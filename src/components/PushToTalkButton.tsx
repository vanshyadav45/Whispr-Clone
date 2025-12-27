import React from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { RecordingState } from '../hooks/useRecording';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Props {
    state: RecordingState;
    onClick: () => void;
}

export const PushToTalkButton: React.FC<Props> = ({ state, onClick }) => {
    const isRecording = state === 'recording';
    const isProcessing = state === 'processing';

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                onClick={onClick}
                disabled={isProcessing}
                className={cn(
                    "relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20",
                    isRecording
                        ? "bg-red-500 hover:bg-red-600 animate-pulse-slow shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                        : "bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_20px_rgba(79,70,229,0.3)]",
                    isProcessing && "bg-slate-700 cursor-not-allowed"
                )}
            >
                {isRecording ? (
                    <Square className="w-8 h-8 text-white fill-current" />
                ) : isProcessing ? (
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                ) : (
                    <Mic className="w-10 h-10 text-white" />
                )}
            </button>
            <span className={cn(
                "text-sm font-medium tracking-wide transition-colors",
                isRecording ? "text-red-400" : "text-slate-400"
            )}>
                {isRecording ? "Recording..." : isProcessing ? "Processing..." : "Start Recording"}
            </span>
        </div>
    );
};
