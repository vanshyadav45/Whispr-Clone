import React from 'react';
import { Copy, Trash2, Download } from 'lucide-react';

interface Props {
    onCopy: () => void;
    onClear: () => void;
    onSave: () => void;
    disabled: boolean;
}

export const Controls: React.FC<Props> = ({ onCopy, onClear, onSave, disabled }) => {
    return (
        <div className="flex items-center gap-3">
            <button
                onClick={onCopy}
                disabled={disabled}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative"
                title="Copy to clipboard"
            >
                <Copy className="w-5 h-5" />
            </button>
            <button
                onClick={onSave}
                disabled={disabled}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative"
                title="Save as .txt"
            >
                <Download className="w-5 h-5" />
            </button>
            <div className="w-px h-8 bg-white/5 mx-1" />
            <button
                onClick={onClear}
                disabled={disabled}
                className="p-3 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clear transcript"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
};
