import React, { useState, useEffect } from 'react';
import { 
  BookOpen, FileText, Download, Copy, Check, ChevronDown, ChevronUp, Cpu, 
  Award, Layers, TrendingUp, Sparkles, Terminal, RefreshCw, Sliders, 
  Activity, Zap, Info, ArrowUpRight, Search, Flame, Bug, Compass, Target,
  Bookmark, Share2, Eye, HelpCircle, Calendar, ShieldCheck, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Modular high-precision subcomponents
import { usePrefersReducedMotion } from './research/hooks';
import AnimatedCounter from './research/AnimatedCounter';
import RippleButton from './research/RippleButton';
import ResearchCardItem, { ResearchCard } from './research/ResearchCardItem';
import WaferOptimizer from './research/WaferOptimizer';

const CATEGORIES = [
  'All', 'ASIC', 'FPGA', 'EDA', 'Embedded', 'Physical Design', 'AI Hardware', 'Research Papers', 'Industry News'
];

const TRENDING_TECH = [
  { name: 'Chiplets', desc: 'High-density organic interposers and UCIe interconnect protocols.', status: 'Active Std' },
  { name: 'HBM', desc: 'High-Bandwidth Memory stacking with 3D TSV vertical silicon routing.', status: 'HBM4 Spec' },
  { name: 'GAAFET', desc: 'Gate-All-Around nanosheets replacing legacy FinFET transistors.', status: '1.4nm GAA' },
  { name: 'OpenLane', desc: 'Open-source EDA synthesis flow targeting physical layout generation.', status: 'v2.1 Stable' },
  { name: 'Sky130', desc: 'SkyWater 130nm open-source PDK enabling accessible silicon fabrication.', status: 'Open PDK' },
  { name: 'RISC-V', desc: 'Open instruction set architecture powering custom processor innovations.', status: 'Vector Ext' },
  { name: 'Photonics', desc: 'Silicon micro-combs utilizing light instead of copper for ultra-fast bus lanes.', status: 'Opto-Bus' }
];

const RESEARCH_FEED: ResearchCard[] = [
  {
    id: 'res-1',
    category: 'ASIC',
    title: 'Design of a 1.2V Low-Latency Tensor Core in N3E Node with Advanced Power Gating',
    summary: 'An implementation study of dense tensor arithmetic tiles using fine-grained power state-machines. The architecture uses low-threshold transistors to preserve slack timing under critical low-voltage operations.',
    whyItMatters: 'Resolves thermal throttling bottlenecks in high-density matrix units by isolating unused execution pipelines dynamically within 2 clock cycles.',
    industryImpact: 'Delivers a 22% improvement in performance-per-watt for continuous transformer token generation at edge form-factors.',
    difficulty: 'Advanced',
    readingTime: '8 min read',
    source: 'IEEE Journal of Solid-State Circuits',
    date: 'June 2026',
    author: 'Dr. Evelyn Vance & Team',
    tags: ['N3E Node', 'Power Gating', 'Tensor Core']
  },
  {
    id: 'res-2',
    category: 'RISC-V',
    title: 'RV64GCH Vector Extension Integration for Out-of-Order Decoders',
    summary: 'Analysing register renaming congestion and execution queue hazard detection within an out-of-order 64-bit RISC-V application core running high-width SIMD instructions.',
    whyItMatters: 'Allows hardware vector operations to bypass typical pipeline flushes during speculative execution branch mispredicts.',
    industryImpact: 'Boosts cryptographic hashing and sparse matrix multipliers scaling by 1.8x over conventional in-order vector units.',
    difficulty: 'Expert',
    readingTime: '12 min read',
    source: 'RISC-V International Arch Forum',
    date: 'May 2026',
    author: 'Prof. Marcus Thorne',
    tags: ['Vector Extensions', 'Out-of-Order', 'Renaming']
  },
  {
    id: 'res-3',
    category: 'Physical Design',
    title: 'Backside Power Grid Synthesis (BSPDN) under Ultra-Dense Standard Cell Placements',
    summary: 'A formal physical synthesis approach detailing nano-TSV (Through-Silicon Via) pitch rules and backside metal layout optimization to resolve current density electromigration issues.',
    whyItMatters: 'Moves power distribution networks exclusively to the backside of the wafer, freeing up the frontside entirely for high-frequency routing congestion resolution.',
    industryImpact: 'Enables 15% cell density scaling and eliminates IR-drop bottlenecks in sub-2nm digital macro floorplans.',
    difficulty: 'Expert',
    readingTime: '10 min read',
    source: 'International Symposium on Physical Design (ISPD)',
    date: 'June 2026',
    author: 'Elena Rostova',
    tags: ['BSPDN', 'nano-TSV', 'Electromigration']
  },
  {
    id: 'res-4',
    category: 'AI Hardware',
    title: 'Neuromorphic Resistive Random-Access Memory (RRAM) Crossbar Arrays for Edge Models',
    summary: 'Investigating high-precision analog dot-product computing with active noise mitigation. We present feedback amplifier topologies that compensate for memristive resistance drift.',
    whyItMatters: 'Computes matrix operations directly in the analog domain, reducing memory bus transit energy losses by up to 90%.',
    industryImpact: 'Provides zero-latency visual inference pipelines running continuously within 50mW power constraints.',
    difficulty: 'Advanced',
    readingTime: '9 min read',
    source: 'Nature Electronics Insights',
    date: 'April 2026',
    author: 'Dr. Aris Carter',
    tags: ['RRAM Crossbar', 'Analog Computing', 'Neuromorphic']
  },
  {
    id: 'res-5',
    category: 'EDA',
    title: 'Directed Acyclic Graph (DAG) Planners for Multi-Corner Multi-Mode Timing Closure',
    summary: 'Evaluating high-throughput parallel logic synthesis engines that optimize cell sizing and buffer insertion across 64 distinct timing corners simultaneously.',
    whyItMatters: 'Speeds up timing closure synthesis rounds from days to hours by pruning non-critical DAG paths prior to routing.',
    industryImpact: 'Reduces time-to-tapeout margins for large-scale multi-million gate SoC designs by 30%.',
    difficulty: 'Intermediate',
    readingTime: '7 min read',
    source: 'EDA Design Automation Conference (DAC)',
    date: 'March 2026',
    author: 'Akshay Srikrishnan',
    tags: ['DAG Planning', 'Timing Closure', 'SoC Synthesis']
  },
  {
    id: 'res-6',
    category: 'FPGA',
    title: 'Dynamic Partial Reconfiguration of Neural Kernels in Space-Borne FPGA Platforms',
    summary: 'Implementing single-event upset (SEU) hardiness in dynamically reconfigurable fabric tiles. The configuration bitstream is scrubbed continuously via local triple-modular redundancy layers.',
    whyItMatters: 'Permits continuous software updates to machine learning accelerators in orbital environments without resetting the main control core.',
    industryImpact: 'Enhances mission lifetimes of Earth observation nano-satellites through dynamic hardware fault repair.',
    difficulty: 'Advanced',
    readingTime: '11 min read',
    source: 'Military & Aerospace Electronics Forum',
    date: 'May 2026',
    author: 'Capt. Jonathan Vance',
    tags: ['FPGA Reconfig', 'SEU Mitigation', 'Space Electronics']
  },
  {
    id: 'res-7',
    category: 'Embedded',
    title: 'Microsecond Duty-Cycling on Cortex-M Subsystems with Active State Retention',
    summary: 'Describing ultra-low leakage sleep transitions where static RAM blocks are powered with a retention voltage of 0.4V to maintain register contexts.',
    whyItMatters: 'Reduces passive standby current leakage down to 1.2 microamps while allowing sub-10 microsecond wakeups.',
    industryImpact: 'Ideal for bio-telemetry implants and ambient sensor mesh grids running on harvested energy sources.',
    difficulty: 'Intermediate',
    readingTime: '6 min read',
    source: 'Embedded Systems Journal',
    date: 'February 2026',
    author: 'Lina G. S.',
    tags: ['Low Leakage', 'State Retention', 'Duty-Cycling']
  },
  {
    id: 'res-8',
    category: 'Research Papers',
    title: 'An Angstrom-Scale Assessment of High-NA EUV Anamorphic Projection Optics',
    summary: 'A critical review of imaging field magnification imbalances (anamorphic scaling) inside the ASML Twinscan systems, analyzing line-edge roughness limits under extreme UV light.',
    whyItMatters: 'Determines the ultimate physical resolution limit of double-patterning lithography before stochastic defects overwhelm chip yields.',
    industryImpact: 'Guides standard cell library architectures for future 10Å (1nm) and 7Å process node lines.',
    difficulty: 'Expert',
    readingTime: '14 min read',
    source: 'SPIE Lithography Symposium',
    date: 'January 2026',
    author: 'Dr. Evelyn Vance',
    tags: ['High-NA EUV', 'Anamorphic Optics', 'Stochastic Defects']
  },
  {
    id: 'res-9',
    category: 'Industry',
    title: 'GAA-Nanosheet Foundry Alliances and Multi-Sourcing Resiliency Programs',
    summary: 'A strategic policy review of modern fabrication foundry geopolitical clustering and standard design enablement kits bridging N2 and 18A nodes.',
    whyItMatters: 'Assures microarchitecture supply chain resilience by creating interchangeable standard cell layouts across multiple global foundry hubs.',
    industryImpact: 'Protects critical fabless design cycles from localized geographical manufacturing interruptions.',
    difficulty: 'Beginner',
    readingTime: '5 min read',
    source: 'Semiconductor Strategy Quarterly',
    date: 'June 2026',
    author: 'Akshay Srikrishnan',
    tags: ['Foundry Alliance', 'Standard Cells', 'Supply Chain']
  }
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showWeeklyModal, setShowWeeklyModal] = useState<boolean>(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Trigger a subtle animated loading state whenever categories or search query updates
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700); // Premium load duration
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  // Disney Stitch-inspired interactive semiconductor tuner state (Mischief Core Balancer)
  const [mischiefMode, setMischiefMode] = useState<boolean>(true); // Stitch dynamic mode toggle
  const [processNodeSize, setProcessNodeSize] = useState<number>(3); // 2nm, 3nm, 5nm, 7nm
  const [waferVoltage, setWaferVoltage] = useState<number>(0.85); // 0.6V to 1.2V
  const [mischiefOverclock, setMischiefOverclock] = useState<number>(85); // 0% to 150%

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const handleCopyCitation = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter Publications
  const filteredPublications = RESEARCH_FEED.filter(pub => {
    const matchesCategory = activeCategory === 'All' || 
                            pub.category.toLowerCase() === activeCategory.toLowerCase() ||
                            (activeCategory === 'Research Papers' && pub.category === 'Research Papers') ||
                            ((activeCategory === 'Industry' || activeCategory === 'Industry News') && (pub.category === 'Industry' || pub.category === 'Industry News'));
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pub.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pub.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pub.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pub.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Circuit tracing paths for hero background
  const circuitLines = [
    { d: "M 0 100 H 200 L 250 150 H 600 L 650 100 H 1400", duration: 8 },
    { d: "M 100 0 V 150 L 150 200 V 400", duration: 10 },
    { d: "M 800 450 L 900 350 H 1100 L 1150 400 V 600", duration: 12 },
    { d: "M 50 350 H 300 L 350 300 V 100 L 400 50 H 900", duration: 15 },
  ];

  return (
    <div className="relative py-20 min-h-screen overflow-hidden text-slate-100 bg-[#060606] font-sans selection:bg-purple-500/30 selection:text-white" id="research-page">
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
                {/* Delicately scaled Grid pattern overlay representing lithographic step patterns */}
                <pattern id="silicon-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.75" fill="rgba(167, 139, 250, 0.15)" />
                  <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(167, 139, 250, 0.03)" strokeWidth="0.5" />
                  <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(167, 139, 250, 0.03)" strokeWidth="0.5" />
                </pattern>
              </defs>

              {/* Apply grid pattern */}
              <rect width="100%" height="100%" fill="url(#silicon-grid)" />

              {/* Silicon Wafer Outlines (Concentric Circular Tracks & Sector Grids) */}
              <g transform="translate(900, 120)" className="animate-[spin_300s_linear_infinite]" style={{ transformOrigin: 'center center', willChange: 'transform' }}>
                <circle r="120" fill="none" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1.5" strokeDasharray="4,8" />
                <circle r="180" fill="none" stroke="rgba(129, 140, 248, 0.3)" strokeWidth="1" strokeDasharray="30,10,15,10" />
                <circle r="260" fill="none" stroke="rgba(167, 139, 250, 0.2)" strokeWidth="2" strokeDasharray="15,45" />
                <circle r="340" fill="none" stroke="rgba(129, 140, 248, 0.15)" strokeWidth="1.2" />
                {/* Wafer sector/orientation markers */}
                <line x1="0" y1="-360" x2="0" y2="360" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="0.75" strokeDasharray="10,10" />
                <line x1="-360" y1="0" x2="360" y2="0" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="0.75" strokeDasharray="10,10" />
                <line x1="-250" y1="-250" x2="250" y2="250" stroke="rgba(129, 140, 248, 0.1)" strokeWidth="0.5" />
                <line x1="-250" y1="250" x2="250" y2="-250" stroke="rgba(129, 140, 248, 0.1)" strokeWidth="0.5" />
              </g>

              {/* Microchip Outlines & Die layouts */}
              <g transform="translate(180, 70)">
                <rect width="100" height="100" rx="6" fill="none" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1.5" />
                <rect x="8" y="8" width="84" height="84" rx="4" fill="none" stroke="rgba(129, 140, 248, 0.25)" strokeWidth="1" />
                {/* Silicon Core/Die area */}
                <rect x="25" y="25" width="50" height="50" rx="2" fill="rgba(167, 139, 250, 0.05)" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="1" />
                {/* Pins and routing exits */}
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

              {/* Dedicated PCB Traces & Routing Channels with 45-degree physical routing layout rules */}
              <g stroke="rgba(167, 139, 250, 0.15)" strokeWidth="1.5" fill="none">
                {/* Channel A */}
                <path d="M 0 100 H 180 M 180 100 L 220 140 V 280 H 500" />
                {/* Channel B */}
                <path d="M 130 0 V 70 M 280 120 H 420 L 460 160 V 300 H 600" stroke="rgba(129, 140, 248, 0.2)" />
                {/* Channel C */}
                <path d="M 720 280 H 630 L 590 240 V 180 H 450" />
                {/* Channel D */}
                <path d="M 780 280 H 840 L 880 240 V 40" stroke="rgba(129, 140, 248, 0.2)" />
                {/* Channel E (Bus lanes) */}
                <path d="M 400 50 H 650 L 690 90 V 200" strokeWidth="1" strokeDasharray="3,3" />
                <path d="M 400 55 H 648 L 685 92 V 200" strokeWidth="1" strokeDasharray="3,3" />
              </g>

              {/* Signal Pulses - flowing along specific PCB Routing tracks */}
              {/* Pulse 1 on Channel A */}
              <motion.path
                d="M 0 100 H 180 L 220 140 V 280 H 500"
                fill="none"
                stroke="rgba(167, 139, 250, 0.6)"
                strokeWidth="2.5"
                initial={{ pathLength: 0.08, pathOffset: 0 }}
                animate={{ pathOffset: [0, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              />

              {/* Pulse 2 on Channel B */}
              <motion.path
                d="M 280 120 H 420 L 460 160 V 300 H 600"
                fill="none"
                stroke="rgba(129, 140, 248, 0.7)"
                strokeWidth="2"
                initial={{ pathLength: 0.12, pathOffset: 0 }}
                animate={{ pathOffset: [0, 1] }}
                transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 2 }}
              />

              {/* Pulse 3 on Channel C */}
              <motion.path
                d="M 720 280 H 630 L 590 240 V 180 H 450"
                fill="none"
                stroke="rgba(167, 139, 250, 0.6)"
                strokeWidth="2.2"
                initial={{ pathLength: 0.06, pathOffset: 0 }}
                animate={{ pathOffset: [0, 1] }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear", delay: 4 }}
              />

              {/* Pulse 4 on Channel D */}
              <motion.path
                d="M 780 280 H 840 L 880 240 V 40"
                fill="none"
                stroke="rgba(129, 140, 248, 0.8)"
                strokeWidth="2"
                initial={{ pathLength: 0.15, pathOffset: 0 }}
                animate={{ pathOffset: [0, 1] }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear", delay: 1 }}
              />

              {/* Tiny Glowing Nodes (junctions & terminals) */}
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

              {/* Floating Sub-atomic semiconductor particles drifting slowly (highly optimized) */}
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

          {/* Glowing central node widget */}
          <div className="w-full lg:w-96 h-80 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] p-6 relative flex flex-col justify-between overflow-hidden shadow-[0_0_30px_rgba(167,139,250,0.05)]">
            <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-600 font-bold uppercase tracking-wider">
              STITCH-SYS CORE //
            </div>

            {/* Glowing circle node network */}
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

        {/* SECTION 2: TODAY'S HIGHLIGHTS (Four statistics glassmorphism cards with count counters) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="todays-highlights">
          
          {/* Stat 1: New Articles */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ease: [0.2, 0, 0, 1], duration: 0.45, delay: 0.1 }}
            whileHover={shouldReduceMotion ? {} : {
              y: -5,
              scale: 1.015,
              borderColor: 'rgba(167, 139, 250, 0.25)',
              boxShadow: '0 12px 30px rgba(167, 139, 250, 0.04)'
            }}
            className="relative group overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg transition-all duration-300"
          >
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">New Articles</p>
                <h3 className="text-4xl font-extrabold text-white">
                  <AnimatedCounter value={12} />
                </h3>
              </div>
              <div className="rounded-lg p-2.5 bg-purple-500/10 border border-purple-500/20 text-[#a78bfa]">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-[#10b981] font-mono">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+3 since yesterday</span>
            </div>
          </motion.div>

          {/* Stat 2: Research Papers */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ease: [0.2, 0, 0, 1], duration: 0.45, delay: 0.15 }}
            whileHover={shouldReduceMotion ? {} : {
              y: -5,
              scale: 1.015,
              borderColor: 'rgba(167, 139, 250, 0.25)',
              boxShadow: '0 12px 30px rgba(167, 139, 250, 0.04)'
            }}
            className="relative group overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg transition-all duration-300"
          >
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">Research Papers</p>
                <h3 className="text-4xl font-extrabold text-white">
                  <AnimatedCounter value={148} />
                </h3>
              </div>
              <div className="rounded-lg p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span>Active architecture files</span>
            </div>
          </motion.div>

          {/* Stat 3: Industry Updates */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ease: [0.2, 0, 0, 1], duration: 0.45, delay: 0.2 }}
            whileHover={shouldReduceMotion ? {} : {
              y: -5,
              scale: 1.015,
              borderColor: 'rgba(167, 139, 250, 0.25)',
              boxShadow: '0 12px 30px rgba(167, 139, 250, 0.04)'
            }}
            className="relative group overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg transition-all duration-300"
          >
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">Industry Updates</p>
                <h3 className="text-4xl font-extrabold text-white">
                  <AnimatedCounter value={42} />
                </h3>
              </div>
              <div className="rounded-lg p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Activity className="h-5 w-5 animate-pulse" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>100% verified sources</span>
            </div>
          </motion.div>

          {/* Stat 4: Trending Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ease: [0.2, 0, 0, 1], duration: 0.45, delay: 0.25 }}
            whileHover={shouldReduceMotion ? {} : {
              y: -5,
              scale: 1.015,
              borderColor: 'rgba(167, 139, 250, 0.25)',
              boxShadow: '0 12px 30px rgba(167, 139, 250, 0.04)'
            }}
            className="relative group overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg transition-all duration-300"
          >
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-[#a78bfa]/5 rounded-full blur-2xl group-hover:bg-[#a78bfa]/10 transition-colors" />
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">Trending Tech</p>
                <h3 className="text-4xl font-extrabold text-white">
                  <AnimatedCounter value={8} />
                </h3>
              </div>
              <div className="rounded-lg p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-400 font-mono">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>Gained active volume</span>
            </div>
          </motion.div>

        </div>

        {/* SECTION 3: PREMIUM SEARCH & FILTER EXPERIENCE */}
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
            {/* Large Premium Search Bar - positioned ABOVE the chips */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: [0.2, 0, 0, 1], duration: 0.4, delay: 0.3 }}
              className="relative w-full max-w-4xl" 
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
                  placeholder="Search semiconductor news..."
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-4 py-5 text-base md:text-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0"
                />
                {searchQuery && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSearchQuery('')}
                    className="mr-5 px-3 py-1.5 rounded-lg bg-[#151515] hover:bg-[#202020] border border-[rgba(255,255,255,0.06)] font-mono text-xs text-[#a78bfa] transition-all uppercase tracking-wider"
                  >
                    Clear
                  </motion.button>
                )}
                <div className="hidden md:flex items-center gap-1.5 pr-6 font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  <span>SYSTEM_SCAN // ACTIVE</span>
                </div>
              </div>
            </motion.div>

            {/* Google Material Pill-styled Filter Chips with Shared Slide-back Highlight */}
            <div className="flex flex-wrap gap-2.5 pt-2" id="premium-filter-chips">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <motion.button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    whileHover={shouldReduceMotion ? {} : { y: -1, scale: 1.02 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    className={`relative px-5 py-2.5 rounded-full font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 border overflow-hidden ${
                      isSelected 
                        ? 'text-black font-bold border-transparent' 
                        : 'bg-[#0d0d0d] border-[rgba(255,255,255,0.08)] text-slate-400 hover:text-white hover:border-[rgba(255,255,255,0.2)] hover:bg-[#121212]'
                    }`}
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
          </div>
        </div>

        {/* SECTION 4: LATEST RESEARCH FEED (Large vertical list of high-fidelity research cards) */}
        <div className="space-y-6" id="latest-research-feed">
          {/* Shimmer CSS animation definition */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          ` }} />
          
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              // Beautiful Skeleton Cards with animated shimmer
              [1, 2, 3].map((num) => (
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
              ))
            ) : filteredPublications.length > 0 ? (
              filteredPublications.map((pub) => (
                <ResearchCardItem
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
              // Playful Stitch-inspired engineering empty state
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#0c0c0c] p-8 md:p-16 text-center space-y-8 flex flex-col items-center justify-center relative overflow-hidden"
              >
                {/* Embedded custom glow spots */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0284c7]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#ec4899]/5 rounded-full blur-3xl pointer-events-none" />

                {/* Highly-designed abstract engineering vector layout - Stitch aesthetic */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full animate-[pulse_4s_infinite_ease-in-out]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Concentric diagnostic circle tracks */}
                    <circle cx="100" cy="100" r="85" stroke="rgba(2, 132, 199, 0.15)" strokeWidth="1" strokeDasharray="4,8" />
                    <circle cx="100" cy="100" r="65" stroke="rgba(236, 72, 153, 0.1)" strokeWidth="1.5" />
                    
                    {/* Animated central plasma core ring */}
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
                    
                    {/* Playful abstract vector fins/cooling ears nodding to Experiment 626 design */}
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

                    {/* Central capsule core chamber */}
                    <rect x="80" y="80" width="40" height="40" rx="8" fill="#0f172a" stroke="rgba(2, 132, 199, 0.5)" strokeWidth="1.5" />
                    <rect x="87" y="87" width="26" height="26" rx="4" fill="rgba(14, 165, 233, 0.1)" stroke="rgba(236, 72, 153, 0.3)" strokeWidth="1" />
                    
                    {/* Micro signal antennas/lasers */}
                    <line x1="100" y1="45" x2="100" y2="80" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3,3" />
                    <circle cx="100" cy="45" r="3.5" fill="#0ea5e9" />
                    
                    <line x1="100" y1="120" x2="100" y2="155" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="3,3" />
                    <circle cx="100" cy="155" r="3.5" fill="#ec4899" />

                    {/* Laser nodes */}
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

                    {/* Tiny diagnostic specs */}
                    <text x="75" y="115" fill="rgba(14, 165, 233, 0.5)" fontSize="7" fontFamily="monospace" fontWeight="bold">SYS_626</text>
                  </svg>
                </div>

                {/* Typography details */}
                <div className="space-y-2 max-w-md">
                  <h3 className="font-sans text-xl md:text-2xl font-extrabold text-white tracking-tight">
                    No research updates available yet.
                  </h3>
                  <p className="font-sans text-sm text-slate-400 leading-relaxed">
                    The plasma calibration sequence returned zero matching records. Reset the silicon filters to restore normal feed tracking.
                  </p>
                </div>

                {/* Refresh button */}
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

        {/* SECTION 5: TRENDING TECHNOLOGIES (Soft glowing animated chips with details) */}
        <div className="space-y-6" id="trending-technologies">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#a78bfa]">
              // ACTIVE ARCHITECTURE WATCH
            </p>
            <h3 className="font-sans text-2xl font-extrabold text-white mt-1">
              Trending Silicon Innovations
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {TRENDING_TECH.map((tech, idx) => (
              <motion.div 
                key={tech.name}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ease: [0.2, 0, 0, 1], duration: 0.4, delay: 0.1 + idx * 0.05 }}
                whileHover={shouldReduceMotion ? {} : { 
                  y: -4, 
                  scale: 1.02,
                  borderColor: 'rgba(167, 139, 250, 0.3)',
                  boxShadow: '0 8px 20px rgba(167, 139, 250, 0.03)'
                }}
                className="group relative rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] p-4 text-center cursor-help transition-all duration-300"
                title={`${tech.name}: ${tech.desc}`}
              >
                {/* Soft glowing ambient drop */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#a78bfa]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                
                <p className="font-mono text-xs text-[#a78bfa] tracking-wider uppercase mb-1 font-bold">
                  {tech.name}
                </p>
                <span className="rounded bg-[#111] border border-[rgba(255,255,255,0.03)] px-1.5 py-0.5 font-mono text-[9px] text-slate-500 block w-max mx-auto">
                  {tech.status}
                </span>
                <p className="font-sans text-[10px] text-slate-400 leading-normal mt-2 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto overflow-hidden transition-all duration-300">
                  {tech.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 6: WEEKLY DIGEST (Premium summary card & mock generation action) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="weekly-digest">
          
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
                <span className="font-mono text-[10px] text-slate-500">// June Week 4 Summary</span>
              </div>
              
              <h3 className="font-sans text-3xl font-extrabold text-white tracking-tight leading-snug">
                Weekly Architecture & Synthesis Intel Report
              </h3>
              
              <p className="font-sans text-sm text-slate-300 leading-relaxed">
                Our synthesis registers suggest increased focus on sub-2nm vertical cell stacking (GAAFET) and localized heat mitigation profiles. Memory systems have marked High-Bandwidth Memory (HBM4) as the top trending substrate file.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.03)]">
                  <span className="block font-mono text-[9px] text-slate-500 uppercase">Articles Logged</span>
                  <span className="font-mono text-lg font-extrabold text-white block mt-1">
                    <AnimatedCounter value={24} />
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.03)]">
                  <span className="block font-mono text-[9px] text-slate-500 uppercase">Top Category</span>
                  <span className="font-mono text-sm font-extrabold text-[#a78bfa] block mt-1 truncate">RISC-V Core</span>
                </div>
                <div className="p-4 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.03)]">
                  <span className="block font-mono text-[9px] text-slate-500 uppercase">Top Comp. Index</span>
                  <span className="font-mono text-sm font-extrabold text-emerald-400 block mt-1 truncate">TSMC & ASML</span>
                </div>
                <div className="p-4 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.03)]">
                  <span className="block font-mono text-[9px] text-slate-500 uppercase">Active Threads</span>
                  <span className="font-mono text-lg font-extrabold text-amber-400 block mt-1">
                    <AnimatedCounter value={102} />
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-6 mt-4">
              <span className="font-mono text-[10px] text-slate-500 uppercase">
                COMPILED BY OBSIDIAN SILICON HUB
              </span>
              <RippleButton 
                onClick={() => setShowWeeklyModal(true)}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5"
                rippleColor="rgba(255, 255, 255, 0.2)"
              >
                Compile Weekly Summary <Terminal className="h-3.5 w-3.5" />
              </RippleButton>
            </div>
          </motion.div>

          {/* Stitch Physical Wafer Optimizer Component */}
          <WaferOptimizer
            processNodeSize={processNodeSize}
            setProcessNodeSize={setProcessNodeSize}
            waferVoltage={waferVoltage}
            setWaferVoltage={setWaferVoltage}
            mischiefOverclock={mischiefOverclock}
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
                  - Total Active Silicon Files: 148 verified<br />
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
