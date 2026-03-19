namespace VinhKhanhTour.AutoNarration.Models;

public sealed class GenerateNarrationResponse
{
    public required string? LocationId { get; init; }
    public required string LocationName { get; init; }
    public required string SourceTextVi { get; init; }
    public required string TranslatedText { get; init; }
    public required string TargetLanguage { get; init; }
    public required string VoiceName { get; init; }
    public required string AudioUrl { get; init; }
    public required DateTimeOffset GeneratedAt { get; init; }
}
