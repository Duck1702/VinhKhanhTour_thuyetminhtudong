namespace VinhKhanhTour.AutoNarration.Models;

public sealed class StreetLocation
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public required string Category { get; init; }
    public required string Address { get; init; }
    public required string OpeningHours { get; init; }
    public required string ShortIntro { get; init; }
    public required string BestTime { get; init; }
    public required string Highlight { get; init; }
    public required string DescriptionVi { get; init; }
    public string? DishSamples { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
}
