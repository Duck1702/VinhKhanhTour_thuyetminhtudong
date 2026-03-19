using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using VinhKhanhTour.AutoNarration.Options;

namespace VinhKhanhTour.AutoNarration.Services;

public sealed class AzureTranslationService : ITranslationService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly AzureAiOptions _options;

    public AzureTranslationService(IHttpClientFactory httpClientFactory, IOptions<AzureAiOptions> options)
    {
        _httpClientFactory = httpClientFactory;
        _options = options.Value;
    }

    public async Task<string> TranslateAsync(string text, string sourceLanguage, string targetLanguage, CancellationToken cancellationToken)
    {
        if (string.Equals(sourceLanguage, targetLanguage, StringComparison.OrdinalIgnoreCase))
        {
            return text;
        }

        EnsureTranslatorConfigured();

        var endpoint = _options.TranslatorEndpoint.TrimEnd('/');
        var requestUri = $"{endpoint}/translate?api-version=3.0&from={Uri.EscapeDataString(sourceLanguage)}&to={Uri.EscapeDataString(targetLanguage)}";

        var payload = JsonSerializer.Serialize(new[] { new { Text = text } });

        using var request = new HttpRequestMessage(HttpMethod.Post, requestUri)
        {
            Content = new StringContent(payload, Encoding.UTF8, "application/json")
        };

        request.Headers.Add("Ocp-Apim-Subscription-Key", _options.TranslatorKey);
        request.Headers.Add("Ocp-Apim-Subscription-Region", _options.TranslatorRegion);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        using var client = _httpClientFactory.CreateClient();
        using var response = await client.SendAsync(request, cancellationToken);

        response.EnsureSuccessStatusCode();

        await using var responseStream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var translationResponse = await JsonSerializer.DeserializeAsync<List<TranslationApiResult>>(responseStream, cancellationToken: cancellationToken)
            ?? throw new InvalidOperationException("Không đọc được dữ liệu trả về từ Azure Translator.");

        var translated = translationResponse
            .FirstOrDefault()?
            .Translations?
            .FirstOrDefault()?
            .Text;

        return string.IsNullOrWhiteSpace(translated)
            ? throw new InvalidOperationException("Azure Translator không trả về bản dịch hợp lệ.")
            : translated;
    }

    private void EnsureTranslatorConfigured()
    {
        if (string.IsNullOrWhiteSpace(_options.TranslatorEndpoint) ||
            string.IsNullOrWhiteSpace(_options.TranslatorKey) ||
            string.IsNullOrWhiteSpace(_options.TranslatorRegion))
        {
            throw new InvalidOperationException("Thiếu cấu hình Azure Translator trong appsettings.json (AzureAi). ");
        }
    }

    private sealed class TranslationApiResult
    {
        public List<TranslatedItem>? Translations { get; init; }
    }

    private sealed class TranslatedItem
    {
        public string? Text { get; init; }
    }
}
