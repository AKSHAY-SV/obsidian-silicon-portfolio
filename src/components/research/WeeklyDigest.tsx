import React from 'react';
import { motion } from 'motion/react';
import { Terminal } from 'lucide-react';
import RippleButton from './RippleButton';
import AnimatedCounter from './AnimatedCounter';
import { ResearchCardType } from './ResearchCard';
import { usePrefersReducedMotion } from './hooks';

export interface WeeklyDigestConfig {
  issue: number;
  focus: string;
  editorial: string;
}

interface WeeklyDigestProps {
  publications: ResearchCardType[];
  digestConfig: WeeklyDigestConfig | undefined;
  onCompileClick: () => void;
  isLoading?: boolean;
}

export default function WeeklyDigest({
  publications,
  digestConfig,
  onCompileClick,
  isLoading = false,
}: WeeklyDigestProps) {
  const shouldReduceMotion = usePrefersReducedMotion();

  // 1. Articles This Week
  const articlesCount = publications.length;

  // 2. Compute Top Category
  const categoryCounts: Record<string, number> = {};
  publications.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });
  let topCategory = 'RISC-V';
  let maxCatCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCatCount) {
      maxCatCount = count;
      topCategory = cat;
    }
  });

  // 3. Compute Most Mentioned Technology
  const techCounts: Record<string, number> = {};
  publications.forEach(p => {
    const tags = p.technologyTags || p.tags || [];
    tags.forEach(tag => {
      techCounts[tag] = (techCounts[tag] || 0) + 1;
    });
  });
  let topTech = 'HBM4';
  let maxTechCount = 0;
  Object.entries(techCounts).forEach(([tech, count]) => {
    if (count > maxTechCount) {
      maxTechCount = count;
      topTech = tech;
    }
  });

  // 4. Latest Update
  let latestDate = '2026-06-30';
  if (publications.length > 0) {
    const dates = publications.map(p => p.publishedDate || p.date || '').filter(Boolean);
    if (dates.length > 0) {
      latestDate = dates.sort().reverse()[0];
    }
  }

  // Fallback default description/editorial if not loaded
  const issueNumber = digestConfig?.issue || 142;
  const focusTitle = digestConfig?.focus || "Silicon Co-Design & Heterogeneous Integration";
  const editorialText = digestConfig?.editorial || "As standard CMOS planar scaling approaches absolute physical boundaries, the industry turns to advanced packaging and anamorphic lithography to maintain performance progression. This week's digest surveys high-yield wafer stitching and RRAM neuromorphic crossbars.";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: [0.2, 0, 0, 1], duration: 0.45, delay: 0.4 }}
      whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.005 }}
      className="lg:col-span-2 rounded-xl border border-[rgba(167,139,250,0.15)] bg-[#0d0d0d] p-8 space-y-6 flex flex-col justify-between relative overflow-hidden transition-colors duration-300"
    >
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 font-mono text-[10px] uppercase font-bold tracking-wider text-indigo-400">
            INTELLIGENCE INDEX
          </span>
          <span className="font-mono text-[10px] text-slate-500">// Issue #{issueNumber} Summary</span>
        </div>
        
        <h3 className="font-sans text-3xl font-extrabold text-white tracking-tight leading-snug">
          {focusTitle}
        </h3>
        
        <p className="font-sans text-sm text-slate-300 leading-relaxed">
          {editorialText}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="p-4 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.03)]">
            <span className="block font-mono text-[9px] text-slate-500 uppercase">Articles Logged</span>
            <span className="font-mono text-lg font-extrabold text-white block mt-1">
              {isLoading ? (
                <span className="text-slate-600">...</span>
              ) : (
                <AnimatedCounter value={articlesCount} />
              )}
            </span>
          </div>
          <div className="p-4 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.03)]">
            <span className="block font-mono text-[9px] text-slate-500 uppercase">Top Category</span>
            <span className="font-mono text-xs font-extrabold text-[#a78bfa] block mt-1.5 truncate" title={topCategory}>
              {isLoading ? "Analyzing..." : topCategory}
            </span>
          </div>
          <div className="p-4 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.03)]">
            <span className="block font-mono text-[9px] text-slate-500 uppercase">Top Technology</span>
            <span className="font-mono text-xs font-extrabold text-emerald-400 block mt-1.5 truncate" title={topTech}>
              {isLoading ? "Scanning..." : topTech}
            </span>
          </div>
          <div className="p-4 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.03)]">
            <span className="block font-mono text-[9px] text-slate-500 uppercase">Latest Update</span>
            <span className="font-mono text-[11px] font-extrabold text-amber-400 block mt-1.5 truncate">
              {isLoading ? "Calculating..." : latestDate}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-6 mt-4">
        <span className="font-mono text-[10px] text-slate-500 uppercase">
          COMPILED BY OBSIDIAN SILICON HUB
        </span>
        <RippleButton 
          onClick={onCompileClick}
          disabled={isLoading}
          className={`rounded-lg text-white px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
            isLoading 
              ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-50' 
              : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
          rippleColor="rgba(255, 255, 255, 0.2)"
        >
          Compile Weekly Summary <Terminal className="h-3.5 w-3.5" />
        </RippleButton>
      </div>
    </motion.div>
  );
}
