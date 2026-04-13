namespace VinhKhanhTour.AutoNarration.Models;

public sealed class AuthUserResponse
{
    public string Id { get; init; } = string.Empty;
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Role { get; init; } = "user"; // user, merchant, admin
}
