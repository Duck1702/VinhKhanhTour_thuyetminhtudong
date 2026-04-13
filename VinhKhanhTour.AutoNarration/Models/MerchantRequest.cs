namespace VinhKhanhTour.AutoNarration.Models;

public sealed class MerchantRequest
{
    public string Id { get; init; } = Guid.NewGuid().ToString("N");
    public string LocationId { get; init; } = string.Empty;
    public string MerchantEmail { get; init; } = string.Empty;
    public string MerchantName { get; init; } = string.Empty;
    public string RequestType { get; init; } = string.Empty; // "edit-info", "promotion", "advertisement", "other"
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Status { get; init; } = "pending"; // "pending", "approved", "rejected"
    public string? AdminResponse { get; init; } = null;
    public bool IsPinnedTop { get; init; } = false;
    public int PriorityScore { get; init; } = 0;
    public DateTimeOffset? CampaignStartAt { get; init; } = null;
    public DateTimeOffset? CampaignEndAt { get; init; } = null;
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? ReviewedAt { get; init; } = null;
    public string? ReviewedBy { get; init; } = null;
}
