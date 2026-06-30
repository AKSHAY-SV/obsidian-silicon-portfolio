import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, FileText, Download, Copy, Check, ChevronDown, ChevronUp, Cpu, 
  Award, Layers, TrendingUp, Sparkles, Terminal, RefreshCw, Sliders, 
  Activity, Zap, Info, ArrowUpRight, Search, Flame, Bug, Compass, Target,
  Bookmark, Share2, Eye, HelpCircle, Calendar, ShieldCheck, Clock, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Modular high-precision subcomponents
import { usePrefersReducedMotion } from './research/hooks';
import AnimatedCounter from './research/AnimatedCounter';
import RippleButton from './research/RippleButton';
import WaferOptimizer from './research/WaferOptimizer';

// Newly extracted reusable, prop-driven components
import ResearchCard, { ResearchCardType } from './research/ResearchCard';
import FeaturedResearch from './research/FeaturedResearch';
import TrendingTechnologies, { TechItem } from './research/TrendingTechnologies';
import WeeklyDigest, { WeeklyDigestConfig } from './research/WeeklyDigest';
import LoadingSkeleton from './research/LoadingSkeleton';
import ErrorState from './research/ErrorState';
import Highlights from './research/Highlights';
import CategoryFilter from './research/CategoryFilter';
import SearchBar from './research/SearchBar';

const TRENDING_TECH_DEFAULTS: TechItem[] = [
  { name: 'Chiplets', desc: 'High-density organic interposers and UCIe interconnect protocols.', status: 'Active Std' },
  { name: 'HBM', desc: 'High-Bandwidth Memory stacking with 3D TSV vertical silicon routing.', status: 'HBM4 Spec' },
  { name: 'GAAFET', desc: 'Gate-All-Around nanosheets replacing legacy FinFET transistors.', status: '1.4nm GAA' },
  { name: 'OpenLane', desc: 'Open-source EDA synthesis flow targeting physical layout generation.', status: 'v2.1 Stable' },
  { name: 'Sky130', desc: 'SkyWater 130nm open-source PDK enabling accessible silicon fabrication.', status: 'Open PDK' },
  { name: 'RISC-V', desc: 'Open instruction set architecture powering custom processor innovations.', status: 'Vector Ext' },
  { name: 'Photonics', desc: 'Silicon micro-combs utilizing light instead of copper for ultra-fast bus lanes.', status: 'Opto-Bus' }
];

const REAL_TIME_TICKERS = [
  { label: 'TSMC N2 Yield', value: '82.4%', change: '+1.2%', up: true },
  { label: 'Intel 18A D0 Defect', value: '0.12/cm²', change: '-4.8%', up: true },
  { label: 'ASML EUV Uptime', value: '98.9%', change: '+0.4%', up: true },
  { label: 'High-NA Lens Alignment', value: '0.08 nm', change: 'Stable', up: null },
  { label: '3D GAA Nanosheet Density', value: '295 MTr/mm²', change: '+8.1%', up: true },
];

export default function Research() {
  const shouldReduceMotion = usePrefersReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showWeeklyModal, setShowWeeklyModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Dynamic Publications Feed states
  const [publications, setPublications] = useState<ResearchCardType[]>([]);
  const [weeklyDigest, setWeeklyDigest] = useState<WeeklyDigestConfig | undefined>(undefined);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Disney Stitch-inspired interactive semiconductor tuner state (Mischief Core Balancer)
  const [processNodeSize, setProcessNodeSize] = useState<number>(3); // 2nm, 3nm, 5nm, 7nm
  const [waferVoltage, setWaferVoltage] = useState<number>(0.85); // 0.6V to 1.2V
  const [mischiefOverclock, setMischiefOverclock] = useState<number>(85); // 0% to 150%

  // Sync data from JSON-driven endpoint
  const loadPublications = async () => {
    try {
      setFetchLoading(true);
      setFetchError(null);
      const response = await fetch('/research-feed.json');
      if (!response.ok) {
        throw new Error(`CRITICAL_FAIL: Status ${response.status} (${response.statusText || 'Internal Channel Failure'})`);
      }
      const data = await response.json();
      const publicationsList = Array.isArray(data) ? data : (data?.research || []);
      setPublications(publicationsList);
      if (data?.weeklyDigest) {
        setWeeklyDigest(data.weeklyDigest);
      }
    } catch (err: any) {
      setFetchError(err?.message || 'CRITICAL_FAIL: Unable to sync with research telemetry pipeline.');
    } finally {
      setFetchLoading(false);
    }
  };

  // Initial mount load
  useEffect(() => {
    loadPublications();
  }, []);

  // Trigger a subtle animated loading state whenever categories or search query updates
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700); // Premium micro-load duration
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  // Dynamically calculate Categories list from JSON, removing duplicates & ensuring 'All' is first
  const dynamicCategories = useMemo(() => {
    const rawCategories = publications.map(p => p.category).filter(Boolean);
    const uniqueCategories = Array.from(new Set(rawCategories));
    
    // Sort remaining categories for visual consistency, keeping 'All' at the top
    uniqueCategories.sort((a, b) => String(a).localeCompare(String(b)));
    return ['All', ...uniqueCategories];
  }, [publications]);

  // Client-Side Search & Category Filters (instant & case-insensitive)
  const filteredPublications = useMemo(() => {
    return publications.filter(pub => {
      // 1. Category check
      const matchesCategory = activeCategory === 'All' || 
                              pub.category.toLowerCase() === activeCategory.toLowerCase();

      // 2. Search query check
      const tags = pub.technologyTags || pub.tags || [];
      const queryLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
                            pub.title.toLowerCase().includes(queryLower) || 
                            pub.summary.toLowerCase().includes(queryLower) ||
                            pub.category.toLowerCase().includes(queryLower) ||
                            tags.some(tag => tag.toLowerCase().includes(queryLower));

      return matchesCategory && matchesSearch;
    });
  }, [publications, activeCategory, searchQuery]);

  // Detect the single Featured research item where featured === true
  const featuredArticle = useMemo(() => {
    return publications.find(p => p.featured === true);
  }, [publications]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const handleCopyCitation = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Highlight featured article spec on-click (scrolling cleanly to spec table)
  const handleSelectFeatured = (pub: ResearchCardType) => {
    setActiveCategory('All');
    setExpandedId(pub.id);
    setTimeout(() => {
      document.getElementById(`latest-research-feed`)?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="relative py-20 min-h-screen overflow-hidden text-slate-100 bg-[#060606] font-sans selection:bg-purple-500/30 selection:text-white" id="research-page">
      {/* Shimmer CSS animation definition */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      ` }} />
      
      {/* Drifting ambient background glow spots (Material gentle background movement) */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div 
            className="absolute top-[5%] left-[-10%] w-[60vw] h-[60vw] bg-purple-950/20 rounded-full blur-[140px]"
            animate={{
              x: [0, 40, -30, 0],
              y: [0, -30, 40, 0],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-[10%] right-[-10%] w-[70vw] h-[70vw] bg-indigo-950/15 rounded-full blur-[160px]"
            animate={{
              x: [0, -45, 35, 0],
              y: [0, 45, -35, 0],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          />
          <motion.div 
            className="absolute top-[55%] left-[15%] w-[50vw] h-[50vw] bg-slate-900/10 rounded-full blur-[140px]"
            animate={{
              x: [0, 35, -35, 0],
              y: [0, 35, -35, 0],
            }}
            transition={{
              duration: 38,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Bloomberg Ticker bar */}
        <div className="overflow-hidden rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] px-4 py-3 font-mono text-xs shadow-inner" id="silicon-live-telemetry">
          <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
            <div className="flex items-center gap-2 text-[#a78bfa] shrink-0 uppercase tracking-widest font-extrabold text-[10px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              REAL-TIME WAFER INTEL //
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-1 overflow-x-auto text-[11px] text-slate-400 font-medium">
              {REAL_TIME_TICKERS.map((t, idx) => (
                <div key={idx} className="flex items-center gap-2 whitespace-nowrap border-r border-[rgba(255,255,255,0.04)] pr-8 last:border-0">
                  <span className="text-slate-500 uppercase">{t.label}:</span>
                  <span className="text-white font-bold">{t.value}</span>
                  {t.change !== 'Stable' && (
                    <span className={t.up ? 'text-[#10b981]' : 'text-[#ef4444]'}>{t.change}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 uppercase shrink-0 font-bold hidden lg:block">
              GMT-7 SYSTEM SYNC //
            </div>
          </div>
        </div>

        {/* SECTION 1: HERO BANNER (Google DeepMind + Google I/O + Stitch aesthetic) */}
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0a0a0a] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12" id="silicon-hero-banner">
          
          {/* Advanced GPU-Accelerated Semiconductor Background (PCB Traces, Silicon Wafers, Microchip packages, Signal Pulses, and floating particles) */}
          <div className="absolute inset-0 opacity-[0.045] overflow-hidden pointer-events-none select-none z-0" style={{ willChange: 'transform' }}>
            {/* Subtle base glows - extremely low opacity */}
            <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />

            <svg className="absolute inset-0 w-full h-full text-[#a78bfa]" xmlns="http://www.w3.org/2000/svg" style={{ backfaceVisibility: 'hidden' }}>
              <defs>
                <pattern id="silicon-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.75" fill="rgba(167, 139, 250, 0.15)" />
                  <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(167, 139, 250, 0.03)" strokeWidth="0.5" />
                  <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(167, 139, 250, 0.03)" strokeWidth="0.5" />
                </pattern>
              </defs>

              <rect width="100%" height="100%" fill="url(#silicon-grid)" />

              <g transform="translate(900, 120)" className="animate-[spin_300s_linear_infinite]" style={{ transformOrigin: 'center center', willChange: 'transform' }}>
                <circle r="120" fill="none" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1.5" strokeDasharray="4,8" />
                <circle r="180" fill="none" stroke="rgba(129, 140, 248, 0.3)" strokeWidth="1" strokeDasharray="30,10,15,10" />
                <circle r="260" fill="none" stroke="rgba(167, 139, 250, 0.2)" strokeWidth="2" strokeDasharray="15,45" />
                <circle r="340" fill="none" stroke="rgba(129, 140, 248, 0.15)" strokeWidth="1.2" />
                <line x1="0" y1="-360" x2="0" y2="360" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="0.75" strokeDasharray="10,10" />
                <line x1="-360" y1="0" x2="360" y2="0" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="0.75" strokeDasharray="10,10" />
                <line x1="-250" y1="-250" x2="250" y2="250" stroke="rgba(129, 140, 248, 0.1)" strokeWidth="0.5" />
                <line x1="-250" y1="250" x2="250" y2="-250" stroke="rgba(129, 140, 248, 0.1)" strokeWidth="0.5" />
              </g>

              <g transform="translate(180, 70)">
                <rect width="100" height="100" rx="6" fill="none" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1.5" />
                <rect x="8" y="8" width="84" height="84" rx="4" fill="none" stroke="rgba(129, 140, 248, 0.25)" strokeWidth="1" />
                <rect x="25" y="25" width="50" height="50" rx="2" fill="rgba(167, 139, 250, 0.05)" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="1" />
                <path d="M -15 20 H 0 M -15 40 H 0 M -15 60 H 0 M -15 80 H 0" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="1" />
                <path d="M 100 20 H 115 M 100 40 H 115 M 100 60 H 115 M 100 80 H 115" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="1" />
                <path d="M 20 -15 V 0 M 40 -15 V 0 M 60 -15 V 0 M 80 -15 V 0" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="1" />
                <path d="M 20 100 V 115 M 40 100 V 115 M 60 100 V 115 M 80 100 V 115" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="1" />
              </g>

              <g transform="translate(720, 250)">
                <rect width="60" height="60" rx="4" fill="none" stroke="rgba(129, 140, 248, 0.35)" strokeWidth="1.2" />
                <rect x="6" y="6" width="48" height="48" rx="2" fill="none" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="0.8" />
                <path d="M -10 15 H 0 M -10 30 H 0 M -10 45 H 0" stroke="rgba(129, 140, 248, 0.3)" strokeWidth="0.8" />
                <path d="M 60 15 H 70 M 60 30 H 70 M 60 45 H 70" stroke="rgba(129, 140, 248, 0.3)" strokeWidth="0.8" />
              </g>

              <g stroke="rgba(167, 139, 250, 0.15)" strokeWidth="1.5" fill="none">
                <path d="M 0 100 H 180 M 180 100 L 220 140 V 280 H 500" />
                <path d="M 130 0 V 70 M 280 120 H 420 L 460 160 V 300 H 600" stroke="rgba(129, 140, 248, 0.2)" />
                <path d="M 720 280 H 630 L 590 240 V 180 H 450" />
                <path d="M 780 280 H 840 L 880 240 V 40" stroke="rgba(129, 140, 248, 0.2)" />
                <path d="M 400 50 H 650 L 690 90 V 200" strokeWidth="1" strokeDasharray="3,3" />
                <path d="M 400 55 H 648 L 685 92 V 200" strokeWidth="1" strokeDasharray="3,3" />
              </g>

              <motion.path
                d="M 0 100 H 180 L 220 140 V 280 H 500"
                fill="none"
                stroke="rgba(167, 139, 250, 0.6)"
                strokeWidth="2.5"
                initial={{ pathLength: 0.08, pathOffset: 0 }}
                animate={{ pathOffset: [0, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              />

              <motion.path
                d="M 280 120 H 420 L 460 160 V 300 H 600"
                fill="none"
                stroke="rgba(129, 140, 248, 0.7)"
                strokeWidth="2"
                initial={{ pathLength: 0.12, pathOffset: 0 }}
                animate={{ pathOffset: [0, 1] }}
                transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 2 }}
              />

              <motion.path
                d="M 720 280 H 630 L 590 240 V 180 H 450"
                fill="none"
                stroke="rgba(167, 139, 250, 0.6)"
                strokeWidth="2.2"
                initial={{ pathLength: 0.06, pathOffset: 0 }}
                animate={{ pathOffset: [0, 1] }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear", delay: 4 }}
              />

              <motion.path
                d="M 780 280 H 840 L 880 240 V 40"
                fill="none"
                stroke="rgba(129, 140, 248, 0.8)"
                strokeWidth="2"
                initial={{ pathLength: 0.15, pathOffset: 0 }}
                animate={{ pathOffset: [0, 1] }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear", delay: 1 }}
              />

              <g fill="#a78bfa" className="animate-pulse">
                <circle cx="180" cy="100" r="3" fill="#a78bfa" style={{ animationDuration: '3s' }} />
                <circle cx="220" cy="140" r="2.5" fill="#818cf8" style={{ animationDuration: '4.5s' }} />
                <circle cx="420" cy="160" r="3" fill="#c084fc" style={{ animationDuration: '2.5s' }} />
                <circle cx="460" cy="160" r="2" fill="#818cf8" style={{ animationDuration: '5s' }} />
                <circle cx="630" cy="240" r="3" fill="#a78bfa" style={{ animationDuration: '3.5s' }} />
                <circle cx="590" cy="240" r="2.5" fill="#c084fc" style={{ animationDuration: '4s' }} />
                <circle cx="840" cy="240" r="3" fill="#818cf8" style={{ animationDuration: '3s' }} />
                <circle cx="880" cy="240" r="2.5" fill="#a78bfa" style={{ animationDuration: '2.8s' }} />
              </g>

              {[...Array(16)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx={`${15 + i * 5.5}%`}
                  cy={`${15 + (i * 19) % 75}%`}
                  r={1 + (i % 2)}
                  fill={i % 2 === 0 ? "#a78bfa" : "#818cf8"}
                  animate={{
                    y: [0, -25, 0],
                    x: [0, 12, 0],
                    opacity: [0.15, 0.45, 0.15]
                  }}
                  transition={{
                    duration: 10 + (i % 3) * 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.35
                  }}
                  style={{ willChange: 'transform' }}
                />
              ))}
            </svg>
          </div>

          <div className="max-w-2xl space-y-6 relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#a78bfa]/20 bg-[#a78bfa]/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#a78bfa]">
              <Sparkles className="h-3 w-3 animate-spin" style={{ animationDuration: '4s' }} /> SEMICONDUCTOR INTEL HUB v4.3
            </div>
            
            <h1 className="font-mono text-4xl sm:text-7xl font-black tracking-tight text-white uppercase leading-[0.95]" id="silicon-intelligence-title">
              SILICON<br />
              <span className="text-[#a78bfa] drop-shadow-[0_0_15px_rgba(167,139,250,0.35)]">INTELLIGENCE</span>
            </h1>
            
            <p className="font-sans text-lg sm:text-xl text-slate-300 font-medium leading-relaxed max-w-xl">
              Daily AI-curated semiconductor research, industry breakthroughs and architecture insights.
            </p>
            
            <p className="font-sans text-sm text-slate-400 leading-relaxed max-w-lg">
              Explore structural physical metrics, pipeline balancing mathematics, and formal verification frameworks mapping out the state space of sub-nanometer integrated platforms.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <RippleButton 
                onClick={() => document.getElementById('latest-research-feed')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-lg bg-[#a78bfa] hover:bg-[#b49dfb] text-black px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 group shadow-lg shadow-purple-500/10"
                rippleColor="rgba(0, 0, 0, 0.15)"
              >
                <BookOpen className="h-4 w-4" /> Browse Bibliography
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </RippleButton>
              <RippleButton 
                onClick={() => document.getElementById('wafer-optimizer-panel')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#121212] hover:bg-[#181818] text-white px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2"
                rippleColor="rgba(255, 255, 255, 0.1)"
              >
                <Sliders className="h-4 w-4 text-[#a78bfa]" /> Wafer Optimization Sandbox
              </RippleButton>
            </div>
          </div>

          <div className="w-full lg:w-96 h-80 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] p-6 relative flex flex-col justify-between overflow-hidden shadow-[0_0_30px_rgba(167,139,250,0.05)]">
            <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-600 font-bold uppercase tracking-wider">
              STITCH-SYS CORE //
            </div>

            <div className="relative flex-1 flex items-center justify-center">
              <div className="absolute h-40 w-40 rounded-full border border-[rgba(167,139,250,0.1)] flex items-center justify-center animate-spin" style={{ animationDuration: '10s' }}>
                <div className="absolute top-0 left-0 h-3.5 w-3.5 rounded-full bg-[#c084fc] shadow-[0_0_10px_#a78bfa]" />
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#818cf8] shadow-[0_0_8px_#818cf8]" />
              </div>
              <div className="absolute h-24 w-24 rounded-full border border-[rgba(255,255,255,0.04)] flex items-center justify-center">
                <div className="absolute top-1/2 left-0 h-3 w-3 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981]" />
              </div>
              
              <motion.div 
                className="relative h-16 w-16 rounded-full bg-[#111111] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#a78bfa] cursor-pointer shadow-[0_0_15px_rgba(167,139,250,0.2)]"
                whileHover={{ scale: 1.1, rotate: 15 }}
                onClick={() => {
                  setMischiefOverclock(prev => Math.min(150, prev + 10));
                }}
              >
                <Zap className="h-7 w-7 filter drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]" />
              </motion.div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[rgba(255,255,255,0.04)]">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-500 uppercase">Chamber Multiplier</span>
                <span className="text-white font-bold">{mischiefOverclock}%</span>
              </div>
              <div className="w-full bg-[#222222] h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#818cf8] to-[#a78bfa] h-full transition-all duration-300" style={{ width: `${(mischiefOverclock / 150) * 100}%` }} />
              </div>
              <span className="block text-[9px] font-mono text-slate-500 text-center uppercase tracking-widest">
                [ Click center to pulse-charge plasma matrix ]
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: TODAY'S HIGHLIGHTS (Dynamic Statistics component) */}
        <Highlights 
          publications={publications} 
          isLoading={fetchLoading} 
        />

        {/* SECTION 3: PREMIUM FEATURED RESEARCH SPOTLIGHT (Dynamic Featured Spotlight) */}
        {featuredArticle && !fetchLoading && (
          <FeaturedResearch 
            pub={featuredArticle} 
            onSelect={handleSelectFeatured} 
            isLoading={fetchLoading} 
          />
        )}

        {/* SECTION 4: PREMIUM SEARCH & FILTER EXPERIENCE */}
        <div className="space-y-8" id="premium-search-experience">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-5">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#a78bfa]">
                // HIGH-PRECISION SEMICONDUCTOR INTEL
              </p>
              <h3 className="font-sans text-2xl font-extrabold text-white mt-1">
                Academic Bibliography & Verification Archives
              </h3>
            </div>
          </div>

          <div className="space-y-6">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
              isLoading={fetchLoading} 
            />

            <CategoryFilter 
              categories={dynamicCategories} 
              activeCategory={activeCategory} 
              onSelectCategory={setActiveCategory} 
              isLoading={fetchLoading} 
            />
          </div>
        </div>

        {/* SECTION 5: LATEST RESEARCH FEED (Interactive data-driven lists) */}
        <div className="space-y-6" id="latest-research-feed">
          <AnimatePresence mode="popLayout">
            {fetchError ? (
              <ErrorState 
                error={fetchError} 
                onRetry={loadPublications} 
              />
            ) : (fetchLoading || isLoading) ? (
              <LoadingSkeleton count={3} />
            ) : filteredPublications.length > 0 ? (
              filteredPublications.map((pub) => (
                <ResearchCard
                  key={pub.id}
                  pub={pub}
                  isExpanded={expandedId === pub.id}
                  isBookmarked={bookmarkedIds.includes(pub.id)}
                  onToggleExpand={() => toggleExpand(pub.id)}
                  onToggleBookmark={(e) => toggleBookmark(pub.id, e)}
                  onCopyCitation={(text) => handleCopyCitation(pub.id, text)}
                />
              ))
            ) : (
              // Playful empty state
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#0c0c0c] p-8 md:p-16 text-center space-y-8 flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0284c7]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#ec4899]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full animate-[pulse_4s_infinite_ease-in-out]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="85" stroke="rgba(2, 132, 199, 0.15)" strokeWidth="1" strokeDasharray="4,8" />
                    <circle cx="100" cy="100" r="65" stroke="rgba(236, 72, 153, 0.1)" strokeWidth="1.5" />
                    
                    <motion.circle 
                      cx="100" 
                      cy="100" 
                      r="40" 
                      stroke="rgba(14, 165, 233, 0.4)" 
                      strokeWidth="2" 
                      strokeDasharray="10, 40"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                    
                    <motion.path 
                      d="M 50 100 C 10 70 20 20 60 40 C 65 42 70 55 65 65" 
                      stroke="#0ea5e9" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      fill="rgba(14, 165, 233, 0.05)"
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.path 
                      d="M 150 100 C 190 70 180 20 140 40 C 135 42 130 55 135 65" 
                      stroke="#ec4899" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      fill="rgba(236, 72, 153, 0.05)"
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />

                    <rect x="80" y="80" width="40" height="40" rx="8" fill="#0f172a" stroke="rgba(2, 132, 199, 0.5)" strokeWidth="1.5" />
                    <rect x="87" y="87" width="26" height="26" rx="4" fill="rgba(14, 165, 233, 0.1)" stroke="rgba(236, 72, 153, 0.3)" strokeWidth="1" />
                    
                    <line x1="100" y1="45" x2="100" y2="80" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3,3" />
                    <circle cx="100" cy="45" r="3.5" fill="#0ea5e9" />
                    
                    <line x1="100" y1="120" x2="100" y2="155" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="3,3" />
                    <circle cx="100" cy="155" r="3.5" fill="#ec4899" />

                    <motion.circle 
                      cx="60" 
                      cy="140" 
                      r="4" 
                      fill="#38bdf8"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.circle 
                      cx="140" 
                      cy="140" 
                      r="4" 
                      fill="#f472b6"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    <text x="75" y="115" fill="rgba(14, 165, 233, 0.5)" fontSize="7" fontFamily="monospace" fontWeight="bold">SYS_626</text>
                  </svg>
                </div>

                <div className="space-y-2 max-w-md">
                  <h3 className="font-sans text-xl md:text-2xl font-extrabold text-white tracking-tight">
                    No matching research found
                  </h3>
                  <p className="font-sans text-sm text-slate-400 leading-relaxed">
                    The plasma calibration sequence returned zero matching records. Reset the silicon filters to restore normal feed tracking.
                  </p>
                </div>

                <RippleButton
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 hover:border-[#a78bfa] text-[#a78bfa] hover:text-white transition-all flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/5"
                  rippleColor="rgba(167, 139, 250, 0.2)"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Feed
                </RippleButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SECTION 6: TRENDING TECHNOLOGIES */}
        <TrendingTechnologies 
          technologies={TRENDING_TECH_DEFAULTS} 
        />

        {/* SECTION 7: WEEKLY DIGEST & WAFER OPTIMIZER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="weekly-digest">
          <WeeklyDigest
            publications={publications}
            digestConfig={weeklyDigest}
            onCompileClick={() => setShowWeeklyModal(true)}
            isLoading={fetchLoading}
          />

          <WaferOptimizer
            processNodeSize={processNodeSize}
            setProcessNodeSize={setProcessNodeSize}
            waferVoltage={waferVoltage}
            setWaferVoltage={setWaferVoltage}
            mischiefOverclock={mischiefOverclock}
            disabled={fetchLoading}
          />
        </div>

      </div>

      {/* Interactive Modal: Weekly digest compile mock */}
      <AnimatePresence>
        {showWeeklyModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0d0d0d] p-6 space-y-6 shadow-2xl relative"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="rounded bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 font-mono text-[9px] uppercase font-bold text-indigo-400">
                    COMPILED DIGEST
                  </span>
                  <h3 className="font-sans text-lg font-bold text-white">Silicon Intel digest compilation</h3>
                </div>
                <button 
                  onClick={() => setShowWeeklyModal(false)}
                  className="rounded p-1 text-slate-500 hover:text-white hover:bg-white/5 transition-all font-mono text-xs"
                >
                  [CLOSE]
                </button>
              </div>

              <div className="space-y-3.5 font-mono text-xs text-slate-300">
                <div className="p-3 bg-[#030303] rounded border border-[rgba(255,255,255,0.02)] leading-relaxed">
                  <span className="text-purple-400 font-bold block mb-1">// SYSTEM METRIC RESULTS:</span>
                  - Total Active Silicon Files: {publications.length} verified<br />
                  - Active physical layout nodes: TSMC N2 & Intel 18A GAA<br />
                  - Registered corner models: 64 timing corners closed successfully
                </div>

                <div className="p-3 bg-[#030303] rounded border border-[rgba(255,255,255,0.02)] leading-relaxed">
                  <span className="text-amber-400 font-bold block mb-1">// ACTIVE INDUSTRY SUMMARY:</span>
                  ASML has confirmed projection lens alignment down to sub-angstrom lines. Foundry alliances anticipate high volume yields of Backside Power Delivery networks in high-density matrix floorplans.
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-mono text-[9px] text-slate-500 uppercase">Obsidian Core System Signoff Complete</span>
                <RippleButton
                  onClick={() => setShowWeeklyModal(false)}
                  className="rounded bg-[#a78bfa] hover:bg-[#b49dfb] text-black px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider transition-colors"
                  rippleColor="rgba(0, 0, 0, 0.15)"
                >
                  Acknowledge Report
                </RippleButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
