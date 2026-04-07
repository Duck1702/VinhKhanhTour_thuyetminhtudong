namespace VinhKhanhTour.AutoNarration.Models;

public sealed class AssistantAskRequest
{
    public string Question { get; init; } = string.Empty;
    public string Language { get; init; } = "vi";
}
