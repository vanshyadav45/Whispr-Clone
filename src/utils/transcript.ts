export interface DeepgramResult {
    channel: {
        alternatives: Array<{
            transcript: string;
            confidence: number;
        }>;
    };
    is_final: boolean;
    speech_final: boolean;
}

export const processTranscript = (
    results: DeepgramResult,
    currentFinal: string
): { final: string; interim: string } => {
    const transcript = results.channel.alternatives[0]?.transcript || "";

    if (results.is_final) {
        return {
            final: currentFinal + (currentFinal ? " " : "") + transcript,
            interim: ""
        };
    } else {
        return {
            final: currentFinal,
            interim: transcript
        };
    }
};
