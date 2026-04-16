namespace VinhKhanhTour.AutoNarration.Services;

public interface ILiveParticipantTracker
{
    LiveParticipantsSnapshot Touch(string participantId);
    LiveParticipantsSnapshot GetSnapshot();
}

public sealed class LiveParticipantsSnapshot
{
    public int ActiveParticipants { get; init; }
    public int ActiveWindowSeconds { get; init; }
    public DateTimeOffset CapturedAt { get; init; }
    public IReadOnlyList<string> ParticipantIds { get; init; } = new List<string>();
}
