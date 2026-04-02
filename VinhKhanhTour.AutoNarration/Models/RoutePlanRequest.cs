namespace VinhKhanhTour.AutoNarration.Models;

public sealed class RoutePlanRequest
{
    public string? VisitorType { get; init; }
    public string? BudgetLevel { get; init; }
    public string? StartHour { get; init; }
    public int? GuestCount { get; init; }
    public string? Preferences { get; init; }
    public string? MustTry { get; init; }
    public string? Language { get; init; } = "vi";
}