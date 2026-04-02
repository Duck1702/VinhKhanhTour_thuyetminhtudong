using VinhKhanhTour.AutoNarration.Models;

namespace VinhKhanhTour.AutoNarration.Services;

public sealed class InMemoryLocationContentService : ILocationContentService, IAdminManagementService
{
    private readonly object _syncLock = new();
    private readonly Dictionary<string, AdminManagedLocation> _locations;
    private readonly Dictionary<string, VoiceProfile> _voiceProfiles;
    private readonly Dictionary<string, NarrationTemplate> _templates;
    private readonly List<VisitLogEntry> _visitLogs = [];
    private readonly List<AiUsageLogEntry> _aiUsageLogs = [];

    public InMemoryLocationContentService()
    {
        _locations = SeedLocations()
            .Select(location => new AdminManagedLocation
            {
                Id = location.Id,
                Name = location.Name,
                Category = location.Category,
                Address = location.Address,
                OpeningHours = location.OpeningHours,
                ShortIntro = location.ShortIntro,
                BestTime = location.BestTime,
                Highlight = location.Highlight,
                DescriptionVi = location.DescriptionVi,
                DishSamples = location.DishSamples,
                Latitude = location.Latitude,
                Longitude = location.Longitude,
                NarrationDraftVi = location.DescriptionVi,
                NarrationPublicVi = location.DescriptionVi,
                IsPublished = true,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            })
            .ToDictionary(x => x.Id, StringComparer.OrdinalIgnoreCase);

        _voiceProfiles = new[]
        {
            new VoiceProfile { Id = "voice-vi-default", Scenario = "default", Language = "vi", VoiceName = "vi-VN-HoaiMyNeural", IsActive = true, UpdatedAt = DateTimeOffset.UtcNow },
            new VoiceProfile { Id = "voice-en-tour", Scenario = "international", Language = "en", VoiceName = "en-US-JennyNeural", IsActive = true, UpdatedAt = DateTimeOffset.UtcNow },
            new VoiceProfile { Id = "voice-fr-tour", Scenario = "france-tour", Language = "fr", VoiceName = "fr-FR-DeniseNeural", IsActive = true, UpdatedAt = DateTimeOffset.UtcNow },
            new VoiceProfile { Id = "voice-ja-tour", Scenario = "japan-tour", Language = "ja", VoiceName = "ja-JP-NanamiNeural", IsActive = true, UpdatedAt = DateTimeOffset.UtcNow }
        }.ToDictionary(x => x.Id, StringComparer.OrdinalIgnoreCase);

        _templates = new Dictionary<string, NarrationTemplate>(StringComparer.OrdinalIgnoreCase);
    }

    private static IReadOnlyCollection<StreetLocation> SeedLocations() =>
    [
        new StreetLocation
        {
            Id = "oc-oanh",
            Name = "Ốc Oanh",
            Category = "Ốc / hải sản",
            Address = "534 Vĩnh Khánh, Khánh Hội Ward",
            OpeningHours = "13:00 - 00:00",
            ShortIntro = "Điểm dừng nổi tiếng nhất của Vĩnh Khánh, phù hợp để mở đầu hành trình ăn đêm.",
            BestTime = "Sau 18:00",
            Highlight = "Cua rang muối, tôm nướng, ốc sốt cay",
            DishSamples = "Cua rang muối, tôm nướng, ốc sốt me",
            DescriptionVi = "Ốc Oanh là điểm đến quen thuộc của nhiều thực khách trên phố ẩm thực Vĩnh Khánh. Quán nổi bật với cua rang muối, tôm nướng và các món ốc đậm vị, không gian luôn nhộn nhịp vào buổi tối.",
            Latitude = 10.760865,
            Longitude = 106.703808
        },
        new StreetLocation
        {
            Id = "oc-vu",
            Name = "Ốc Vũ",
            Category = "Ốc / hải sản",
            Address = "37 Vĩnh Khánh, Khánh Hội Ward",
            OpeningHours = "12:00 - 06:00 & 12:00 - 00:00 (trừ thứ Sáu 12:00 - 00:00)",
            ShortIntro = "Quán được nhiều người ghé khi muốn ăn khuya và thử cách chế biến giữ trọn độ tươi.",
            BestTime = "Từ 20:00 đến khuya",
            Highlight = "Sò điệp nướng trứng, ốc tỏi nướng muối ớt, càng cua rang muối",
            DishSamples = "Sò điệp nướng trứng, ốc tỏi muối ớt, càng cua rang muối",
            DescriptionVi = "Ốc Vũ nổi tiếng với cách chế biến giữ được độ tươi của nguyên liệu. Các món được gọi nhiều nhất là sò điệp nướng trứng, ốc tỏi nướng muối ớt và càng cua rang muối, rất phù hợp cho hành trình ăn đêm kéo dài.",
            Latitude = 10.762386,
            Longitude = 106.703316
        },
        new StreetLocation
        {
            Id = "thao-oc",
            Name = "Thảo Ốc",
            Category = "Ốc / hải sản",
            Address = "383 Vĩnh Khánh, Khánh Hội Ward",
            OpeningHours = "09:00 - 02:00",
            ShortIntro = "Từ một xe ốc nhỏ, nay trở thành điểm dừng quen thuộc với hải sản tươi giá hợp lý.",
            BestTime = "19:00 - 23:30",
            Highlight = "Ốc, nghêu, sò, mực, tôm và lẩu hải sản",
            DishSamples = "Ốc len xào dừa, nghêu hấp thái, lẩu hải sản",
            DescriptionVi = "Thảo Ốc xuất phát từ một xe ốc nhỏ và phát triển thành quán hải sản được nhiều du khách lẫn người địa phương yêu thích. Thực đơn tập trung vào ốc, nghêu, sò, mực và tôm với cách chế biến đậm đà.",
            Latitude = 10.761128,
            Longitude = 106.703573
        },
        new StreetLocation
        {
            Id = "oc-sau-no",
            Name = "Ốc Sáu Nở",
            Category = "Ốc / hải sản",
            Address = "128 Vĩnh Khánh, Khánh Hội Ward",
            OpeningHours = "16:00 - 02:30",
            ShortIntro = "Quán rộng, dễ ngồi lâu và hợp cho nhóm bạn hoặc gia đình đi ăn đêm.",
            BestTime = "Sau 18:30",
            Highlight = "Ốc sốt trứng muối, nghêu hấp thái, ốc dừa nướng",
            DishSamples = "Ốc sốt trứng muối, nghêu hấp thái, ốc dừa nướng",
            DescriptionVi = "Ốc Sáu Nở là lựa chọn quen thuộc của những ai thích không gian rộng và món ăn đậm đà. Quán nổi bật với ốc sốt trứng muối, nghêu hấp Thái và ốc dừa nướng, phù hợp cho nhóm đông người.",
            Latitude = 10.762108,
            Longitude = 106.703061
        },
        new StreetLocation
        {
            Id = "be-oc",
            Name = "Bê Ốc",
            Category = "Ốc / hải sản",
            Address = "58/44 Vĩnh Khánh, Khánh Hội Ward",
            OpeningHours = "15:00 - 00:00",
            ShortIntro = "Dừng chân cuối hành trình khi muốn ăn nhẹ, thưởng vị ốc và hải sản trong không gian thoải mái.",
            BestTime = "Cuối buổi tối",
            Highlight = "Món ốc tươi, chế biến vừa vị, giá dễ tiếp cận",
            DishSamples = "Ốc luộc sả, nghêu nướng mỡ hành, mực hấp gừng",
            DescriptionVi = "Bê Ốc là nơi phù hợp để kết thúc chuyến đi Vĩnh Khánh bằng một phần ốc hoặc hải sản nhẹ hơn. Quán có không gian thoải mái, món ăn vừa vị và mức giá phù hợp với nhiều nhóm khách.",
            Latitude = 10.761721,
            Longitude = 106.703915
        },
        new StreetLocation
        {
            Id = "lang-quan",
            Name = "Lãng Quán",
            Category = "Hải sản / món nhậu",
            Address = "530 Vĩnh Khánh, Khánh Hội Ward",
            OpeningHours = "00:00 - 15:00 & 00:00 - 21:00 (tuỳ ngày)",
            ShortIntro = "Điểm dừng có giá dễ chịu, phù hợp khách muốn ăn nhanh và gọi nhiều món nhỏ.",
            BestTime = "Buổi trưa hoặc tối muộn",
            Highlight = "Hải sản tươi, món nhậu sáng tạo, giá mềm",
            DishSamples = "Nghêu xào bơ tỏi, sò điệp nướng mỡ hành, mì xào hải sản",
            DescriptionVi = "Lãng Quán phục vụ nhiều món hải sản theo kiểu bình dân, thích hợp cho khách muốn thử nhiều món trong một lần ghé. Điểm mạnh của quán là mức giá dễ tiếp cận và menu có nhiều món nhậu hợp với nhóm bạn.",
            Latitude = 10.760936,
            Longitude = 106.703745
        },
        new StreetLocation
        {
            Id = "chilli-quan",
            Name = "Chilli Quán",
            Category = "Lẩu / nướng",
            Address = "232/105 Vĩnh Khánh, Khánh Hội Ward",
            OpeningHours = "16:00 - 02:00",
            ShortIntro = "Rất hợp cho nhóm gia đình hoặc bạn bè muốn ăn no, ngồi lâu và gọi lẩu/nướng.",
            BestTime = "19:00 - 22:30",
            Highlight = "Lẩu Thái, chân gà, món nướng và món cay",
            DishSamples = "Lẩu Thái, chân gà sả tắc, bò nướng",
            DescriptionVi = "Chilli Quán là nơi phù hợp khi khách muốn đổi nhịp khỏi nhóm quán ốc. Quán nổi bật với lẩu, món nướng và các món cay, phù hợp cho bữa ăn dài và đông người.",
            Latitude = 10.761488,
            Longitude = 106.703205
        },
        new StreetLocation
        {
            Id = "the-gioi-bo",
            Name = "Thế Giới Bò",
            Category = "Bò / món nóng",
            Address = "6 Vĩnh Khánh, Khánh Hội Ward",
            OpeningHours = "14:20 - 00:30",
            ShortIntro = "Dành cho khách thích bò nướng, bò hầm và các món đậm vị khác ngoài hải sản.",
            BestTime = "Sau 17:30",
            Highlight = "Món bò kiểu Hàn - Nhật, lẩu bò và beef hot pot",
            DishSamples = "Bò nướng, lẩu bò, dẻ sườn bò",
            DescriptionVi = "Thế Giới Bò là lựa chọn tốt nếu đoàn khách muốn có thêm món thịt đỏ bên cạnh hải sản. Món ăn theo phong cách Hàn - Nhật, phù hợp với nhóm khách trẻ và gia đình.",
            Latitude = 10.762504,
            Longitude = 106.703426
        }
    ];

    public IReadOnlyCollection<StreetLocation> GetAll()
    {
        lock (_syncLock)
        {
            return _locations.Values
                .Where(x => x.IsPublished)
                .OrderBy(x => x.Name)
                .Select(ToPublicLocation)
                .ToArray();
        }
    }

    public StreetLocation? GetById(string locationId)
    {
        lock (_syncLock)
        {
            if (!_locations.TryGetValue(locationId, out var location) || !location.IsPublished)
            {
                return null;
            }

            return ToPublicLocation(location);
        }
    }

    public IReadOnlyCollection<AdminManagedLocation> GetLocations()
    {
        lock (_syncLock)
        {
            return _locations.Values
                .OrderByDescending(x => x.UpdatedAt)
                .Select(CloneLocation)
                .ToArray();
        }
    }

    public AdminManagedLocation? GetLocation(string id)
    {
        lock (_syncLock)
        {
            return _locations.TryGetValue(id, out var location) ? CloneLocation(location) : null;
        }
    }

    public AdminManagedLocation UpsertLocation(AdminManagedLocation location)
    {
        lock (_syncLock)
        {
            var now = DateTimeOffset.UtcNow;
            var id = string.IsNullOrWhiteSpace(location.Id) ? Slugify(location.Name) : Slugify(location.Id);
            if (_locations.TryGetValue(id, out var existing))
            {
                existing.Name = location.Name.Trim();
                existing.Category = location.Category.Trim();
                existing.Address = location.Address.Trim();
                existing.OpeningHours = location.OpeningHours.Trim();
                existing.ShortIntro = location.ShortIntro.Trim();
                existing.BestTime = location.BestTime.Trim();
                existing.Highlight = location.Highlight.Trim();
                existing.DescriptionVi = location.DescriptionVi.Trim();
                existing.DishSamples = string.IsNullOrWhiteSpace(location.DishSamples) ? null : location.DishSamples.Trim();
                existing.Latitude = location.Latitude;
                existing.Longitude = location.Longitude;
                existing.NarrationDraftVi = string.IsNullOrWhiteSpace(location.NarrationDraftVi)
                    ? existing.NarrationDraftVi
                    : location.NarrationDraftVi.Trim();
                existing.UpdatedAt = now;
                return CloneLocation(existing);
            }

            var item = new AdminManagedLocation
            {
                Id = id,
                Name = location.Name.Trim(),
                Category = location.Category.Trim(),
                Address = location.Address.Trim(),
                OpeningHours = location.OpeningHours.Trim(),
                ShortIntro = location.ShortIntro.Trim(),
                BestTime = location.BestTime.Trim(),
                Highlight = location.Highlight.Trim(),
                DescriptionVi = location.DescriptionVi.Trim(),
                DishSamples = string.IsNullOrWhiteSpace(location.DishSamples) ? null : location.DishSamples.Trim(),
                Latitude = location.Latitude,
                Longitude = location.Longitude,
                NarrationDraftVi = string.IsNullOrWhiteSpace(location.NarrationDraftVi)
                    ? location.DescriptionVi.Trim()
                    : location.NarrationDraftVi.Trim(),
                NarrationPublicVi = null,
                IsPublished = false,
                CreatedAt = now,
                UpdatedAt = now
            };

            _locations[id] = item;
            return CloneLocation(item);
        }
    }

    public bool DeleteLocation(string id)
    {
        lock (_syncLock)
        {
            return _locations.Remove(id);
        }
    }

    public AdminManagedLocation? ApproveLocation(string id, string? approvedNarrationVi)
    {
        lock (_syncLock)
        {
            if (!_locations.TryGetValue(id, out var existing))
            {
                return null;
            }

            existing.IsPublished = true;
            existing.NarrationPublicVi = string.IsNullOrWhiteSpace(approvedNarrationVi)
                ? (existing.NarrationDraftVi ?? existing.DescriptionVi)
                : approvedNarrationVi.Trim();
            existing.UpdatedAt = DateTimeOffset.UtcNow;

            return CloneLocation(existing);
        }
    }

    public IReadOnlyCollection<VoiceProfile> GetVoiceProfiles()
    {
        lock (_syncLock)
        {
            return _voiceProfiles.Values
                .OrderBy(x => x.Scenario)
                .ThenBy(x => x.Language)
                .Select(CloneVoiceProfile)
                .ToArray();
        }
    }

    public VoiceProfile UpsertVoiceProfile(VoiceProfile profile)
    {
        lock (_syncLock)
        {
            var id = string.IsNullOrWhiteSpace(profile.Id)
                ? $"voice-{Guid.NewGuid():N}"
                : Slugify(profile.Id);

            var item = new VoiceProfile
            {
                Id = id,
                Scenario = profile.Scenario.Trim(),
                Language = profile.Language.Trim(),
                VoiceName = profile.VoiceName.Trim(),
                IsActive = profile.IsActive,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            _voiceProfiles[id] = item;
            return CloneVoiceProfile(item);
        }
    }

    public bool DeleteVoiceProfile(string id)
    {
        lock (_syncLock)
        {
            return _voiceProfiles.Remove(id);
        }
    }

    public IReadOnlyCollection<NarrationTemplate> GetNarrationTemplates(bool publishedOnly)
    {
        lock (_syncLock)
        {
            return _templates.Values
                .Where(x => !publishedOnly || x.IsPublished)
                .OrderByDescending(x => x.UpdatedAt)
                .Select(CloneTemplate)
                .ToArray();
        }
    }

    public NarrationTemplate UpsertNarrationTemplate(NarrationTemplate template)
    {
        lock (_syncLock)
        {
            var now = DateTimeOffset.UtcNow;
            var id = string.IsNullOrWhiteSpace(template.Id)
                ? $"tpl-{Guid.NewGuid():N}"
                : Slugify(template.Id);

            var createdAt = now;
            if (_templates.TryGetValue(id, out var existing))
            {
                createdAt = existing.CreatedAt;
            }

            var item = new NarrationTemplate
            {
                Id = id,
                LocationId = string.IsNullOrWhiteSpace(template.LocationId) ? null : template.LocationId.Trim(),
                Title = template.Title.Trim(),
                SourceTextVi = template.SourceTextVi.Trim(),
                TargetLanguage = template.TargetLanguage.Trim(),
                VoiceName = string.IsNullOrWhiteSpace(template.VoiceName) ? null : template.VoiceName.Trim(),
                AudioUrl = string.IsNullOrWhiteSpace(template.AudioUrl) ? null : template.AudioUrl.Trim(),
                IsPublished = template.IsPublished,
                CreatedAt = createdAt,
                UpdatedAt = now
            };

            _templates[id] = item;
            return CloneTemplate(item);
        }
    }

    public bool DeleteNarrationTemplate(string id)
    {
        lock (_syncLock)
        {
            return _templates.Remove(id);
        }
    }

    public void TrackVisit(string path, string method, string userAgent)
    {
        lock (_syncLock)
        {
            _visitLogs.Add(new VisitLogEntry
            {
                Id = Guid.NewGuid().ToString("N"),
                Path = path,
                Method = method,
                UserAgent = userAgent,
                VisitedAt = DateTimeOffset.UtcNow
            });

            if (_visitLogs.Count > 3000)
            {
                _visitLogs.RemoveRange(0, _visitLogs.Count - 3000);
            }
        }
    }

    public IReadOnlyCollection<VisitLogEntry> GetVisitLogs(int take)
    {
        lock (_syncLock)
        {
            return _visitLogs
                .OrderByDescending(x => x.VisitedAt)
                .Take(Math.Clamp(take, 1, 500))
                .Select(x => new VisitLogEntry
                {
                    Id = x.Id,
                    Path = x.Path,
                    Method = x.Method,
                    UserAgent = x.UserAgent,
                    VisitedAt = x.VisitedAt
                })
                .ToArray();
        }
    }

    public void TrackAiUsage(AiUsageLogEntry usage)
    {
        lock (_syncLock)
        {
            _aiUsageLogs.Add(new AiUsageLogEntry
            {
                Id = string.IsNullOrWhiteSpace(usage.Id) ? Guid.NewGuid().ToString("N") : usage.Id,
                LocationId = usage.LocationId,
                TargetLanguage = usage.TargetLanguage,
                VoiceName = usage.VoiceName,
                SourceChars = usage.SourceChars,
                OutputChars = usage.OutputChars,
                EstimatedCostUsd = usage.EstimatedCostUsd,
                GeneratedAt = usage.GeneratedAt == default ? DateTimeOffset.UtcNow : usage.GeneratedAt
            });

            if (_aiUsageLogs.Count > 3000)
            {
                _aiUsageLogs.RemoveRange(0, _aiUsageLogs.Count - 3000);
            }
        }
    }

    public IReadOnlyCollection<AiUsageLogEntry> GetAiUsageLogs(int take)
    {
        lock (_syncLock)
        {
            return _aiUsageLogs
                .OrderByDescending(x => x.GeneratedAt)
                .Take(Math.Clamp(take, 1, 500))
                .Select(x => new AiUsageLogEntry
                {
                    Id = x.Id,
                    LocationId = x.LocationId,
                    TargetLanguage = x.TargetLanguage,
                    VoiceName = x.VoiceName,
                    SourceChars = x.SourceChars,
                    OutputChars = x.OutputChars,
                    EstimatedCostUsd = x.EstimatedCostUsd,
                    GeneratedAt = x.GeneratedAt
                })
                .ToArray();
        }
    }

    private static StreetLocation ToPublicLocation(AdminManagedLocation location) =>
        new()
        {
            Id = location.Id,
            Name = location.Name,
            Category = location.Category,
            Address = location.Address,
            OpeningHours = location.OpeningHours,
            ShortIntro = location.ShortIntro,
            BestTime = location.BestTime,
            Highlight = location.Highlight,
            DescriptionVi = string.IsNullOrWhiteSpace(location.NarrationPublicVi)
                ? location.DescriptionVi
                : location.NarrationPublicVi,
            DishSamples = location.DishSamples,
            Latitude = location.Latitude,
            Longitude = location.Longitude
        };

    private static AdminManagedLocation CloneLocation(AdminManagedLocation location) =>
        new()
        {
            Id = location.Id,
            Name = location.Name,
            Category = location.Category,
            Address = location.Address,
            OpeningHours = location.OpeningHours,
            ShortIntro = location.ShortIntro,
            BestTime = location.BestTime,
            Highlight = location.Highlight,
            DescriptionVi = location.DescriptionVi,
            DishSamples = location.DishSamples,
            Latitude = location.Latitude,
            Longitude = location.Longitude,
            IsPublished = location.IsPublished,
            NarrationDraftVi = location.NarrationDraftVi,
            NarrationPublicVi = location.NarrationPublicVi,
            CreatedAt = location.CreatedAt,
            UpdatedAt = location.UpdatedAt
        };

    private static VoiceProfile CloneVoiceProfile(VoiceProfile profile) =>
        new()
        {
            Id = profile.Id,
            Scenario = profile.Scenario,
            Language = profile.Language,
            VoiceName = profile.VoiceName,
            IsActive = profile.IsActive,
            UpdatedAt = profile.UpdatedAt
        };

    private static NarrationTemplate CloneTemplate(NarrationTemplate template) =>
        new()
        {
            Id = template.Id,
            LocationId = template.LocationId,
            Title = template.Title,
            SourceTextVi = template.SourceTextVi,
            TargetLanguage = template.TargetLanguage,
            VoiceName = template.VoiceName,
            AudioUrl = template.AudioUrl,
            IsPublished = template.IsPublished,
            CreatedAt = template.CreatedAt,
            UpdatedAt = template.UpdatedAt
        };

    private static string Slugify(string input)
    {
        var validChars = input
            .Trim()
            .ToLowerInvariant()
            .Select(ch => char.IsLetterOrDigit(ch) ? ch : '-')
            .ToArray();

        var slug = new string(validChars).Trim('-');
        while (slug.Contains("--", StringComparison.Ordinal))
        {
            slug = slug.Replace("--", "-", StringComparison.Ordinal);
        }

        return string.IsNullOrWhiteSpace(slug) ? Guid.NewGuid().ToString("N") : slug;
    }
}
