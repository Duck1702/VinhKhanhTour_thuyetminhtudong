namespace VinhKhanhTour.AutoNarration.Models;

public sealed class GenerateNarrationRequest
{
    public string? LocationId { get; init; }
    public string? CustomTextVi { get; init; }
    public string TargetLanguage { get; init; } = "en";
    public string? VoiceName { get; init; }
    public double SpeakingRate { get; init; } = 1.0;
}
