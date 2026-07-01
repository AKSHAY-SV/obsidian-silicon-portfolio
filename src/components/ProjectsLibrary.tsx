import React, { useState } from 'react';
import { PROJECTS } from '../data';
import { Project } from '../types';
import { 
  Cpu, ArrowUpRight, ShieldCheck, Cpu as ChipIcon, FileText, Code, CheckCircle, 
  Flame, Layers, Award, RefreshCw, Copy, Check, Folder, FolderOpen, Terminal, 
  Github, Search, SlidersHorizontal, ChevronDown, ChevronRight, Activity, Zap, 
  Calendar, GitBranch, Shield, Filter, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import RTLExplorer from './RTLExplorer';
import ASICFlow from './ASICFlow';
import SimPipeline from './SimPipeline';
import SimCache from './SimCache';
import SimMemory from './SimMemory';
import RV32IMSoCDetail from './RV32IMSoCDetail';
import EightBitComputerDetail from './EightBitComputerDetail';
import ProjectWorkspace from './ProjectWorkspace';

interface ProjectMeta {
  difficulty: 'Advanced' | 'Intermediate';
  status: 'Completed' | 'In Progress';
  completionDate: string;
  completionDisplay: string;
  primaryLanguage: string;
  complexityScore: number;
  domains: string[];
  quickTags: string[];
  githubUrl: string;
}

export let globalProjectsCache: any[] = [];

export const getProjectMetadata = (id: string): ProjectMeta => {
  const proj = globalProjectsCache.find(p => p.id === id);
  if (proj) {
    return {
      difficulty: proj.difficulty || 'Intermediate',
      status: proj.status || 'Completed',
      completionDate: proj.completionDate || '2026-01',
      completionDisplay: proj.completionDisplay || 'Jan 2026',
      primaryLanguage: proj.primaryLanguage || proj.techStack?.[0] || 'SystemVerilog',
      complexityScore: proj.complexityScore || 80,
      domains: proj.domains || ['RTL Design'],
      quickTags: proj.quickTags || proj.techStack?.slice(0, 3) || [],
      githubUrl: proj.githubUrl || 'https://github.com/google-deepmind',
    };
  }

  // Fallback map for local/bootstrapping safety
  const fallbackMap: Record<string, ProjectMeta> = {
    'rv32im-core': {
      difficulty: 'Advanced',
      status: 'Completed',
      completionDate: '2026-01',
      completionDisplay: 'Jan 2026',
      primaryLanguage: 'SystemVerilog',
      complexityScore: 92,
      domains: ['Computer Architecture', 'RTL Design', 'FPGA', 'Verification'],
      quickTags: ['RISC-V', '5-Stage', 'Bypass Matrix'],
      githubUrl: 'https://github.com/google-deepmind/rv32im-processor',
    },
    'rv32im-soc-processor': {
      difficulty: 'Advanced',
      status: 'Completed',
      completionDate: '2026-05',
      completionDisplay: 'May 2026',
      primaryLanguage: 'Chisel',
      complexityScore: 98,
      domains: ['Computer Architecture', 'RTL Design', 'ASIC Design', 'Physical Design'],
      quickTags: ['7nm FinFET', 'RISC-V', '5-Stage Pipelined'],
      githubUrl: 'https://github.com/google-deepmind/rv32im-soc-processor',
    },
    'axi4-interconnect': {
      difficulty: 'Advanced',
      status: 'Completed',
      completionDate: '2026-03',
      completionDisplay: 'Mar 2026',
      primaryLanguage: 'SystemVerilog',
      complexityScore: 88,
      domains: ['Computer Architecture', 'RTL Design', 'ASIC Design', 'Verification'],
      quickTags: ['AXI4', 'Non-blocking Switch', 'Credit-flow'],
      githubUrl: 'https://github.com/google-deepmind/axi4-crossbar',
    },
    'l2-cache-controller': {
      difficulty: 'Advanced',
      status: 'Completed',
      completionDate: '2025-11',
      completionDisplay: 'Nov 2025',
      primaryLanguage: 'SystemVerilog',
      complexityScore: 85,
      domains: ['Computer Architecture', 'RTL Design', 'Verification'],
      quickTags: ['MESI Coherence', 'Pseudo-LRU', 'Snoop Buffer'],
      githubUrl: 'https://github.com/google-deepmind/l2-cache-system',
    },
    'eight-bit-computer': {
      difficulty: 'Intermediate',
      status: 'In Progress',
      completionDate: '2026-06',
      completionDisplay: 'Jun 2026',
      primaryLanguage: 'Verilog',
      complexityScore: 65,
      domains: ['Computer Architecture', 'RTL Design', 'FPGA', 'Embedded Systems'],
      quickTags: ['von Neumann', '8-bit Bus', 'Microprogrammed CU'],
      githubUrl: 'https://github.com/google-deepmind/8-bit-computer',
    },
  };

  return fallbackMap[id] || {
    difficulty: 'Intermediate',
    status: 'Completed',
    completionDate: '2026-01',
    completionDisplay: 'Jan 2026',
    primaryLanguage: 'Verilog',
    complexityScore: 50,
    domains: ['RTL Design'],
    quickTags: ['Digital Core'],
    githubUrl: 'https://github.com/google-deepmind',
  };
};

const DOMAINS = [
  'Computer Architecture',
  'RTL Design',
  'ASIC Design',
  'Physical Design',
  'FPGA',
  'Embedded Systems',
  'Verification'
];

interface ProjectsLibraryProps {
  projects?: Project[];
}

export default function ProjectsLibrary({ projects }: ProjectsLibraryProps = {}) {
  const [projectsList, setProjectsList] = useState<Project[]>(projects || PROJECTS);

  React.useEffect(() => {
    if (projects && projects.length > 0) {
      setProjectsList(projects);
      globalProjectsCache = projects;
    } else {
      fetch('/projects/projects.json')
        .then(res => {
          if (!res.ok) throw new Error('Failed to load JSON');
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setProjectsList(data);
            globalProjectsCache = data;
          }
        })
        .catch(err => {
          console.warn('[ProjectsLibrary] Fallback to embedded PROJECTS due to fetch error:', err);
          setProjectsList(PROJECTS);
          globalProjectsCache = PROJECTS;
        });
    }
  }, [projects]);

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
  const [activeFilter, setActiveFilter] = useState('All'); // All, RTL, ASIC, FPGA, Embedded, Completed, In Progress
  const [sortBy, setSortBy] = useState<'Newest' | 'Most Complex' | 'Featured'>('Featured');

  // Collapsible state for domains
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({
    'Computer Architecture': true,
    'RTL Design': true,
    'ASIC Design': true,
    'Physical Design': false,
    'FPGA': false,
    'Embedded Systems': false,
    'Verification': false,
  });

  const toggleDomain = (domain: string) => {
    setExpandedDomains(prev => ({
      ...prev,
      [domain]: !prev[domain]
    }));
  };

  const toggleAllDomains = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    DOMAINS.forEach(d => {
      next[d] = expand;
    });
    setExpandedDomains(next);
  };

  const filters = [
    'All',
    'RTL',
    'ASIC',
    'FPGA',
    'Embedded',
    'Completed',
    'In Progress'
  ];

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

  // Helper to filter and sort
  const sortProjects = (projectsList: Project[]) => {
    const list = [...projectsList];
    if (sortBy === 'Newest') {
      return list.sort((a, b) => {
        const metaA = getProjectMetadata(a.id);
        const metaB = getProjectMetadata(b.id);
        return metaB.completionDate.localeCompare(metaA.completionDate);
      });
    } else if (sortBy === 'Most Complex') {
      return list.sort((a, b) => {
        const metaA = getProjectMetadata(a.id);
        const metaB = getProjectMetadata(b.id);
        return metaB.complexityScore - metaA.complexityScore;
      });
    } else {
      // Featured
      const featuredOrder = ['rv32im-soc-processor', 'rv32im-core', 'axi4-interconnect', 'l2-cache-controller', 'eight-bit-computer'];
      return list.sort((a, b) => {
        const idxA = featuredOrder.indexOf(a.id);
        const idxB = featuredOrder.indexOf(b.id);
        return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
      });
    }
  };

  const filteredAndSortedProjects = sortProjects(
    projectsList.filter((proj) => {
      const meta = getProjectMetadata(proj.id);

      // Apply Filter Pill
      if (activeFilter === 'RTL') {
        if (!meta.domains.includes('RTL Design')) return false;
      } else if (activeFilter === 'ASIC') {
        if (!meta.domains.includes('ASIC Design')) return false;
      } else if (activeFilter === 'FPGA') {
        if (!meta.domains.includes('FPGA')) return false;
      } else if (activeFilter === 'Embedded') {
        if (!meta.domains.includes('Embedded Systems')) return false;
      } else if (activeFilter === 'Completed') {
        if (meta.status !== 'Completed') return false;
      } else if (activeFilter === 'In Progress') {
        if (meta.status !== 'In Progress') return false;
      }

      // Apply Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = proj.name.toLowerCase().includes(query);
        const matchTagline = proj.tagline.toLowerCase().includes(query);
        const matchTech = proj.techStack.some((t) => t.toLowerCase().includes(query));
        const matchLang = meta.primaryLanguage.toLowerCase().includes(query);
        const matchDomains = meta.domains.some((d) => d.toLowerCase().includes(query));

        if (!matchName && !matchTagline && !matchTech && !matchLang && !matchDomains) {
          return false;
        }
      }

      return true;
    })
  );

  const projectsInDomain = (domain: string) => {
    return filteredAndSortedProjects.filter((proj) => {
      const meta = getProjectMetadata(proj.id);
      return meta.domains.includes(domain);
    });
  };

  // Count active domains
  const activeDomainsCount = DOMAINS.filter(d => projectsInDomain(d).length > 0).length;

  return (
    <section className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* If no detailed project is open, show the list */}
        <AnimatePresence mode="wait">
          {!activeProject ? (
            <motion.div
              key="archive-list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {/* Header */}
            <div className="mb-10 text-center md:text-left">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#a78bfa] border-b border-[#a78bfa]/20 pb-1">
                SYSTEMS ARCHIVE // INTERNAL REPOSITORIES
              </span>
              <h1 className="mt-3 font-mono text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                SILICON DESIGN DATABASE
              </h1>
              <p className="mt-3 max-w-2xl font-sans text-sm text-[#94a3b8] leading-relaxed">
                Authorized hardware codebase directory containing synthesizable RTL cores, memory subsystems, physical backend layout signoffs, and functional verification fixtures.
              </p>
            </div>

            {/* Filter and Search controls */}
            <div className="mb-8 flex flex-col gap-4 bg-[#0a0a0c]/80 border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-xl backdrop-blur-md">
              
              {/* Search Row & Sort Selector */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                    <Search className="h-4 w-4 text-[#a78bfa]/60" />
                  </div>
                  <input
                    type="text"
                    placeholder="Filter by register name, language, technology stack..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-lg pl-10 pr-4 py-2.5 font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#a78bfa]/50 focus:ring-1 focus:ring-[#a78bfa]/20 transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-3 flex items-center text-xs text-slate-500 hover:text-white font-mono"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                {/* Sorting and Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-lg p-1">
                    <span className="font-mono text-[10px] text-slate-500 uppercase px-2">// SORT:</span>
                    {(['Featured', 'Newest', 'Most Complex'] as const).map((mode) => {
                      const active = sortBy === mode;
                      return (
                        <button
                          key={mode}
                          onClick={() => setSortBy(mode)}
                          className={`px-3 py-1.5 rounded font-mono text-[10px] font-bold uppercase transition-all ${
                            active 
                              ? 'bg-[#a78bfa]/10 text-[#a78bfa] border border-[#a78bfa]/30' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {mode}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-1 bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-lg p-1">
                    <button
                      onClick={() => toggleAllDomains(true)}
                      className="px-2.5 py-1.5 rounded font-mono text-[9px] font-bold uppercase text-slate-400 hover:text-white transition-all"
                      title="Expand All Domains"
                    >
                      Expand All
                    </button>
                    <span className="text-slate-700 self-center">|</span>
                    <button
                      onClick={() => toggleAllDomains(false)}
                      className="px-2.5 py-1.5 rounded font-mono text-[9px] font-bold uppercase text-slate-400 hover:text-white transition-all"
                      title="Collapse All Domains"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>

              </div>

              {/* Professional Filters Bar */}
              <div className="flex items-center gap-2 flex-wrap border-t border-[rgba(255,255,255,0.04)] pt-4">
                <span className="font-mono text-[10px] text-slate-500 uppercase mr-1 flex items-center gap-1">
                  <Filter className="h-3 w-3 text-[#a78bfa]/70" /> REG_FILTER:
                </span>
                {filters.map((flt) => {
                  const isActive = activeFilter === flt;
                  return (
                    <button
                      key={flt}
                      onClick={() => setActiveFilter(flt)}
                      className={`px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-wide uppercase transition-all rounded-md ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#a78bfa]/20 to-[#c084fc]/20 border border-[#a78bfa]/50 text-white shadow-md'
                          : 'bg-[#111114]/60 border border-[rgba(255,255,255,0.06)] text-slate-400 hover:text-white hover:bg-[#18181c]'
                      }`}
                    >
                      {flt}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Engineering Archive Folders */}
            <div className="space-y-4">
              {DOMAINS.map((domain) => {
                const projects = projectsInDomain(domain);
                const isExpanded = !!expandedDomains[domain];
                
                // If filters or search is active and this domain has no matching projects, hide it
                if (projects.length === 0) return null;

                return (
                  <div 
                    key={domain} 
                    className="border border-[rgba(255,255,255,0.06)] bg-[#0d0d10] rounded-xl overflow-hidden shadow-lg transition-all"
                  >
                    {/* Collapsible Folder Header */}
                    <button
                      onClick={() => toggleDomain(domain)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-[#111115] hover:bg-[#15151c] transition-colors border-b border-[rgba(255,255,255,0.04)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-[#a78bfa]">
                          {isExpanded ? (
                            <FolderOpen className="h-5 w-5" />
                          ) : (
                            <Folder className="h-5 w-5" />
                          )}
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wider">
                          {domain}
                        </span>
                        <span className="rounded-full bg-[#1e1b4b] border border-[#a78bfa]/30 px-2 py-0.5 font-mono text-[9px] font-bold text-[#a78bfa]">
                          {projects.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] uppercase text-slate-500 tracking-wider hidden sm:inline">
                          {isExpanded ? 'Collapse Folder' : 'Expand Folder'}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Folder Content: Projects List */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden bg-[#070709]"
                        >
                          <div className="divide-y divide-[rgba(255,255,255,0.04)] p-1.5">
                            {projects.map((proj) => {
                              const meta = getProjectMetadata(proj.id);
                              
                              // Language Color Indicator Dot
                              const langColor = 
                                meta.primaryLanguage === 'SystemVerilog' ? 'bg-[#a78bfa]' :
                                meta.primaryLanguage === 'Chisel' ? 'bg-[#10b981]' :
                                'bg-[#eab308]'; // Verilog

                              return (
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  key={`${domain}-${proj.id}`}
                                  className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#0a0a0d]/40 hover:bg-[#121217]/80 rounded-lg border border-transparent hover:border-[#a78bfa]/20 transition-all duration-300"
                                >
                                  {/* Left: Project Identity */}
                                  <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                      <Terminal className="h-3.5 w-3.5 text-[#a78bfa]/70 shrink-0" />
                                      <h3 className="font-mono text-sm font-bold text-slate-100 group-hover:text-[#a78bfa] transition-colors tracking-tight">
                                        google-deepmind / {proj.name}
                                      </h3>
                                      
                                      {/* Status Badge */}
                                      <span className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase font-bold border ${
                                        meta.status === 'Completed' 
                                          ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]' 
                                          : 'bg-[#f59e0b]/10 border-[#f59e0b]/30 text-[#f59e0b]'
                                      }`}>
                                        ● {meta.status === 'Completed' ? 'TAPEOUT_READY' : 'IN_PROGRESS'}
                                      </span>

                                      {/* Difficulty Badge */}
                                      <span className="rounded bg-[#1e1b4b]/50 border border-[rgba(255,255,255,0.08)] px-2.5 py-0.5 font-mono text-[9px] text-[#94a3b8]">
                                        {meta.difficulty}
                                      </span>
                                    </div>

                                    {/* Tech Tag Stack */}
                                    <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                                      {/* Language Dot */}
                                      <div className="flex items-center gap-1.5 mr-2 font-mono text-[10px] text-slate-400">
                                        <span className={`h-2 w-2 rounded-full ${langColor}`} />
                                        {meta.primaryLanguage}
                                      </div>

                                      <span className="text-slate-600 text-[10px] font-mono select-none">|</span>

                                      {proj.techStack.map((tech) => (
                                        <span
                                          key={tech}
                                          className="rounded bg-[#141419] border border-[rgba(255,255,255,0.04)] px-1.5 py-0.5 font-mono text-[9px] text-slate-400 group-hover:border-[#a78bfa]/10 transition-colors"
                                        >
                                          {tech}
                                        </span>
                                      ))}
                                    </div>

                                    {/* Quick Tags / Subtitle */}
                                    <div className="mt-2 flex flex-wrap gap-2 items-center text-[10px] text-slate-500 font-mono">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3 text-slate-600" /> Compl: {meta.completionDisplay}
                                      </span>
                                      <span>•</span>
                                      <span className="flex items-center gap-1 text-slate-400">
                                        <GitBranch className="h-3 w-3 text-slate-600" /> branch: <span className="text-[#a78bfa]/80">main</span>
                                      </span>
                                      <span>•</span>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-slate-600">Tags:</span>
                                        {meta.quickTags.map((qt) => (
                                          <span key={qt} className="text-slate-400 bg-slate-900/40 px-1 py-0.2 rounded font-mono text-[9px]">
                                            #{qt.toLowerCase().replace(/\s+/g, '')}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right: Actions Buttons */}
                                  <div className="mt-4 md:mt-0 flex items-center gap-2 shrink-0">
                                    {/* GitHub Repo Button */}
                                    <a
                                      href={meta.githubUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-center p-2 rounded-lg bg-[#111115] border border-[rgba(255,255,255,0.08)] text-slate-400 hover:text-white hover:border-[#a78bfa]/40 transition-all cursor-pointer"
                                      title="Open Source Repository"
                                    >
                                      <Github className="h-4 w-4" />
                                    </a>

                                    {/* Open Workspace Button */}
                                    <button
                                      onClick={() => handleSetActiveProject(proj)}
                                      className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#5b21b6] to-[#7c3aed] border border-[#a78bfa]/40 px-3.5 py-2 font-mono text-[10px] font-bold uppercase text-white hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#5b21b6]/20 cursor-pointer"
                                    >
                                      Open Workspace <ArrowUpRight className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Centralized Empty State when no domains matched */}
              {activeDomainsCount === 0 && (
                <div className="text-center py-16 border border-dashed border-[rgba(255,255,255,0.08)] rounded-xl bg-[#0a0a0c]/40">
                  <div className="mx-auto h-12 w-12 text-slate-600 mb-3 flex items-center justify-center">
                    <Activity className="h-8 w-8 text-[#a78bfa]/40 animate-pulse" />
                  </div>
                  <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                    NO REG_RECORDS MATCHED
                  </h3>
                  <p className="mt-1 font-sans text-xs text-[#94a3b8] max-w-md mx-auto">
                    The active query or parameter combination did not retrieve any registered cores. Adjust filters or search parameters.
                  </p>
                  <button
                    onClick={() => {
                      setActiveFilter('All');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-4 py-2 rounded-lg border border-[#a78bfa]/30 bg-[#a78bfa]/10 font-mono text-xs uppercase font-bold text-[#a78bfa] hover:bg-[#a78bfa]/20 transition-all"
                  >
                    Reset Archive Registers
                  </button>
                </div>
              )}
            </div>
          </motion.div>
          ) : (
            <motion.div
              key="project-workspace"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <ProjectWorkspace project={activeProject} onClose={() => handleSetActiveProject(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legacy views disabled to respect single unified workspace architecture */}
        {false && (
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
                {activeProject.id === 'rv32im-soc-processor' && (
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
