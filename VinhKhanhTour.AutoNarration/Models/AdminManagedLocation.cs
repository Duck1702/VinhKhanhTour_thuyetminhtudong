namespace VinhKhanhTour.AutoNarration.Models;

public sealed class AdminManagedLocation
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Category { get; set; }
    public required string Address { get; set; }
    public required string OpeningHours { get; set; }
    public required string ShortIntro { get; set; }
    public required string BestTime { get; set; }
    public required string Highlight { get; set; }
    public required string DescriptionVi { get; set; }
    public string? DishSamples { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public bool IsPublished { get; set; }
    public string? NarrationDraftVi { get; set; }
    public string? NarrationPublicVi { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
