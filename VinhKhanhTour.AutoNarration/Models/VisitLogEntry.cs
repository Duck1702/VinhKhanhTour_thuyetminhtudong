namespace VinhKhanhTour.AutoNarration.Models;

public sealed class VisitLogEntry
{
    public required string Id { get; set; }
    public required string Path { get; set; }
    public required string Method { get; set; }
    public required string UserAgent { get; set; }
    public string? UserEmail { get; set; }
    public DateTimeOffset VisitedAt { get; set; }
}
