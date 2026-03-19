using VinhKhanhTour.AutoNarration.Models;

namespace VinhKhanhTour.AutoNarration.Services;

public sealed class InMemoryLocationContentService : ILocationContentService
{
    private static readonly IReadOnlyCollection<StreetLocation> Locations =
    [
        new StreetLocation
        {
            Id = "com-tam-hoa-binh",
            Name = "Cơm tấm Hòa Bình",
            Category = "Món chính",
            ShortIntro = "Món ăn no bụng, hợp làm điểm mở đầu cho hành trình ăn tối.",
            BestTime = "18:00 - 21:00",
            Highlight = "Sườn nướng thơm và chả trứng đậm vị",
            DescriptionVi = "Cơm tấm tại Vĩnh Khánh nổi bật với sườn nướng thơm, bì mềm và chả trứng đậm vị. Đây là lựa chọn phù hợp cho du khách muốn ăn tối nhanh nhưng vẫn đậm chất Sài Gòn."
        },
        new StreetLocation
        {
            Id = "oc-tuoc-nuong",
            Name = "Ốc và bạch tuộc nướng",
            Category = "Hải sản",
            ShortIntro = "Món đặc trưng nhất của phố ăn đêm, nhiều hương vị và rất náo nhiệt.",
            BestTime = "19:00 - 23:30",
            Highlight = "Ốc nướng mỡ hành, bạch tuộc sa tế, sò điệp phô mai",
            DescriptionVi = "Phố ẩm thực Vĩnh Khánh nổi tiếng về các quán ốc nướng mỡ hành, bạch tuộc sa tế và sò điệp phô mai. Không gian náo nhiệt, thích hợp để trải nghiệm văn hóa ăn đêm địa phương."
        },
        new StreetLocation
        {
            Id = "nuoc-mia-sau-rieng",
            Name = "Nước mía sầu riêng",
            Category = "Đồ uống",
            ShortIntro = "Thức uống béo ngọt, giúp cân bằng vị sau khi ăn món nướng.",
            BestTime = "Sau 20:00",
            Highlight = "Vị sầu riêng hòa cùng nước mía mát lạnh",
            DescriptionVi = "Một thức uống được nhiều bạn trẻ yêu thích là nước mía kết hợp sầu riêng, tạo vị ngọt béo đặc trưng. Đây là món giải nhiệt phù hợp sau khi thưởng thức các món nướng cay."
        },
        new StreetLocation
        {
            Id = "banh-trang-nuong-pho-dem",
            Name = "Bánh tráng nướng phố đêm",
            Category = "Ăn vặt",
            ShortIntro = "Món ăn vặt giòn thơm, dễ cầm tay và rất hợp đi dạo.",
            BestTime = "17:30 - 22:00",
            Highlight = "Trứng, xúc xích, phô mai và hành phi",
            DescriptionVi = "Bánh tráng nướng tại đây có nhiều topping như trứng, xúc xích, phô mai và hành phi. Món ăn giòn, thơm, giá hợp lý và rất phù hợp để vừa đi dạo vừa thưởng thức."
        },
        new StreetLocation
        {
            Id = "che-dem-vinh-khanh",
            Name = "Chè đêm Vĩnh Khánh",
            Category = "Tráng miệng",
            ShortIntro = "Món tráng miệng giúp kết thúc hành trình bằng vị ngọt thanh.",
            BestTime = "20:00 - 24:00",
            Highlight = "Chè đậu, chè khúc bạch, tàu hũ đá",
            DescriptionVi = "Khu vực này có nhiều quán chè truyền thống và chè hiện đại, từ chè đậu, chè khúc bạch đến tàu hũ đá. Vị ngọt thanh giúp cân bằng sau bữa ăn nhiều đạm và gia vị."
        }
    ];

    public IReadOnlyCollection<StreetLocation> GetAll() => Locations;

    public StreetLocation? GetById(string locationId) =>
        Locations.FirstOrDefault(l => l.Id.Equals(locationId, StringComparison.OrdinalIgnoreCase));
}
