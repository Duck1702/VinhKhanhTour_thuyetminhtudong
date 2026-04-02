namespace VinhKhanhTour.AutoNarration.Models;

public sealed class RoutePlanResponse
{
    public required string Title { get; init; }
    public required string Summary { get; init; }
    public required string Strategy { get; init; }
    public required IReadOnlyList<RouteStop> Stops { get; init; }
    public required string GeneratedBy { get; init; }
}