import React from 'react';
import { motion } from 'motion/react';
import { Bug, RefreshCw } from 'lucide-react';
import RippleButton from './RippleButton';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      key="fetch-error-card"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 md:p-12 text-center space-y-6 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
        <Bug className="h-10 w-10 animate-pulse" />
      </div>

      <div className="space-y-2 max-w-lg relative z-10">
        <h4 className="font-sans text-sm font-extrabold text-red-400 uppercase tracking-widest">
          // TELEMETRY LOSS ERROR DETECTED
        </h4>
        <h3 className="font-sans text-xl md:text-2xl font-black text-white tracking-tight">
          DATA INTEGRITY COLLAPSE
        </h3>
        <div className="bg-black/60 p-4 rounded-lg border border-red-500/15 text-left max-w-full overflow-x-auto my-3">
          <span className="font-mono text-[10px] text-red-400/50 block font-bold mb-1 uppercase tracking-wider">ERROR CORE DIAGNOSTIC //</span>
          <code className="font-mono text-xs text-red-300 block select-all break-all leading-normal whitespace-pre-wrap">
            {error}
          </code>
        </div>
        <p className="font-sans text-xs text-slate-400 leading-relaxed">
          The calibration stream is corrupted or the wafer telemetry data could not be reached. Check the configuration line or attempt manual override.
        </p>
      </div>

      <RippleButton
        onClick={onRetry}
        className="rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
        rippleColor="rgba(239, 68, 68, 0.2)"
      >
        <RefreshCw className="h-4 w-4" /> RECALIBRATE FEEDSTREAM
      </RippleButton>
    </motion.div>
  );
}
