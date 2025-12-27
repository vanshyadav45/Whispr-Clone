import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export type RecordingState = 'idle' | 'recording' | 'processing' | 'error';

export const useRecording = () => {
    const [state, setState] = useState<RecordingState>('idle');
    const [error, setError] = useState<string | null>(null);

    const startRecording = async () => {
        try {
            setState('recording');
            await invoke('start_recording');
            setError(null);
        } catch (err) {
            setState('error');
            setError(err as string);
        }
    };

    const stopRecording = async () => {
        try {
            setState('processing');
            await invoke('stop_recording');
            setState('idle');
        } catch (err) {
            setState('error');
            setError(err as string);
        }
    };

    const toggleRecording = () => {
        if (state === 'idle') {
            startRecording();
        } else if (state === 'recording') {
            stopRecording();
        }
    };

    return {
        state,
        error,
        startRecording,
        stopRecording,
        toggleRecording,
    };
};
