namespace VinhKhanhTour.AutoNarration.Models;

public sealed class AssistantAskResponse
{
    public required string Answer { get; init; }
    public required string Language { get; init; }
    public required string Source { get; init; }
    public required IReadOnlyCollection<string> SuggestedLocations { get; init; }
}
