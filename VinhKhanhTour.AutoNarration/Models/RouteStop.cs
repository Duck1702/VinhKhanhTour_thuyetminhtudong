namespace VinhKhanhTour.AutoNarration.Models;

public sealed class RouteStop
{
    public string? LocationId { get; init; }
    public required string Name { get; init; }
    public required string Address { get; init; }
    public required string Why { get; init; }
    public required string RecommendedDish { get; init; }
    public required string BestTime { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
}