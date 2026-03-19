using VinhKhanhTour.AutoNarration.Models;

namespace VinhKhanhTour.AutoNarration.Services;

public sealed class InMemoryLocationContentService : ILocationContentService
{
    private static readonly IReadOnlyCollection<StreetLocation> Locations =
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
            DescriptionVi = "Ốc Oanh là điểm đến quen thuộc của nhiều thực khách trên phố ẩm thực Vĩnh Khánh. Quán nổi bật với cua rang muối, tôm nướng và các món ốc đậm vị, không gian luôn nhộn nhịp vào buổi tối."
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
            DescriptionVi = "Ốc Vũ nổi tiếng với cách chế biến giữ được độ tươi của nguyên liệu. Các món được gọi nhiều nhất là sò điệp nướng trứng, ốc tỏi nướng muối ớt và càng cua rang muối, rất phù hợp cho hành trình ăn đêm kéo dài."
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
            DescriptionVi = "Thảo Ốc xuất phát từ một xe ốc nhỏ và phát triển thành quán hải sản được nhiều du khách lẫn người địa phương yêu thích. Thực đơn tập trung vào ốc, nghêu, sò, mực và tôm với cách chế biến đậm đà."
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
            DescriptionVi = "Ốc Sáu Nở là lựa chọn quen thuộc của những ai thích không gian rộng và món ăn đậm đà. Quán nổi bật với ốc sốt trứng muối, nghêu hấp Thái và ốc dừa nướng, phù hợp cho nhóm đông người."
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
            DescriptionVi = "Bê Ốc là nơi phù hợp để kết thúc chuyến đi Vĩnh Khánh bằng một phần ốc hoặc hải sản nhẹ hơn. Quán có không gian thoải mái, món ăn vừa vị và mức giá phù hợp với nhiều nhóm khách."
        }
    ];

    public IReadOnlyCollection<StreetLocation> GetAll() => Locations;

    public StreetLocation? GetById(string locationId) =>
        Locations.FirstOrDefault(l => l.Id.Equals(locationId, StringComparison.OrdinalIgnoreCase));
}
