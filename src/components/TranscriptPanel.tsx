import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    final: string;
    interim: string;
}

export const TranscriptPanel: React.FC<Props> = ({ final, interim }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [final, interim]);

    const isEmpty = !final && !interim;

    return (
        <div className="flex-1 w-full glass-panel rounded-2xl p-6 overflow-hidden flex flex-col min-h-[300px]">
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2"
            >
                <AnimatePresence mode="popLayout">
                    {isEmpty ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex items-center justify-center text-slate-500 italic"
                        >
                            Press the microphone and start speaking...
                        </motion.div>
                    ) : (
                        <div className="text-lg leading-relaxed">
                            <span className="text-slate-100">{final}</span>
                            {interim && (
                                <span className="text-slate-400 opacity-60 italic ml-1 transition-opacity duration-200">
                                    {interim}
                                </span>
                            )}
                            <div ref={scrollRef} className="h-4" />
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
