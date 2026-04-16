using VinhKhanhTour.AutoNarration.Models;
using VinhKhanhTour.AutoNarration.Options;
using VinhKhanhTour.AutoNarration.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.Configure<AzureAiOptions>(builder.Configuration.GetSection("AzureAi"));
builder.Services.Configure<AdminOptions>(builder.Configuration.GetSection("Admin"));
builder.Services.AddHttpClient();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "vktour.auth";
        options.LoginPath = "/login.html";
        options.AccessDeniedPath = "/login.html";
        options.SlidingExpiration = true;
        options.ExpireTimeSpan = TimeSpan.FromHours(12);
        options.Events = new CookieAuthenticationEvents
        {
            OnRedirectToLogin = context =>
            {
                if (context.Request.Path.StartsWithSegments("/api"))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                }

                context.Response.Redirect(context.RedirectUri);
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddSingleton<InMemoryLocationContentService>();
builder.Services.AddSingleton<ILocationContentService>(sp => sp.GetRequiredService<InMemoryLocationContentService>());
builder.Services.AddSingleton<IAdminManagementService>(sp => sp.GetRequiredService<InMemoryLocationContentService>());
builder.Services.AddSingleton<ILiveParticipantTracker, InMemoryLiveParticipantTracker>();
builder.Services.AddSingleton<IPublicNarrationPaymentService, InMemoryPublicNarrationPaymentService>();
builder.Services.AddSingleton<IUserAuthService, InMemoryUserAuthService>();
builder.Services.AddScoped<ITranslationService, AzureTranslationService>();
builder.Services.AddScoped<ISpeechSynthesisService, AzureSpeechSynthesisService>();
builder.Services.AddScoped<NarrationOrchestrator>();
builder.Services.AddScoped<IRoutePlanningService, RoutePlanningService>();
builder.Services.AddScoped<ITourAssistantService, TourAssistantService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    
    // Initialize test accounts (development only)
    var authService = app.Services.GetRequiredService<IUserAuthService>();
    var contentService = app.Services.GetRequiredService<ILocationContentService>();
    
    // Create admin test account
    var (adminSuccess, adminError, _) = authService.Register(
        "Admin Vĩnh Khánh",
        "admin@vinh-khanh.test",
        "Admin@1234",
        "admin"
    );
    if (adminSuccess)
    {
        System.Console.WriteLine("✅ Admin test account created: admin@vinh-khanh.test / Admin@1234");
    }
    else if (!adminError?.Contains("already") ?? false)
    {
        System.Console.WriteLine($"⚠️  Admin account: {adminError}");
    }
    
    // Get all locations and create merchant accounts
    try
    {
        var locations = contentService.GetAll();
        var merchantCount = 0;
        foreach (var loc in locations)
        {
            var email = $"{loc.Id}@vinh-khanh.test".ToLowerInvariant();
            var password = "Merchant@1234";
            var (success, error, _) = authService.Register(
                loc.Name,
                email,
                password,
                "merchant"
            );
            if (success)
            {
                System.Console.WriteLine($"  ✅ Merchant: {loc.Name} ({email})");
                merchantCount++;
            }
            else if (!error?.Contains("already") ?? false)
            {
                System.Console.WriteLine($"  ⚠️  {loc.Name}: {error}");
            }
        }
        System.Console.WriteLine($"\n📊 {merchantCount} merchant account(s) created/available");
    }
    catch (Exception ex)
    {
        System.Console.WriteLine($"⚠️  Error creating merchant accounts: {ex.Message}");
    }
}

app.UseDefaultFiles();
app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value ?? string.Empty;
    var isProtectedHtmlPage = HttpMethods.IsGet(context.Request.Method)
        && (path.Equals("/admin.html", StringComparison.OrdinalIgnoreCase)
            || path.Equals("/merchant.html", StringComparison.OrdinalIgnoreCase)
            || path.Equals("/account.html", StringComparison.OrdinalIgnoreCase));

    if (isProtectedHtmlPage && context.User.Identity?.IsAuthenticated != true)
    {
        var returnUrl = Uri.EscapeDataString($"{context.Request.Path}{context.Request.QueryString}");
        context.Response.Redirect($"/login.html?returnUrl={returnUrl}");
        return;
    }

    await next();
});

app.Use(async (context, next) =>
{
    await next();

    if (!HttpMethods.IsGet(context.Request.Method))
    {
        return;
    }

    var path = context.Request.Path.Value ?? string.Empty;
    if (path.StartsWith("/api", StringComparison.OrdinalIgnoreCase))
    {
        return;
    }

    var admin = context.RequestServices.GetRequiredService<IAdminManagementService>();
    var userAgent = context.Request.Headers.UserAgent.ToString();
    var userEmail = context.User.FindFirstValue(ClaimTypes.Email);
    admin.TrackVisit(path, context.Request.Method, userAgent, userEmail);
});

app.UseStaticFiles();

static bool IsAdmin(HttpRequest request, IOptions<AdminOptions> options)
{
    var key = request.Headers["X-Admin-Key"].ToString();
    var expected = options.Value.ApiKey;
    return !string.IsNullOrWhiteSpace(expected)
        && !string.IsNullOrWhiteSpace(key)
        && key.Equals(expected, StringComparison.Ordinal);
}

static IResult UnauthorizedAdmin() => Results.Unauthorized();

static ClaimsPrincipal CreateUserPrincipal(AuthUserResponse user)
{
    var claims = new List<Claim>
    {
        new(ClaimTypes.NameIdentifier, user.Id),
        new(ClaimTypes.Name, user.FullName),
        new(ClaimTypes.Email, user.Email),
        new(ClaimTypes.Role, user.Role)
    };

    var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
    return new ClaimsPrincipal(identity);
}

app.MapPost("/api/auth/register", async (
    RegisterRequest request,
    IUserAuthService userAuthService,
    HttpContext httpContext) =>
{
    var normalizedRole = (request.Role ?? string.Empty).Trim().ToLowerInvariant();
    if (!normalizedRole.Equals("merchant", StringComparison.OrdinalIgnoreCase))
    {
        return Results.BadRequest(new { message = "Chỉ tài khoản chủ quán được phép đăng ký trên hệ thống." });
    }

    var result = userAuthService.Register(request.FullName, request.Email, request.Password, normalizedRole);
    if (!result.Success || result.User is null)
    {
        return Results.BadRequest(new { message = result.Error ?? "Không thể đăng ký tài khoản." });
    }

    await httpContext.SignInAsync(
        CookieAuthenticationDefaults.AuthenticationScheme,
        CreateUserPrincipal(result.User));

    return Results.Ok(new { user = result.User });
});

app.MapPost("/api/auth/login", async (
    LoginRequest request,
    IUserAuthService userAuthService,
    HttpContext httpContext) =>
{
    var normalizedRole = (request.Role ?? string.Empty).Trim().ToLowerInvariant();
    if (normalizedRole is not ("admin" or "merchant"))
    {
        return Results.BadRequest(new { message = "Chỉ hỗ trợ đăng nhập cho admin và chủ quán." });
    }

    var result = userAuthService.Login(request.Email, request.Password, normalizedRole);
    if (!result.Success || result.User is null)
    {
        return Results.Json(
            new { message = result.Error ?? "Đăng nhập thất bại." },
            statusCode: StatusCodes.Status401Unauthorized);
    }

    await httpContext.SignInAsync(
        CookieAuthenticationDefaults.AuthenticationScheme,
        CreateUserPrincipal(result.User));

    return Results.Ok(new { user = result.User });
});

app.MapPost("/api/auth/logout", async (HttpContext httpContext) =>
{
    await httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.Ok(new { message = "Đã đăng xuất." });
});

app.MapGet("/api/auth/me", (HttpContext httpContext) =>
{
    if (httpContext.User.Identity?.IsAuthenticated != true)
    {
        return Results.Unauthorized();
    }

    var user = new AuthUserResponse
    {
        Id = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty,
        FullName = httpContext.User.FindFirstValue(ClaimTypes.Name) ?? string.Empty,
        Email = httpContext.User.FindFirstValue(ClaimTypes.Email) ?? string.Empty,
        Role = httpContext.User.FindFirstValue(ClaimTypes.Role) ?? "merchant"
    };

    return Results.Ok(user);
});

app.MapGet("/api/locations", (ILocationContentService locationContentService) =>
{
    return Results.Ok(locationContentService.GetAll());
})
.WithName("GetLocations");

app.MapGet("/api/public/locations", (ILocationContentService locationContentService) =>
{
    return Results.Ok(locationContentService.GetAll());
})
.WithName("GetPublicLocations");

app.MapGet("/api/public/locations/{locationId}", (
    string locationId,
    ILocationContentService locationContentService) =>
{
    if (string.IsNullOrWhiteSpace(locationId))
    {
        return Results.BadRequest(new { message = "LocationId không hợp lệ." });
    }

    var location = locationContentService.GetById(locationId);
    if (location is null)
    {
        return Results.NotFound(new { message = "Không tìm thấy quán ăn." });
    }

    return Results.Ok(location);
})
.WithName("GetPublicLocationById");

app.MapGet("/api/public/tts-capabilities", (IOptions<AzureAiOptions> azureOptions) =>
{
    static bool IsConfigured(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        var normalized = value.Trim();
        return !normalized.StartsWith("YOUR_", StringComparison.OrdinalIgnoreCase);
    }

    var options = azureOptions.Value;
    var cloudNarrationAvailable = IsConfigured(options.TranslatorKey)
        && IsConfigured(options.SpeechKey)
        && !string.IsNullOrWhiteSpace(options.TranslatorEndpoint)
        && !string.IsNullOrWhiteSpace(options.SpeechRegion);

    return Results.Ok(new
    {
        cloudNarrationAvailable,
        fallbackMode = cloudNarrationAvailable ? "cloud-first" : "browser-audio-fallback"
    });
})
.WithName("GetPublicTtsCapabilities");

app.MapGet("/api/public/narrations/pricing", (
    string? lang,
    IPublicNarrationPaymentService paymentService) =>
{
    var quote = paymentService.GetQuote(lang ?? "vi");
    return Results.Ok(new
    {
        language = quote.Language,
        currencyCode = quote.CurrencyCode,
        currencySymbol = quote.CurrencySymbol,
        amount = quote.Amount,
        amountVnd = quote.AmountVnd,
        quotedAt = quote.QuotedAt
    });
})
.WithName("GetPublicNarrationPricing");

app.MapPost("/api/public/narrations/pay", (
    PublicNarrationPaymentRequest request,
    IPublicNarrationPaymentService paymentService) =>
{
    if (string.IsNullOrWhiteSpace(request.ParticipantId)
        || string.IsNullOrWhiteSpace(request.LocationId))
    {
        return Results.BadRequest(new { message = "Thiếu dữ liệu thanh toán cho thuyết minh." });
    }

    try
    {
        var ticket = paymentService.CreatePayment(
            request.ParticipantId,
            request.LocationId,
            request.TargetLanguage);

        return Results.Ok(new
        {
            paymentToken = ticket.PaymentToken,
            participantId = ticket.ParticipantId,
            locationId = ticket.LocationId,
            language = ticket.Language,
            currencyCode = ticket.CurrencyCode,
            currencySymbol = ticket.CurrencySymbol,
            amount = ticket.Amount,
            amountVnd = ticket.AmountVnd,
            paidAt = ticket.PaidAt
        });
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { message = ex.Message });
    }
})
.WithName("PayPublicNarration");

app.MapPost("/api/public/narrations/instant", async (
    GenerateNarrationRequest request,
    NarrationOrchestrator narrationOrchestrator,
    IPublicNarrationPaymentService paymentService,
    IAdminManagementService adminManagementService,
    HttpContext httpContext,
    CancellationToken cancellationToken) =>
{
    if (string.IsNullOrWhiteSpace(request.LocationId))
    {
        return Results.BadRequest(new { message = "Bạn cần truyền LocationId để nghe thuyết minh nhanh." });
    }

    var language = string.IsNullOrWhiteSpace(request.TargetLanguage) ? "vi" : request.TargetLanguage.Trim().ToLowerInvariant();
    var supportedLanguages = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "vi", "en", "fr", "ja", "ko" };
    if (!supportedLanguages.Contains(language))
    {
        return Results.BadRequest(new { message = "Ngôn ngữ không được hỗ trợ." });
    }

    if (string.IsNullOrWhiteSpace(request.ParticipantId)
        || string.IsNullOrWhiteSpace(request.PaymentToken))
    {
        return Results.Json(
            new { message = "Bạn cần thanh toán trước khi nghe thuyết minh." },
            statusCode: StatusCodes.Status402PaymentRequired);
    }

    if (!paymentService.TryConsumePayment(request.ParticipantId, request.LocationId, language, request.PaymentToken, out var ticket)
        || ticket is null)
    {
        return Results.Json(
            new { message = "Thanh toán không hợp lệ hoặc đã hết hạn. Vui lòng thanh toán lại." },
            statusCode: StatusCodes.Status402PaymentRequired);
    }

    try
    {
        var baseUrl = $"{httpContext.Request.Scheme}://{httpContext.Request.Host}";
        var response = await narrationOrchestrator.GetOrCreateInstantAsync(request.LocationId, language, baseUrl, cancellationToken);

        adminManagementService.TrackNarrationListen(new NarrationListenLogEntry
        {
            Id = Guid.NewGuid().ToString("N"),
            LocationId = request.LocationId,
            ParticipantId = request.ParticipantId,
            UserEmail = httpContext.User.FindFirstValue(ClaimTypes.Email),
            TargetLanguage = language,
            CurrencyCode = ticket.CurrencyCode,
            PaidAmount = ticket.Amount,
            PaidAmountVnd = ticket.AmountVnd,
            ListenedAt = DateTimeOffset.UtcNow
        });

        return Results.Ok(response);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { message = ex.Message });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
    }
})
.WithName("GeneratePublicInstantNarration");

app.MapPost("/api/public/narrations", async (
    GenerateNarrationRequest request,
    NarrationOrchestrator narrationOrchestrator,
    IPublicNarrationPaymentService paymentService,
    IAdminManagementService adminManagementService,
    HttpContext httpContext,
    CancellationToken cancellationToken) =>
{
    if (string.IsNullOrWhiteSpace(request.LocationId))
    {
        return Results.BadRequest(new { message = "Bạn cần chọn quán ăn để tạo thuyết minh có thanh toán." });
    }

    var language = string.IsNullOrWhiteSpace(request.TargetLanguage) ? "vi" : request.TargetLanguage.Trim().ToLowerInvariant();
    if (string.IsNullOrWhiteSpace(request.ParticipantId)
        || string.IsNullOrWhiteSpace(request.PaymentToken))
    {
        return Results.Json(
            new { message = "Bạn cần thanh toán trước khi nghe thuyết minh." },
            statusCode: StatusCodes.Status402PaymentRequired);
    }

    if (!paymentService.TryConsumePayment(request.ParticipantId, request.LocationId, language, request.PaymentToken, out var ticket)
        || ticket is null)
    {
        return Results.Json(
            new { message = "Thanh toán không hợp lệ hoặc đã hết hạn. Vui lòng thanh toán lại." },
            statusCode: StatusCodes.Status402PaymentRequired);
    }

    try
    {
        var baseUrl = $"{httpContext.Request.Scheme}://{httpContext.Request.Host}";
        var response = await narrationOrchestrator.GenerateAsync(request, baseUrl, cancellationToken, null);

        adminManagementService.TrackNarrationListen(new NarrationListenLogEntry
        {
            Id = Guid.NewGuid().ToString("N"),
            LocationId = request.LocationId,
            ParticipantId = request.ParticipantId,
            UserEmail = null,
            TargetLanguage = language,
            CurrencyCode = ticket.CurrencyCode,
            PaidAmount = ticket.Amount,
            PaidAmountVnd = ticket.AmountVnd,
            ListenedAt = DateTimeOffset.UtcNow
        });

        return Results.Ok(response);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { message = ex.Message });
    }
    catch (InvalidOperationException ex)
    {
        return Results.Problem(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
    }
    catch (HttpRequestException ex)
    {
        return Results.Problem($"Lỗi kết nối đến dịch vụ AI: {ex.Message}", statusCode: StatusCodes.Status503ServiceUnavailable);
    }
})
.WithName("GeneratePublicPaidNarration");

app.MapGet("/api/public/tts-proxy", async (
    string text,
    string? lang,
    IHttpClientFactory httpClientFactory,
    CancellationToken cancellationToken) =>
{
    if (string.IsNullOrWhiteSpace(text))
    {
        return Results.BadRequest(new { message = "Thiếu nội dung text để tạo audio." });
    }

    var safeText = text.Trim();
    if (safeText.Length > 500)
    {
        return Results.BadRequest(new { message = "Nội dung text quá dài cho fallback audio." });
    }

    var normalizedLang = string.IsNullOrWhiteSpace(lang) ? "vi" : lang.Trim().ToLowerInvariant();
    var supported = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "vi", "en", "fr", "ja", "ko" };
    if (!supported.Contains(normalizedLang))
    {
        normalizedLang = "vi";
    }

    var googleUrl = $"https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl={Uri.EscapeDataString(normalizedLang)}&q={Uri.EscapeDataString(safeText)}";
    try
    {
        var client = httpClientFactory.CreateClient();
        using var requestMessage = new HttpRequestMessage(HttpMethod.Get, googleUrl);
        requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile Safari/604.1");
        using var response = await client.SendAsync(requestMessage, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            return Results.Problem("Không tải được audio fallback từ nguồn TTS.", statusCode: StatusCodes.Status502BadGateway);
        }

        var bytes = await response.Content.ReadAsByteArrayAsync(cancellationToken);
        return Results.File(bytes, "audio/mpeg");
    }
    catch (Exception ex)
    {
        return Results.Problem($"Lỗi fallback audio: {ex.Message}", statusCode: StatusCodes.Status502BadGateway);
    }
})
.WithName("ProxyPublicTts");

app.MapPost("/api/public/live-participants/heartbeat", (
    LiveParticipantHeartbeatRequest request,
    ILiveParticipantTracker liveParticipantTracker) =>
{
    if (string.IsNullOrWhiteSpace(request.ParticipantId))
    {
        return Results.BadRequest(new { message = "Thiếu ParticipantId để theo dõi người tham gia." });
    }

    var snapshot = liveParticipantTracker.Touch(request.ParticipantId);
    return Results.Ok(new
    {
        activeParticipants = snapshot.ActiveParticipants,
        activeWindowSeconds = snapshot.ActiveWindowSeconds,
        capturedAt = snapshot.CapturedAt
    });
})
.WithName("HeartbeatPublicLiveParticipants");

app.MapGet("/api/public/live-participants", (ILiveParticipantTracker liveParticipantTracker) =>
{
    var snapshot = liveParticipantTracker.GetSnapshot();
    return Results.Ok(new
    {
        activeParticipants = snapshot.ActiveParticipants,
        activeWindowSeconds = snapshot.ActiveWindowSeconds,
        capturedAt = snapshot.CapturedAt
    });
})
.WithName("GetPublicLiveParticipants");

app.MapGet("/api/voice-profiles", (IAdminManagementService adminManagementService) =>
{
    var profiles = adminManagementService
        .GetVoiceProfiles()
        .Where(x => x.IsActive)
        .Select(x => new
        {
            x.Id,
            x.Scenario,
            x.Language,
            x.VoiceName
        });

    return Results.Ok(profiles);
})
.WithName("GetVoiceProfiles");

app.MapGet("/api/narration-templates", (IAdminManagementService adminManagementService) =>
{
    return Results.Ok(adminManagementService.GetNarrationTemplates(publishedOnly: true));
})
.WithName("GetPublishedNarrationTemplates");

app.MapPost("/api/narrations", async (
    GenerateNarrationRequest request,
    NarrationOrchestrator narrationOrchestrator,
    HttpContext httpContext,
    CancellationToken cancellationToken) =>
{
    try
    {
        var baseUrl = $"{httpContext.Request.Scheme}://{httpContext.Request.Host}";
        var userEmail = httpContext.User.FindFirstValue(ClaimTypes.Email);
        var response = await narrationOrchestrator.GenerateAsync(request, baseUrl, cancellationToken, userEmail);
        return Results.Ok(response);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { message = ex.Message });
    }
    catch (InvalidOperationException ex)
    {
        return Results.Problem(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
    }
    catch (HttpRequestException ex)
    {
        return Results.Problem($"Lỗi kết nối đến dịch vụ AI (kiểm tra lại API Key hoặt kết nối mạng): {ex.Message}", statusCode: StatusCodes.Status503ServiceUnavailable);
    }
})
.WithName("GenerateNarration")
.RequireAuthorization();

app.MapPost("/api/narrations/instant", async (
    GenerateNarrationRequest request,
    NarrationOrchestrator narrationOrchestrator,
    HttpContext httpContext,
    CancellationToken cancellationToken) =>
{
    if (string.IsNullOrWhiteSpace(request.LocationId))
    {
        return Results.BadRequest(new { message = "Bạn cần truyền LocationId để nghe thuyết minh nhanh." });
    }

    var language = string.IsNullOrWhiteSpace(request.TargetLanguage) ? "vi" : request.TargetLanguage;

    try
    {
        var baseUrl = $"{httpContext.Request.Scheme}://{httpContext.Request.Host}";
        var userEmail = httpContext.User.FindFirstValue(ClaimTypes.Email);
        var response = await narrationOrchestrator.GetOrCreateInstantAsync(request.LocationId, language, baseUrl, cancellationToken, userEmail);
        return Results.Ok(response);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { message = ex.Message });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
    }
})
.WithName("GenerateInstantNarration")
.RequireAuthorization();

app.MapPost("/api/routes/plan", async (
    RoutePlanRequest request,
    IRoutePlanningService routePlanningService,
    IAdminManagementService adminManagementService,
    HttpContext httpContext,
    CancellationToken cancellationToken) =>
{
    try
    {
        var response = await routePlanningService.BuildAsync(request, cancellationToken);

        var stopSummary = string.Join(" | ", response.Stops.Select(x => x.Name).Take(5));
        adminManagementService.TrackRoutePlan(new RoutePlanLogEntry
        {
            Id = Guid.NewGuid().ToString("N"),
            UserEmail = httpContext.User.FindFirstValue(ClaimTypes.Email),
            VisitorType = request.VisitorType,
            BudgetLevel = request.BudgetLevel,
            StartHour = request.StartHour,
            GuestCount = request.GuestCount,
            Preferences = request.Preferences,
            MustTry = request.MustTry,
            PlanTitle = response.Title,
            GeneratedBy = response.GeneratedBy,
            StopSummary = stopSummary,
            CreatedAt = DateTimeOffset.UtcNow
        });

        return Results.Ok(response);
    }
    catch (InvalidOperationException ex)
    {
        return Results.Problem(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
    }
})
.WithName("PlanRoute");

app.MapPost("/api/routes/options", async (
    RoutePlanRequest request,
    IRoutePlanningService routePlanningService,
    IAdminManagementService adminManagementService,
    HttpContext httpContext,
    CancellationToken cancellationToken) =>
{
    try
    {
        var response = await routePlanningService.BuildOptionsAsync(request, cancellationToken);
        var firstOption = response.Options.FirstOrDefault();
        var stopSummary = firstOption is null
            ? string.Empty
            : string.Join(" | ", firstOption.Stops.Select(x => x.Name).Take(5));

        adminManagementService.TrackRoutePlan(new RoutePlanLogEntry
        {
            Id = Guid.NewGuid().ToString("N"),
            UserEmail = httpContext.User.FindFirstValue(ClaimTypes.Email),
            VisitorType = request.VisitorType,
            BudgetLevel = request.BudgetLevel,
            StartHour = request.StartHour,
            GuestCount = request.GuestCount,
            Preferences = request.Preferences,
            MustTry = request.MustTry,
            PlanTitle = firstOption?.Title ?? "Không có phương án",
            GeneratedBy = firstOption?.GeneratedBy ?? "none",
            StopSummary = stopSummary,
            CreatedAt = DateTimeOffset.UtcNow
        });

        return Results.Ok(response);
    }
    catch (InvalidOperationException ex)
    {
        return Results.Problem(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
    }
})
.WithName("PlanRouteOptions");

app.MapPost("/api/assistant/ask", async (
    AssistantAskRequest request,
    ITourAssistantService tourAssistantService,
    CancellationToken cancellationToken) =>
{
    try
    {
        var response = await tourAssistantService.AskAsync(request, cancellationToken);
        return Results.Ok(response);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { message = ex.Message });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
    }
})
.WithName("AskAssistant");

app.MapGet("/api/account/dashboard", (
    HttpContext httpContext,
    IAdminManagementService adminManagementService,
    ILocationContentService locationContentService) =>
{
    if (httpContext.User.Identity?.IsAuthenticated != true)
    {
        return Results.Unauthorized();
    }

    var userEmail = httpContext.User.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
    var fullName = httpContext.User.FindFirstValue(ClaimTypes.Name) ?? userEmail;
    var locations = locationContentService.GetAll().ToDictionary(x => x.Id, StringComparer.OrdinalIgnoreCase);

    var visitHistory = adminManagementService
        .GetVisitLogs(300)
        .Where(x => string.Equals(x.UserEmail, userEmail, StringComparison.OrdinalIgnoreCase))
        .OrderByDescending(x => x.VisitedAt)
        .Take(12)
        .Select(x => new
        {
            x.Path,
            x.VisitedAt
        });

    var narrationHistory = adminManagementService
        .GetAiUsageLogs(300)
        .Where(x => string.Equals(x.UserEmail, userEmail, StringComparison.OrdinalIgnoreCase))
        .OrderByDescending(x => x.GeneratedAt)
        .Take(12)
        .Select(x => new
        {
            x.LocationId,
            locationName = x.LocationId is not null && locations.TryGetValue(x.LocationId, out var location)
                ? location.Name
                : "Nội dung tùy chỉnh",
            x.TargetLanguage,
            x.VoiceName,
            x.GeneratedAt
        });

    var routeHistory = adminManagementService
        .GetRoutePlanLogs(300)
        .Where(x => string.Equals(x.UserEmail, userEmail, StringComparison.OrdinalIgnoreCase))
        .OrderByDescending(x => x.CreatedAt)
        .Take(12)
        .Select(x => new
        {
            x.PlanTitle,
            x.GeneratedBy,
            x.VisitorType,
            x.BudgetLevel,
            x.Preferences,
            x.StopSummary,
            x.CreatedAt
        });

    return Results.Ok(new
    {
        user = new
        {
            fullName,
            email = userEmail
        },
        metrics = new
        {
            totalVisits = visitHistory.Count(),
            totalNarrations = narrationHistory.Count(),
            totalRoutes = routeHistory.Count()
        },
        visitHistory,
        narrationHistory,
        routeHistory
    });
});

app.MapGet("/api/admin/dashboard", (
    HttpContext httpContext,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService,
    ILiveParticipantTracker liveParticipantTracker) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    var locations = adminManagementService.GetLocations();
    var aiLogs = adminManagementService.GetAiUsageLogs(1000);
    var visits = adminManagementService.GetVisitLogs(5000);
    var listens = adminManagementService.GetNarrationListenLogs(10000);
    var liveSnapshot = liveParticipantTracker.GetSnapshot();
    var now = DateTimeOffset.UtcNow;
    var weekStart = now.AddDays(-7);
    var monthStart = now.AddDays(-30);

    var locationNameById = locations.ToDictionary(x => x.Id, x => x.Name, StringComparer.OrdinalIgnoreCase);

    var dashboard = new
    {
        locationCount = locations.Count,
        publishedLocationCount = locations.Count(x => x.IsPublished),
        voiceProfileCount = adminManagementService.GetVoiceProfiles().Count,
        templateCount = adminManagementService.GetNarrationTemplates(false).Count,
        narrationCount = aiLogs.Count,
        totalEstimatedCostUsd = aiLogs.Sum(x => x.EstimatedCostUsd),
        totalVisits = visits.Count,
        visitsThisWeek = visits.Count(x => x.VisitedAt >= weekStart),
        visitsThisMonth = visits.Count(x => x.VisitedAt >= monthStart),
        activeParticipantsNow = liveSnapshot.ActiveParticipants,
        totalListenCount = listens.Count,
        totalRevenueVnd = listens.Sum(x => x.PaidAmountVnd),
        dailyVisits = Enumerable.Range(0, 7)
            .Select(i => new
            {
                date = weekStart.AddDays(i).Date,
                visits = visits.Count(x => x.VisitedAt.Date == weekStart.AddDays(i).Date)
            })
            .ToList(),
        topPages = visits
            .GroupBy(x => x.Path)
            .Select(g => new { path = g.Key, visits = g.Count() })
            .OrderByDescending(x => x.visits)
            .Take(10),
        listensByLocation = listens
            .GroupBy(x => x.LocationId)
            .Select(g => new
            {
                locationId = g.Key,
                locationName = locationNameById.TryGetValue(g.Key, out var name) ? name : g.Key,
                listenCount = g.Count(),
                revenueVnd = g.Sum(x => x.PaidAmountVnd),
                lastListenedAt = g.Max(x => x.ListenedAt)
            })
            .OrderByDescending(x => x.listenCount)
            .Take(30)
    };

    return Results.Ok(dashboard);
});

app.MapGet("/api/admin/debug/participants", (
    HttpContext httpContext,
    IOptions<AdminOptions> adminOptions,
    ILiveParticipantTracker liveParticipantTracker) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    var snapshot = liveParticipantTracker.GetSnapshot();
    
    return Results.Ok(new
    {
        totalActive = snapshot.ActiveParticipants,
        activeWindowSeconds = snapshot.ActiveWindowSeconds,
        capturedAt = snapshot.CapturedAt,
        participantIds = snapshot.ParticipantIds,
        details = snapshot.ParticipantIds.Select((id, index) => new
        {
            index = index + 1,
            participantId = id,
            isAdmin = id.StartsWith("admin_", StringComparison.OrdinalIgnoreCase),
            length = id.Length
        }).ToList()
    });
});

app.MapGet("/api/admin/locations", (
    HttpContext httpContext,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    return Results.Ok(adminManagementService.GetLocations());
});

app.MapPost("/api/admin/locations", (
    HttpContext httpContext,
    AdminManagedLocation payload,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    var saved = adminManagementService.UpsertLocation(payload);
    return Results.Ok(saved);
});

app.MapPut("/api/admin/locations/{id}", (
    HttpContext httpContext,
    string id,
    AdminManagedLocation payload,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    payload.Id = id;
    var saved = adminManagementService.UpsertLocation(payload);
    return Results.Ok(saved);
});

app.MapPost("/api/admin/locations/{id}/approve", (
    HttpContext httpContext,
    string id,
    string? narrationPublicVi,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    var approved = adminManagementService.ApproveLocation(id, narrationPublicVi);
    return approved is null ? Results.NotFound() : Results.Ok(approved);
});

app.MapDelete("/api/admin/locations/{id}", (
    HttpContext httpContext,
    string id,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    return adminManagementService.DeleteLocation(id) ? Results.NoContent() : Results.NotFound();
});

app.MapGet("/api/admin/voice-profiles", (
    HttpContext httpContext,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    return Results.Ok(adminManagementService.GetVoiceProfiles());
});

app.MapPost("/api/admin/voice-profiles", (
    HttpContext httpContext,
    VoiceProfile payload,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    return Results.Ok(adminManagementService.UpsertVoiceProfile(payload));
});

app.MapDelete("/api/admin/voice-profiles/{id}", (
    HttpContext httpContext,
    string id,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    return adminManagementService.DeleteVoiceProfile(id) ? Results.NoContent() : Results.NotFound();
});

app.MapGet("/api/admin/narration-templates", (
    HttpContext httpContext,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    return Results.Ok(adminManagementService.GetNarrationTemplates(false));
});

app.MapPost("/api/admin/narration-templates", (
    HttpContext httpContext,
    NarrationTemplate payload,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    return Results.Ok(adminManagementService.UpsertNarrationTemplate(payload));
});

app.MapDelete("/api/admin/narration-templates/{id}", (
    HttpContext httpContext,
    string id,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    return adminManagementService.DeleteNarrationTemplate(id) ? Results.NoContent() : Results.NotFound();
});

app.MapGet("/api/admin/logs/ai", (
    HttpContext httpContext,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService,
    int take = 200) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    return Results.Ok(adminManagementService.GetAiUsageLogs(take));
});

app.MapGet("/api/admin/logs/visits", (
    HttpContext httpContext,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService,
    int take = 200) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    return Results.Ok(adminManagementService.GetVisitLogs(take));
});

// Merchant Request APIs
app.MapPost("/api/merchant/requests", (
    MerchantRequest request,
    HttpContext httpContext,
    IAdminManagementService adminManagementService) =>
{
    if (httpContext.User.Identity?.IsAuthenticated != true)
    {
        return Results.Unauthorized();
    }

    var userEmail = httpContext.User.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
    var fullName = httpContext.User.FindFirstValue(ClaimTypes.Name) ?? userEmail;
    var role = httpContext.User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

    if (!role.Equals("merchant", StringComparison.OrdinalIgnoreCase))
    {
        return Results.Json(
            new { message = "Chỉ tài khoản chủ quán mới được gửi yêu cầu." },
            statusCode: StatusCodes.Status403Forbidden);
    }

    var newRequest = new MerchantRequest
    {
        Id = Guid.NewGuid().ToString("N"),
        LocationId = request.LocationId,
        MerchantEmail = userEmail,
        MerchantName = fullName,
        RequestType = request.RequestType,
        Title = request.Title,
        Description = request.Description,
        Status = "pending",
        CampaignStartAt = request.CampaignStartAt,
        CampaignEndAt = request.CampaignEndAt,
        CreatedAt = DateTimeOffset.UtcNow
    };

    var created = adminManagementService.SubmitMerchantRequest(newRequest);
    return Results.Ok(new { message = "Yêu cầu đã được gửi tới admin", request = created });
})
.WithName("SubmitMerchantRequest")
.RequireAuthorization();

app.MapGet("/api/merchant/requests", (
    HttpContext httpContext,
    IAdminManagementService adminManagementService) =>
{
    if (httpContext.User.Identity?.IsAuthenticated != true)
    {
        return Results.Unauthorized();
    }

    var userEmail = httpContext.User.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
    var role = httpContext.User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

    if (!role.Equals("merchant", StringComparison.OrdinalIgnoreCase))
    {
        return Results.Json(
            new { message = "Chỉ tài khoản chủ quán mới được xem lịch sử yêu cầu." },
            statusCode: StatusCodes.Status403Forbidden);
    }

    var requests = adminManagementService.GetMerchantRequests(currentUserEmail: userEmail);
    return Results.Ok(requests);
})
.WithName("GetMyMerchantRequests")
.RequireAuthorization();

app.MapGet("/api/admin/merchant-requests", (
    HttpContext httpContext,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService,
    string? status = null) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    var requests = adminManagementService.GetMerchantRequests(status: status);
    return Results.Ok(requests);
})
.WithName("GetAllMerchantRequests");

app.MapGet("/api/public/merchant-ads", (
    IAdminManagementService adminManagementService,
    ILocationContentService locationContentService,
    int take = 12,
    string? type = null,
    string? time = null) =>
{
    var locations = locationContentService
        .GetAll()
        .ToDictionary(x => x.Id, StringComparer.OrdinalIgnoreCase);

    var normalizedType = string.IsNullOrWhiteSpace(type)
        ? "all"
        : type.Trim().ToLowerInvariant();
    var normalizedTime = string.IsNullOrWhiteSpace(time)
        ? "all"
        : time.Trim().ToLowerInvariant();
    var now = DateTimeOffset.UtcNow;

    var query = adminManagementService
        .GetMerchantRequests(status: "approved")
        .Where(x => x.RequestType.Equals("promotion", StringComparison.OrdinalIgnoreCase)
            || x.RequestType.Equals("advertisement", StringComparison.OrdinalIgnoreCase));

    if (normalizedType.Equals("promotion", StringComparison.OrdinalIgnoreCase)
        || normalizedType.Equals("advertisement", StringComparison.OrdinalIgnoreCase))
    {
        query = query.Where(x => x.RequestType.Equals(normalizedType, StringComparison.OrdinalIgnoreCase));
    }

    if (normalizedTime.Equals("active", StringComparison.OrdinalIgnoreCase))
    {
        query = query.Where(x => (!x.CampaignStartAt.HasValue || x.CampaignStartAt.Value <= now)
            && (!x.CampaignEndAt.HasValue || x.CampaignEndAt.Value >= now));
    }
    else if (normalizedTime.Equals("today", StringComparison.OrdinalIgnoreCase))
    {
        var start = now.Date;
        var end = start.AddDays(1).AddTicks(-1);
        query = query.Where(x => (x.CampaignStartAt ?? x.ReviewedAt ?? x.CreatedAt) <= end
            && (x.CampaignEndAt ?? x.ReviewedAt ?? x.CreatedAt) >= start);
    }
    else if (normalizedTime.Equals("week", StringComparison.OrdinalIgnoreCase))
    {
        var start = now.Date;
        var end = start.AddDays(7).AddTicks(-1);
        query = query.Where(x => (x.CampaignStartAt ?? x.ReviewedAt ?? x.CreatedAt) <= end
            && (x.CampaignEndAt ?? x.ReviewedAt ?? x.CreatedAt) >= start);
    }

    var ads = query
        .OrderByDescending(x => x.IsPinnedTop)
        .ThenByDescending(x => x.PriorityScore)
        .ThenByDescending(x => x.ReviewedAt ?? x.CreatedAt)
        .Take(Math.Clamp(take, 1, 30))
        .Select(x => new
        {
            x.Id,
            x.LocationId,
            locationName = locations.TryGetValue(x.LocationId, out var location) ? location.Name : x.LocationId,
            x.Title,
            x.Description,
            x.RequestType,
            approvedAt = x.ReviewedAt ?? x.CreatedAt,
            merchantName = x.MerchantName,
            x.IsPinnedTop,
            x.PriorityScore,
            x.CampaignStartAt,
            x.CampaignEndAt
        });

    return Results.Ok(ads);
})
.WithName("GetPublicMerchantAds");

app.MapPost("/api/admin/merchant-requests/{requestId}/approve", (
    string requestId,
    HttpContext httpContext,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    var adminEmail = httpContext.User.FindFirstValue(ClaimTypes.Email) ?? "admin";
    var updated = adminManagementService.ApproveMerchantRequest(requestId, adminEmail);
    if (updated == null)
    {
        return Results.NotFound(new { message = "Yêu cầu không tìm thấy" });
    }

    return Results.Ok(new { message = "Yêu cầu đã được duyệt", request = updated });
})
.WithName("ApproveMerchantRequest");

app.MapPost("/api/admin/merchant-requests/{requestId}/reject", (
    string requestId,
    HttpContext httpContext,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService,
    string? response = null) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    var adminEmail = httpContext.User.FindFirstValue(ClaimTypes.Email) ?? "admin";
    var updated = adminManagementService.RejectMerchantRequest(requestId, adminEmail, response ?? "Bị từ chối");
    if (updated == null)
    {
        return Results.NotFound(new { message = "Yêu cầu không tìm thấy" });
    }

    return Results.Ok(new { message = "Yêu cầu đã bị từ chối", request = updated });
})
.WithName("RejectMerchantRequest");

app.MapPost("/api/admin/merchant-requests/{requestId}/highlight", (
    string requestId,
    HttpContext httpContext,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService,
    bool isPinnedTop = false,
    int priorityScore = 0,
    DateTimeOffset? campaignStartAt = null,
    DateTimeOffset? campaignEndAt = null) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    if (campaignStartAt.HasValue && campaignEndAt.HasValue && campaignStartAt > campaignEndAt)
    {
        return Results.BadRequest(new { message = "Khoảng thời gian chiến dịch không hợp lệ." });
    }

    var updated = adminManagementService.UpdateMerchantRequestHighlight(
        requestId,
        isPinnedTop,
        priorityScore,
        campaignStartAt,
        campaignEndAt);

    if (updated == null)
    {
        return Results.NotFound(new { message = "Yêu cầu không tìm thấy" });
    }

    return Results.Ok(new { message = "Đã cập nhật ưu tiên quảng cáo", request = updated });
})
.WithName("UpdateMerchantRequestHighlight");

// User Management Analytics - Visit Stats
app.MapGet("/api/admin/user-stats", (
    HttpContext httpContext,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService,
    string period = "daily") => // daily, weekly, monthly
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    var visits = adminManagementService.GetVisitLogs(10000);
    var now = DateTimeOffset.UtcNow;
    var locationNameById = adminManagementService.GetLocations()
        .ToDictionary(x => x.Id, x => x.Name, StringComparer.OrdinalIgnoreCase);

    var grouped = period switch
    {
        "weekly" => visits
            .GroupBy(v => System.Globalization.CultureInfo.InvariantCulture.Calendar
                .GetWeekOfYear(v.VisitedAt.DateTime, System.Globalization.CalendarWeekRule.FirstDay, DayOfWeek.Monday))
            .Select(g => new { period = $"Week {g.Key}", visits = g.Count() })
            .OrderBy(x => x.period),
        "monthly" => visits
            .GroupBy(v => v.VisitedAt.Date.AddDays(-(v.VisitedAt.Day - 1)))
            .Select(g => new { period = g.Key.ToString("MMM yyyy"), visits = g.Count() })
            .OrderBy(x => x.period),
        _ => visits // daily (default)
            .GroupBy(v => v.VisitedAt.Date)
            .Select(g => new { date = g.Key, visits = g.Count() })
            .OrderByDescending(x => x.date)
            .Take(30)
            .Select(x => new { period = x.date.ToString("ddd MMM dd"), visits = x.visits })
            .AsEnumerable()
    };

    var recentVisits = visits
        .OrderByDescending(x => x.VisitedAt)
        .Take(50)
        .Select(v => new
        {
            v.Id,
            device = ExtractDeviceFromUserAgent(v.UserAgent),
            visitedAt = v.VisitedAt,
            path = v.Path,
            userAgent = v.UserAgent
        })
        .ToList();

    return Results.Ok(new
    {
        visitStats = grouped.ToList(),
        recentVisits,
        totalUniqueDevices = visits.Select(v => ExtractDeviceFromUserAgent(v.UserAgent)).Distinct().Count(),
        totalVisits = visits.Count
    });
})
.WithName("AdminUserStats");

// User Management Analytics - Payment Stats
app.MapGet("/api/admin/payment-stats", (
    HttpContext httpContext,
    IOptions<AdminOptions> adminOptions,
    IAdminManagementService adminManagementService) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    var listens = adminManagementService.GetNarrationListenLogs(10000);
    var visits = adminManagementService.GetVisitLogs(10000);
    var locations = adminManagementService.GetLocations()
        .ToDictionary(x => x.Id, x => x.Name, StringComparer.OrdinalIgnoreCase);

    // Payment stats grouped by participant
    var paymentStats = listens
        .GroupBy(x => x.ParticipantId)
        .Select(g => new
        {
            participantId = g.Key,
            transactionCount = g.Count(),
            totalRevenueVnd = g.Sum(x => x.PaidAmountVnd),
            lastPaymentAt = g.Max(x => x.ListenedAt),
            recentLocations = g.GroupBy(x => x.LocationId)
                .Select(lg => new
                {
                    locationId = lg.Key,
                    locationName = locations.TryGetValue(lg.Key, out var name) ? name : lg.Key,
                    payments = lg.Count(),
                    amountVnd = lg.Sum(x => x.PaidAmountVnd)
                })
                .OrderByDescending(x => x.amountVnd)
                .Take(3)
                .ToList()
        })
        .OrderByDescending(x => x.totalRevenueVnd)
        .Take(50)
        .ToList();

    // QR vs Web-Only ratio
    var usersWithPayment = visits
        .Where(v => listens.Any(l => l.ParticipantId.Contains(v.Id) || v.UserAgent.Contains(l.ParticipantId)))
        .Count();
    var qrPaymentUsers = listens.Select(x => x.ParticipantId).Distinct().Count();
    var webOnlyUsers = Math.Max(0, visits.Count - usersWithPayment);

    return Results.Ok(new
    {
        paymentStats,
        totalRevenueVnd = listens.Sum(x => x.PaidAmountVnd),
        totalTransactions = listens.Count,
        uniquePayers = listens.Select(x => x.ParticipantId).Distinct().Count(),
        qrPaymentRatio = new
        {
            qrUsers = qrPaymentUsers,
            webOnlyUsers = Math.Max(1, webOnlyUsers),
            paymentPercentage = listens.Count > 0 ? Math.Round((double)qrPaymentUsers / (qrPaymentUsers + webOnlyUsers) * 100, 1) : 0
        }
    });
})
.WithName("AdminPaymentStats");

// Helper: Extract device type from UserAgent
static string ExtractDeviceFromUserAgent(string userAgent)
{
    if (string.IsNullOrWhiteSpace(userAgent)) return "Unknown";
    
    var ua = userAgent.ToLower();
    if (ua.Contains("iphone")) return "iPhone";
    if (ua.Contains("ipad")) return "iPad";
    if (ua.Contains("android")) return "Android";
    if (ua.Contains("windows")) return "Windows PC";
    if (ua.Contains("macintosh") || ua.Contains("mac os")) return "Mac";
    if (ua.Contains("linux")) return "Linux";
    return "Web Browser";
}

app.Run();
