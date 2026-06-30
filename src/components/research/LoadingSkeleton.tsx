import React from 'react';
import { motion } from 'motion/react';

interface LoadingSkeletonProps {
  count?: number;
}

export default function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => {
        const num = index + 1;
        return (
          <motion.div
            key={`skeleton-${num}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: num * 0.05 }}
            className="relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] p-6 md:p-8 space-y-6"
          >
            {/* Sliding Shimmer Overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" 
              style={{
                animation: 'shimmer 1.8s infinite linear',
                width: '200%',
                willChange: 'transform'
              }}
            />
            
            {/* Top tags row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-5 w-20 rounded bg-slate-800/80 animate-pulse" />
                <div className="h-3 w-28 rounded bg-slate-800/40 animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-24 rounded bg-slate-800/50 animate-pulse" />
                <div className="h-3.5 w-16 rounded bg-slate-800/40 animate-pulse" />
              </div>
            </div>

            {/* Title & Author */}
            <div className="space-y-3">
              <div className="h-7 w-3/4 rounded bg-slate-800/60 animate-pulse" />
              <div className="h-7 w-1/2 rounded bg-slate-800/60 animate-pulse" />
              <div className="h-3.5 w-1/4 rounded bg-slate-800/40 animate-pulse" />
            </div>

            {/* Summary blocks */}
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded bg-slate-800/30 animate-pulse" />
              <div className="h-4 w-11/12 rounded bg-slate-800/30 animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-slate-800/30 animate-pulse" />
            </div>

            {/* Bottom Action Row */}
            <div className="pt-4 border-t border-[rgba(255,255,255,0.04)] flex justify-between items-center">
              <div className="h-9 w-28 rounded-lg bg-slate-800/50 animate-pulse" />
              <div className="flex gap-2">
                <div className="h-9 w-9 rounded-lg bg-slate-800/40 animate-pulse" />
                <div className="h-9 w-9 rounded-lg bg-slate-800/40 animate-pulse" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
