namespace VinhKhanhTour.AutoNarration.Models;

public sealed class RouteStop
{
    public required string Name { get; init; }
    public required string Address { get; init; }
    public required string Why { get; init; }
    public required string RecommendedDish { get; init; }
    public required string BestTime { get; init; }
}