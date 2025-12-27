import { listen } from '@tauri-apps/api/event';
import { useEffect } from 'react';

export const useTauriEvent = <T>(
    eventName: string,
    handler: (payload: T) => void
) => {
    useEffect(() => {
        let unlisten: (() => void) | undefined;

        const setupListener = async () => {
            unlisten = await listen<T>(eventName, (event) => {
                handler(event.payload);
            });
        };

        setupListener();

        return () => {
            if (unlisten) unlisten();
        };
    }, [eventName, handler]);
};
