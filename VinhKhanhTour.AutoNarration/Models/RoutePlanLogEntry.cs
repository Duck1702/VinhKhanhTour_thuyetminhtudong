namespace VinhKhanhTour.AutoNarration.Models;

public sealed class RoutePlanLogEntry
{
    public required string Id { get; set; }
    public string? UserEmail { get; set; }
    public string? VisitorType { get; set; }
    public string? BudgetLevel { get; set; }
    public string? StartHour { get; set; }
    public int? GuestCount { get; set; }
    public string? Preferences { get; set; }
    public string? MustTry { get; set; }
    public required string PlanTitle { get; set; }
    public required string GeneratedBy { get; set; }
    public string? StopSummary { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}
