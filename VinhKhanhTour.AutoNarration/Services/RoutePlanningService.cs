using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using VinhKhanhTour.AutoNarration.Models;
using VinhKhanhTour.AutoNarration.Options;

namespace VinhKhanhTour.AutoNarration.Services;

public sealed class RoutePlanningService : IRoutePlanningService
{
    private readonly ILocationContentService _locationContentService;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly AzureAiOptions _options;

    public RoutePlanningService(
        ILocationContentService locationContentService,
        IHttpClientFactory httpClientFactory,
        IOptions<AzureAiOptions> options)
    {
        _locationContentService = locationContentService;
        _httpClientFactory = httpClientFactory;
        _options = options.Value;
    }

    public async Task<RoutePlanResponse> BuildAsync(RoutePlanRequest request, CancellationToken cancellationToken)
    {
        var locations = _locationContentService.GetAll().ToList();
        if (locations.Count == 0)
        {
            throw new InvalidOperationException("Chưa có dữ liệu địa điểm để gợi ý lộ trình.");
        }

        if (CanUseAi())
        {
            var aiResponse = await TryBuildWithAiAsync(request, locations, cancellationToken);
            if (aiResponse is not null)
            {
                return EnrichStops(aiResponse, locations);
            }
        }

        return EnrichStops(BuildFallbackPlan(request, locations), locations);
    }

    public async Task<RoutePlanOptionsResponse> BuildOptionsAsync(RoutePlanRequest request, CancellationToken cancellationToken)
    {
        var basePlan = await BuildAsync(request, cancellationToken);
        var stops = basePlan.Stops?.ToList() ?? [];

        if (stops.Count == 0)
        {
            return new RoutePlanOptionsResponse
            {
                RequestLabel = BuildRequestLabel(request),
                Options = []
            };
        }

        var quickStops = stops.Take(Math.Min(3, stops.Count)).ToList();
        var balanceStops = stops.Take(Math.Min(4, stops.Count)).ToList();
        var exploreStops = stops.Take(Math.Min(6, stops.Count)).ToList();

        var options = new List<RoutePlanOption>
        {
            BuildOption("quick", request, basePlan, quickStops, OptionKind.Quick),
            BuildOption("balanced", request, basePlan, balanceStops, OptionKind.Balanced),
            BuildOption("night", request, basePlan, exploreStops, OptionKind.NightExplore)
        };

        return new RoutePlanOptionsResponse
        {
            RequestLabel = BuildRequestLabel(request),
            Options = options
        };
    }

    private bool CanUseAi() =>
        !string.IsNullOrWhiteSpace(_options.RouteAiEndpoint) &&
        !string.IsNullOrWhiteSpace(_options.RouteAiKey) &&
        !string.IsNullOrWhiteSpace(_options.RouteAiModel);

    private async Task<RoutePlanResponse?> TryBuildWithAiAsync(RoutePlanRequest request, List<StreetLocation> locations, CancellationToken cancellationToken)
    {
        var endpoint = _options.RouteAiEndpoint.TrimEnd('/');
        var payload = new
        {
            model = _options.RouteAiModel,
            temperature = 0.4,
            messages = new object[]
            {
                new { role = "system", content = "You plan visitor routes for Vinh Khanh food street in Ho Chi Minh City. Return strict JSON only." },
                new { role = "user", content = BuildPrompt(request, locations) }
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
        var aiText = document.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        if (string.IsNullOrWhiteSpace(aiText))
        {
            return null;
        }

        try
        {
            return JsonSerializer.Deserialize<RoutePlanResponse>(aiText, new JsonSerializerOptions(JsonSerializerDefaults.Web));
        }
        catch
        {
            return null;
        }
    }

    private static string BuildPrompt(RoutePlanRequest request, List<StreetLocation> locations)
    {
        var locationText = string.Join("\n", locations.Select(location => $"- {location.Name} | {location.Address} | {location.OpeningHours} | {location.Highlight} | {location.DishSamples}"));

                var lines = new List<string>
                {
                        "Create a route plan for Vinh Khanh Food Street.",
                        "Return JSON matching this shape:",
                        "{",
                        "  \"title\": \"string\",",
                        "  \"summary\": \"string\",",
                        "  \"strategy\": \"string\",",
                        "  \"generatedBy\": \"AI\",",
                        "  \"stops\": [",
                        "    {\"name\":\"string\",\"address\":\"string\",\"why\":\"string\",\"recommendedDish\":\"string\",\"bestTime\":\"string\"}",
                        "  ]",
                        "}",
                        string.Empty,
                        "User request:",
                        $"- Visitor type: {request.VisitorType ?? "any"}",
                        $"- Budget level: {request.BudgetLevel ?? "any"}",
                        $"- Start hour: {request.StartHour ?? "any"}",
                        $"- Guest count: {request.GuestCount?.ToString() ?? "any"}",
                        $"- Preferences: {request.Preferences ?? "any"}",
                        $"- Must try: {request.MustTry ?? "any"}",
                        $"- Language: {request.Language ?? "vi"}",
                        string.Empty,
                        "Available places:",
                        locationText,
                        string.Empty,
                        "Make the plan practical and specific to the visitor request."
                };

                return string.Join(Environment.NewLine, lines);
    }

    private static RoutePlanResponse BuildFallbackPlan(RoutePlanRequest request, List<StreetLocation> locations)
    {
        var normalizedPreferences = (request.Preferences ?? string.Empty).ToLowerInvariant();
        var normalizedBudget = (request.BudgetLevel ?? string.Empty).ToLowerInvariant();
        var wantsLateNight = normalizedPreferences.Contains("khuya") || normalizedPreferences.Contains("late") || normalizedPreferences.Contains("đêm");
        var wantsSeafood = normalizedPreferences.Contains("ốc") || normalizedPreferences.Contains("hải sản") || normalizedPreferences.Contains("seafood");
        var wantsFamily = normalizedPreferences.Contains("gia đình") || normalizedPreferences.Contains("family");
        var maxStops = wantsFamily ? 3 : 4;

        var ordered = locations
            .OrderByDescending(location => Score(location, wantsSeafood, wantsLateNight, wantsFamily, normalizedBudget))
            .Take(maxStops)
            .ToList();

        var stops = ordered.Select(location => new RouteStop
        {
            LocationId = location.Id,
            Name = location.Name,
            Address = location.Address,
            Why = location.ShortIntro,
            RecommendedDish = location.DishSamples ?? location.Highlight,
            BestTime = location.BestTime,
            Latitude = location.Latitude,
            Longitude = location.Longitude
        }).ToList();

        var title = wantsSeafood ? "Lộ trình ốc và hải sản Vĩnh Khánh" : "Lộ trình khám phá Vĩnh Khánh theo sở thích khách";
        var summary = $"Gợi ý dựa trên {request.VisitorType ?? "nhu cầu khách"}, ưu tiên {request.Preferences ?? "sự cân bằng giữa món ăn và thời gian"}.";
        var strategy = wantsLateNight
            ? "Ưu tiên các quán mở khuya và có không khí sôi động để khách đi từ tối đến khuya."
            : "Ưu tiên các quán dễ ghé, món nổi bật và cân bằng giữa thời gian di chuyển với trải nghiệm ăn uống.";

        return new RoutePlanResponse
        {
            Title = title,
            Summary = summary,
            Strategy = strategy,
            Stops = stops,
            GeneratedBy = "rule-based fallback"
        };
    }

    private static int Score(StreetLocation location, bool wantsSeafood, bool wantsLateNight, bool wantsFamily, string budget)
    {
        var score = 0;
        if (wantsSeafood && location.Category.Contains("ốc", StringComparison.OrdinalIgnoreCase)) score += 5;
        if (wantsLateNight && (location.OpeningHours.Contains("00:00") || location.OpeningHours.Contains("02:"))) score += 3;
        if (wantsFamily && (location.Name.Contains("Chilli", StringComparison.OrdinalIgnoreCase) || location.Name.Contains("Thế Giới Bò", StringComparison.OrdinalIgnoreCase))) score += 4;
        if (budget.Contains("rẻ") || budget.Contains("thấp")) score += location.OpeningHours.Contains("02:30") ? 1 : 2;
        if (budget.Contains("cao")) score += 1;
        return score;
    }

    private enum OptionKind
    {
        Quick,
        Balanced,
        NightExplore
    }

    private static RoutePlanOption BuildOption(string id, RoutePlanRequest request, RoutePlanResponse basePlan, List<RouteStop> stops, OptionKind kind)
    {
        var stopCount = stops.Count;
        var duration = kind switch
        {
            OptionKind.Quick => 65 + stopCount * 18,
            OptionKind.Balanced => 95 + stopCount * 22,
            _ => 125 + stopCount * 26
        };

        var budgetBase = request.BudgetLevel?.Trim().ToLowerInvariant() switch
        {
            "thấp" => 120_000,
            "cao" => 290_000,
            _ => 190_000
        };

        var budget = budgetBase + stopCount * 28_000;
        var walking = 280 + Math.Max(0, stopCount - 1) * 430;
        var language = (request.Language ?? "vi").Trim().ToLowerInvariant();

        var title = kind switch
        {
            OptionKind.Quick => language.StartsWith("en") ? "Quick Route" : "Lộ trình nhanh gọn",
            OptionKind.Balanced => language.StartsWith("en") ? "Balanced Route" : "Lộ trình cân bằng",
            _ => language.StartsWith("en") ? "Night Explorer Route" : "Lộ trình trải nghiệm đêm"
        };

        var summary = kind switch
        {
            OptionKind.Quick => language.StartsWith("en")
                ? "Suitable when you have limited time but still want signature dishes."
                : "Phù hợp khi bạn ít thời gian nhưng vẫn muốn thử món đặc trưng.",
            OptionKind.Balanced => language.StartsWith("en")
                ? "Balanced between travel, food variety, and budget."
                : "Cân bằng giữa di chuyển, độ đa dạng món và ngân sách.",
            _ => language.StartsWith("en")
                ? "Deeper night-food experience with more stops and richer narration."
                : "Trải nghiệm sâu hơn về đêm với nhiều điểm dừng và thuyết minh chi tiết hơn."
        };

        var strategy = kind switch
        {
            OptionKind.Quick => language.StartsWith("en") ? "Fast pace, low walking, high highlights." : "Đi nhanh, ít đi bộ, tập trung điểm nổi bật.",
            OptionKind.Balanced => language.StartsWith("en") ? "Moderate pace for most visitor groups." : "Nhịp vừa phải, phù hợp đa số nhóm khách.",
            _ => language.StartsWith("en") ? "Slow pace, richer tasting and atmosphere-oriented stops." : "Nhịp chậm hơn, ưu tiên trải nghiệm không khí và đa dạng món."
        };

        var narrationSummary = language.StartsWith("en")
            ? $"Narration ready for {stopCount} stops. Tap a stop to listen while moving."
            : $"Đã sẵn sàng thuyết minh cho {stopCount} điểm dừng. Bạn có thể nghe từng điểm khi di chuyển.";

        return new RoutePlanOption
        {
            Id = id,
            Title = title,
            Summary = summary,
            Strategy = strategy,
            GeneratedBy = basePlan.GeneratedBy,
            EstimatedDurationMinutes = duration,
            EstimatedBudgetPerPersonVnd = budget,
            EstimatedWalkingMeters = walking,
            NarrationSummary = narrationSummary,
            Stops = stops
        };
    }

    private static string BuildRequestLabel(RoutePlanRequest request)
    {
        var visitor = string.IsNullOrWhiteSpace(request.VisitorType) ? "khách chung" : request.VisitorType.Trim();
        var budget = string.IsNullOrWhiteSpace(request.BudgetLevel) ? "ngân sách bất kỳ" : request.BudgetLevel.Trim();
        var pref = string.IsNullOrWhiteSpace(request.Preferences) ? "không yêu cầu đặc biệt" : request.Preferences.Trim();
        return $"{visitor} - {budget} - {pref}";
    }

    private static RoutePlanResponse EnrichStops(RoutePlanResponse response, List<StreetLocation> locations)
    {
        var locationMapByName = locations
            .GroupBy(x => x.Name, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(g => g.Key, g => g.First(), StringComparer.OrdinalIgnoreCase);

        var enrichedStops = response.Stops.Select(stop =>
        {
            if (stop.LocationId is not null && stop.Latitude.HasValue && stop.Longitude.HasValue)
            {
                return stop;
            }

            if (!locationMapByName.TryGetValue(stop.Name, out var loc))
            {
                return stop;
            }

            return new RouteStop
            {
                LocationId = stop.LocationId ?? loc.Id,
                Name = stop.Name,
                Address = stop.Address,
                Why = stop.Why,
                RecommendedDish = stop.RecommendedDish,
                BestTime = stop.BestTime,
                Latitude = stop.Latitude ?? loc.Latitude,
                Longitude = stop.Longitude ?? loc.Longitude
            };
        }).ToList();

        return new RoutePlanResponse
        {
            Title = response.Title,
            Summary = response.Summary,
            Strategy = response.Strategy,
            Stops = enrichedStops,
            GeneratedBy = response.GeneratedBy
        };
    }
}