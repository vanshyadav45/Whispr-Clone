import React from 'react';
import { Wifi, WifiOff, Disc } from 'lucide-react';

interface Props {
    connected: boolean;
    recording: boolean;
}

export const StatusIndicator: React.FC<Props> = ({ connected, recording }) => {
    return (
        <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-slate-900/50 border border-white/5">
            <div className="flex items-center gap-2">
                {connected ? (
                    <Wifi className="w-4 h-4 text-emerald-500" />
                ) : (
                    <WifiOff className="w-4 h-4 text-rose-500" />
                )}
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Deepgram: {connected ? 'Connected' : 'Ready'}
                </span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
                <Disc className={`w-4 h-4 ${recording ? 'text-red-500 animate-pulse' : 'text-slate-600'}`} />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {recording ? 'Live' : 'Standby'}
                </span>
            </div>
        </div>
    );
};
