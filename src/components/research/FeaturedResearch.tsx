import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Clock, Star } from 'lucide-react';
import RippleButton from './RippleButton';
import { ResearchCardType } from './ResearchCard';
import { usePrefersReducedMotion } from './hooks';

interface FeaturedResearchProps {
  pub: ResearchCardType | undefined;
  onSelect: (pub: ResearchCardType) => void;
  isLoading?: boolean;
}

export default function FeaturedResearch({ pub, onSelect, isLoading = false }: FeaturedResearchProps) {
  const shouldReduceMotion = usePrefersReducedMotion();

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0c0c0c] p-6 md:p-10 space-y-6">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" 
             style={{ animation: 'shimmer 1.8s infinite linear', width: '200%', willChange: 'transform' }} />
        <div className="h-5 w-32 rounded bg-slate-800/80 animate-pulse" />
        <div className="space-y-3">
          <div className="h-8 w-5/6 rounded bg-slate-800/60 animate-pulse" />
          <div className="h-8 w-2/3 rounded bg-slate-800/60 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-slate-800/30 animate-pulse" />
          <div className="h-4 w-11/12 rounded bg-slate-800/30 animate-pulse" />
        </div>
        <div className="h-10 w-40 rounded bg-slate-800/40 animate-pulse" />
      </div>
    );
  }

  if (!pub) return null;

  const displayDate = pub.publishedDate || pub.date || '';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: [0.2, 0, 0, 1], duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#0c0a12] via-[#08080c] to-[#040406] p-6 md:p-10 shadow-[0_0_50px_rgba(167,139,250,0.05)]"
      id="featured-research-section"
    >
      {/* Decorative ambient background assets */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Geometric PCB line element */}
      <svg className="absolute inset-0 w-full h-full text-purple-500/10 opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 40 H 120 L 160 80 V 200 H 600" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx="160" cy="80" r="3" fill="currentColor" />
      </svg>

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
        <div className="space-y-5 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#a78bfa]">
              <Sparkles className="h-3.5 w-3.5" /> EDITOR'S CHOICE // FEATURED RESEARCH
            </span>
            <span className="font-mono text-xs text-slate-500">
              {pub.source} • {displayDate}
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="font-sans text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {pub.title}
            </h2>
            <p className="font-sans text-sm text-slate-400">
              By <span className="text-slate-300 font-medium">{pub.author}</span>
            </p>
          </div>

          <p className="font-sans text-base text-slate-300 leading-relaxed max-w-3xl">
            {pub.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <span className="block font-mono text-[10px] font-bold text-[#a78bfa] uppercase tracking-wider mb-1">// STRUCTURAL BREAKTHROUGH</span>
              <p className="font-sans text-xs text-slate-400 leading-relaxed">
                {pub.whyItMatters}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <span className="block font-mono text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">// TECHNOLOGY VALUE</span>
              <p className="font-sans text-xs text-slate-400 leading-relaxed">
                {pub.industryImpact}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <RippleButton
              onClick={() => onSelect(pub)}
              className="rounded-lg bg-[#a78bfa] hover:bg-[#b49dfb] text-black px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5"
              rippleColor="rgba(0, 0, 0, 0.15)"
            >
              Examine Specifications <ArrowRight className="h-3.5 w-3.5" />
            </RippleButton>
            
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5 text-[#a78bfa]" />
              <span>{pub.readingTime} analyze time</span>
            </div>
          </div>
        </div>

        {pub.image && (
          <div className="w-full md:w-80 shrink-0 self-stretch rounded-xl overflow-hidden border border-white/10 relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60" />
            <img 
              src={pub.image} 
              alt={pub.title} 
              referrerPolicy="no-referrer"
              className="w-full h-48 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 font-mono text-[9px] text-[#a78bfa] font-bold uppercase tracking-widest bg-black/55 backdrop-blur-md px-2 py-1 rounded">
              <Star className="h-3 w-3 fill-[#a78bfa]" /> LEVEL: {pub.difficulty}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
