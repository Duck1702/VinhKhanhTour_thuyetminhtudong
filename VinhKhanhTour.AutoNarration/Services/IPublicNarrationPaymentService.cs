namespace VinhKhanhTour.AutoNarration.Services;

public interface IPublicNarrationPaymentService
{
    NarrationPriceQuote GetQuote(string language);
    NarrationPaymentTicket CreatePayment(string participantId, string locationId, string language);
    bool TryConsumePayment(string participantId, string locationId, string language, string paymentToken, out NarrationPaymentTicket? ticket);
}

public sealed class NarrationPriceQuote
{
    public required string Language { get; init; }
    public required string CurrencyCode { get; init; }
    public required string CurrencySymbol { get; init; }
    public double Amount { get; init; }
    public double AmountVnd { get; init; }
    public DateTimeOffset QuotedAt { get; init; }
}

public sealed class NarrationPaymentTicket
{
    public required string PaymentToken { get; init; }
    public required string ParticipantId { get; init; }
    public required string LocationId { get; init; }
    public required string Language { get; init; }
    public required string CurrencyCode { get; init; }
    public required string CurrencySymbol { get; init; }
    public double Amount { get; init; }
    public double AmountVnd { get; init; }
    public DateTimeOffset PaidAt { get; init; }
}
