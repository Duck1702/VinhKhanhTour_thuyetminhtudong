using VinhKhanhTour.AutoNarration.Models;

namespace VinhKhanhTour.AutoNarration.Services;

public interface IUserAuthService
{
    (bool Success, string? Error, AuthUserResponse? User) Register(string fullName, string email, string password, string role = "user");
    (bool Success, string? Error, AuthUserResponse? User) Login(string email, string password, string role = "user");
    AuthUserResponse? GetByEmail(string email);
    IEnumerable<AuthUserResponse> GetAdmins();
    IEnumerable<AuthUserResponse> GetMerchants();
}
