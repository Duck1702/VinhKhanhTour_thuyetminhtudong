namespace VinhKhanhTour.AutoNarration.Services;

public sealed class InMemoryLiveParticipantTracker : ILiveParticipantTracker
{
    private const int ActiveWindowSeconds = 45;
    private static readonly TimeSpan ActiveWindow = TimeSpan.FromSeconds(ActiveWindowSeconds);
    private static readonly TimeSpan CleanupWindow = TimeSpan.FromMinutes(20);

    private readonly object _syncLock = new();
    private readonly Dictionary<string, DateTimeOffset> _lastSeenByParticipant = new(StringComparer.Ordinal);

    public LiveParticipantsSnapshot Touch(string participantId)
    {
        var normalized = NormalizeParticipantId(participantId);
        var now = DateTimeOffset.UtcNow;

        lock (_syncLock)
        {
            _lastSeenByParticipant[normalized] = now;
            CleanupExpired(now);
            return BuildSnapshot(now);
        }
    }

    public LiveParticipantsSnapshot GetSnapshot()
    {
        var now = DateTimeOffset.UtcNow;
        lock (_syncLock)
        {
            CleanupExpired(now);
            return BuildSnapshot(now);
        }
    }

    private static string NormalizeParticipantId(string participantId)
    {
        var normalized = participantId?.Trim() ?? string.Empty;
        if (normalized.Length > 128)
        {
            normalized = normalized[..128];
        }

        return normalized;
    }

    private void CleanupExpired(DateTimeOffset now)
    {
        var threshold = now - CleanupWindow;
        var expiredKeys = _lastSeenByParticipant
            .Where(entry => entry.Value < threshold)
            .Select(entry => entry.Key)
            .ToArray();

        foreach (var key in expiredKeys)
        {
            _lastSeenByParticipant.Remove(key);
        }
    }

    private LiveParticipantsSnapshot BuildSnapshot(DateTimeOffset now)
    {
        var activeThreshold = now - ActiveWindow;
        var activeParticipantIds = _lastSeenByParticipant
            .Where(entry => entry.Value >= activeThreshold)
            .Select(entry => entry.Key)
            .ToList();

        return new LiveParticipantsSnapshot
        {
            ActiveParticipants = activeParticipantIds.Count,
            ActiveWindowSeconds = ActiveWindowSeconds,
            CapturedAt = now,
            ParticipantIds = activeParticipantIds
        };
    }
}
