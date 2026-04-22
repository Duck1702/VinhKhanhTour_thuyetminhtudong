namespace VinhKhanhTour.AutoNarration.Services;

public sealed class InMemoryPublicNarrationPaymentService : IPublicNarrationPaymentService
{
    private const double BaseVndPerListen = 20000d;
    private static readonly TimeSpan PaymentTokenTtl = TimeSpan.FromMinutes(10);

    private readonly object _syncLock = new();
    private readonly Dictionary<string, StoredPaymentToken> _tokens = new(StringComparer.Ordinal);

    public NarrationPriceQuote GetQuote(string language)
    {
        var normalizedLanguage = NormalizeLanguage(language);
        var (currencyCode, currencySymbol, amount) = ConvertCurrency(normalizedLanguage, BaseVndPerListen);

        return new NarrationPriceQuote
        {
            Language = normalizedLanguage,
            CurrencyCode = currencyCode,
            CurrencySymbol = currencySymbol,
            Amount = amount,
            AmountVnd = BaseVndPerListen,
            QuotedAt = DateTimeOffset.UtcNow
        };
    }

    public NarrationPaymentTicket CreatePayment(string participantId, string locationId, string language)
    {
        var normalizedParticipant = NormalizeId(participantId);
        var normalizedLocation = NormalizeId(locationId);
        var normalizedLanguage = NormalizeLanguage(language);
        var quote = GetQuote(normalizedLanguage);
        var now = DateTimeOffset.UtcNow;

        if (string.IsNullOrWhiteSpace(normalizedParticipant))
        {
            throw new ArgumentException("Thiếu ParticipantId thanh toán.");
        }

        if (string.IsNullOrWhiteSpace(normalizedLocation))
        {
            throw new ArgumentException("Thiếu LocationId thanh toán.");
        }

        var token = Guid.NewGuid().ToString("N");
        var ticket = new NarrationPaymentTicket
        {
            PaymentToken = token,
            ParticipantId = normalizedParticipant,
            LocationId = normalizedLocation,
            Language = normalizedLanguage,
            CurrencyCode = quote.CurrencyCode,
            CurrencySymbol = quote.CurrencySymbol,
            Amount = quote.Amount,
            AmountVnd = quote.AmountVnd,
            PaidAt = now
        };

        lock (_syncLock)
        {
            CleanupExpired(now);
            _tokens[token] = new StoredPaymentToken
            {
                Ticket = ticket,
                ExpiresAt = now.Add(PaymentTokenTtl)
            };
        }

        return ticket;
    }

    public bool TryConsumePayment(string participantId, string locationId, string language, string paymentToken, out NarrationPaymentTicket? ticket)
    {
        ticket = null;
        var now = DateTimeOffset.UtcNow;
        var normalizedParticipant = NormalizeId(participantId);
        var normalizedLocation = NormalizeId(locationId);
        var normalizedLanguage = NormalizeLanguage(language);
        var paymentKey = (paymentToken ?? string.Empty).Trim();

        lock (_syncLock)
        {
            CleanupExpired(now);

            if (string.IsNullOrWhiteSpace(paymentKey)
                || !_tokens.TryGetValue(paymentKey, out var stored))
            {
                return false;
            }

            var data = stored.Ticket;
            var isMatch = data.ParticipantId.Equals(normalizedParticipant, StringComparison.Ordinal)
                && data.LocationId.Equals(normalizedLocation, StringComparison.Ordinal)
                && data.Language.Equals(normalizedLanguage, StringComparison.OrdinalIgnoreCase);

            if (!isMatch)
            {
                return false;
            }

            // Note: We do NOT remove the token here - tokens are reusable until they expire
            // This allows customers to listen multiple times without repaying
            ticket = data;
            return true;
        }
    }

    private static (string CurrencyCode, string CurrencySymbol, double Amount) ConvertCurrency(string language, double amountVnd)
    {
        return language switch
        {
            "en" => ("USD", "$", Math.Round(amountVnd / 25500d, 2)),
            "fr" => ("EUR", "EUR", Math.Round(amountVnd / 28000d, 2)),
            "ja" => ("JPY", "JPY", Math.Round(amountVnd / 170d, 0)),
            "ko" => ("KRW", "KRW", Math.Round(amountVnd / 19d, 0)),
            _ => ("VND", "VND", amountVnd)
        };
    }

    private static string NormalizeLanguage(string language)
    {
        var normalized = (language ?? string.Empty).Trim().ToLowerInvariant();
        var supported = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "vi", "en", "fr", "ja", "ko" };
        return supported.Contains(normalized) ? normalized : "vi";
    }

    private static string NormalizeId(string value)
    {
        var normalized = (value ?? string.Empty).Trim();
        return normalized.Length <= 160 ? normalized : normalized[..160];
    }

    private void CleanupExpired(DateTimeOffset now)
    {
        var expired = _tokens
            .Where(x => x.Value.ExpiresAt < now)
            .Select(x => x.Key)
            .ToArray();

        foreach (var key in expired)
        {
            _tokens.Remove(key);
        }
    }

    private sealed class StoredPaymentToken
    {
        public required NarrationPaymentTicket Ticket { get; init; }
        public DateTimeOffset ExpiresAt { get; init; }
    }
}
