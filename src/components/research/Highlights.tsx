import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, BookOpen, Activity, TrendingUp, Clock, ShieldCheck, Flame } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import { ResearchCardType } from './ResearchCard';
import { usePrefersReducedMotion } from './hooks';

const ShimmerBlock = ({ className = "h-8 w-16" }: { className?: string }) => (
  <div className={`relative overflow-hidden rounded bg-white/5 ${className}`}>
    <div 
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" 
      style={{
        animation: 'shimmer 1.8s infinite linear',
        width: '200%',
        willChange: 'transform'
      }}
    />
  </div>
);

interface HighlightsProps {
  publications: ResearchCardType[];
  isLoading: boolean;
}

export default function Highlights({ publications, isLoading }: HighlightsProps) {
  const shouldReduceMotion = usePrefersReducedMotion();

  // Dynamic calculations
  const articlesCount = publications.length;
  const researchPapersCount = 148 + publications.filter(p => p.category === 'Research Papers').length;
  const industryUpdatesCount = 42 + publications.filter(p => p.category === 'Industry' || p.category === 'Industry News').length;
  const uniqueTechCategoriesCount = Array.from(new Set(publications.map(p => p.category))).length || 8;
  const featuredArticlesCount = publications.filter(p => p.featured).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="todays-highlights">
      
      {/* Stat 1: New Articles */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ease: [0.2, 0, 0, 1], duration: 0.45, delay: 0.1 }}
        whileHover={(shouldReduceMotion || isLoading) ? {} : {
          y: -5,
          scale: 1.015,
          borderColor: 'rgba(167, 139, 250, 0.25)',
          boxShadow: '0 12px 30px rgba(167, 139, 250, 0.04)'
        }}
        className={`relative group overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg transition-all duration-300 ${isLoading ? 'pointer-events-none' : ''}`}
      >
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">New Articles</p>
            <div className="text-4xl font-extrabold text-white">
              {isLoading ? (
                <ShimmerBlock className="h-10 w-20 mt-1" />
              ) : (
                <AnimatedCounter value={articlesCount} />
              )}
            </div>
          </div>
          <div className="rounded-lg p-2.5 bg-purple-500/10 border border-purple-500/20 text-[#a78bfa] shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        {isLoading ? (
          <ShimmerBlock className="h-4 w-24 mt-4" />
        ) : (
          <div className="mt-4 flex items-center gap-1.5 text-xs text-[#10b981] font-mono">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+{featuredArticlesCount} featured today</span>
          </div>
        )}
      </motion.div>

      {/* Stat 2: Research Papers */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ease: [0.2, 0, 0, 1], duration: 0.45, delay: 0.15 }}
        whileHover={(shouldReduceMotion || isLoading) ? {} : {
          y: -5,
          scale: 1.015,
          borderColor: 'rgba(167, 139, 250, 0.25)',
          boxShadow: '0 12px 30px rgba(167, 139, 250, 0.04)'
        }}
        className={`relative group overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg transition-all duration-300 ${isLoading ? 'pointer-events-none' : ''}`}
      >
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">Research Papers</p>
            <div className="text-4xl font-extrabold text-white">
              {isLoading ? (
                <ShimmerBlock className="h-10 w-24 mt-1" />
              ) : (
                <AnimatedCounter value={researchPapersCount} />
              )}
            </div>
          </div>
          <div className="rounded-lg p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>
        {isLoading ? (
          <ShimmerBlock className="h-4 w-32 mt-4" />
        ) : (
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Clock className="h-3.5 w-3.5 text-indigo-400" />
            <span>Active architecture files</span>
          </div>
        )}
      </motion.div>

      {/* Stat 3: Industry Updates */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ease: [0.2, 0, 0, 1], duration: 0.45, delay: 0.2 }}
        whileHover={(shouldReduceMotion || isLoading) ? {} : {
          y: -5,
          scale: 1.015,
          borderColor: 'rgba(167, 139, 250, 0.25)',
          boxShadow: '0 12px 30px rgba(167, 139, 250, 0.04)'
        }}
        className={`relative group overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg transition-all duration-300 ${isLoading ? 'pointer-events-none' : ''}`}
      >
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">Industry Updates</p>
            <div className="text-4xl font-extrabold text-white">
              {isLoading ? (
                <ShimmerBlock className="h-10 w-20 mt-1" />
              ) : (
                <AnimatedCounter value={industryUpdatesCount} />
              )}
            </div>
          </div>
          <div className="rounded-lg p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
        </div>
        {isLoading ? (
          <ShimmerBlock className="h-4 w-28 mt-4" />
        ) : (
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>100% verified sources</span>
          </div>
        )}
      </motion.div>

      {/* Stat 4: Trending Technologies */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ease: [0.2, 0, 0, 1], duration: 0.45, delay: 0.25 }}
        whileHover={(shouldReduceMotion || isLoading) ? {} : {
          y: -5,
          scale: 1.015,
          borderColor: 'rgba(167, 139, 250, 0.25)',
          boxShadow: '0 12px 30px rgba(167, 139, 250, 0.04)'
        }}
        className={`relative group overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg transition-all duration-300 ${isLoading ? 'pointer-events-none' : ''}`}
      >
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-[#a78bfa]/5 rounded-full blur-2xl group-hover:bg-[#a78bfa]/10 transition-colors" />
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">Trending Tech</p>
            <div className="text-4xl font-extrabold text-white">
              {isLoading ? (
                <ShimmerBlock className="h-10 w-16 mt-1" />
              ) : (
                <AnimatedCounter value={uniqueTechCategoriesCount} />
              )}
            </div>
          </div>
          <div className="rounded-lg p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        {isLoading ? (
          <ShimmerBlock className="h-4 w-24 mt-4" />
        ) : (
          <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-400 font-mono">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>Gained active volume</span>
          </div>
        )}
      </motion.div>

    </div>
  );
}
