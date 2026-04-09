using VinhKhanhTour.AutoNarration.Models;

namespace VinhKhanhTour.AutoNarration.Services;

public interface IUserAuthService
{
    (bool Success, string? Error, AuthUserResponse? User) Register(string fullName, string email, string password);
    (bool Success, string? Error, AuthUserResponse? User) Login(string email, string password);
    AuthUserResponse? GetByEmail(string email);
}
