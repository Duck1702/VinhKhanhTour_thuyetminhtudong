namespace VinhKhanhTour.AutoNarration.Services;

public interface ISpeechSynthesisService
{
    Task<(byte[] AudioBytes, string VoiceName)> SynthesizeToMp3Async(
        string text,
        string language,
        string? preferredVoice,
        double speakingRate,
        CancellationToken cancellationToken);
}
