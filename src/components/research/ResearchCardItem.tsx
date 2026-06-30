import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, ChevronDown, ChevronUp, Bookmark, Copy, Check } from 'lucide-react';
import RippleButton from './RippleButton';
import { usePrefersReducedMotion } from './hooks';

export interface ResearchCard {
  id: string;
  category: string;
  title: string;
  summary: string;
  whyItMatters: string;
  industryImpact: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  readingTime: string;
  source: string;
  date: string;
  author: string;
  tags: string[];
}

interface ResearchCardItemProps {
  key?: React.Key | string;
  pub: ResearchCard;
  isExpanded: boolean;
  isBookmarked: boolean;
  onToggleExpand: () => void;
  onToggleBookmark: (e: React.MouseEvent) => void;
  onCopyCitation: (text: string) => void;
}

export default function ResearchCardItem({
  pub,
  isExpanded,
  isBookmarked,
  onToggleExpand,
  onToggleBookmark,
  onCopyCitation,
}: ResearchCardItemProps) {
  const shouldReduceMotion = usePrefersReducedMotion();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const citationText = `${pub.author}, "${pub.title}," Published in ${pub.source}, ${pub.date}.`;
    onCopyCitation(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={shouldReduceMotion ? {} : { 
        y: -4, 
        scale: 1.006,
        borderColor: 'rgba(167, 139, 250, 0.25)',
        boxShadow: '0 12px 25px rgba(167, 139, 250, 0.03)'
      }}
      transition={{ 
        type: "tween",
        ease: [0.2, 0, 0, 1],
        duration: 0.35 
      }}
      className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] overflow-hidden transition-all duration-300"
    >
      <div className="p-6 md:p-8 space-y-4">
        {/* Header line */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#a78bfa]/10 border border-[#a78bfa]/20 px-2 py-0.5 font-mono text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
              {pub.category}
            </span>
            <span className="font-mono text-[10px] text-slate-500">{pub.source} • {pub.date}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
              pub.difficulty === 'Expert' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
              pub.difficulty === 'Advanced' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
              pub.difficulty === 'Intermediate' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' :
              'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            }`}>
              {pub.difficulty} Level
            </span>
            
            <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
              <Clock className="h-3.5 w-3.5 text-[#a78bfa]" />
              {pub.readingTime}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-sans text-xl md:text-2xl font-extrabold text-white leading-snug tracking-tight">
          {pub.title}
        </h3>

        {/* Authors */}
        <p className="font-sans text-xs text-slate-400">
          Investigated by <span className="text-slate-300 italic font-semibold">{pub.author}</span>
        </p>

        {/* Main Summary */}
        <p className="font-sans text-sm text-slate-300 leading-relaxed">
          {pub.summary}
        </p>

        {/* Collapsible deeper specifications */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4 pt-4 border-t border-[rgba(255,255,255,0.05)]"
          >
            {/* Why It Matters (Inset Panel) */}
            <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
              <span className="block font-mono text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">// WHY IT MATTERS</span>
              <p className="font-sans text-sm text-slate-300 leading-relaxed">
                {pub.whyItMatters}
              </p>
            </div>

            {/* Industry Impact (Inset Panel) */}
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <span className="block font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">// INDUSTRY IMPACT</span>
              <p className="font-sans text-sm text-slate-300 leading-relaxed">
                {pub.industryImpact}
              </p>
            </div>

            {/* Simulated microchip telemetry diagram placeholder */}
            <div className="p-4 rounded-lg border border-[rgba(255,255,255,0.03)] bg-[#070707] font-mono text-xs text-slate-400 space-y-1">
              <span className="text-purple-400 font-bold block mb-1">// SIMULATED SILICON TIMING TRACE</span>
              <div className="font-mono text-[11px] leading-tight select-all">CLK_CORE:  |__|¯¯|__|¯¯|__|¯¯|__|¯¯|__|¯¯|__|¯¯| (Active Gate)</div>
              <div className="font-mono text-[11px] leading-tight">SLACK_S1:  +42ps [CRITICAL SLACK CLOSED ACCORDING TO SPECS]</div>
              <div className="font-mono text-[11px] leading-tight text-indigo-400">VDD_CHAM:  ============= 1.20V REGULATED =============</div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {pub.tags.map(t => (
                <span key={t} className="rounded bg-[#1a1a1a] px-2.5 py-1 font-mono text-[10px] text-slate-400 border border-[rgba(255,255,255,0.03)]">
                  #{t}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action buttons row */}
        <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.04)]">
          <RippleButton
            onClick={onToggleExpand}
            className="rounded-lg bg-[#1a1a1a] hover:bg-[#a78bfa] hover:text-black text-slate-300 transition-all px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1"
            rippleColor="rgba(167, 139, 250, 0.3)"
          >
            {isExpanded ? (
              <>Collapse Spec <ChevronUp className="h-3.5 w-3.5" /></>
            ) : (
              <>Read More <ChevronDown className="h-3.5 w-3.5" /></>
            )}
          </RippleButton>

          <div className="flex items-center gap-2">
            {/* Bookmark Button */}
            <RippleButton
              onClick={onToggleBookmark}
              className={`rounded-lg p-2 border transition-all flex items-center justify-center h-9 w-9 ${
                isBookmarked 
                  ? 'bg-purple-500/10 border-purple-500/30 text-[#a78bfa]' 
                  : 'border-[rgba(255,255,255,0.06)] hover:bg-[#1e1e1e] text-slate-400'
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Document"}
              rippleColor="rgba(167, 139, 250, 0.2)"
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-[#a78bfa]' : ''}`} />
            </RippleButton>

            {/* Citation Copy Trigger */}
            <RippleButton
              onClick={handleCopy}
              className="rounded-lg p-2 border border-[rgba(255,255,255,0.06)] hover:bg-[#1e1e1e] text-slate-400 hover:text-white transition-all flex items-center justify-center h-9 w-9"
              title="Copy Citation String"
              rippleColor="rgba(255, 255, 255, 0.15)"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </RippleButton>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
