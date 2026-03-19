using VinhKhanhTour.AutoNarration.Models;

namespace VinhKhanhTour.AutoNarration.Services;

public sealed class NarrationOrchestrator
{
    private readonly ILocationContentService _locationContentService;
    private readonly ITranslationService _translationService;
    private readonly ISpeechSynthesisService _speechSynthesisService;
    private readonly IWebHostEnvironment _environment;

    public NarrationOrchestrator(
        ILocationContentService locationContentService,
        ITranslationService translationService,
        ISpeechSynthesisService speechSynthesisService,
        IWebHostEnvironment environment)
    {
        _locationContentService = locationContentService;
        _translationService = translationService;
        _speechSynthesisService = speechSynthesisService;
        _environment = environment;
    }

    public async Task<GenerateNarrationResponse> GenerateAsync(
        GenerateNarrationRequest request,
        string baseUrl,
        CancellationToken cancellationToken)
    {
        var hasLocation = !string.IsNullOrWhiteSpace(request.LocationId);
        var hasCustomText = !string.IsNullOrWhiteSpace(request.CustomTextVi);

        if (!hasLocation && !hasCustomText)
        {
            throw new ArgumentException("Bạn cần truyền LocationId hoặc CustomTextVi.");
        }

        var sourceTextVi = request.CustomTextVi?.Trim();
        var locationName = "Nội dung tùy chỉnh";

        if (hasLocation)
        {
            var location = _locationContentService.GetById(request.LocationId!);
            if (location is null)
            {
                throw new ArgumentException($"Không tìm thấy địa điểm với id '{request.LocationId}'.");
            }

            sourceTextVi ??= location.DescriptionVi;
            locationName = location.Name;
        }

        var targetLanguage = request.TargetLanguage.Trim();
        var translatedText = await _translationService.TranslateAsync(sourceTextVi!, "vi", targetLanguage, cancellationToken);

        var (audioBytes, voiceName) = await _speechSynthesisService.SynthesizeToMp3Async(
            translatedText,
            targetLanguage,
            request.VoiceName,
            request.SpeakingRate,
            cancellationToken);

        var webRoot = _environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        var audioDir = Path.Combine(webRoot, "audio");
        Directory.CreateDirectory(audioDir);

        var fileName = $"narration-{DateTimeOffset.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}.mp3";
        var audioPath = Path.Combine(audioDir, fileName);
        await File.WriteAllBytesAsync(audioPath, audioBytes, cancellationToken);

        var audioUrl = $"{baseUrl.TrimEnd('/')}/audio/{fileName}";

        return new GenerateNarrationResponse
        {
            LocationId = request.LocationId,
            LocationName = locationName,
            SourceTextVi = sourceTextVi!,
            TranslatedText = translatedText,
            TargetLanguage = targetLanguage,
            VoiceName = voiceName,
            AudioUrl = audioUrl,
            GeneratedAt = DateTimeOffset.UtcNow
        };
    }
}
