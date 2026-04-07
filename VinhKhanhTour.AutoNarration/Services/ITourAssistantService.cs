using VinhKhanhTour.AutoNarration.Models;

namespace VinhKhanhTour.AutoNarration.Services;

public interface ITourAssistantService
{
    Task<AssistantAskResponse> AskAsync(AssistantAskRequest request, CancellationToken cancellationToken);
}
