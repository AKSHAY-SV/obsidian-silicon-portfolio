import React, { useState } from 'react';
import { PROJECTS } from '../data';
import { Project } from '../types';
import { Cpu, ArrowUpRight, ShieldCheck, Cpu as ChipIcon, FileText, Code, CheckCircle, Flame, Layers, Award, RefreshCw, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import RTLExplorer from './RTLExplorer';
import ASICFlow from './ASICFlow';
import SimPipeline from './SimPipeline';
import SimCache from './SimCache';
import SimMemory from './SimMemory';
import RV32IMSoCDetail from './RV32IMSoCDetail';
import EightBitComputerDetail from './EightBitComputerDetail';

export default function ProjectsLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const handleSetActiveProject = (proj: Project | null) => {
    setActiveProject(proj);
    if (proj) {
      sessionStorage.setItem('silicon_copilot_current_project', proj.name);
      try {
        const current = JSON.parse(sessionStorage.getItem('silicon_copilot_opened_projects') || '[]');
        if (!current.includes(proj.name)) {
          current.push(proj.name);
          sessionStorage.setItem('silicon_copilot_opened_projects', JSON.stringify(current));
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      sessionStorage.removeItem('silicon_copilot_current_project');
    }
    window.dispatchEvent(new Event('silicon_copilot_sync'));
  };
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeCycle, setActiveCycle] = useState<number>(2); // Waveform selector

  // Advanced Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTool, setSelectedTool] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'ASIC', 'FPGA', 'Computer Arch', 'Verification'];

  // Helper to resolve project physical parameters for filtering
  const getProjectMeta = (id: string) => {
    switch(id) {
      case 'rv32im-core':
        return { difficulty: 'Advanced', tools: ['Verilator', 'OpenSTA', 'FPGA'], tech: ['RTL', 'FPGA'], frequency: 180, luts: 4280 };
      case 'helios-7-soc':
        return { difficulty: 'Advanced', tools: ['Cadence', 'Synopsys'], tech: ['ASIC', 'RTL'], frequency: 1200, luts: 28000000 };
      case 'axi4-interconnect':
        return { difficulty: 'Advanced', tools: ['ModelSim', 'UVM', 'FPGA'], tech: ['RTL', 'FPGA'], frequency: 350, luts: 8450 };
      case 'l2-cache-controller':
        return { difficulty: 'Advanced', tools: ['ModelSim', 'SymbiYosys'], tech: ['RTL', 'Research'], frequency: 200, luts: 12240 };
      case 'eight-bit-computer':
        return { difficulty: 'Intermediate', tools: ['Vivado', 'XSim'], tech: ['RTL', 'FPGA'], frequency: 50, luts: 342 };
      default:
        return { difficulty: 'Intermediate', tools: [], tech: ['RTL'], frequency: 0, luts: 0 };
    }
  };

  // Filter & Sort Logic
  const filteredProjects = PROJECTS.filter(proj => {
    const meta = getProjectMeta(proj.id);
    
    // Category pill check
    if (selectedCategory !== 'All' && proj.category !== selectedCategory) return false;
    
    // Tech check
    if (selectedTech !== 'All' && !meta.tech.includes(selectedTech)) return false;
    
    // Difficulty check
    if (selectedDifficulty !== 'All' && meta.difficulty !== selectedDifficulty) return false;
    
    // Tool check
    if (selectedTool !== 'All' && !meta.tools.some(t => t.toLowerCase() === selectedTool.toLowerCase())) return false;
    
    // Search query check
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = proj.name.toLowerCase().includes(q);
      const matchTagline = proj.tagline.toLowerCase().includes(q);
      const matchTech = proj.techStack.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchTagline && !matchTech) return false;
    }
    
    return true;
  });

  // Sort Logic
  if (sortBy === 'name') {
    filteredProjects.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'frequency') {
    filteredProjects.sort((a, b) => getProjectMeta(b.id).frequency - getProjectMeta(a.id).frequency);
  } else if (sortBy === 'luts') {
    filteredProjects.sort((a, b) => getProjectMeta(b.id).luts - getProjectMeta(a.id).luts);
  }

  const handleCopyCode = (filename: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // Waveform logic cycles
  const waveformCycles = [0, 1, 2, 3, 4, 5, 6, 7];
  const cycleData = [
    { clk: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], pc: '0x0004', instr: 'ADD R3, R1, R2', forwardA: '00', aluOut: '0x000F', status: 'Instruction fetch complete.' },
    { clk: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], pc: '0x0008', instr: 'SUB R4, R3, R5', forwardA: '10', aluOut: '0x000B', status: 'RAW Hazard detected on R3. Forwarding active from EX/MEM stage.' },
    { clk: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], pc: '0x000C', instr: 'LW R6, 4(R3)',   forwardA: '00', aluOut: '0x0013', status: 'Load instruction accessing Memory Controller.' },
    { clk: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], pc: '0x0010', instr: 'ADD R7, R6, R1', forwardA: '01', aluOut: '0x001E', status: 'Data dependency on load. 1-cycle pipeline stall inserted.' },
    { clk: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], pc: '0x0014', instr: 'SW R7, 8(R0)',   forwardA: '00', aluOut: '0x0008', status: 'Storing computed values back to L1 Cache.' },
    { clk: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], pc: '0x0018', instr: 'BEQ R3, R4, -8',  forwardA: '00', aluOut: '0x0000', status: 'Branch condition evaluation. Branch not taken.' },
    { clk: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], pc: '0x001C', instr: 'OR R8, R1, R2',  forwardA: '00', aluOut: '0x000F', status: 'Logical execution bypass active.' },
    { clk: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], pc: '0x0020', instr: 'XOR R9, R3, R4',  forwardA: '00', aluOut: '0x0004', status: 'Nominal arithmetic pipeline state.' }
  ];

  return (
    <section className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* If no detailed project is open, show the list */}
        {!activeProject ? (
          <div>
            {/* Header */}
            <div className="mb-10 text-center md:text-left">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#a78bfa]">
                Engineering Archive
              </span>
              <h1 className="mt-2 font-sans text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                SILICON DESIGN LIBRARY
              </h1>
              <p className="mt-4 max-w-2xl font-sans text-base text-[#94a3b8]">
                Explore high-performance synthesizable digital structures, parameterized interconnect buses, RISC-V compute cores, and advanced layout metrics.
              </p>
            </div>

            {/* Navigation and Advanced Filters Bar */}
            <div className="mb-8 flex flex-col gap-5 border-b border-[rgba(255,255,255,0.06)] pb-6">
              
              {/* Category Pills & Search Row */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className="relative px-5 py-2 font-sans text-xs font-bold tracking-wide uppercase transition-colors duration-300 rounded-full overflow-hidden"
                      >
                        <span className={`relative z-10 transition-colors duration-300 ${
                          isActive ? 'text-[#0a0a0a]' : 'text-[#94a3b8] hover:text-white'
                        }`}>
                          {cat}
                        </span>
                        {isActive && (
                          <motion.span
                            layoutId="activeCategoryPill"
                            className="absolute inset-0 bg-gradient-to-r from-[#a78bfa] to-[#c084fc] rounded-full shadow-lg shadow-[#a78bfa]/20 z-0"
                            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                          />
                        )}
                        {!isActive && (
                          <span className="absolute inset-0 bg-[#121212] border border-[rgba(255,255,255,0.06)] rounded-full -z-10 hover:bg-[#1a1a1a] transition-colors" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Filter and Search controls */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <input
                      type="text"
                      placeholder="Search architecture database..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#121212] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2 font-mono text-xs text-white focus:outline-none focus:border-[#a78bfa]/50"
                    />
                  </div>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2 rounded-lg border font-mono text-xs uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      showFilters || selectedTech !== 'All' || selectedDifficulty !== 'All' || selectedTool !== 'All' || sortBy !== 'default'
                        ? 'bg-purple-900/20 border-[#a78bfa] text-[#a78bfa]'
                        : 'bg-[#121212] border-[rgba(255,255,255,0.06)] text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚙️ Parameters
                  </button>
                </div>
              </div>

              {/* Collapsible Parameters Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded-xl p-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 font-mono text-[11px] uppercase">
                      
                      {/* Tech Filter */}
                      <div>
                        <span className="text-[#a78bfa] font-bold block mb-2">// Tech Core Target:</span>
                        <select
                          value={selectedTech}
                          onChange={(e) => setSelectedTech(e.target.value)}
                          className="w-full bg-[#121212] border border-[rgba(255,255,255,0.06)] rounded px-3 py-2 text-white focus:outline-none"
                        >
                          <option value="All">All Technologies</option>
                          <option value="RTL">RTL HDL Designs</option>
                          <option value="ASIC">ASIC Signoff</option>
                          <option value="FPGA">FPGA Target Maps</option>
                          <option value="Research">Coherence Research</option>
                        </select>
                      </div>

                      {/* Difficulty */}
                      <div>
                        <span className="text-[#a78bfa] font-bold block mb-2">// Block Complexity:</span>
                        <select
                          value={selectedDifficulty}
                          onChange={(e) => setSelectedDifficulty(e.target.value)}
                          className="w-full bg-[#121212] border border-[rgba(255,255,255,0.06)] rounded px-3 py-2 text-white focus:outline-none"
                        >
                          <option value="All">All Difficulties</option>
                          <option value="Intermediate">Intermediate Blocks</option>
                          <option value="Advanced">Advanced Architectures</option>
                        </select>
                      </div>

                      {/* Tools Used */}
                      <div>
                        <span className="text-[#a78bfa] font-bold block mb-2">// EDA Compiler Tool:</span>
                        <select
                          value={selectedTool}
                          onChange={(e) => setSelectedTool(e.target.value)}
                          className="w-full bg-[#121212] border border-[rgba(255,255,255,0.06)] rounded px-3 py-2 text-white focus:outline-none"
                        >
                          <option value="All">All EDA Systems</option>
                          <option value="Cadence">Cadence Virtuoso/Innovus</option>
                          <option value="Synopsys">Synopsys Design Compiler</option>
                          <option value="Verilator">Verilator C++ Models</option>
                          <option value="ModelSim">ModelSim Wave Simulator</option>
                          <option value="SymbiYosys">SymbiYosys Formal Checker</option>
                          <option value="Vivado">Xilinx Vivado</option>
                        </select>
                      </div>

                      {/* Sorting */}
                      <div>
                        <span className="text-[#a78bfa] font-bold block mb-2">// Order Registers By:</span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full bg-[#121212] border border-[rgba(255,255,255,0.06)] rounded px-3 py-2 text-white focus:outline-none"
                        >
                          <option value="default">Default Address</option>
                          <option value="name">Alphabetical (A-Z)</option>
                          <option value="frequency">Signoff Frequency (Hz)</option>
                          <option value="luts">Logic Density (LUTs / Transistors)</option>
                        </select>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Grid of Projects with Layout Animations */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {filteredProjects.map((proj) => (
                <motion.div
                  layout
                  key={proj.id}
                  onClick={() => handleSetActiveProject(proj)}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] cursor-pointer transition-all duration-500 hover:border-[#a78bfa]/50 hover:shadow-2xl hover:shadow-[#a78bfa]/10 hover:-translate-y-1.5"
                  id={`project-card-${proj.id}`}
                >
                  {/* Image Aspect ratio container */}
                  <div className="relative h-52 w-full overflow-hidden bg-[#181818]">
                    <img
                      src={proj.image}
                      alt={proj.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover opacity-60 grayscale transition-all duration-500 group-hover:scale-105 group-hover:opacity-80 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                    
                    {/* Top Right Badges */}
                    <div className="absolute top-4 left-4 flex gap-1.5">
                      <span className="rounded bg-[#a78bfa]/10 border border-[#a78bfa]/20 px-2.5 py-1 font-mono text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
                        {proj.category}
                      </span>
                    </div>

                    {/* METRICS OVERLAY ON HOVER */}
                    <div className="absolute inset-0 flex flex-col justify-end bg-black/90 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] mb-3">
                        ⚡ TIMING & PHYSICAL SIGN-OFF
                      </span>
                      <div className="grid grid-cols-2 gap-3 text-left">
                        {proj.metrics.lutCount && (
                          <div>
                            <span className="block text-[10px] font-mono text-[#94a3b8] uppercase">Logic Size</span>
                            <span className="font-mono text-sm text-white font-bold">{proj.metrics.lutCount}</span>
                          </div>
                        )}
                        {proj.metrics.timingSlack && (
                          <div>
                            <span className="block text-[10px] font-mono text-[#94a3b8] uppercase">Timing Slack</span>
                            <span className="font-mono text-sm text-[#10b981] font-bold">{proj.metrics.timingSlack}</span>
                          </div>
                        )}
                        {proj.metrics.area && (
                          <div>
                            <span className="block text-[10px] font-mono text-[#94a3b8] uppercase">Silicon Area</span>
                            <span className="font-mono text-sm text-white font-bold">{proj.metrics.area}</span>
                          </div>
                        )}
                        {proj.metrics.frequency && (
                          <div>
                            <span className="block text-[10px] font-mono text-[#94a3b8] uppercase">Signoff Freq</span>
                            <span className="font-mono text-sm text-[#a78bfa] font-bold">{proj.metrics.frequency}</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <span className="font-mono text-xs font-bold text-[#a78bfa]">
                      {proj.name}
                    </span>
                    <h3 className="mt-1 font-sans text-xl font-bold text-white tracking-tight group-hover:text-[#a78bfa] transition-colors">
                      {proj.tagline}
                    </h3>
                    <p className="mt-3 flex-1 font-sans text-sm text-[#94a3b8] line-clamp-3">
                      {proj.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {proj.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-[#1a1a1a] border border-[rgba(255,255,255,0.06)] px-2 py-0.5 font-mono text-[10px] text-[#94a3b8]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[rgba(255,255,255,0.06)] pt-4">
                      <span className="font-mono text-[10px] uppercase text-[#94a3b8] flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#10b981]" /> PPA Mapped
                      </span>
                      <span className="font-sans text-xs font-bold text-[#a78bfa] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Detailed Specs <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : activeProject.id === 'rv32im-core' ? (
          <RV32IMSoCDetail onClose={() => handleSetActiveProject(null)} />
        ) : activeProject.id === 'eight-bit-computer' ? (
          <EightBitComputerDetail onClose={() => handleSetActiveProject(null)} />
        ) : (
          // Detailed Project View
          <div className="animate-in fade-in duration-300">
            {/* Back Button */}
            <button
              onClick={() => handleSetActiveProject(null)}
              className="mb-8 flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#121212] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#94a3b8] hover:bg-[#1a1a1a] hover:text-white transition-all"
            >
              ← Return to Library
            </button>

            {/* Project Header Banner */}
            <div className="relative mb-10 overflow-hidden rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-8 md:p-12">
              <div className="absolute right-0 top-0 h-full w-1/3 opacity-15 pointer-events-none">
                <img
                  src={activeProject.image}
                  alt={activeProject.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover grayscale"
                />
              </div>
              <div className="max-w-3xl">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="rounded bg-[#a78bfa]/10 border border-[#a78bfa]/20 px-2.5 py-0.5 font-mono text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
                    {activeProject.category}
                  </span>
                  <span className="rounded bg-[#10b981]/10 border border-[#10b981]/20 px-2.5 py-0.5 font-mono text-[10px] uppercase font-bold tracking-wider text-[#10b981]">
                    Tapeout-Ready Verified
                  </span>
                </div>
                <h1 className="font-mono text-3xl font-extrabold text-[#a78bfa] tracking-tight sm:text-4xl">
                  {activeProject.name}
                </h1>
                <p className="mt-2 font-sans text-xl font-bold text-white tracking-tight leading-snug">
                  {activeProject.tagline}
                </p>
                <p className="mt-4 font-sans text-base text-[#94a3b8] leading-relaxed">
                  {activeProject.description}
                </p>
              </div>
            </div>

            {/* Split layout: Section 1 (Architecture Specs & Vector Diagram) */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-10">
              
              {/* Left Column: Tech Specs Card */}
              <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <ChipIcon className="h-5 w-5 text-[#a78bfa]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    Hardware Specifications Matrix
                  </span>
                </div>
                <div className="divide-y divide-[rgba(255,255,255,0.06)]">
                  {activeProject.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex justify-between py-3">
                      <span className="font-sans text-sm text-[#94a3b8]">{spec.label}</span>
                      <span className="font-mono text-sm text-white font-bold text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded border border-[rgba(255,255,255,0.06)] bg-[#181818] p-4">
                  <span className="block font-mono text-[10px] text-[#a78bfa] uppercase font-semibold mb-2">
                    ⚡ Physical Verification Metrics
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-sans text-[#94a3b8]">Est. Gate Area:</span>
                      <span className="font-mono text-sm text-white font-bold">{activeProject.metrics.area || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-sans text-[#94a3b8]">Dynamic Power:</span>
                      <span className="font-mono text-sm text-white font-bold">{activeProject.metrics.power || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Architectural Vector Diagram (Custom SVG Mocked Schematic) */}
              <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6 flex flex-col justify-between">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Layers className="h-4.5 w-4.5 text-[#a78bfa]" /> RTL Schematic Interconnect
                    </span>
                    <span className="rounded bg-[#1a1a1a] px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#a78bfa] border border-[rgba(255,255,255,0.06)]">
                      interactive
                    </span>
                  </div>
                  
                  {/* Dynamic SVG Drawing */}
                  <div className="relative flex h-64 items-center justify-center rounded border border-[rgba(255,255,255,0.06)] bg-[#0c0c0c] p-4 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 400 240">
                      {/* Grid background inside svg */}
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />

                      {/* Bus Interconnect System */}
                      <path d="M 40 120 L 360 120" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="3" strokeDasharray="5,5" className="animate-pulse" />
                      
                      {/* Block A: CPU Core */}
                      <g className="hover:scale-105 origin-center transition-transform cursor-pointer">
                        <rect x="40" y="40" width="80" height="60" rx="4" fill="#181818" stroke="#a78bfa" strokeWidth="1.2" />
                        <text x="80" y="65" fill="#a78bfa" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">CPU_CORE</text>
                        <text x="80" y="80" fill="#94a3b8" fontSize="8" fontFamily="sans-serif" textAnchor="middle">RV32IM_I</text>
                      </g>

                      {/* Block B: L1 Cache */}
                      <g className="hover:scale-105 origin-center transition-transform cursor-pointer">
                        <rect x="160" y="40" width="80" height="60" rx="4" fill="#181818" stroke="#10b981" strokeWidth="1.2" />
                        <text x="200" y="65" fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L1_CACHE</text>
                        <text x="200" y="80" fill="#94a3b8" fontSize="8" fontFamily="sans-serif" textAnchor="middle">Dual-Ported</text>
                      </g>

                      {/* Block C: Coherency L2 */}
                      <g className="hover:scale-105 origin-center transition-transform cursor-pointer">
                        <rect x="280" y="40" width="80" height="60" rx="4" fill="#181818" stroke="#f59e0b" strokeWidth="1.2" />
                        <text x="320" y="65" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L2_CONTROLLER</text>
                        <text x="320" y="80" fill="#94a3b8" fontSize="8" fontFamily="sans-serif" textAnchor="middle">MESI State</text>
                      </g>

                      {/* Block D: AXI4 Interconnect Switch */}
                      <rect x="60" y="150" width="280" height="50" rx="4" fill="#121212" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      <text x="200" y="175" fill="white" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">AXI4_NON_BLOCKING_MATRIX</text>
                      <text x="200" y="190" fill="#94a3b8" fontSize="8" fontFamily="sans-serif" textAnchor="middle">4x4 Concurrent Paths</text>

                      {/* Connection wires */}
                      <line x1="80" y1="100" x2="80" y2="150" stroke="#a78bfa" strokeWidth="1" />
                      <line x1="200" y1="100" x2="200" y2="150" stroke="#10b981" strokeWidth="1" />
                      <line x1="320" y1="100" x2="320" y2="150" stroke="#f59e0b" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 font-sans text-xs text-[#94a3b8] flex items-center justify-between">
                  <span>Hover blocks to review micro-architectural boundaries</span>
                  <span className="text-[#a78bfa] font-mono">CLOCK: ACTIVE</span>
                </div>
              </div>

            </div>

            {/* Section 2: Challenges and Solutions Comparison Block */}
            <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6 mb-10">
              <div className="mb-6 flex items-center gap-2">
                <Flame className="h-5 w-5 text-[#ef4444]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  Design Challenges & Physical Bottlenecks Mapped
                </span>
              </div>
              <div className="space-y-6">
                {activeProject.challenges.map((chal, cIdx) => (
                  <div key={cIdx} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded border border-[rgba(255,255,255,0.04)] bg-[#161616]">
                    <div>
                      <span className="rounded bg-[#ef4444]/10 border border-[#ef4444]/20 px-2 py-0.5 font-mono text-[9px] uppercase font-bold text-[#ef4444]">
                        Physical/Timing Obstacle
                      </span>
                      <p className="mt-2.5 font-sans text-sm text-[#e2e8f0] leading-relaxed">
                        {chal.problem}
                      </p>
                    </div>
                    <div>
                      <span className="rounded bg-[#10b981]/10 border border-[#10b981]/20 px-2 py-0.5 font-mono text-[9px] uppercase font-bold text-[#10b981]">
                        Adopted RTL Solution
                      </span>
                      <p className="mt-2.5 font-sans text-sm text-[#94a3b8] leading-relaxed">
                        {chal.solution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Interactive Signal Trace (Logic Analyzer Simulator!) */}
            <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6 mb-10">
              <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <RefreshCw className="h-4.5 w-4.5 text-[#a78bfa] animate-spin-slow" /> Interactive Signal Waveform Analyzer
                  </span>
                  <p className="font-sans text-xs text-[#94a3b8] mt-1">
                    Simulate logic hazard bypassing and register states. Select cycle states below to inspect live logic.
                  </p>
                </div>
                
                {/* Cycles menu */}
                <div className="flex gap-1">
                  {waveformCycles.map((cy) => (
                    <button
                      key={cy}
                      onClick={() => setActiveCycle(cy)}
                      className={`h-7 w-12 rounded font-mono text-xs font-bold transition-all ${
                        activeCycle === cy
                          ? 'bg-[#a78bfa] text-[#0a0a0a]'
                          : 'bg-[#181818] text-[#94a3b8] border border-[rgba(255,255,255,0.06)] hover:bg-[#1e1e1e]'
                      }`}
                    >
                      CY_{cy}
                    </button>
                  ))}
                </div>
              </div>

              {/* Waveform Canvas-Style Output */}
              <div className="rounded border border-[rgba(255,255,255,0.06)] bg-[#0a0a0a] p-5 font-mono text-xs">
                {/* CLK Wave */}
                <div className="flex items-center h-10 border-b border-[rgba(255,255,255,0.03)]">
                  <span className="w-28 font-mono text-xs text-[#94a3b8] font-bold">clk</span>
                  <div className="flex-1 flex items-center">
                    {waveformCycles.map((cy) => (
                      <div key={cy} className="flex-1 flex flex-col relative">
                        {/* Clock cycle square wave */}
                        <svg className="w-full h-8" viewBox="0 0 100 30">
                          <path d="M 0 25 L 25 25 L 25 5 L 75 5 L 75 25 L 100 25" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
                        </svg>
                        {activeCycle === cy && (
                          <div className="absolute inset-0 bg-[#a78bfa]/10 border-l border-r border-[#a78bfa]/30" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* PC Wave */}
                <div className="flex items-center h-10 border-b border-[rgba(255,255,255,0.03)]">
                  <span className="w-28 font-mono text-xs text-[#94a3b8] font-bold">pc[31:0]</span>
                  <div className="flex-1 flex">
                    {waveformCycles.map((cy) => (
                      <div key={cy} className="flex-1 text-center py-2 border-r border-[rgba(255,255,255,0.04)] relative">
                        <span className={`text-[10px] ${activeCycle === cy ? 'text-[#a78bfa] font-bold' : 'text-[#64748b]'}`}>
                          {cycleData[cy].pc}
                        </span>
                        {activeCycle === cy && (
                          <div className="absolute inset-0 bg-[#a78bfa]/10" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* INSTR Wave */}
                <div className="flex items-center h-10 border-b border-[rgba(255,255,255,0.03)]">
                  <span className="w-28 font-mono text-xs text-[#94a3b8] font-bold">instruction</span>
                  <div className="flex-1 flex">
                    {waveformCycles.map((cy) => (
                      <div key={cy} className="flex-1 text-center py-2 border-r border-[rgba(255,255,255,0.04)] relative overflow-hidden text-ellipsis whitespace-nowrap">
                        <span className={`text-[9px] ${activeCycle === cy ? 'text-[#a78bfa] font-bold' : 'text-[#64748b]'}`}>
                          {cycleData[cy].instr}
                        </span>
                        {activeCycle === cy && (
                          <div className="absolute inset-0 bg-[#a78bfa]/10" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Forwarding A Mode */}
                <div className="flex items-center h-10 border-b border-[rgba(255,255,255,0.03)]">
                  <span className="w-28 font-mono text-xs text-[#a78bfa] font-bold">forward_a[1:0]</span>
                  <div className="flex-1 flex">
                    {waveformCycles.map((cy) => (
                      <div key={cy} className="flex-1 text-center py-2 border-r border-[rgba(255,255,255,0.04)] relative">
                        <span className={`text-[10px] font-bold ${cycleData[cy].forwardA !== '00' ? 'text-[#10b981]' : 'text-[#64748b]'}`}>
                          {cycleData[cy].forwardA}
                        </span>
                        {activeCycle === cy && (
                          <div className="absolute inset-0 bg-[#a78bfa]/10" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ALU Out Value */}
                <div className="flex items-center h-10">
                  <span className="w-28 font-mono text-xs text-[#94a3b8] font-bold">alu_out[31:0]</span>
                  <div className="flex-1 flex">
                    {waveformCycles.map((cy) => (
                      <div key={cy} className="flex-1 text-center py-2 border-r border-[rgba(255,255,255,0.04)] relative">
                        <span className={`text-[10px] ${activeCycle === cy ? 'text-[#10b981] font-bold' : 'text-[#64748b]'}`}>
                          {cycleData[cy].aluOut}
                        </span>
                        {activeCycle === cy && (
                          <div className="absolute inset-0 bg-[#a78bfa]/10" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Simulation explanation panel */}
              <div className="mt-4 rounded bg-[#181818] border border-[rgba(255,255,255,0.04)] p-4 font-sans text-sm">
                <span className="block font-mono text-[10px] uppercase font-bold text-[#a78bfa]">
                  🎯 Logic Waveform Analysis & Pipeline Co-Simulation State
                </span>
                <p className="mt-1 text-white font-medium">
                  {cycleData[activeCycle].status}
                </p>
              </div>
            </div>

            {/* Section 4: RTL Snippets with Code Blocks and tabs */}
            <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Code className="h-4.5 w-4.5 text-[#a78bfa]" /> Synthesizable Hardware Codebase Snippets
                </span>
                <span className="font-sans text-xs text-[#94a3b8]">
                  Fully compliant synthesizable Verilog modules
                </span>
              </div>

              <div className="space-y-6">
                {activeProject.files.map((file, fIdx) => (
                  <div key={fIdx} className="rounded border border-[rgba(255,255,255,0.06)] bg-[#0c0c0c] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-[#161616] px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)]">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#94a3b8]" />
                        <span className="font-mono text-xs text-white font-bold">{file.name}</span>
                        <span className="font-mono text-[10px] text-[#64748b]">({file.size})</span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(file.name, file.content)}
                        className="flex items-center gap-1.5 rounded bg-[#242424] px-2.5 py-1 font-mono text-[10px] text-[#94a3b8] hover:bg-[#303030] hover:text-white transition-all active:scale-95"
                      >
                        {copiedFile === file.name ? (
                          <>
                            <Check className="h-3 w-3 text-[#10b981]" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Copy RTL
                          </>
                        )}
                      </button>
                    </div>

                    {/* Preformated text */}
                    <pre className="p-4 overflow-x-auto font-mono text-xs text-[#a78bfa]/95 leading-relaxed bg-[#0a0a0a] max-h-96">
                      <code>{file.content}</code>
                    </pre>
                  </div>
                ))}
              </div>

            </div>

            {/* Section 5: Embed Live Logic Laboratory */}
            <div className="mt-10 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
              <div className="mb-6">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block">
                  ⚡ LIVE LOGIC LABORATORY &amp; INTERACTIVE SIMULATOR
                </span>
                <p className="font-sans text-xs text-[#94a3b8] mt-1">
                  Interact with the synthesizable digital core and trace simulation cycles in real-time.
                </p>
              </div>

              <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0a0a0a] p-4">
                {activeProject.id === 'rv32im-core' && (
                  <div className="space-y-6">
                    <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
                      <span className="font-mono text-xs text-white block font-bold mb-1">// Pipeline Stage Sandbox</span>
                      <p className="text-xs text-slate-400 font-sans">Simulate active registers, bypass hazards, and trace dynamic Instructions-Per-Cycle (IPC) clocks below.</p>
                    </div>
                    <SimPipeline />
                    <div className="border-t border-[rgba(255,255,255,0.06)] pt-6">
                      <span className="font-mono text-xs text-white block font-bold mb-1">// Register Files &amp; Verilog Code Explorer</span>
                      <p className="text-xs text-slate-400 font-sans mb-4">Read active Verilog files and trace electrical pin behaviors across standard operations.</p>
                      <RTLExplorer />
                    </div>
                  </div>
                )}
                {activeProject.id === 'helios-7-soc' && (
                  <div className="space-y-4">
                    <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
                      <span className="font-mono text-xs text-white block font-bold mb-1">// ASIC Physical Backend Synthesis pipeline</span>
                      <p className="text-xs text-slate-400 font-sans">Walk through physical synthesis steps from high-level Verilog to physical GDSII layout signoffs.</p>
                    </div>
                    <ASICFlow />
                  </div>
                )}
                {activeProject.id === 'l2-cache-controller' && (
                  <div className="space-y-4">
                    <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
                      <span className="font-mono text-xs text-white block font-bold mb-1">// MESI Coherent Multi-Core cache simulator</span>
                      <p className="text-xs text-slate-400 font-sans">Trigger reads, writes, and invalidates, and watch multi-cluster state flags transition interactively.</p>
                    </div>
                    <SimCache />
                  </div>
                )}
                {activeProject.id === 'axi4-interconnect' && (
                  <div className="space-y-4">
                    <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
                      <span className="font-mono text-xs text-white block font-bold mb-1">// Parameters &amp; Memory Map crossbar simulator</span>
                      <p className="text-xs text-slate-400 font-sans">Route out-of-order burst commands and balance queue transactions on a concurrent arbitration grid.</p>
                    </div>
                    <SimMemory />
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
