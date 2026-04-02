using VinhKhanhTour.AutoNarration.Models;

namespace VinhKhanhTour.AutoNarration.Services;

public interface IAdminManagementService
{
    IReadOnlyCollection<AdminManagedLocation> GetLocations();
    AdminManagedLocation? GetLocation(string id);
    AdminManagedLocation UpsertLocation(AdminManagedLocation location);
    bool DeleteLocation(string id);
    AdminManagedLocation? ApproveLocation(string id, string? approvedNarrationVi);

    IReadOnlyCollection<VoiceProfile> GetVoiceProfiles();
    VoiceProfile UpsertVoiceProfile(VoiceProfile profile);
    bool DeleteVoiceProfile(string id);

    IReadOnlyCollection<NarrationTemplate> GetNarrationTemplates(bool publishedOnly);
    NarrationTemplate UpsertNarrationTemplate(NarrationTemplate template);
    bool DeleteNarrationTemplate(string id);

    void TrackVisit(string path, string method, string userAgent);
    IReadOnlyCollection<VisitLogEntry> GetVisitLogs(int take);

    void TrackAiUsage(AiUsageLogEntry usage);
    IReadOnlyCollection<AiUsageLogEntry> GetAiUsageLogs(int take);
}
