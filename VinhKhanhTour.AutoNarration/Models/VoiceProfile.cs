namespace VinhKhanhTour.AutoNarration.Models;

public sealed class VoiceProfile
{
    public required string Id { get; set; }
    public required string Scenario { get; set; }
    public required string Language { get; set; }
    public required string VoiceName { get; set; }
    public bool IsActive { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
