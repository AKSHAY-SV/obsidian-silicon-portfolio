import React, { useState, useEffect } from 'react';
import { NavTab, Project } from './types';
import { PROJECTS } from './data';
import TopNavBar from './components/TopNavBar';
import Footer from './components/Footer';
import InteractiveHeroCanvas from './components/InteractiveHeroCanvas';
import ProjectsLibrary from './components/ProjectsLibrary';
import DownloadCenter from './components/DownloadCenter';

import About from './components/About';
import Resume from './components/Resume';
import Contact from './components/Contact';
import AccessRequest from './components/AccessRequest';
import SiliconCopilot from './components/copilot/SiliconCopilot';

import WorkstationDashboard from './components/WorkstationDashboard';
import EngineeringRoadmap from './components/EngineeringRoadmap';
import RV32IMShowcase from './components/RV32IMShowcase';
import DesignFlowVisualizer from './components/DesignFlowVisualizer';
import EngineeringToolchain from './components/EngineeringToolchain';

import { motion, AnimatePresence } from 'motion/react';

import {
  Cpu, ArrowUpRight, ShieldCheck, Terminal, Settings2, HelpCircle,
  Award, Briefcase, GraduationCap, Copy, Check, Search, X, Sliders,
  Gauge, Zap, CheckCircle2, AlertCircle, FileText, ChevronRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [simTab, setSimTab] = useState<'pipeline' | 'cache' | 'memory'>('pipeline');
  
  // Overlays State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  // Dynamic config parameters state
  const [clockSpeed, setClockSpeed] = useState<number>(3.2); // GHz
  const [nodeSize, setNodeSize] = useState<string>('7nm FinFET');
  const [voltage, setVoltage] = useState<number>(0.675); // V

  // Dynamic projects list state
  const [projects, setProjects] = useState<Project[]>(PROJECTS);

  useEffect(() => {
    fetch('/projects/projects.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch JSON');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch(err => {
        console.warn('[App] Dynamic projects registry load failed, using fallback:', err);
      });
  }, []);

  // Resume Copy state
  const [resumeCopied, setResumeCopied] = useState(false);

  // CMD+K event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Synchronize visited tabs and search queries to sessionStorage for Copilot Context
  useEffect(() => {
    try {
      const currentPages = JSON.parse(sessionStorage.getItem('silicon_copilot_visited_pages') || '[]');
      if (!currentPages.includes(activeTab)) {
        currentPages.push(activeTab);
        sessionStorage.setItem('silicon_copilot_visited_pages', JSON.stringify(currentPages));
        window.dispatchEvent(new Event('silicon_copilot_sync'));
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeTab]);

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      try {
        const currentSearches = JSON.parse(sessionStorage.getItem('silicon_copilot_searches') || '[]');
        if (!currentSearches.includes(searchQuery.trim())) {
          currentSearches.push(searchQuery.trim());
          sessionStorage.setItem('silicon_copilot_searches', JSON.stringify(currentSearches));
          window.dispatchEvent(new Event('silicon_copilot_sync'));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [searchQuery]);

  const handleCopyResumeText = () => {
    const resumeText = `AKSHAY SRIKRISHNAN - SILICON ARCHITECT & RTL ENGINEER
Email: crazyplayz61@gmail.com
Education: M.S. in Computer Engineering (Specialization: VLSI & Computer Architecture)
Core Competencies: RTL Design, Physical Implementation, Formal Verification, Cache Coherence.
Tapeouts: RV32IM SoC – 5-Stage Pipelined RISC-V Processor (TSMC 7nm), L2 MESI Coherent Cache.`;
    navigator.clipboard.writeText(resumeText);
    setResumeCopied(true);
    setTimeout(() => setResumeCopied(false), 2000);
  };

  const filteredSearchResults = searchQuery.trim() === ''
    ? []
    : projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] bg-semiconductor-grid bg-wafer-rings text-white flex flex-col justify-between selection:bg-[#a78bfa]/30 selection:text-white" id="root-viewport">
      
      {/* Sticky TopNavBar */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchOpen={() => setSearchOpen(true)}
        onSettingsOpen={() => setSettingsOpen(true)}
        onSystemStatusOpen={() => setResumeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.26, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            {/* HOMEPAGE VIEW (Unified Engineering Hub) */}
            {activeTab === 'home' && (
          <div className="relative">
            
            {/* Section 1: Hero Scene */}
            <section className="relative h-[80vh] w-full flex items-center justify-center border-b border-[rgba(255,255,255,0.06)] overflow-hidden" id="hero-section">
              {/* Interactive Vector 3D background */}
              <InteractiveHeroCanvas />

              {/* Radial gradient mask to guarantee flawless typographic contrast */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,10,10,0.2)_0%,rgba(10,10,10,0.85)_100%)] pointer-events-none z-1" />

              {/* Glassmorphic Title overlay card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
              >
                <motion.span
                  initial={{ opacity: 0, letterSpacing: '0.12em' }}
                  animate={{ opacity: 1, letterSpacing: '0.2em' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-[#a78bfa] font-mono text-xs uppercase tracking-[0.2em] mb-5 block font-bold"
                >
                  ⚡ INTEGRATED CIRCUITS & SYSTEMS RESEARCH // v1.0.0
                </motion.span>
                <h1 className="font-sans text-5xl font-black tracking-tight leading-[0.95] text-white sm:text-7xl md:text-8xl uppercase">
                  Akshay Srikrishnan:<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#c084fc] to-[#e879f9]">Architecting Silicon</span>
                </h1>
                <p className="mx-auto mt-8 max-w-2xl font-sans text-base text-slate-300 leading-relaxed">
                  Designing synthesizable micro-architectures, low-latency coherent cache fabrics, high-speed interconnect switches, and automating silicon physical implementation GDS flows.
                </p>
                
                {/* Hero CTAs */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="w-full sm:w-auto rounded-lg bg-[#a78bfa] px-8 py-4 font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#0a0a0a] hover:bg-[#b49dfb] active:scale-95 transition-all shadow-lg shadow-[#a78bfa]/25 duration-200 cursor-pointer"
                  >
                    Explore Architecture
                  </button>
                  <button
                    onClick={() => setActiveTab('about')}
                    className="w-full sm:w-auto rounded-lg border-2 border-[#a78bfa]/80 bg-transparent px-8 py-4 font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#a78bfa] hover:bg-[#a78bfa]/10 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    Meet the Architect
                  </button>
                </div>
              </motion.div>

              {/* Bottom linear trace decorations */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#a78bfa]/30 to-transparent" />
            </section>

            {/* Immersive Workstation Dashboard Panel */}
            <WorkstationDashboard />

            {/* Interactive Engineering Roadmap */}
            <EngineeringRoadmap />

            {/* Flagship RV32IM CPU Showcase */}
            <RV32IMShowcase />

            {/* Automated Design Flow Visualizer */}
            <DesignFlowVisualizer />

            {/* Comprehensive Toolchain Matrix */}
            <EngineeringToolchain />

            {/* Section 3: Featured Project (RV32IM SoC – 5-Stage Pipelined RISC-V Processor) */}
            <section className="py-16 border-b border-[rgba(255,255,255,0.06)]" id="featured-project-showcase">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#a78bfa]">
                  Crown Jewel Showcase
                </span>
                <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  FEATURED WORK: RV32IM SoC – 5-STAGE PIPELINED RISC-V PROCESSOR
                </h2>

                <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 items-center">
                  
                  {/* Left: Text & Specs */}
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="rounded bg-[#a78bfa]/10 border border-[#a78bfa]/20 px-2.5 py-1 font-mono text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
                        TSMC 7NM FINFET PDK
                      </span>
                      <span className="rounded bg-[#10b981]/10 border border-[#10b981]/20 px-2.5 py-1 font-mono text-[10px] uppercase font-bold tracking-wider text-[#10b981]">
                        1.2GHz SIGN-OFF SUCCESS
                      </span>
                    </div>

                    <p className="font-sans text-lg text-slate-300 leading-relaxed">
                      RV32IM SoC is a 5-stage pipelined RISC-V processor co-designed with high-efficiency accelerators, sharing L1/L2 coherent memory caches and communicating via non-blocking AXI4 crossbar interconnect switches.
                    </p>

                    <div className="mt-6 space-y-3.5 font-sans text-sm text-slate-400">
                      <div className="flex justify-between border-b border-[rgba(255,255,255,0.04)] pb-2">
                        <span>Die Package Size:</span>
                        <span className="font-mono text-white font-bold">12.54 mm² core size</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(255,255,255,0.04)] pb-2">
                        <span>Peak Dynamic Power:</span>
                        <span className="font-mono text-[#a78bfa] font-bold">452 mW @ 0.675V supply</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(255,255,255,0.04)] pb-2">
                        <span>Hardware Interfaces:</span>
                        <span className="font-mono text-white font-bold">LPDDR5 PHY, AXI4 Interconnect, JTAG TAP</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('projects')}
                      className="mt-8 flex items-center gap-1.5 rounded-lg bg-[#121212] border border-[rgba(255,255,255,0.1)] px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white hover:border-[#a78bfa]/50 transition-all"
                    >
                      Deep Dive Project Specs <ArrowUpRight className="h-4 w-4 text-[#a78bfa]" />
                    </button>
                  </div>

                  {/* Right: Immersive Render representation */}
                  <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-4 relative overflow-hidden group">
                    <img
                      src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop"
                      alt="SoC Die Layout"
                      referrerPolicy="no-referrer"
                      className="rounded w-full h-80 object-cover opacity-75 grayscale transition-transform duration-500 group-hover:scale-102 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                    
                    {/* Floating label inside image block */}
                    <div className="absolute bottom-6 left-6 font-mono text-xs text-white bg-black/80 px-4 py-2 rounded border border-[rgba(255,255,255,0.08)] flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-[#a78bfa]" /> MAPPED DIE PHOTOMASK
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Section 4: Insights & Research publications */}
            <section className="py-16 border-b border-[rgba(255,255,255,0.06)] bg-[#0c0c0c]" id="insights-research">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#a78bfa] block text-center">
                  Academic Contributions & Notes
                </span>
                <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-white text-center sm:text-4xl">
                  HARDWARE PUBLICATIONS & INSIGHTS
                </h2>

                <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                  
                  {/* Paper 1 */}
                  <div 
                    onClick={() => setActiveTab('downloads')}
                    className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#121212] p-6 flex flex-col justify-between hover:border-[#a78bfa]/40 cursor-pointer hover:bg-[#151515] transition-all"
                  >
                    <div>
                      <span className="font-mono text-[9px] uppercase font-bold text-[#a78bfa]">
                        Research Article / 8-min read
                      </span>
                      <h3 className="mt-2.5 font-sans text-lg font-bold text-white tracking-tight hover:text-[#a78bfa] transition-colors">
                        Dynamic IR-Drop Mitigation on 7nm FinFET Power Meshes
                      </h3>
                      <p className="mt-3 font-sans text-xs text-[#94a3b8] leading-relaxed">
                        Analyzing transient voltage droops on deep sub-micron process nodes and implementing localized decouple capacitor placements adjacent to high-speed arithmetic logical groups.
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.04)] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
                      <span>PUBLISHED: JSSC-2025</span>
                      <span className="text-[#a78bfa] font-bold uppercase flex items-center">
                        Read paper <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>

                  {/* Paper 2 */}
                  <div 
                    onClick={() => setActiveTab('downloads')}
                    className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#121212] p-6 flex flex-col justify-between hover:border-[#a78bfa]/40 cursor-pointer hover:bg-[#151515] transition-all"
                  >
                    <div>
                      <span className="font-mono text-[9px] uppercase font-bold text-[#a78bfa]">
                        System Manual / 12-min read
                      </span>
                      <h3 className="mt-2.5 font-sans text-lg font-bold text-white tracking-tight hover:text-[#a78bfa] transition-colors">
                        Formal Validation of MESI Coherence on Multi-Core Pipelines
                      </h3>
                      <p className="mt-3 font-sans text-xs text-[#94a3b8] leading-relaxed">
                        Proving non-deadlocking coherency transitions under heavy snoop collisions using SystemVerilog Assertions (SVA) co-simulated with SymbiYosys formal model checkers.
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.04)] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
                      <span>PUBLISHED: VLSI-2026</span>
                      <span className="text-[#a78bfa] font-bold uppercase flex items-center">
                        Read paper <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>

                  {/* Paper 3 */}
                  <div 
                    onClick={() => setActiveTab('downloads')}
                    className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#121212] p-6 flex flex-col justify-between hover:border-[#a78bfa]/40 cursor-pointer hover:bg-[#151515] transition-all"
                  >
                    <div>
                      <span className="font-mono text-[9px] uppercase font-bold text-[#a78bfa]">
                        White Paper / 6-min read
                      </span>
                      <h3 className="mt-2.5 font-sans text-lg font-bold text-white tracking-tight hover:text-[#a78bfa] transition-colors">
                        Radix-4 Booth Multipliers for Deep Integer Acceleration
                      </h3>
                      <p className="mt-3 font-sans text-xs text-[#94a3b8] leading-relaxed">
                        Synthesizing parameterized multi-stage Booth encoders, mapping timing slacks, and balancing critical latency pipelines to maximize high-performance computing speeds.
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.04)] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
                      <span>PUBLISHED: IEEE-2025</span>
                      <span className="text-[#a78bfa] font-bold uppercase flex items-center">
                        Read paper <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Section 5: Core Competencies */}
            <section className="py-16" id="core-competencies">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#a78bfa] block">
                  Expertise Matrix
                </span>
                <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  CORE TECHNICAL DISCIPLINES
                </h2>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  
                  {/* Skill Card 1 */}
                  <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#121212] p-5 hover:bg-[#151515] hover:border-[#a78bfa]/20 transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] mb-4">
                      <Terminal className="h-5 w-5" />
                    </div>
                    <h3 className="font-mono text-sm font-bold text-white">
                      RTL Coding & Design
                    </h3>
                    <p className="mt-2 font-sans text-xs text-[#94a3b8] leading-relaxed">
                      Synthesizable hardware descriptions written in SystemVerilog, with deep clock-domain crossings checks and structural multipliers pipelining.
                    </p>
                  </div>

                  {/* Skill Card 2 */}
                  <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#121212] p-5 hover:bg-[#151515] hover:border-[#a78bfa]/20 transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] mb-4">
                      <Settings2 className="h-5 w-5" />
                    </div>
                    <h3 className="font-mono text-sm font-bold text-white">
                      Physical Synthesis (PPA)
                    </h3>
                    <p className="mt-2 font-sans text-xs text-[#94a3b8] leading-relaxed">
                      Managing die floorplanning boundaries, multi-source clock-tree synthesis balancing, metal routing resistance and timing closure STA reports.
                    </p>
                  </div>

                  {/* Skill Card 3 */}
                  <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#121212] p-5 hover:bg-[#151515] hover:border-[#a78bfa]/20 transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] mb-4">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <h3 className="font-mono text-sm font-bold text-white">
                      Computer Architecture
                    </h3>
                    <p className="mt-2 font-sans text-xs text-[#94a3b8] leading-relaxed">
                      Customizing pipelined processors, memory caches coherence topologies, out-of-order execution hazard routing, and AXI4 matrices.
                    </p>
                  </div>

                  {/* Skill Card 4 */}
                  <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#121212] p-5 hover:bg-[#151515] hover:border-[#a78bfa]/20 transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] mb-4">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="font-mono text-sm font-bold text-white">
                      Formal Verification
                    </h3>
                    <p className="mt-2 font-sans text-xs text-[#94a3b8] leading-relaxed">
                      Defining SystemVerilog Assertions (SVA) to secure coherency boundaries, simulated under Cocotb python frameworks and Yosys check engines.
                    </p>
                  </div>

                </div>
              </div>
            </section>

          </div>
        )}

        {/* ABOUT VIEW */}
        {activeTab === 'about' && <About />}

        {/* PROJECTS LIBRARY VIEW */}
        {activeTab === 'projects' && <ProjectsLibrary projects={projects} />}

        {/* DOWNLOAD CENTER VIEW */}
        {activeTab === 'downloads' && (
          <DownloadCenter onRequestAccess={() => setActiveTab('access-request')} />
        )}

        {/* RESUME VIEW */}
        {activeTab === 'resume' && <Resume />}

        {/* CONTACT VIEW */}
        {activeTab === 'contact' && <Contact />}

        {/* ACCESS REQUEST VIEW */}
        {activeTab === 'access-request' && (
          <AccessRequest onReturn={() => setActiveTab('home')} />
        )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer component */}
      <Footer
        setActiveTab={setActiveTab}
        onSystemStatusOpen={() => setResumeOpen(true)}
      />

      {/* OVERLAY 1: CMD+K GLOBAL FUZZY SEARCH MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-lg border border-[rgba(255,255,255,0.15)] bg-[#121212] p-6 shadow-2xl">
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <span className="font-mono text-[9px] uppercase font-bold text-[#a78bfa] tracking-widest block mb-2">
              🔍 Global Schematic Search
            </span>

            <div className="relative flex items-center mb-4">
              <Search className="absolute left-3.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type 'RV32IM', 'RISC-V', or 'ASIC' to filter..."
                className="w-full rounded-md bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] pl-11 pr-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#a78bfa]/50"
              />
            </div>

            {/* List Results */}
            <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-xs">
              {searchQuery.trim() === '' ? (
                <div className="text-center p-6 text-slate-500">
                  <Terminal className="h-6 w-6 text-slate-500 mx-auto mb-2 animate-pulse" />
                  <span>Type to search active registers and micro-cores</span>
                </div>
              ) : filteredSearchResults.length > 0 ? (
                filteredSearchResults.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveTab('projects');
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-3 rounded-lg bg-[#181818] border border-[rgba(255,255,255,0.04)] hover:border-[#a78bfa]/30 transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[#a78bfa] font-bold block">{p.name}</span>
                      <span className="text-slate-400 text-[10px] block mt-0.5">{p.tagline}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#a78bfa]" />
                  </button>
                ))
              ) : (
                <div className="text-center p-6 text-[#ef4444] font-bold">
                  <AlertCircle className="h-6 w-6 text-[#ef4444] mx-auto mb-2" />
                  <span>No matching hardware address resolved in ROM</span>
                </div>
              )}
            </div>

            <div className="mt-4 border-t border-[rgba(255,255,255,0.06)] pt-3 flex justify-between items-center text-[9px] font-mono text-slate-500">
              <span>ESC to dismiss</span>
              <span>Search Database version 1.0.0</span>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 2: HARDWARE SIMULATION SETTINGS MODAL */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-lg border border-[rgba(255,255,255,0.15)] bg-[#121212] p-6 shadow-2xl">
            <button
              onClick={() => setSettingsOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3 mb-5">
              <Sliders className="h-5 w-5 text-[#a78bfa]" />
              <h2 className="font-sans text-base font-extrabold text-white">
                Physical Hardware Parameters
              </h2>
            </div>

            <div className="space-y-5 font-mono text-xs">
              
              {/* Sliders 1: Frequency */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Gauge className="h-4 w-4 text-[#a78bfa]" /> MAPPED CORE FREQUENCY:
                  </span>
                  <span className="text-[#a78bfa] font-bold">{clockSpeed.toFixed(1)} GHz</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.5"
                  step="0.1"
                  value={clockSpeed}
                  onChange={(e) => setClockSpeed(parseFloat(e.target.value))}
                  className="w-full accent-[#a78bfa]"
                />
              </div>

              {/* Sliders 2: Voltage */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Zap className="h-4 w-4 text-[#a78bfa]" /> CORE VDD VOLTAGE RAIL:
                  </span>
                  <span className="text-[#a78bfa] font-bold">{voltage.toFixed(3)} V</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="1.2"
                  step="0.025"
                  value={voltage}
                  onChange={(e) => setVoltage(parseFloat(e.target.value))}
                  className="w-full accent-[#a78bfa]"
                />
              </div>

              {/* Dropdown: Process Node */}
              <div>
                <span className="block text-slate-300 mb-1.5 uppercase font-bold text-[9px]">
                  🔬 Micro-technology PDK Node:
                </span>
                <select
                  value={nodeSize}
                  onChange={(e) => setNodeSize(e.target.value)}
                  className="w-full rounded bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] px-3 py-2 text-white focus:outline-none focus:border-[#a78bfa]/50"
                >
                  <option value="7nm FinFET">TSMC 7nm FinFET PDK (High Performance)</option>
                  <option value="Intel 16">Intel 16nm Tri-Gate (Standard-Core)</option>
                  <option value="22nm FD-SOI">GF 22FDX (Ultra-Low Leakage)</option>
                  <option value="Artix-7 FPGA">Xilinx Artix-7 Segment (Look-up Cells)</option>
                </select>
              </div>

            </div>

            <button
              onClick={() => setSettingsOpen(false)}
              className="w-full mt-6 rounded-lg bg-[#a78bfa] py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-[#0a0a0a] hover:bg-[#bca5ff]"
            >
              Apply Physical Parameters
            </button>
          </div>
        </div>
      )}

      {/* OVERLAY 3: SYSTEM RESUME TERMINAL MODAL */}
      {resumeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-lg border border-[rgba(255,255,255,0.15)] bg-[#121212] p-6 shadow-2xl">
            <button
              onClick={() => setResumeOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3 mb-5">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-[#a78bfa]" />
                <h2 className="font-mono text-sm font-extrabold text-white">
                  akshay_resume_signoff.sh
                </h2>
              </div>

              <button
                onClick={handleCopyResumeText}
                className="flex items-center gap-1 rounded bg-[#1e1e1e] border border-[rgba(255,255,255,0.06)] px-2.5 py-1 font-mono text-[10px] text-[#94a3b8] hover:text-white"
              >
                {resumeCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#10b981]" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy Raw Text
                  </>
                )}
              </button>
            </div>

            {/* Immersive Terminal UI with Resume content */}
            <div className="rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#050505] p-6 font-mono text-xs text-slate-300 leading-relaxed max-h-[28rem] overflow-y-auto space-y-6">
              
              <div className="text-[#a78bfa] font-bold text-sm tracking-tight border-b border-[rgba(167,139,250,0.15)] pb-3 mb-4">
                &gt;&gt;&gt; AKSHAY SRIKRISHNAN - SILICON DESIGN ENGINEER &amp; ARCHITECT
              </div>

              {/* Education section */}
              <div className="space-y-1.5 pl-2 border-l-2 border-[#10b981]/30">
                <span className="text-[#10b981] font-bold flex items-center gap-2 text-xs">
                  <GraduationCap className="h-4 w-4 shrink-0" /> [01] ACADEMIC CREDENTIALS
                </span>
                <div className="pl-6 space-y-1 text-slate-300">
                  <span className="block font-bold text-white">M.S. in Computer Engineering</span>
                  <span className="block text-slate-400">Specialization: VLSI Circuits &amp; Computer Architecture</span>
                  <span className="block text-slate-400">G.P.A: 3.92 / 4.0</span>
                </div>
              </div>

              {/* Past Projects Tapeouts */}
              <div className="space-y-1.5 pl-2 border-l-2 border-[#10b981]/30">
                <span className="text-[#10b981] font-bold flex items-center gap-2 text-xs">
                  <Briefcase className="h-4 w-4 shrink-0" /> [02] RECOGNIZED HARDWARE TAPEOUTS
                </span>
                <div className="pl-6 space-y-2 text-slate-300">
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#10b981] select-none shrink-0">•</span>
                    <span className="block break-words"><strong className="text-white font-semibold">RV32IM SoC – 5-Stage Pipelined RISC-V Processor:</strong> Lead Floorplanner and physical power network router. Mapped using TSMC 7nm technology PDK libraries.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#10b981] select-none shrink-0">•</span>
                    <span className="block break-words"><strong className="text-white font-semibold">RV32IM Core CPU:</strong> Synthesized, verified fully synthesizable Base Integer Integer multiplier core on FPGA targets.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#10b981] select-none shrink-0">•</span>
                    <span className="block break-words"><strong className="text-white font-semibold">Non-Blocking L2 Controller:</strong> Formal validation of MESI states and cachelines.</span>
                  </div>
                </div>
              </div>

              {/* Core Skill competency */}
              <div className="space-y-1.5 pl-2 border-l-2 border-[#10b981]/30">
                <span className="text-[#10b981] font-bold flex items-center gap-2 text-xs">
                  <Award className="h-4 w-4 shrink-0" /> [03] SYNTAX &amp; TOOLCHAIN COMPILING COMPETE
                </span>
                <div className="pl-6 text-slate-400 break-words leading-relaxed">
                  SystemVerilog, Verilog, Chisel, Python (Cocotb), C++ (Verilator compiler models), Cadence Innovus, OpenROAD, OpenSTA, GTKWave waveform tracking.
                </div>
              </div>

            </div>

            <div className="mt-5 text-center">
              <span className="font-mono text-[10px] text-slate-500">
                Secure SHA-256 Signature verified by Akshay Srikrishnan.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Silicon Copilot AI Assistant Flagship Feature */}
      <SiliconCopilot activeTab={activeTab} setActiveTab={setActiveTab} />

    </div>
  );
}
