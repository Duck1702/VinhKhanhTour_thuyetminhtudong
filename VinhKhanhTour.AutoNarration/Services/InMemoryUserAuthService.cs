using System.Collections.Concurrent;
using System.Security.Cryptography;
using VinhKhanhTour.AutoNarration.Models;

namespace VinhKhanhTour.AutoNarration.Services;

public sealed class InMemoryUserAuthService : IUserAuthService
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int Iterations = 120_000;

    private readonly ConcurrentDictionary<string, UserAccount> _usersByEmail = new(StringComparer.OrdinalIgnoreCase);

    public (bool Success, string? Error, AuthUserResponse? User) Register(string fullName, string email, string password)
    {
        var normalizedEmail = NormalizeEmail(email);
        var normalizedName = fullName?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(normalizedName))
        {
            return (false, "Họ tên không được để trống.", null);
        }

        if (string.IsNullOrWhiteSpace(normalizedEmail) || !normalizedEmail.Contains('@'))
        {
            return (false, "Email không hợp lệ.", null);
        }

        if (string.IsNullOrWhiteSpace(password) || password.Length < 6)
        {
            return (false, "Mật khẩu phải có ít nhất 6 ký tự.", null);
        }

        if (_usersByEmail.ContainsKey(normalizedEmail))
        {
            return (false, "Email này đã được đăng ký.", null);
        }

        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = HashPassword(password, salt);

        var user = new UserAccount
        {
            Id = Guid.NewGuid().ToString("N"),
            FullName = normalizedName,
            Email = normalizedEmail,
            PasswordSalt = Convert.ToBase64String(salt),
            PasswordHash = Convert.ToBase64String(hash),
            CreatedAt = DateTimeOffset.UtcNow
        };

        if (!_usersByEmail.TryAdd(normalizedEmail, user))
        {
            return (false, "Email này đã được đăng ký.", null);
        }

        return (true, null, ToAuthUser(user));
    }

    public (bool Success, string? Error, AuthUserResponse? User) Login(string email, string password)
    {
        var normalizedEmail = NormalizeEmail(email);
        if (string.IsNullOrWhiteSpace(normalizedEmail) || string.IsNullOrWhiteSpace(password))
        {
            return (false, "Email hoặc mật khẩu không hợp lệ.", null);
        }

        if (!_usersByEmail.TryGetValue(normalizedEmail, out var user))
        {
            return (false, "Sai email hoặc mật khẩu.", null);
        }

        if (!VerifyPassword(password, user.PasswordSalt, user.PasswordHash))
        {
            return (false, "Sai email hoặc mật khẩu.", null);
        }

        return (true, null, ToAuthUser(user));
    }

    public AuthUserResponse? GetByEmail(string email)
    {
        var normalizedEmail = NormalizeEmail(email);
        if (string.IsNullOrWhiteSpace(normalizedEmail))
        {
            return null;
        }

        return _usersByEmail.TryGetValue(normalizedEmail, out var user) ? ToAuthUser(user) : null;
    }

    private static string NormalizeEmail(string value) => value?.Trim().ToLowerInvariant() ?? string.Empty;

    private static byte[] HashPassword(string password, byte[] salt) =>
        Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName.SHA256, HashSize);

    private static bool VerifyPassword(string password, string base64Salt, string base64Hash)
    {
        byte[] salt;
        byte[] expectedHash;

        try
        {
            salt = Convert.FromBase64String(base64Salt);
            expectedHash = Convert.FromBase64String(base64Hash);
        }
        catch
        {
            return false;
        }

        var computed = HashPassword(password, salt);
        return CryptographicOperations.FixedTimeEquals(computed, expectedHash);
    }

    private static AuthUserResponse ToAuthUser(UserAccount user) => new()
    {
        Id = user.Id,
        FullName = user.FullName,
        Email = user.Email
    };
}
