namespace VinhKhanhTour.AutoNarration.Models;

public sealed class AiUsageLogEntry
{
    public required string Id { get; set; }
    public string? LocationId { get; set; }
    public required string TargetLanguage { get; set; }
    public required string VoiceName { get; set; }
    public int SourceChars { get; set; }
    public int OutputChars { get; set; }
    public decimal EstimatedCostUsd { get; set; }
    public DateTimeOffset GeneratedAt { get; set; }
}
