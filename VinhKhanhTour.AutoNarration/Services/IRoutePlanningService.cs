using VinhKhanhTour.AutoNarration.Models;

namespace VinhKhanhTour.AutoNarration.Services;

public interface IRoutePlanningService
{
    Task<RoutePlanResponse> BuildAsync(RoutePlanRequest request, CancellationToken cancellationToken);
    Task<RoutePlanOptionsResponse> BuildOptionsAsync(RoutePlanRequest request, CancellationToken cancellationToken);
}