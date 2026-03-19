using VinhKhanhTour.AutoNarration.Models;
using VinhKhanhTour.AutoNarration.Options;
using VinhKhanhTour.AutoNarration.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.Configure<AzureAiOptions>(builder.Configuration.GetSection("AzureAi"));
builder.Services.AddHttpClient();

builder.Services.AddSingleton<ILocationContentService, InMemoryLocationContentService>();
builder.Services.AddScoped<ITranslationService, AzureTranslationService>();
builder.Services.AddScoped<ISpeechSynthesisService, AzureSpeechSynthesisService>();
builder.Services.AddScoped<NarrationOrchestrator>();

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
app.UseStaticFiles();

app.MapGet("/api/locations", (ILocationContentService locationContentService) =>
{
    return Results.Ok(locationContentService.GetAll());
})
.WithName("GetLocations");

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
})
.WithName("GenerateNarration");

app.Run();
