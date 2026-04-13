namespace VinhKhanhTour.AutoNarration.Models;

public sealed class UserAccount
{
    public string Id { get; init; } = string.Empty;
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string PasswordHash { get; init; } = string.Empty;
    public string PasswordSalt { get; init; } = string.Empty;
    public string Role { get; init; } = "user"; // user, merchant, admin
    public DateTimeOffset CreatedAt { get; init; }
}
