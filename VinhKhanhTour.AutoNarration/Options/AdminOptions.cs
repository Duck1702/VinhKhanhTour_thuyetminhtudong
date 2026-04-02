namespace VinhKhanhTour.AutoNarration.Options;

public sealed class AdminOptions
{
    public string ApiKey { get; init; } = "admin123";
    public decimal TranslationCostPerMillionChars { get; init; } = 10.0m;
    public decimal TtsCostPerMillionChars { get; init; } = 16.0m;
}
