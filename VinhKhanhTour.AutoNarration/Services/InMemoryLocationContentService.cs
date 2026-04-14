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
    private readonly List<RoutePlanLogEntry> _routePlanLogs = [];
    private readonly List<MerchantRequest> _merchantRequests = [];

    public InMemoryLocationContentService()
    {
        _locations = SeedLocations()
            .Select(location => new AdminManagedLocation
            {
                Id = location.Id,
                Name = location.Name,
                Category = location.Category,
                Address = location.Address,
                ContactPhone = location.ContactPhone,
                OpeningHours = location.OpeningHours,
                PriceRange = location.PriceRange,
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

        _merchantRequests.AddRange(SeedMerchantRequests());
    }

    private static IReadOnlyCollection<StreetLocation> SeedLocations() =>
    [
        new StreetLocation
        {
            Id = "oc-oanh",
            Name = "Ốc Oanh",
            Category = "Ốc & hải sản",
            Address = "534 Vĩnh Khánh, P.8, Quận 4",
            ContactPhone = "0937 916 159",
            OpeningHours = "13:00 - 00:00",
            PriceRange = "80.000 - 250.000 VND/người",
            ShortIntro = "Quán nổi tiếng nhất phố Vĩnh Khánh, hải sản tươi và nêm nếm đậm đà.",
            BestTime = "Sau 18:00",
            Highlight = "Ốc hương rang muối ớt, bạch tuộc nướng, chân gà nướng",
            DishSamples = "Ốc hương rang muối ớt, bạch tuộc nướng, chân gà nướng",
            DescriptionVi = "Không gian bình dân nhưng luôn đông khách nhờ món lên nhanh, vị ổn định và nguyên liệu tươi.",
            Latitude = 10.760865,
            Longitude = 106.703808
        },
        new StreetLocation
        {
            Id = "oc-thao",
            Name = "Quán Ốc Thảo",
            Category = "Ốc & hải sản",
            Address = "383 Vĩnh Khánh, P.8, Quận 4",
            ContactPhone = "0932 117 078",
            OpeningHours = "16:00 - 01:00",
            PriceRange = "80.000 - 220.000 VND/người",
            ShortIntro = "Quán thâm niên lâu năm với thực đơn đa dạng và mặt bằng rộng.",
            BestTime = "19:00 - 23:00",
            Highlight = "Ốc len xào dừa, nghêu hấp thái, mì xào ốc giác",
            DishSamples = "Ốc len xào dừa, nghêu hấp thái, mì xào ốc giác",
            DescriptionVi = "Với hơn 15 năm hoạt động, quán ghi điểm nhờ hương vị ổn định và không gian thoáng cho nhóm đông.",
            Latitude = 10.761128,
            Longitude = 106.703573
        },
        new StreetLocation
        {
            Id = "oc-dao-2",
            Name = "Ốc Đào 2",
            Category = "Ốc & hải sản",
            Address = "232/123 Vĩnh Khánh, P.10, Quận 4",
            ContactPhone = "0909 169 891",
            OpeningHours = "11:00 - 22:00",
            PriceRange = "120.000 - 300.000 VND/người",
            ShortIntro = "Chi nhánh thương hiệu Ốc Đào, nổi tiếng với các món xào bơ tỏi.",
            BestTime = "18:00 - 21:00",
            Highlight = "Răng mực xào bơ, ốc móng tay xào rau muống",
            DishSamples = "Răng mực xào bơ, ốc móng tay xào rau muống",
            DescriptionVi = "Món xào đậm vị, ăn kèm bánh mì rất cuốn; phù hợp khách thích phong cách hải sản kiểu Sài Gòn.",
            Latitude = 10.761092,
            Longitude = 106.703402
        },
        new StreetLocation
        {
            Id = "oc-vu",
            Name = "Ốc Vũ",
            Category = "Ốc & hải sản",
            Address = "37 Vĩnh Khánh, P.8, Quận 4",
            ContactPhone = "0908 935 592",
            OpeningHours = "11:00 - 00:00",
            PriceRange = "90.000 - 260.000 VND/người",
            ShortIntro = "Biểu tượng ẩm thực Quận 4, nổi bật với sốt me và trứng muối.",
            BestTime = "19:00 - 23:30",
            Highlight = "Các món ốc sốt me, sốt trứng muối",
            DishSamples = "Ốc sốt me, ốc sốt trứng muối, càng cua",
            DescriptionVi = "Quán có công thức nước chấm me đặc trưng, vị chua cay rõ nét và rất bắt vị.",
            Latitude = 10.762386,
            Longitude = 106.703316
        },
        new StreetLocation
        {
            Id = "oc-sau-no",
            Name = "Ốc Sáu Nở",
            Category = "Ốc & hải sản",
            Address = "128 Vĩnh Khánh, P.10, Quận 4",
            ContactPhone = "0902 468 128",
            OpeningHours = "16:00 - 23:00",
            PriceRange = "90.000 - 220.000 VND/người",
            ShortIntro = "Không gian rộng, phục vụ nhanh, phù hợp tụ tập nhóm bạn.",
            BestTime = "18:30 - 22:30",
            Highlight = "Ốc xào rau muống, sò lông nướng mỡ hành",
            DishSamples = "Ốc xào rau muống, sò lông nướng mỡ hành",
            DescriptionVi = "Là điểm hẹn quen thuộc của dân địa phương nhờ món đậm vị và thời gian lên món ổn định.",
            Latitude = 10.762108,
            Longitude = 106.703061
        },
        new StreetLocation
        {
            Id = "be-oc",
            Name = "Bê Ốc",
            Category = "Ốc & hải sản",
            Address = "58/44 Vĩnh Khánh, P.9, Quận 4",
            ContactPhone = "0906 745 266",
            OpeningHours = "15:00 - 23:00",
            PriceRange = "70.000 - 180.000 VND/người",
            ShortIntro = "Quán bình dân trong hẻm nhưng luôn đông khách vì giá mềm.",
            BestTime = "18:00 - 22:00",
            Highlight = "Ốc len, sò huyết cháy tỏi",
            DishSamples = "Ốc len, sò huyết cháy tỏi",
            DescriptionVi = "Món ăn sạch sẽ, vừa vị, phù hợp khách muốn tìm quán ngon giá dễ chịu.",
            Latitude = 10.761721,
            Longitude = 106.703915
        },
        new StreetLocation
        {
            Id = "alo-quan-seafood-beer",
            Name = "Alo Quán - Seafood & Beer",
            Category = "Ốc & hải sản",
            Address = "402 Vĩnh Khánh, P.10, Quận 4",
            ContactPhone = "0908 644 688",
            OpeningHours = "16:00 - 02:00",
            PriceRange = "120.000 - 350.000 VND/người",
            ShortIntro = "Kết hợp hải sản và bia tươi, phong cách trẻ trung hiện đại.",
            BestTime = "20:00 - 01:00",
            Highlight = "Tôm hùm đất (crawfish), hải sản nướng muối ớt",
            DishSamples = "Crawfish sốt cay, hải sản nướng muối ớt",
            DescriptionVi = "Không khí sôi động về đêm, phù hợp nhóm bạn thích tụ tập và gọi nhiều món nướng.",
            Latitude = 10.760988,
            Longitude = 106.703655
        },
        new StreetLocation
        {
            Id = "chilli-bbq-hotpot",
            Name = "Chilli BBQ Hotpot",
            Category = "Lẩu & đồ nướng",
            Address = "232 Vĩnh Khánh, P.8, Quận 4",
            ContactPhone = "0902 935 667",
            OpeningHours = "16:00 - 03:00",
            PriceRange = "150.000 - 380.000 VND/người",
            ShortIntro = "Thiên đường lẩu nướng mở xuyên đêm, không khí rất chill.",
            BestTime = "20:00 - 01:00",
            Highlight = "Hào 24 vị, bò tảng nướng sốt trứng muối",
            DishSamples = "Hào 24 vị, bò tảng nướng sốt trứng muối",
            DescriptionVi = "View nhìn xuống phố Vĩnh Khánh, menu lẩu nướng đa dạng, phù hợp khách đi nhóm.",
            Latitude = 10.761488,
            Longitude = 106.703205
        },
        new StreetLocation
        {
            Id = "the-gioi-bo",
            Name = "Thế Giới Bò",
            Category = "Lẩu & đồ nướng",
            Address = "6 Vĩnh Khánh, P.8, Quận 4",
            ContactPhone = "0906 339 610",
            OpeningHours = "16:00 - 23:00",
            PriceRange = "180.000 - 600.000 VND/người",
            ShortIntro = "Không gian sang trọng, chuyên các món bò cao cấp.",
            BestTime = "18:00 - 22:00",
            Highlight = "Bò Wagyu A5, bò dát vàng, lẩu Mông Cổ",
            DishSamples = "Bò Wagyu A5, bò dát vàng, lẩu Mông Cổ",
            DescriptionVi = "Phù hợp khách muốn trải nghiệm menu bò thượng hạng với nước sốt đặc trưng.",
            Latitude = 10.762504,
            Longitude = 106.703426
        },
        new StreetLocation
        {
            Id = "a-fat-hot-pot",
            Name = "A Fat Hot Pot",
            Category = "Lẩu & đồ nướng",
            Address = "668 Vĩnh Khánh, P.10, Quận 4",
            ContactPhone = "0898 440 286",
            OpeningHours = "17:00 - 02:00",
            PriceRange = "140.000 - 320.000 VND/người",
            ShortIntro = "Phong cách Hong Kong xưa rực rỡ đèn neon, rất hợp check-in.",
            BestTime = "19:00 - 00:00",
            Highlight = "Lẩu Hong Kong 2 ngăn, viên thả lẩu đa dạng",
            DishSamples = "Lẩu Hong Kong 2 ngăn, viên thả lẩu",
            DescriptionVi = "Quán nổi bật ở phần nước lẩu và topping phong phú, phù hợp nhóm bạn trẻ.",
            Latitude = 10.760802,
            Longitude = 106.703844
        },
        new StreetLocation
        {
            Id = "ot-xiem-quan",
            Name = "Ớt Xiêm Quán",
            Category = "Lẩu & đồ nướng",
            Address = "568 Vĩnh Khánh, P.10, Quận 4",
            ContactPhone = "0938 123 568",
            OpeningHours = "17:30 - 01:30",
            PriceRange = "130.000 - 300.000 VND/người",
            ShortIntro = "Không gian rộng và sạch, món ăn bày biện đẹp mắt.",
            BestTime = "19:00 - 23:30",
            Highlight = "Bò lúc lắc, cua rang me, mực nướng ớt xiêm",
            DishSamples = "Bò lúc lắc, cua rang me, mực nướng ớt xiêm",
            DescriptionVi = "Món nêm theo hướng cay nồng đặc trưng, hợp nhóm thích đồ nhậu đậm vị.",
            Latitude = 10.760924,
            Longitude = 106.703769
        },
        new StreetLocation
        {
            Id = "lang-quan",
            Name = "Lãng Quán",
            Category = "Lẩu & đồ nướng",
            Address = "531 Vĩnh Khánh, P.8, Quận 4",
            ContactPhone = "0903 004 030",
            OpeningHours = "16:00 - 00:00",
            PriceRange = "100.000 - 260.000 VND/người",
            ShortIntro = "Quán nhậu bình dân nổi tiếng với món nội tạng đậm đà.",
            BestTime = "19:00 - 23:00",
            Highlight = "Giò heo chiên giòn, phá lấu lòng, lưỡi vịt sapo",
            DishSamples = "Giò heo chiên giòn, phá lấu lòng, lưỡi vịt sapo",
            DescriptionVi = "Thực đơn hợp ngồi lai rai, giá vừa tầm và không khí nhậu đặc trưng Quận 4.",
            Latitude = 10.760936,
            Longitude = 106.703745
        },
        new StreetLocation
        {
            Id = "quan-hoa",
            Name = "Quán Hỏa",
            Category = "Lẩu & đồ nướng",
            Address = "39 Vĩnh Khánh, P.8, Quận 4",
            ContactPhone = "0908 935 592",
            OpeningHours = "16:00 - 00:00",
            PriceRange = "110.000 - 260.000 VND/người",
            ShortIntro = "Chuyên nướng ngói tại bàn với bếp than hồng.",
            BestTime = "19:00 - 23:00",
            Highlight = "Nướng ngói, bẹ sữa nướng muối ớt",
            DishSamples = "Nướng ngói, bẹ sữa nướng muối ớt",
            DescriptionVi = "Không khí ấm cúng, món nướng lên đều tay, thích hợp đi nhóm bạn và gia đình.",
            Latitude = 10.762312,
            Longitude = 106.703288
        },
        new StreetLocation
        {
            Id = "sushi-ko",
            Name = "Sushi Ko",
            Category = "Đặc sản & món lẻ",
            Address = "122 Vĩnh Khánh, P.10, Quận 4",
            ContactPhone = "0906 313 006",
            OpeningHours = "11:00 - 22:30",
            PriceRange = "90.000 - 220.000 VND/người",
            ShortIntro = "Quán sushi vỉa hè nhưng chất lượng ổn định, giá hợp sinh viên.",
            BestTime = "11:30 - 20:30",
            Highlight = "Sashimi cá hồi, maki tôm nướng, salad rong biển",
            DishSamples = "Sashimi cá hồi, maki tôm nướng, salad rong biển",
            DescriptionVi = "Lựa chọn phù hợp nếu muốn đổi vị với món Nhật giữa khu phố ẩm thực đêm.",
            Latitude = 10.761934,
            Longitude = 106.703121
        },
        new StreetLocation
        {
            Id = "bun-ca-di-tu",
            Name = "Bún cá Châu Đốc Dì Tư",
            Category = "Đặc sản & món lẻ",
            Address = "75 Vĩnh Khánh, P.8, Quận 4",
            ContactPhone = "0909 334 455",
            OpeningHours = "06:00 - 22:00",
            PriceRange = "35.000 - 70.000 VND/phần",
            ShortIntro = "Điểm dừng chân cho khách muốn món nước thanh vị.",
            BestTime = "Sáng - chiều",
            Highlight = "Bún cá, bún mắm miền Tây",
            DishSamples = "Bún cá, bún mắm",
            DescriptionVi = "Món nước đặc sản miền Tây ngay giữa phố nhậu, phù hợp bữa sáng hoặc đổi vị.",
            Latitude = 10.762082,
            Longitude = 106.703196
        },
        new StreetLocation
        {
            Id = "bun-thit-nuong-co-nga",
            Name = "Bún thịt nướng Cô Nga",
            Category = "Đặc sản & món lẻ",
            Address = "14 Vĩnh Khánh, P.8, Quận 4",
            ContactPhone = "0902 334 112",
            OpeningHours = "06:00 - 13:00",
            PriceRange = "35.000 - 60.000 VND/phần",
            ShortIntro = "Quán sáng - trưa nổi tiếng với thịt ướp thơm lừng.",
            BestTime = "07:00 - 11:00",
            Highlight = "Bún thịt nướng, nem nướng",
            DishSamples = "Bún thịt nướng, nem nướng",
            DescriptionVi = "Nước mắm pha vừa miệng, thịt nướng thơm, phù hợp bữa sáng nhanh và no.",
            Latitude = 10.762446,
            Longitude = 106.703423
        },
        new StreetLocation
        {
            Id = "an-an-quan",
            Name = "An An Quán",
            Category = "Đặc sản & món lẻ",
            Address = "490 Vĩnh Khánh, P.10, Quận 4",
            ContactPhone = "0902 334 556",
            OpeningHours = "16:00 - 23:30",
            PriceRange = "90.000 - 220.000 VND/người",
            ShortIntro = "Thực đơn món Việt đa dạng, phục vụ nhiệt tình.",
            BestTime = "18:00 - 22:30",
            Highlight = "Cơm chiên hải sản, sụn gà rang muối",
            DishSamples = "Cơm chiên hải sản, sụn gà rang muối",
            DescriptionVi = "Quán phù hợp gia đình và nhóm bạn muốn menu đa dạng ngoài hải sản nướng.",
            Latitude = 10.760952,
            Longitude = 106.703688
        },
        new StreetLocation
        {
            Id = "nem-nuong-que-nha",
            Name = "Nem Nướng Đặc Sản Quê Nhà",
            Category = "Đặc sản & món lẻ",
            Address = "Đầu đường Vĩnh Khánh, Quận 4",
            ContactPhone = "0908 112 233",
            OpeningHours = "15:00 - 22:00",
            PriceRange = "45.000 - 95.000 VND/phần",
            ShortIntro = "Quán chuyên nem nướng với nước chấm đậu phộng béo ngậy.",
            BestTime = "16:30 - 20:30",
            Highlight = "Nem nướng Nha Trang",
            DishSamples = "Nem nướng Nha Trang",
            DescriptionVi = "Rau sống tươi và nước chấm đặc trưng giúp quán luôn hút khách vào buổi chiều tối.",
            Latitude = 10.762662,
            Longitude = 106.703514
        },
        new StreetLocation
        {
            Id = "bun-bo-hue-14b",
            Name = "Bún Bò Huế 14B",
            Category = "Đặc sản & món lẻ",
            Address = "14B Vĩnh Khánh, P.10, Quận 4",
            ContactPhone = "0903 445 667",
            OpeningHours = "06:00 - 21:00",
            PriceRange = "40.000 - 85.000 VND/phần",
            ShortIntro = "Nước dùng đậm đà, vị ngọt xương rõ nét.",
            BestTime = "Sáng - chiều",
            Highlight = "Bún bò giò gân, bún bò nạm",
            DishSamples = "Bún bò giò gân, bún bò nạm",
            DescriptionVi = "Là một trong các quán bún bò được đánh giá ổn định trên trục Vĩnh Khánh.",
            Latitude = 10.761654,
            Longitude = 106.703486
        },
        new StreetLocation
        {
            Id = "lau-met-nuong-79k",
            Name = "Lẩu Mẹt Nướng 79k",
            Category = "Đặc sản & món lẻ",
            Address = "Cuối đường Vĩnh Khánh, Quận 4",
            ContactPhone = "0934 112 233",
            OpeningHours = "17:00 - 23:00",
            PriceRange = "79.000 - 180.000 VND/người",
            ShortIntro = "Mô hình bình dân, phù hợp sinh viên và nhóm đông.",
            BestTime = "18:00 - 22:00",
            Highlight = "Lẩu mẹt đủ loại, đồ nướng đồng giá",
            DishSamples = "Lẩu mẹt đủ loại, đồ nướng đồng giá",
            DescriptionVi = "Giá dễ tiếp cận, menu phong phú và phục vụ nhanh cho các nhóm khách trẻ.",
            Latitude = 10.760702,
            Longitude = 106.703902
        }
    ];

    private static IReadOnlyCollection<MerchantRequest> SeedMerchantRequests()
    {
        var now = DateTimeOffset.UtcNow;

        return
        [
            new MerchantRequest
            {
                Id = "seed-promo-oc-oanh",
                LocationId = "oc-oanh",
                MerchantEmail = "merchant.oc-oanh@vinhkhanh.local",
                MerchantName = "Ốc Oanh",
                RequestType = "promotion",
                Title = "Combo Hải Sản Đêm Giảm 20%",
                Description = "Giảm 20% cho combo 3 món ốc + 1 nước khi đi theo nhóm từ 3 người sau 20:00.",
                Status = "approved",
                AdminResponse = "Đã duyệt hiển thị thử nghiệm",
                IsPinnedTop = true,
                PriorityScore = 98,
                CampaignStartAt = now.AddDays(-1),
                CampaignEndAt = now.AddDays(7),
                CreatedAt = now.AddDays(-2),
                ReviewedAt = now.AddDays(-1),
                ReviewedBy = "admin@vinhkhanh.local"
            },
            new MerchantRequest
            {
                Id = "seed-ad-oc-vu",
                LocationId = "oc-vu",
                MerchantEmail = "merchant.oc-vu@vinhkhanh.local",
                MerchantName = "Ốc Vũ",
                RequestType = "advertisement",
                Title = "Món Signature Sốt Me Trứng Muối",
                Description = "Đặt bàn trước 19:00 để được tặng 1 phần nước chấm đặc biệt và ưu tiên lên món nhanh.",
                Status = "approved",
                AdminResponse = "Đã duyệt hiển thị thử nghiệm",
                IsPinnedTop = false,
                PriorityScore = 86,
                CampaignStartAt = now.AddDays(-2),
                CampaignEndAt = now.AddDays(5),
                CreatedAt = now.AddDays(-3),
                ReviewedAt = now.AddDays(-2),
                ReviewedBy = "admin@vinhkhanh.local"
            },
            new MerchantRequest
            {
                Id = "seed-promo-chilli",
                LocationId = "chilli-bbq-hotpot",
                MerchantEmail = "merchant.chilli@vinhkhanh.local",
                MerchantName = "Chilli BBQ Hotpot",
                RequestType = "promotion",
                Title = "Happy Hour Lẩu Nướng 79K",
                Description = "Khung giờ 17:00 - 19:00: combo lẩu + nướng đồng giá 79K/người cho bàn từ 2 khách.",
                Status = "approved",
                AdminResponse = "Đã duyệt hiển thị thử nghiệm",
                IsPinnedTop = false,
                PriorityScore = 83,
                CampaignStartAt = now.AddHours(-12),
                CampaignEndAt = now.AddDays(10),
                CreatedAt = now.AddDays(-1),
                ReviewedAt = now.AddHours(-10),
                ReviewedBy = "admin@vinhkhanh.local"
            }
        ];
    }

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
                existing.ContactPhone = string.IsNullOrWhiteSpace(location.ContactPhone)
                    ? existing.ContactPhone
                    : location.ContactPhone.Trim();
                existing.OpeningHours = location.OpeningHours.Trim();
                existing.PriceRange = string.IsNullOrWhiteSpace(location.PriceRange)
                    ? existing.PriceRange
                    : location.PriceRange.Trim();
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
                ContactPhone = string.IsNullOrWhiteSpace(location.ContactPhone) ? null : location.ContactPhone.Trim(),
                OpeningHours = location.OpeningHours.Trim(),
                PriceRange = string.IsNullOrWhiteSpace(location.PriceRange) ? null : location.PriceRange.Trim(),
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

    public void TrackVisit(string path, string method, string userAgent, string? userEmail = null)
    {
        lock (_syncLock)
        {
            _visitLogs.Add(new VisitLogEntry
            {
                Id = Guid.NewGuid().ToString("N"),
                Path = path,
                Method = method,
                UserAgent = userAgent,
                UserEmail = userEmail,
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
                    UserEmail = x.UserEmail,
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
                UserEmail = usage.UserEmail,
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
                    UserEmail = x.UserEmail,
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

    public void TrackRoutePlan(RoutePlanLogEntry routePlanLog)
    {
        lock (_syncLock)
        {
            _routePlanLogs.Add(new RoutePlanLogEntry
            {
                Id = string.IsNullOrWhiteSpace(routePlanLog.Id) ? Guid.NewGuid().ToString("N") : routePlanLog.Id,
                UserEmail = routePlanLog.UserEmail,
                VisitorType = routePlanLog.VisitorType,
                BudgetLevel = routePlanLog.BudgetLevel,
                StartHour = routePlanLog.StartHour,
                GuestCount = routePlanLog.GuestCount,
                Preferences = routePlanLog.Preferences,
                MustTry = routePlanLog.MustTry,
                PlanTitle = routePlanLog.PlanTitle,
                GeneratedBy = routePlanLog.GeneratedBy,
                StopSummary = routePlanLog.StopSummary,
                CreatedAt = routePlanLog.CreatedAt == default ? DateTimeOffset.UtcNow : routePlanLog.CreatedAt
            });

            if (_routePlanLogs.Count > 3000)
            {
                _routePlanLogs.RemoveRange(0, _routePlanLogs.Count - 3000);
            }
        }
    }

    public IReadOnlyCollection<RoutePlanLogEntry> GetRoutePlanLogs(int take)
    {
        lock (_syncLock)
        {
            return _routePlanLogs
                .OrderByDescending(x => x.CreatedAt)
                .Take(Math.Clamp(take, 1, 500))
                .Select(x => new RoutePlanLogEntry
                {
                    Id = x.Id,
                    UserEmail = x.UserEmail,
                    VisitorType = x.VisitorType,
                    BudgetLevel = x.BudgetLevel,
                    StartHour = x.StartHour,
                    GuestCount = x.GuestCount,
                    Preferences = x.Preferences,
                    MustTry = x.MustTry,
                    PlanTitle = x.PlanTitle,
                    GeneratedBy = x.GeneratedBy,
                    StopSummary = x.StopSummary,
                    CreatedAt = x.CreatedAt
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
            ContactPhone = location.ContactPhone,
            OpeningHours = location.OpeningHours,
            PriceRange = location.PriceRange,
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
            ContactPhone = location.ContactPhone,
            OpeningHours = location.OpeningHours,
            PriceRange = location.PriceRange,
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

    // Merchant Request Management
    public MerchantRequest SubmitMerchantRequest(MerchantRequest request)
    {
        lock (_syncLock)
        {
            var newRequest = new MerchantRequest
            {
                Id = Guid.NewGuid().ToString("N"),
                LocationId = request.LocationId,
                MerchantEmail = request.MerchantEmail,
                MerchantName = request.MerchantName,
                RequestType = request.RequestType,
                Title = request.Title,
                Description = request.Description,
                Status = "pending",
                IsPinnedTop = request.IsPinnedTop,
                PriorityScore = request.PriorityScore,
                CampaignStartAt = request.CampaignStartAt,
                CampaignEndAt = request.CampaignEndAt,
                CreatedAt = DateTimeOffset.UtcNow
            };
            _merchantRequests.Add(newRequest);
            return newRequest;
        }
    }

    public IReadOnlyCollection<MerchantRequest> GetMerchantRequests(string? status = null, string? currentUserEmail = null)
    {
        lock (_syncLock)
        {
            var query = _merchantRequests.AsEnumerable();
            
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(x => x.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
            }
            
            if (!string.IsNullOrEmpty(currentUserEmail))
            {
                query = query.Where(x => x.MerchantEmail.Equals(currentUserEmail, StringComparison.OrdinalIgnoreCase));
            }
            
            return query.OrderByDescending(x => x.CreatedAt).ToArray();
        }
    }

    public MerchantRequest? ApproveMerchantRequest(string requestId, string adminEmail)
    {
        lock (_syncLock)
        {
            var request = _merchantRequests.FirstOrDefault(x => x.Id == requestId);
            if (request == null) return null;
            
            var updated = new MerchantRequest
            {
                Id = request.Id,
                LocationId = request.LocationId,
                MerchantEmail = request.MerchantEmail,
                MerchantName = request.MerchantName,
                RequestType = request.RequestType,
                Title = request.Title,
                Description = request.Description,
                Status = "approved",
                AdminResponse = "Đã duyệt",
                IsPinnedTop = request.IsPinnedTop,
                PriorityScore = request.PriorityScore,
                CampaignStartAt = request.CampaignStartAt,
                CampaignEndAt = request.CampaignEndAt,
                CreatedAt = request.CreatedAt,
                ReviewedAt = DateTimeOffset.UtcNow,
                ReviewedBy = adminEmail
            };
            
            var index = _merchantRequests.FindIndex(x => x.Id == requestId);
            if (index >= 0) _merchantRequests[index] = updated;
            return updated;
        }
    }

    public MerchantRequest? RejectMerchantRequest(string requestId, string adminEmail, string response)
    {
        lock (_syncLock)
        {
            var request = _merchantRequests.FirstOrDefault(x => x.Id == requestId);
            if (request == null) return null;
            
            var updated = new MerchantRequest
            {
                Id = request.Id,
                LocationId = request.LocationId,
                MerchantEmail = request.MerchantEmail,
                MerchantName = request.MerchantName,
                RequestType = request.RequestType,
                Title = request.Title,
                Description = request.Description,
                Status = "rejected",
                AdminResponse = response,
                IsPinnedTop = request.IsPinnedTop,
                PriorityScore = request.PriorityScore,
                CampaignStartAt = request.CampaignStartAt,
                CampaignEndAt = request.CampaignEndAt,
                CreatedAt = request.CreatedAt,
                ReviewedAt = DateTimeOffset.UtcNow,
                ReviewedBy = adminEmail
            };
            
            var index = _merchantRequests.FindIndex(x => x.Id == requestId);
            if (index >= 0) _merchantRequests[index] = updated;
            return updated;
        }
    }

    public MerchantRequest? UpdateMerchantRequestHighlight(
        string requestId,
        bool isPinnedTop,
        int priorityScore,
        DateTimeOffset? campaignStartAt,
        DateTimeOffset? campaignEndAt)
    {
        lock (_syncLock)
        {
            var request = _merchantRequests.FirstOrDefault(x => x.Id == requestId);
            if (request == null)
            {
                return null;
            }

            var safePriority = Math.Clamp(priorityScore, 0, 100);
            var updated = new MerchantRequest
            {
                Id = request.Id,
                LocationId = request.LocationId,
                MerchantEmail = request.MerchantEmail,
                MerchantName = request.MerchantName,
                RequestType = request.RequestType,
                Title = request.Title,
                Description = request.Description,
                Status = request.Status,
                AdminResponse = request.AdminResponse,
                IsPinnedTop = isPinnedTop,
                PriorityScore = safePriority,
                CampaignStartAt = campaignStartAt,
                CampaignEndAt = campaignEndAt,
                CreatedAt = request.CreatedAt,
                ReviewedAt = request.ReviewedAt,
                ReviewedBy = request.ReviewedBy
            };

            var index = _merchantRequests.FindIndex(x => x.Id == requestId);
            if (index >= 0)
            {
                _merchantRequests[index] = updated;
            }

            return updated;
        }
    }

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
