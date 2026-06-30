import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ value, onChange, isLoading }: SearchBarProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: [0.2, 0, 0, 1], duration: 0.4, delay: 0.3 }}
      className={`relative w-full max-w-4xl transition-all duration-300 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`} 
      id="premium-search-bar"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl blur-xl opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 pointer-events-none" />
      <div className={`relative flex items-center rounded-2xl bg-[#0b0b0b] border transition-all duration-300 shadow-xl ${
        searchFocused 
          ? 'border-[#a78bfa] shadow-[#a78bfa]/5 ring-1 ring-[#a78bfa]/20' 
          : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)]'
      }`}>
        <div className="pl-5 text-slate-400">
          <Search className={`h-6 w-6 transition-colors duration-300 ${searchFocused ? 'text-[#a78bfa]' : 'text-slate-500'}`} />
        </div>
        <input
          type="text"
          placeholder={isLoading ? "Syncing telemetry feed..." : "Search semiconductor news..."}
          value={value}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          className="w-full bg-transparent px-4 py-5 text-base md:text-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0 disabled:cursor-not-allowed"
        />
        {value && !isLoading && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onChange('')}
            className="mr-5 px-3 py-1.5 rounded-lg bg-[#151515] hover:bg-[#202020] border border-[rgba(255,255,255,0.06)] font-mono text-xs text-[#a78bfa] transition-all uppercase tracking-wider whitespace-nowrap shrink-0"
          >
            Clear
          </motion.button>
        )}
        <div className="hidden md:flex items-center gap-1.5 pr-6 font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold whitespace-nowrap shrink-0 select-none">
          {isLoading ? (
            <span className="text-[#a78bfa] animate-pulse">SYSTEM_SCAN // CALIBRATING</span>
          ) : (
            <span>SYSTEM_SCAN // ACTIVE</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
