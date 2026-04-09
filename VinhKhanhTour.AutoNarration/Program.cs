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
}

app.UseDefaultFiles();
app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value ?? string.Empty;
    var isHtmlPageRequest = HttpMethods.IsGet(context.Request.Method)
        && (path.Equals("/", StringComparison.OrdinalIgnoreCase)
            || path.EndsWith(".html", StringComparison.OrdinalIgnoreCase));
    var isPublicAuthPage = path.Equals("/login.html", StringComparison.OrdinalIgnoreCase)
        || path.Equals("/register.html", StringComparison.OrdinalIgnoreCase);

    if (isHtmlPageRequest && !isPublicAuthPage && context.User.Identity?.IsAuthenticated != true)
    {
        var returnUrl = Uri.EscapeDataString($"{context.Request.Path}{context.Request.QueryString}");
        context.Response.Redirect($"/login.html?returnUrl={returnUrl}");
        return;
    }

    var isProtectedApi = path.StartsWith("/api", StringComparison.OrdinalIgnoreCase)
        && !path.StartsWith("/api/auth", StringComparison.OrdinalIgnoreCase)
        && !path.StartsWith("/api/admin", StringComparison.OrdinalIgnoreCase);

    if (isProtectedApi
        && !HttpMethods.IsOptions(context.Request.Method)
        && context.User.Identity?.IsAuthenticated != true)
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        await context.Response.WriteAsJsonAsync(new { message = "Bạn cần đăng nhập để sử dụng chức năng này." });
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
        new(ClaimTypes.Email, user.Email)
    };

    var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
    return new ClaimsPrincipal(identity);
}

app.MapPost("/api/auth/register", async (
    RegisterRequest request,
    IUserAuthService userAuthService,
    HttpContext httpContext) =>
{
    var result = userAuthService.Register(request.FullName, request.Email, request.Password);
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
    var result = userAuthService.Login(request.Email, request.Password);
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
        Email = httpContext.User.FindFirstValue(ClaimTypes.Email) ?? string.Empty
    };

    return Results.Ok(user);
});

app.MapGet("/api/locations", (ILocationContentService locationContentService) =>
{
    return Results.Ok(locationContentService.GetAll());
})
.WithName("GetLocations");

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
.WithName("GenerateNarration");

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
.WithName("GenerateInstantNarration");

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
    IAdminManagementService adminManagementService) =>
{
    if (!IsAdmin(httpContext.Request, adminOptions))
    {
        return UnauthorizedAdmin();
    }

    var locations = adminManagementService.GetLocations();
    var aiLogs = adminManagementService.GetAiUsageLogs(1000);
    var visits = adminManagementService.GetVisitLogs(1000);

    var dashboard = new
    {
        locationCount = locations.Count,
        publishedLocationCount = locations.Count(x => x.IsPublished),
        voiceProfileCount = adminManagementService.GetVoiceProfiles().Count,
        templateCount = adminManagementService.GetNarrationTemplates(false).Count,
        narrationCount = aiLogs.Count,
        totalEstimatedCostUsd = aiLogs.Sum(x => x.EstimatedCostUsd),
        totalVisits = visits.Count,
        topPages = visits
            .GroupBy(x => x.Path)
            .Select(g => new { path = g.Key, visits = g.Count() })
            .OrderByDescending(x => x.visits)
            .Take(10)
    };

    return Results.Ok(dashboard);
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

app.Run();
