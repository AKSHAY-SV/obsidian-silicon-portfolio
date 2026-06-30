import React from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from './hooks';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  isLoading: boolean;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
  isLoading,
}: CategoryFilterProps) {
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <div className="flex flex-wrap gap-2.5 pt-2" id="premium-filter-chips">
      {categories.map((cat) => {
        const isSelected = activeCategory.toLowerCase() === cat.toLowerCase();
        return (
          <motion.button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            disabled={isLoading}
            whileHover={(shouldReduceMotion || isLoading) ? {} : { y: -1, scale: 1.02 }}
            whileTap={(shouldReduceMotion || isLoading) ? {} : { scale: 0.98 }}
            className={`relative px-5 py-2.5 rounded-full font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 border overflow-hidden ${
              isSelected 
                ? 'text-black font-bold border-transparent' 
                : 'bg-[#0d0d0d] border-[rgba(255,255,255,0.08)] text-slate-400 hover:text-white hover:border-[rgba(255,255,255,0.2)] hover:bg-[#121212]'
            } ${isLoading ? 'opacity-40 cursor-not-allowed border-white/5' : ''}`}
            id={`cat-chip-${cat.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {isSelected && !shouldReduceMotion && (
              <motion.div
                layoutId="active-chip-bg"
                className="absolute inset-0 bg-[#a78bfa] shadow-[0_0_15px_rgba(167,139,250,0.35)] rounded-full"
                style={{ zIndex: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {isSelected && shouldReduceMotion && (
              <div className="absolute inset-0 bg-[#a78bfa] rounded-full" style={{ zIndex: 0 }} />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {isSelected && (
                <span className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
              )}
              <span>{cat}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
