namespace VinhKhanhTour.AutoNarration.Options;

public sealed class AzureAiOptions
{
    public string TranslatorEndpoint { get; init; } = string.Empty;
    public string TranslatorKey { get; init; } = string.Empty;
    public string TranslatorRegion { get; init; } = string.Empty;
    public string SpeechKey { get; init; } = string.Empty;
    public string SpeechRegion { get; init; } = string.Empty;
}
