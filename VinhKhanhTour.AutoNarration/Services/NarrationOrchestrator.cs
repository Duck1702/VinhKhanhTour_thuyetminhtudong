using VinhKhanhTour.AutoNarration.Models;
using VinhKhanhTour.AutoNarration.Options;
using Microsoft.Extensions.Options;
using System.Text;
using System.Collections.Concurrent;

namespace VinhKhanhTour.AutoNarration.Services;

public sealed class NarrationOrchestrator
{
    private static readonly ConcurrentDictionary<string, GenerateNarrationResponse> InstantNarrationCache = new(StringComparer.OrdinalIgnoreCase);

    private readonly ILocationContentService _locationContentService;
    private readonly ITranslationService _translationService;
    private readonly ISpeechSynthesisService _speechSynthesisService;
    private readonly IWebHostEnvironment _environment;
    private readonly IAdminManagementService _adminManagementService;
    private readonly AdminOptions _adminOptions;

    public NarrationOrchestrator(
        ILocationContentService locationContentService,
        ITranslationService translationService,
        ISpeechSynthesisService speechSynthesisService,
        IWebHostEnvironment environment,
        IAdminManagementService adminManagementService,
        IOptions<AdminOptions> adminOptions)
    {
        _locationContentService = locationContentService;
        _translationService = translationService;
        _speechSynthesisService = speechSynthesisService;
        _environment = environment;
        _adminManagementService = adminManagementService;
        _adminOptions = adminOptions.Value;
    }

    public async Task<GenerateNarrationResponse> GenerateAsync(
        GenerateNarrationRequest request,
        string baseUrl,
        CancellationToken cancellationToken,
        string? userEmail = null)
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
        var translatedText = string.Empty;
        var usedFallback = false;

        try
        {
            translatedText = await _translationService.TranslateAsync(sourceTextVi!, "vi", targetLanguage, cancellationToken);
        }
        catch (Exception ex) when (ex is HttpRequestException or InvalidOperationException)
        {
            usedFallback = true;
            translatedText = BuildFallbackTranslation(sourceTextVi!, targetLanguage);
        }

        var voiceName = request.VoiceName;
        if (string.IsNullOrWhiteSpace(voiceName))
        {
            voiceName = _adminManagementService
                .GetVoiceProfiles()
                .Where(x => x.IsActive && x.Language.Equals(targetLanguage, StringComparison.OrdinalIgnoreCase))
                .OrderBy(x => x.Scenario.Equals("default", StringComparison.OrdinalIgnoreCase) ? 0 : 1)
                .Select(x => x.VoiceName)
                .FirstOrDefault();
        }

        byte[] audioBytes;
        string resolvedVoiceName;
        var audioExtension = ".mp3";

        try
        {
            (audioBytes, resolvedVoiceName) = await _speechSynthesisService.SynthesizeToMp3Async(
                translatedText,
                targetLanguage,
                voiceName,
                request.SpeakingRate,
                cancellationToken);
        }
        catch (Exception ex) when (ex is HttpRequestException or InvalidOperationException)
        {
            usedFallback = true;
            resolvedVoiceName = "demo-fallback-tone";
            audioBytes = BuildFallbackWaveAudio();
            audioExtension = ".wav";
        }

        var webRoot = _environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        var audioDir = Path.Combine(webRoot, "audio");
        Directory.CreateDirectory(audioDir);

        var fileName = $"narration-{DateTimeOffset.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}{audioExtension}";
        var audioPath = Path.Combine(audioDir, fileName);
        await File.WriteAllBytesAsync(audioPath, audioBytes, cancellationToken);

        var audioUrl = $"{baseUrl.TrimEnd('/')}/audio/{fileName}";

        var sourceChars = sourceTextVi!.Length;
        var outputChars = translatedText.Length;
        var estimatedCostUsd = usedFallback
            ? 0m
            : (sourceChars / 1_000_000m) * _adminOptions.TranslationCostPerMillionChars
                + (outputChars / 1_000_000m) * _adminOptions.TtsCostPerMillionChars;

        _adminManagementService.TrackAiUsage(new AiUsageLogEntry
        {
            Id = Guid.NewGuid().ToString("N"),
            LocationId = request.LocationId,
            UserEmail = userEmail,
            TargetLanguage = targetLanguage,
            VoiceName = resolvedVoiceName,
            SourceChars = sourceChars,
            OutputChars = outputChars,
            EstimatedCostUsd = decimal.Round(estimatedCostUsd, 6),
            GeneratedAt = DateTimeOffset.UtcNow
        });

        return new GenerateNarrationResponse
        {
            LocationId = request.LocationId,
            LocationName = locationName,
            SourceTextVi = sourceTextVi!,
            TranslatedText = translatedText,
            TargetLanguage = targetLanguage,
            VoiceName = resolvedVoiceName,
            AudioUrl = audioUrl,
            GeneratedAt = DateTimeOffset.UtcNow
        };
    }

    public async Task<GenerateNarrationResponse> GetOrCreateInstantAsync(
        string locationId,
        string targetLanguage,
        string baseUrl,
        CancellationToken cancellationToken,
        string? userEmail = null)
    {
        if (string.IsNullOrWhiteSpace(locationId))
        {
            throw new ArgumentException("LocationId không được để trống.");
        }

        if (string.IsNullOrWhiteSpace(targetLanguage))
        {
            targetLanguage = "vi";
        }

        var normalizedLocationId = locationId.Trim();
        var normalizedLanguage = targetLanguage.Trim();
        var key = $"{normalizedLocationId}|{normalizedLanguage}";

        var publishedTemplate = _adminManagementService
            .GetNarrationTemplates(publishedOnly: true)
            .FirstOrDefault(t =>
                !string.IsNullOrWhiteSpace(t.LocationId)
                && t.LocationId.Equals(normalizedLocationId, StringComparison.OrdinalIgnoreCase)
                && t.TargetLanguage.Equals(normalizedLanguage, StringComparison.OrdinalIgnoreCase)
                && !string.IsNullOrWhiteSpace(t.AudioUrl));

        if (publishedTemplate is not null)
        {
            var location = _locationContentService.GetById(normalizedLocationId)
                ?? throw new ArgumentException($"Không tìm thấy địa điểm với id '{normalizedLocationId}'.");

            var templateAudioUrl = RewriteAudioUrlForCurrentHost(publishedTemplate.AudioUrl!, baseUrl);

            return new GenerateNarrationResponse
            {
                LocationId = normalizedLocationId,
                LocationName = location.Name,
                SourceTextVi = publishedTemplate.SourceTextVi,
                TranslatedText = publishedTemplate.SourceTextVi,
                TargetLanguage = normalizedLanguage,
                VoiceName = publishedTemplate.VoiceName ?? "template-voice",
                AudioUrl = templateAudioUrl,
                GeneratedAt = DateTimeOffset.UtcNow
            };
        }

        if (InstantNarrationCache.TryGetValue(key, out var cached))
        {
            return new GenerateNarrationResponse
            {
                LocationId = cached.LocationId,
                LocationName = cached.LocationName,
                SourceTextVi = cached.SourceTextVi,
                TranslatedText = cached.TranslatedText,
                TargetLanguage = cached.TargetLanguage,
                VoiceName = cached.VoiceName,
                AudioUrl = RewriteAudioUrlForCurrentHost(cached.AudioUrl, baseUrl),
                GeneratedAt = cached.GeneratedAt
            };
        }

        var created = await GenerateAsync(new GenerateNarrationRequest
        {
            LocationId = normalizedLocationId,
            TargetLanguage = normalizedLanguage,
            SpeakingRate = 1.0
        }, baseUrl, cancellationToken, userEmail);

        InstantNarrationCache[key] = created;
        return created;
    }

    private static string RewriteAudioUrlForCurrentHost(string audioUrl, string baseUrl)
    {
        if (!Uri.TryCreate(audioUrl, UriKind.Absolute, out var absoluteUri))
        {
            return audioUrl;
        }

        return $"{baseUrl.TrimEnd('/')}{absoluteUri.AbsolutePath}";
    }

    private static string BuildFallbackTranslation(string sourceTextVi, string targetLanguage)
    {
        if (targetLanguage.Equals("vi", StringComparison.OrdinalIgnoreCase))
        {
            return sourceTextVi;
        }

        return $"[DEMO {targetLanguage.ToUpperInvariant()}] {sourceTextVi}";
    }

    private static byte[] BuildFallbackWaveAudio()
    {
        const int sampleRate = 16000;
        const short channels = 1;
        const short bitsPerSample = 16;
        const double seconds = 1.8;
        var sampleCount = (int)(sampleRate * seconds);
        var dataSize = sampleCount * channels * (bitsPerSample / 8);

        using var stream = new MemoryStream(44 + dataSize);
        using var writer = new BinaryWriter(stream, Encoding.ASCII, leaveOpen: true);

        writer.Write(Encoding.ASCII.GetBytes("RIFF"));
        writer.Write(36 + dataSize);
        writer.Write(Encoding.ASCII.GetBytes("WAVE"));
        writer.Write(Encoding.ASCII.GetBytes("fmt "));
        writer.Write(16);
        writer.Write((short)1);
        writer.Write(channels);
        writer.Write(sampleRate);
        writer.Write(sampleRate * channels * (bitsPerSample / 8));
        writer.Write((short)(channels * (bitsPerSample / 8)));
        writer.Write(bitsPerSample);
        writer.Write(Encoding.ASCII.GetBytes("data"));
        writer.Write(dataSize);

        for (var i = 0; i < sampleCount; i++)
        {
            var t = i / (double)sampleRate;
            var envelope = Math.Min(1.0, t * 6.0) * Math.Min(1.0, (seconds - t) * 6.0);
            var sample = (short)(Math.Sin(2 * Math.PI * 740 * t) * 0.18 * short.MaxValue * envelope);
            writer.Write(sample);
        }

        writer.Flush();
        return stream.ToArray();
    }
}
