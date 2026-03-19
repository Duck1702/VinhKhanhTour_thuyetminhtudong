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
            DescriptionVi = "Cơm tấm tại Vĩnh Khánh nổi bật với sườn nướng thơm, bì mềm và chả trứng đậm vị. Đây là lựa chọn phù hợp cho du khách muốn ăn tối nhanh nhưng vẫn đậm chất Sài Gòn."
        },
        new StreetLocation
        {
            Id = "oc-tuoc-nuong",
            Name = "Ốc và bạch tuộc nướng",
            Category = "Hải sản",
            DescriptionVi = "Phố ẩm thực Vĩnh Khánh nổi tiếng về các quán ốc nướng mỡ hành, bạch tuộc sa tế và sò điệp phô mai. Không gian náo nhiệt, thích hợp để trải nghiệm văn hóa ăn đêm địa phương."
        },
        new StreetLocation
        {
            Id = "nuoc-mia-sau-rieng",
            Name = "Nước mía sầu riêng",
            Category = "Đồ uống",
            DescriptionVi = "Một thức uống được nhiều bạn trẻ yêu thích là nước mía kết hợp sầu riêng, tạo vị ngọt béo đặc trưng. Đây là món giải nhiệt phù hợp sau khi thưởng thức các món nướng cay."
        },
        new StreetLocation
        {
            Id = "banh-trang-nuong-pho-dem",
            Name = "Bánh tráng nướng phố đêm",
            Category = "Ăn vặt",
            DescriptionVi = "Bánh tráng nướng tại đây có nhiều topping như trứng, xúc xích, phô mai và hành phi. Món ăn giòn, thơm, giá hợp lý và rất phù hợp để vừa đi dạo vừa thưởng thức."
        },
        new StreetLocation
        {
            Id = "che-dem-vinh-khanh",
            Name = "Chè đêm Vĩnh Khánh",
            Category = "Tráng miệng",
            DescriptionVi = "Khu vực này có nhiều quán chè truyền thống và chè hiện đại, từ chè đậu, chè khúc bạch đến tàu hũ đá. Vị ngọt thanh giúp cân bằng sau bữa ăn nhiều đạm và gia vị."
        }
    ];

    public IReadOnlyCollection<StreetLocation> GetAll() => Locations;

    public StreetLocation? GetById(string locationId) =>
        Locations.FirstOrDefault(l => l.Id.Equals(locationId, StringComparison.OrdinalIgnoreCase));
}
