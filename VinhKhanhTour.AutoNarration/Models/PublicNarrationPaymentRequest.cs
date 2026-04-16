namespace VinhKhanhTour.AutoNarration.Models;

public sealed class PublicNarrationPaymentRequest
{
    public string ParticipantId { get; set; } = string.Empty;
    public string LocationId { get; set; } = string.Empty;
    public string TargetLanguage { get; set; } = "vi";
}
