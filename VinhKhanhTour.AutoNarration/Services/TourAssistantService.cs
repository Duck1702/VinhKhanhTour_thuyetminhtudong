using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using VinhKhanhTour.AutoNarration.Models;
using VinhKhanhTour.AutoNarration.Options;

namespace VinhKhanhTour.AutoNarration.Services;

public sealed class TourAssistantService : ITourAssistantService
{
    private readonly ILocationContentService _locationContentService;
    private readonly ITranslationService _translationService;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly AzureAiOptions _options;

    public TourAssistantService(
        ILocationContentService locationContentService,
        ITranslationService translationService,
        IHttpClientFactory httpClientFactory,
        IOptions<AzureAiOptions> options)
    {
        _locationContentService = locationContentService;
        _translationService = translationService;
        _httpClientFactory = httpClientFactory;
        _options = options.Value;
    }

    public async Task<AssistantAskResponse> AskAsync(AssistantAskRequest request, CancellationToken cancellationToken)
    {
        var question = request.Question?.Trim();
        if (string.IsNullOrWhiteSpace(question))
        {
            throw new ArgumentException("Câu hỏi không được để trống.");
        }

        var language = string.IsNullOrWhiteSpace(request.Language) ? "vi" : request.Language.Trim();
        var locations = _locationContentService.GetAll().ToList();
        var suggested = FindSuggestedLocations(question, locations);

        if (CanUseAi())
        {
            var aiAnswer = await TryAskWithAiAsync(question, language, locations, cancellationToken);
            if (!string.IsNullOrWhiteSpace(aiAnswer))
            {
                return new AssistantAskResponse
                {
                    Answer = aiAnswer,
                    Language = language,
                    Source = "ai-rag",
                    SuggestedLocations = suggested
                };
            }
        }

        var viAnswer = BuildFallbackAnswer(question, suggested, locations);
        var finalAnswer = viAnswer;

        if (!language.Equals("vi", StringComparison.OrdinalIgnoreCase))
        {
            try
            {
                finalAnswer = await _translationService.TranslateAsync(viAnswer, "vi", language, cancellationToken);
            }
            catch
            {
                finalAnswer = viAnswer;
            }
        }

        return new AssistantAskResponse
        {
            Answer = finalAnswer,
            Language = language,
            Source = "rule-based",
            SuggestedLocations = suggested
        };
    }

    private bool CanUseAi() =>
        !string.IsNullOrWhiteSpace(_options.RouteAiEndpoint) &&
        !string.IsNullOrWhiteSpace(_options.RouteAiKey) &&
        !string.IsNullOrWhiteSpace(_options.RouteAiModel);

    private async Task<string?> TryAskWithAiAsync(
        string question,
        string language,
        List<StreetLocation> locations,
        CancellationToken cancellationToken)
    {
        var endpoint = _options.RouteAiEndpoint.TrimEnd('/');
        var prompt = BuildAiPrompt(question, language, locations);

        var payload = new
        {
            model = _options.RouteAiModel,
            temperature = 0.3,
            messages = new object[]
            {
                new { role = "system", content = "You are a concise local tour assistant for Vinh Khanh food street. Only answer from provided context. If information is missing, say so briefly." },
                new { role = "user", content = prompt }
            }
        };

        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, $"{endpoint}/chat/completions")
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        };

        httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.RouteAiKey);

        using var client = _httpClientFactory.CreateClient();
        using var response = await client.SendAsync(httpRequest, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        using var document = JsonDocument.Parse(content);
        return document.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();
    }

    private static string BuildAiPrompt(string question, string language, List<StreetLocation> locations)
    {
        var locationLines = string.Join("\n", locations.Select(x =>
            $"- {x.Name} | {x.Category} | {x.Address} | {x.OpeningHours} | {x.BestTime} | {x.Highlight} | {x.ShortIntro}"));

        var lines = new List<string>
        {
            "User language:",
            language,
            string.Empty,
            "Question:",
            question,
            string.Empty,
            "Available facts:",
            locationLines,
            string.Empty,
            "Answer in user language in 3-6 concise sentences.",
            "Do not invent addresses, opening hours, or dishes outside the provided facts."
        };

        return string.Join(Environment.NewLine, lines);
    }

    private static IReadOnlyCollection<string> FindSuggestedLocations(string question, List<StreetLocation> locations)
    {
        var normalized = question.ToLowerInvariant();

        var ranked = locations
            .Select(location => new
            {
                Name = location.Name,
                Score = ScoreLocation(normalized, location)
            })
            .OrderByDescending(x => x.Score)
            .ThenBy(x => x.Name)
            .Take(3)
            .Where(x => x.Score > 0)
            .Select(x => x.Name)
            .ToArray();

        return ranked;
    }

    private static int ScoreLocation(string normalizedQuestion, StreetLocation location)
    {
        var score = 0;

        if (normalizedQuestion.Contains(location.Name.ToLowerInvariant())) score += 8;
        if (normalizedQuestion.Contains("ốc") && location.Category.Contains("ốc", StringComparison.OrdinalIgnoreCase)) score += 3;
        if (normalizedQuestion.Contains("hải sản") && location.Category.Contains("hải sản", StringComparison.OrdinalIgnoreCase)) score += 3;
        if (normalizedQuestion.Contains("khuya") && (location.OpeningHours.Contains("00:00") || location.OpeningHours.Contains("02:"))) score += 2;
        if (normalizedQuestion.Contains("gia đình") && location.ShortIntro.Contains("gia đình", StringComparison.OrdinalIgnoreCase)) score += 2;

        return score;
    }

    private static string BuildFallbackAnswer(string question, IReadOnlyCollection<string> suggested, List<StreetLocation> locations)
    {
        if (suggested.Count == 0)
        {
            var top = locations.Take(3).Select(x => x.Name);
            return $"Mình chưa thấy dữ liệu khớp chính xác với câu hỏi \"{question}\". Bạn có thể bắt đầu với: {string.Join(", ", top)}. Nếu muốn, bạn hỏi rõ hơn về món, giờ mở cửa hoặc ngân sách để mình gợi ý chính xác hơn.";
        }

        var suggestions = string.Join(", ", suggested);
        return $"Với câu hỏi \"{question}\", các địa điểm phù hợp nhất là: {suggestions}. Bạn có thể bấm vào từng địa điểm để nghe thuyết minh ngay theo ngôn ngữ đang chọn.";
    }
}
