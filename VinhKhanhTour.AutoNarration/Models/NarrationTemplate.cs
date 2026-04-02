namespace VinhKhanhTour.AutoNarration.Models;

public sealed class NarrationTemplate
{
    public required string Id { get; set; }
    public string? LocationId { get; set; }
    public required string Title { get; set; }
    public required string SourceTextVi { get; set; }
    public required string TargetLanguage { get; set; }
    public string? VoiceName { get; set; }
    public string? AudioUrl { get; set; }
    public bool IsPublished { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
