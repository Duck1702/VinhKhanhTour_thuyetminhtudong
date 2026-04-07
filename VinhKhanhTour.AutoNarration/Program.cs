using VinhKhanhTour.AutoNarration.Models;
using VinhKhanhTour.AutoNarration.Options;
using VinhKhanhTour.AutoNarration.Services;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.Configure<AzureAiOptions>(builder.Configuration.GetSection("AzureAi"));
builder.Services.Configure<AdminOptions>(builder.Configuration.GetSection("Admin"));
builder.Services.AddHttpClient();

builder.Services.AddSingleton<InMemoryLocationContentService>();
builder.Services.AddSingleton<ILocationContentService>(sp => sp.GetRequiredService<InMemoryLocationContentService>());
builder.Services.AddSingleton<IAdminManagementService>(sp => sp.GetRequiredService<InMemoryLocationContentService>());
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
    admin.TrackVisit(path, context.Request.Method, userAgent);
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
        var response = await narrationOrchestrator.GenerateAsync(request, baseUrl, cancellationToken);
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
        var response = await narrationOrchestrator.GetOrCreateInstantAsync(request.LocationId, language, baseUrl, cancellationToken);
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
    CancellationToken cancellationToken) =>
{
    try
    {
        var response = await routePlanningService.BuildAsync(request, cancellationToken);
        return Results.Ok(response);
    }
    catch (InvalidOperationException ex)
    {
        return Results.Problem(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
    }
})
.WithName("PlanRoute");

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
