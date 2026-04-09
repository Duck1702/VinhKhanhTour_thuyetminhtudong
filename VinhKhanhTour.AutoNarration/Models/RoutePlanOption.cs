namespace VinhKhanhTour.AutoNarration.Models;

public sealed class RoutePlanOption
{
    public required string Id { get; init; }
    public required string Title { get; init; }
    public required string Summary { get; init; }
    public required string Strategy { get; init; }
    public required string GeneratedBy { get; init; }
    public int EstimatedDurationMinutes { get; init; }
    public int EstimatedBudgetPerPersonVnd { get; init; }
    public int EstimatedWalkingMeters { get; init; }
    public required string NarrationSummary { get; init; }
    public required IReadOnlyList<RouteStop> Stops { get; init; }
}
