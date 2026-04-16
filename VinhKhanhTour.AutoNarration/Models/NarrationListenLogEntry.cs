namespace VinhKhanhTour.AutoNarration.Models;

public sealed class NarrationListenLogEntry
{
    public required string Id { get; set; }
    public required string LocationId { get; set; }
    public required string ParticipantId { get; set; }
    public string? UserEmail { get; set; }
    public required string TargetLanguage { get; set; }
    public required string CurrencyCode { get; set; }
    public double PaidAmount { get; set; }
    public double PaidAmountVnd { get; set; }
    public DateTimeOffset ListenedAt { get; set; }
}
