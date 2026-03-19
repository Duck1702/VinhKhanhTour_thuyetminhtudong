using System.Globalization;
using System.Net.Http.Headers;
using System.Security;
using System.Text;
using Microsoft.Extensions.Options;
using VinhKhanhTour.AutoNarration.Options;

namespace VinhKhanhTour.AutoNarration.Services;

public sealed class AzureSpeechSynthesisService : ISpeechSynthesisService
{
    private static readonly IReadOnlyDictionary<string, string> DefaultVoices = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        ["vi"] = "vi-VN-HoaiMyNeural",
        ["en"] = "en-US-JennyNeural",
        ["fr"] = "fr-FR-DeniseNeural",
        ["ja"] = "ja-JP-NanamiNeural",
        ["ko"] = "ko-KR-SunHiNeural",
        ["zh-Hans"] = "zh-CN-XiaoxiaoNeural"
    };

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly AzureAiOptions _options;

    public AzureSpeechSynthesisService(IHttpClientFactory httpClientFactory, IOptions<AzureAiOptions> options)
    {
        _httpClientFactory = httpClientFactory;
        _options = options.Value;
    }

    public async Task<(byte[] AudioBytes, string VoiceName)> SynthesizeToMp3Async(
        string text,
        string language,
        string? preferredVoice,
        double speakingRate,
        CancellationToken cancellationToken)
    {
        EnsureSpeechConfigured();

        var voice = ResolveVoice(language, preferredVoice);
        var safeRate = Math.Clamp(speakingRate, 0.5, 2.0);
        var escapedText = SecurityElement.Escape(text) ?? text;

        var ssml = $"<speak version='1.0' xml:lang='{language}'><voice name='{voice}'><prosody rate='{safeRate.ToString("0.##", CultureInfo.InvariantCulture)}'>{escapedText}</prosody></voice></speak>";
        var requestUri = $"https://{_options.SpeechRegion}.tts.speech.microsoft.com/cognitiveservices/v1";

        using var request = new HttpRequestMessage(HttpMethod.Post, requestUri)
        {
            Content = new StringContent(ssml, Encoding.UTF8, "application/ssml+xml")
        };

        request.Headers.Add("Ocp-Apim-Subscription-Key", _options.SpeechKey);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("audio/mpeg"));
        request.Headers.Add("X-Microsoft-OutputFormat", "audio-24khz-96kbitrate-mono-mp3");

        using var client = _httpClientFactory.CreateClient();
        using var response = await client.SendAsync(request, cancellationToken);

        response.EnsureSuccessStatusCode();

        var audioBytes = await response.Content.ReadAsByteArrayAsync(cancellationToken);
        return (audioBytes, voice);
    }

    private static string ResolveVoice(string language, string? preferredVoice)
    {
        if (!string.IsNullOrWhiteSpace(preferredVoice))
        {
            return preferredVoice;
        }

        if (DefaultVoices.TryGetValue(language, out var voice))
        {
            return voice;
        }

        return "en-US-JennyNeural";
    }

    private void EnsureSpeechConfigured()
    {
        if (string.IsNullOrWhiteSpace(_options.SpeechKey) ||
            string.IsNullOrWhiteSpace(_options.SpeechRegion))
        {
            throw new InvalidOperationException("Thiếu cấu hình Azure Speech trong appsettings.json (AzureAi). ");
        }
    }
}
