namespace VinhKhanhTour.AutoNarration.Models;

public sealed class RoutePlanOptionsResponse
{
    public required string RequestLabel { get; init; }
    public required IReadOnlyList<RoutePlanOption> Options { get; init; }
}
