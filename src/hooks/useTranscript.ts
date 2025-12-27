import { useState, useCallback } from 'react';
import { DeepgramResult } from '../utils/transcript';
import { useTauriEvent } from './useTauriEvents';

export const useTranscript = () => {
    const [finalTranscript, setFinalTranscript] = useState<string>('');
    const [interimTranscript, setInterimTranscript] = useState<string>('');

    const handleTranscript = useCallback((result: DeepgramResult) => {
        console.log('Received transcript event:', result);
        const transcript = result.channel.alternatives[0]?.transcript || "";

        if (result.is_final) {
            setFinalTranscript(prev => prev + (prev ? " " : "") + transcript);
            setInterimTranscript('');
        } else {
            setInterimTranscript(transcript);
        }
    }, []);

    useTauriEvent<DeepgramResult>('transcript-result', handleTranscript);

    const clearTranscript = () => {
        setFinalTranscript('');
        setInterimTranscript('');
    };

    return {
        finalTranscript,
        interimTranscript,
        clearTranscript,
    };
};
