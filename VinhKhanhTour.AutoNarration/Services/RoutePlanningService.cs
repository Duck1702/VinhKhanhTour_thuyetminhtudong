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
                    "All text fields in the JSON must be written in exactly one language: the requested language.",
                    "Do not mix languages in title, summary, strategy, why, recommendedDish, bestTime, or other fields.",
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
        var language = NormalizeLanguage(request.Language);
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

        var title = wantsSeafood
            ? Localize(language,
                "Lộ trình ốc và hải sản Vĩnh Khánh",
                "Vinh Khanh Seafood Route",
                "Itineraire fruits de mer de Vinh Khanh",
                "ビンカイン海鮮ルート",
                "빈칸 해산물 루트")
            : Localize(language,
                "Lộ trình khám phá Vĩnh Khánh theo sở thích khách",
                "Vinh Khanh Route by Visitor Preferences",
                "Itineraire Vinh Khanh selon les preferences du visiteur",
                "来訪者の好みに合わせたビンカインルート",
                "방문자 취향 기반 빈칸 루트");

        var visitorText = request.VisitorType ?? Localize(language, "nhu cầu khách", "visitor needs", "besoins du visiteur", "来訪者ニーズ", "방문자 요구");
        var preferenceText = request.Preferences ?? Localize(language, "sự cân bằng giữa món ăn và thời gian", "a balance between food and time", "un equilibre entre cuisine et temps", "食事と時間のバランス", "음식과 시간의 균형");
        var summary = Localize(language,
            $"Gợi ý dựa trên {visitorText}, ưu tiên {preferenceText}.",
            $"Suggested for {visitorText}, prioritizing {preferenceText}.",
            $"Suggestion pour {visitorText}, avec priorite a {preferenceText}.",
            $"{visitorText}向けに、{preferenceText}を重視した提案です。",
            $"{visitorText} 기준으로 {preferenceText}을 우선한 추천입니다.");

        var strategy = wantsLateNight
            ? Localize(language,
                "Ưu tiên các quán mở khuya và có không khí sôi động để khách đi từ tối đến khuya.",
                "Prioritize late-night spots with lively atmosphere from evening to midnight.",
                "Priorite aux lieux ouverts tard avec une ambiance animee du soir a la nuit.",
                "夜遅くまで営業し、活気のある店舗を優先します。",
                "저녁부터 심야까지 활기 있는 심야 영업 매장을 우선합니다.")
            : Localize(language,
                "Ưu tiên các quán dễ ghé, món nổi bật và cân bằng giữa thời gian di chuyển với trải nghiệm ăn uống.",
                "Prioritize easy-to-access places, signature dishes, and a balance between travel time and food experience.",
                "Priorite aux lieux accessibles, plats signatures et bon equilibre entre trajet et degustation.",
                "立ち寄りやすさ、看板料理、移動時間と食体験のバランスを優先します。",
                "이동 편의성, 대표 메뉴, 이동 시간과 식도락 경험의 균형을 우선합니다.");

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
        var language = NormalizeLanguage(request.Language);

        var title = kind switch
        {
            OptionKind.Quick => Localize(language, "Lộ trình nhanh gọn", "Quick Route", "Parcours rapide", "クイックルート", "빠른 경로"),
            OptionKind.Balanced => Localize(language, "Lộ trình cân bằng", "Balanced Route", "Parcours equilibre", "バランスルート", "균형 경로"),
            _ => Localize(language, "Lộ trình trải nghiệm đêm", "Night Explorer Route", "Parcours de nuit", "ナイト体験ルート", "야간 체험 경로")
        };

        var summary = kind switch
        {
            OptionKind.Quick => Localize(language,
                "Phù hợp khi bạn ít thời gian nhưng vẫn muốn thử món đặc trưng.",
                "Suitable when you have limited time but still want signature dishes.",
                "Convient si vous avez peu de temps mais voulez des plats signatures.",
                "時間が限られていても名物料理を楽しみたい方向けです。",
                "시간이 부족해도 대표 메뉴를 즐기고 싶은 경우에 적합합니다."),
            OptionKind.Balanced => Localize(language,
                "Cân bằng giữa di chuyển, độ đa dạng món và ngân sách.",
                "Balanced between travel, food variety, and budget.",
                "Equilibre entre deplacement, diversite culinaire et budget.",
                "移動、料理の多様性、予算のバランスを重視します。",
                "이동, 음식 다양성, 예산의 균형을 맞춥니다."),
            _ => Localize(language,
                "Trải nghiệm sâu hơn về đêm với nhiều điểm dừng và thuyết minh chi tiết hơn.",
                "Deeper night-food experience with more stops and richer narration.",
                "Experience nocturne plus riche avec plus d arrets et de narration.",
                "停留所を増やし、夜の食体験をより深く楽しめます。",
                "정류장을 늘려 더 깊은 야간 미식 경험을 제공합니다.")
        };

        var strategy = kind switch
        {
            OptionKind.Quick => Localize(language,
                "Đi nhanh, ít đi bộ, tập trung điểm nổi bật.",
                "Fast pace, low walking, high highlights.",
                "Rythme rapide, peu de marche, points forts prioritaires.",
                "短時間・少ない徒歩で見どころ重視の構成です。",
                "빠른 이동, 적은 도보, 핵심 포인트 중심 구성입니다."),
            OptionKind.Balanced => Localize(language,
                "Nhịp vừa phải, phù hợp đa số nhóm khách.",
                "Moderate pace for most visitor groups.",
                "Rythme modere adapte a la plupart des groupes.",
                "多くのグループに合う標準的なペースです。",
                "대부분의 방문 그룹에 맞는 중간 속도입니다."),
            _ => Localize(language,
                "Nhịp chậm hơn, ưu tiên trải nghiệm không khí và đa dạng món.",
                "Slow pace, richer tasting and atmosphere-oriented stops.",
                "Rythme lent, degustation plus riche et ambiance privilegiee.",
                "ゆっくり巡り、雰囲気と料理の多様性を重視します。",
                "느린 속도로 분위기와 음식 다양성을 우선합니다.")
        };

        var narrationSummary = Localize(language,
            $"Đã sẵn sàng thuyết minh cho {stopCount} điểm dừng. Bạn có thể nghe từng điểm khi di chuyển.",
            $"Narration ready for {stopCount} stops. Tap a stop to listen while moving.",
            $"Narration prete pour {stopCount} arrets. Touchez un arret pour ecouter en deplacement.",
            $"{stopCount} か所分のナレーションを用意しました。移動中に各停留所で再生できます。",
            $"{stopCount}개 정류장 내레이션이 준비되었습니다. 이동 중 각 정류장에서 재생할 수 있습니다.");

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
        var language = NormalizeLanguage(request.Language);
        var visitor = MapVisitorLabel(language, request.VisitorType);
        var budget = MapBudgetLabel(language, request.BudgetLevel);
        var pref = MapPreferenceLabel(language, request.Preferences);
        return $"{visitor} - {budget} - {pref}";
    }

    private static string MapVisitorLabel(string language, string? visitorType)
    {
        if (string.IsNullOrWhiteSpace(visitorType))
        {
            return Localize(language, "khách chung", "general visitor", "visiteur general", "一般来訪者", "일반 방문자");
        }

        var normalized = visitorType.Trim().ToLowerInvariant();
        if (normalized.Contains("family") || normalized.Contains("gia đình") || normalized.Contains("gia dinh"))
        {
            return Localize(language, "gia đình", "family", "famille", "家族", "가족");
        }

        if (normalized.Contains("couple") || normalized.Contains("cap doi") || normalized.Contains("cặp đôi"))
        {
            return Localize(language, "cặp đôi", "couple", "couple", "カップル", "커플");
        }

        if (normalized.Contains("friend") || normalized.Contains("nhóm bạn") || normalized.Contains("nhom ban") || normalized.Contains("group"))
        {
            return Localize(language, "nhóm bạn", "friends group", "groupe d amis", "友人グループ", "친구 그룹");
        }

        if (normalized.Contains("solo") || normalized.Contains("một mình") || normalized.Contains("mot minh") || normalized.Contains("single"))
        {
            return Localize(language, "đi một mình", "solo traveler", "voyageur solo", "一人旅", "혼행 여행자");
        }

        return visitorType.Trim();
    }

    private static string MapBudgetLabel(string language, string? budgetLevel)
    {
        if (string.IsNullOrWhiteSpace(budgetLevel))
        {
            return Localize(language, "ngân sách bất kỳ", "any budget", "budget libre", "予算自由", "예산 무관");
        }

        var normalized = budgetLevel.Trim().ToLowerInvariant();
        if (normalized is "thấp" or "thap" or "low")
        {
            return Localize(language, "thấp", "low", "faible", "低", "낮음");
        }

        if (normalized is "vừa" or "vua" or "medium" or "mid")
        {
            return Localize(language, "vừa", "medium", "moyen", "中", "중간");
        }

        if (normalized is "cao" or "high")
        {
            return Localize(language, "cao", "high", "eleve", "高", "높음");
        }

        return budgetLevel.Trim();
    }

    private static string MapPreferenceLabel(string language, string? preferences)
    {
        if (string.IsNullOrWhiteSpace(preferences))
        {
            return Localize(language, "không yêu cầu đặc biệt", "no special preferences", "aucune preference particuliere", "特別な希望なし", "특별 요청 없음");
        }

        var rawParts = preferences
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(x => x.Trim())
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .ToList();

        if (rawParts.Count == 0)
        {
            return preferences.Trim();
        }

        var mapped = rawParts.Select(part =>
        {
            var token = part.ToLowerInvariant();
            if (token.Contains("seafood") || token.Contains("hải sản") || token.Contains("hai san") || token.Contains("ốc") || token.Contains("oc"))
            {
                return Localize(language, "hải sản", "seafood", "fruits de mer", "海鮮", "해산물");
            }

            if (token.Contains("late") || token.Contains("khuya") || token.Contains("đêm") || token.Contains("dem") || token.Contains("night"))
            {
                return Localize(language, "đi khuya", "late-night", "nuit tardive", "夜遅め", "야간 선호");
            }

            if (token.Contains("walk") || token.Contains("đi bộ") || token.Contains("di bo"))
            {
                return Localize(language, "ít đi bộ", "less walking", "moins de marche", "徒歩少なめ", "도보 최소");
            }

            if (token.Contains("budget") || token.Contains("tiết kiệm") || token.Contains("tiet kiem") || token.Contains("affordable"))
            {
                return Localize(language, "tiết kiệm", "budget-friendly", "economique", "予算重視", "가성비");
            }

            return part;
        });

        return string.Join(", ", mapped);
    }

    private static string NormalizeLanguage(string? language)
    {
        var normalized = (language ?? "vi").Trim().ToLowerInvariant();
        return normalized switch
        {
            "en" or "fr" or "ja" or "ko" or "vi" => normalized,
            _ => "vi"
        };
    }

    private static string Localize(string language, string vi, string en, string fr, string ja, string ko) => language switch
    {
        "en" => en,
        "fr" => fr,
        "ja" => ja,
        "ko" => ko,
        _ => vi
    };

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