using VinhKhanhTour.AutoNarration.Models;

namespace VinhKhanhTour.AutoNarration.Services;

public interface ILocationContentService
{
    IReadOnlyCollection<StreetLocation> GetAll();
    StreetLocation? GetById(string locationId);
}
