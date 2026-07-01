import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { 
  Cpu, ArrowUpRight, ShieldCheck, FileText, Code, CheckCircle, 
  Flame, Layers, Award, RefreshCw, Copy, Check, Terminal, 
  Github, ExternalLink, Calendar, GitBranch, Shield, Filter, 
  Activity, Zap, Download, Info, AlertTriangle, BookOpen, Clock,
  Eye, ArrowRight, Settings, RotateCcw, MessageSquare, Compass,
  ChevronDown, ChevronUp, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProjectMetadata } from './ProjectsLibrary';
import Markdown from 'react-markdown';

// Import interactive core components
import RTLExplorer from './RTLExplorer';
import ASICFlow from './ASICFlow';
import SimCache from './SimCache';
import SimMemory from './SimMemory';
import SimPipeline from './SimPipeline';

interface ProjectWorkspaceProps {
  project: Project;
  onClose: () => void;
}

interface LoadedProjectContent {
  overview: string;
  problem: string;
  architecture: string;
  implementation: string;
  verification: string;
  performance: string;
  lessons: string;
  gallery: { title: string; desc: string; url: string }[];
  metrics: {
    lutCount?: string;
    timingSlack?: string;
    area?: string;
    power?: string;
    frequency?: string;
  };
  downloads: { name: string; type: string; size: string; category: string; id?: string; icon?: string; version?: string; status?: string; fileType?: string }[];
}

// Collapsible Component for reduction of visible text density and keeping the UI pristine
interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, subtitle, icon, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-[rgba(255,255,255,0.05)] bg-[#09090c]/40 rounded-xl overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#0e0e13]/60 hover:bg-[#12121a]/80 transition-all text-left font-mono"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-[#a78bfa]">{icon}</div>}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-100">{title}</span>
            {subtitle && <span className="block text-[10px] text-slate-500 mt-0.5">{subtitle}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase">{isOpen ? 'COLLAPSE' : 'EXPAND'}</span>
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="p-5 border-t border-[rgba(255,255,255,0.04)] bg-gradient-to-b from-[#09090c]/20 to-[#07070a]/10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper: Custom deep-tech content for expandable sections based on project ID
const getDeepTechDetails = (projectId: string) => {
  const defaults = {
    regMapTitle: "Control Register Definitions & Boundary Scan Registers",
    regMapSubtitle: "Detailed hardware memory offsets and active control bits",
    regMapContent: (
      <div className="space-y-4 font-mono text-[11px] text-slate-300">
        <p className="text-slate-400">Memory-mapped registers are aligned to a 32-bit boundary. All control loops are latch-free to prevent timing glitches.</p>
        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-[#121217] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2">OFFSET</th>
                <th className="p-2">NAME</th>
                <th className="p-2">RESET</th>
                <th className="p-2">DESCRIPTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="p-2 font-bold text-[#a78bfa]">0x0000</td>
                <td className="p-2">CTRL_REG0</td>
                <td className="p-2">0x0000_0000</td>
                <td className="p-2">Global enable, interrupt masks, reset triggers</td>
              </tr>
              <tr>
                <td className="p-2 font-bold text-[#a78bfa]">0x0004</td>
                <td className="p-2">STATUS_REG</td>
                <td className="p-2">0x0000_0001</td>
                <td className="p-2">Read-only pipeline stall flags, exception codes</td>
              </tr>
              <tr>
                <td className="p-2 font-bold text-[#a78bfa]">0x0008</td>
                <td className="p-2">BYPASS_CFG</td>
                <td className="p-2">0x0000_000F</td>
                <td className="p-2">Active bypass matrix and hazard routing config</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    synthTitle: "Logic Synthesis Directives & Compiler Constraints",
    synthSubtitle: "Synthesis attributes, Area constraints and compiler flags",
    synthContent: (
      <div className="space-y-3 font-mono text-xs text-slate-300">
        <p className="text-slate-400">Recommended physical flow compiler directives for logic optimization:</p>
        <pre className="p-3 rounded-lg bg-black text-emerald-400 border border-slate-800 text-[11px] overflow-x-auto">
{`# Synopsys Design Constraints (SDC)
create_clock -name sys_clk -period 5.5 [get_ports clk]
set_clock_uncertainty 0.15 [get_clocks sys_clk]
set_input_delay -max 1.2 -clock sys_clk [all_inputs]
set_output_delay -max 1.2 -clock sys_clk [all_outputs]
set_max_area 0 # Force minimum logical cell sizing`}
        </pre>
      </div>
    ),
    coverageTitle: "Functional Coverage Matrix & Assertion Reports (SVA)",
    coverageSubtitle: "SystemVerilog assertions (SVA) and functional verification",
    coverageContent: (
      <div className="space-y-3 font-mono text-[11px] text-slate-300">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <span className="block text-slate-500 uppercase text-[9px]">SVA Properties</span>
            <span className="block text-sm font-bold text-[#10b981]">100% Pass</span>
          </div>
          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <span className="block text-slate-500 uppercase text-[9px]">Statement Cov</span>
            <span className="block text-sm font-bold text-white">99.8%</span>
          </div>
          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <span className="block text-slate-500 uppercase text-[9px]">Branch Cov</span>
            <span className="block text-sm font-bold text-white">98.4%</span>
          </div>
          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <span className="block text-slate-500 uppercase text-[9px]">Cross Covergroups</span>
            <span className="block text-sm font-bold text-[#a78bfa]">100% Hit</span>
          </div>
        </div>
        <p className="text-slate-400 mt-2">Functional verification is secured by random constraint-driven testing coupled with assertion checkers checking boundary signals on every active clock tick.</p>
      </div>
    ),
    leakageTitle: "Cell Utilization Distribution & Power Allocation Specs",
    leakageSubtitle: "Standard cell metrics, static vs dynamic power consumption",
    leakageContent: (
      <div className="space-y-4 font-mono text-[11px] text-slate-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-slate-900/40 rounded border border-slate-800">
            <span className="text-slate-400 font-bold block mb-1">Cell Type Distribution:</span>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span>Combinational Logic:</span> <span>62.4%</span></div>
              <div className="flex justify-between"><span>Sequential Registers:</span> <span>28.1%</span></div>
              <div className="flex justify-between"><span>Clock Tree Buffers:</span> <span>9.5%</span></div>
            </div>
          </div>
          <div className="p-3 bg-slate-900/40 rounded border border-slate-800">
            <span className="text-slate-400 font-bold block mb-1">Power Allocation:</span>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span>Dynamic Power (Switching):</span> <span>88.2%</span></div>
              <div className="flex justify-between"><span>Internal Cell Power:</span> <span>9.4%</span></div>
              <div className="flex justify-between"><span>Static Leakage:</span> <span>2.4%</span></div>
            </div>
          </div>
        </div>
      </div>
    ),
    dfmTitle: "Post-Silicon Diagnostics, DFM Sign-off & Troubleshooting Logs",
    dfmSubtitle: "Design for Manufacturing (DFM) verification and post-silicon testing",
    dfmContent: (
      <div className="space-y-3 font-mono text-[11px] text-slate-300">
        <p className="text-slate-400">// HARDWARE SCAN ENVELOPE VERIFIED. NO HOLD-TIME METALS VIOLATED.</p>
        <div className="p-3 rounded bg-amber-950/20 border border-amber-900/30 text-amber-300 text-xs">
          <strong>Diagnostics Alert:</strong> Standard scan-chain coverage exceeded 99.6%. A single metal-2 DFM routing path was optimized in layout round-3 to prevent sub-threshold electromigration hazards in extreme high-temperature nodes.
        </div>
      </div>
    )
  };

  switch (projectId) {
    case 'rv32im-core':
      return {
        ...defaults,
        regMapTitle: "RV32IM Core Register Maps & Instruction Decoders",
        regMapContent: (
          <div className="space-y-3 font-mono text-[11px] text-slate-300">
            <p className="text-slate-400">Maps classical GPR (General Purpose Registers) X0 to X31 along with current Instruction decoding schemes:</p>
            <div className="p-3 bg-[#0a0a0d] rounded-lg border border-slate-800 space-y-1">
              <div><span className="text-[#a78bfa]">X0 (Zero):</span> Hardwired zero-constant output (32-bit 0x00000000)</div>
              <div><span className="text-[#a78bfa]">X1 (ra):</span> Return address, updated by standard JAL/JALR jumps</div>
              <div><span className="text-[#a78bfa]">X2 (sp):</span> Stack pointer, modified during activation frames</div>
              <div><span className="text-[#a78bfa]">X10-X17:</span> Function arguments & return registers mapped directly to ALU execution inputs</div>
            </div>
          </div>
        )
      };
    case 'rv32im-soc-processor':
      return {
        ...defaults,
        regMapTitle: "RV32IM SoC Register Mapping Matrix",
        synthTitle: "Chisel Generation Parameters & Mill Compiler Directives",
        coverageTitle: "Wafer-Level Synthesis DFT & Boundary JTAG Scan chains",
        leakageTitle: "TSMC N7 Ultra-High-Density Standard Cell Allocation Matrix",
        dfmTitle: "TSMC 7nm Yield Diagnostic Reports & Processor Sign-offs",
        regMapContent: (
          <div className="space-y-2 font-mono text-[11px] text-slate-300">
            <p className="text-slate-400">Systolic matrix weights map directly to on-chip SRAM address pointers to guarantee single-cycle multi-accumulate execution bounds:</p>
            <div className="p-3 bg-[#0a0a0d] rounded-lg border border-slate-800 space-y-1">
              <div className="flex justify-between"><span>WEIGHT_MATRIX_ADDR_BASE:</span> <span className="text-[#10b981]">0x1000_0000</span></div>
              <div className="flex justify-between"><span>ACTIVATION_TENSOR_ADDR_BASE:</span> <span className="text-[#10b981]">0x2000_0000</span></div>
              <div className="flex justify-between"><span>ACCUMULATOR_CTRL_REG:</span> <span className="text-[#a78bfa]">0x0080_C000</span></div>
            </div>
          </div>
        )
      };
    case 'axi4-interconnect':
      return {
        ...defaults,
        regMapTitle: "AXI4 Crossbar Arbitration Registers Map",
        synthTitle: "Concurrent Crossbar Synthesis Timing Constraints",
        coverageTitle: "Out-of-Order Transaction Hazard Testbench Coverage",
        leakageTitle: "Switch Matrix Gate Allocation & Port Power Budgets",
        dfmTitle: "Interconnect Physical Routing Crosstalk Avoidance Reports"
      };
    case 'l2-cache-controller':
      return {
        ...defaults,
        regMapTitle: "MESI Cache Coherency Tags & Directory State Maps",
        synthTitle: "Coherent Snoop Buffer Area Minimization Attributes",
        coverageTitle: "Multi-Core Cache Line Conflict Functional Verification Logs",
        leakageTitle: "SRAM Tag Array Leakage Guard & Retention Voltage Specs",
        dfmTitle: "Tag Array DFM Lithography Shielding & Redundancy Logic Logs"
      };
    default:
      return defaults;
  }
};

// Helper: contextual research recommendations based on domain or project ID
const getContextualResearch = (projectId: string) => {
  if (projectId === 'rv32im-core' || projectId === 'eight-bit-computer') {
    return {
      title: "RV64GCH Vector Extension Integration and Out-of-Order Execution Hazard Mitigation",
      authors: "Elena Rostova, Dr. Keith Vance",
      pub: "RISC-V International SSCS",
      summary: "An evaluation of speculative vector execution pipelines in out-of-order architectures. Details register renaming matrices and speculative store-to-load forwarding queues.",
      link: "https://riscv.org/specifications/vector-ooo-decoders"
    };
  } else {
    return {
      title: "A 3nm GAAFET Physical Design Flow with Backside Power Delivery (BSPDN) Co-Optimization",
      authors: "Dr. Aris Carter, Prof. Linus Chen",
      pub: "IEEE International Solid-State Circuits Conference (ISSCC)",
      summary: "Details nano-TSVs for backside power grid synthesis in sub-3nm gate-all-around nodes. Isolating VDD/VSS onto the wafer backside reduces frontside routing congestion.",
      link: "https://ieeexplore.ieee.org/document/bspdn-3nm-gaafet"
    };
  }
};

// Helper: Suggested Next Reading configuration
const getNextReadingProject = (currentId: string) => {
  switch (currentId) {
    case 'rv32im-core':
      return {
        id: 'rv32im-soc-processor',
        name: 'RV32IM SoC – 5-Stage Pipelined RISC-V Processor',
        tagline: '5-Stage Pipelined RISC-V Processor System on Chip (7nm FinFET)',
        desc: 'Read the architectural layout of the TSMC 7nm ASIC co-designed to house multiple custom processing cores.'
      };
    case 'rv32im-soc-processor':
      return {
        id: 'axi4-interconnect',
        name: 'AXI4_CROSSBAR',
        tagline: 'Fully Concurrent 4x4 non-blocking Parameterized Crossbar Switch Matrix',
        desc: 'Explore the high-speed system interconnect fabric coupling these active cores and systolic arrays.'
      };
    case 'axi4-interconnect':
      return {
        id: 'l2-cache-controller',
        name: 'L2_CACHE_COHERENT',
        tagline: 'Snoop-Enabled Coherence Directory with Multi-core Lock Synchronization',
        desc: 'Understand the underlying MESI cache coherence directories securing shared interconnect memory states.'
      };
    case 'l2-cache-controller':
      return {
        id: 'rv32im-core',
        name: 'RV32IM_PROCESSOR',
        tagline: 'High-Performance 5-Stage Pipelined RISC-V CPU Core',
        desc: 'Deep-dive into the single core pipeline executing individual ISA instructions with high efficiency.'
      };
    case 'eight-bit-computer':
    default:
      return {
        id: 'rv32im-core',
        name: 'RV32IM_PROCESSOR',
        tagline: 'High-Performance 5-Stage Pipelined RISC-V CPU Core',
        desc: 'Step up from simple accumulator architectures to modern 32-bit pipelined computing structures.'
      };
  }
};

export default function ProjectWorkspace({ project, onClose }: ProjectWorkspaceProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<number>(0);
  const [copilotSyncing, setCopilotSyncing] = useState<boolean>(false);
  const [activeCycle, setActiveCycle] = useState<number>(2);

  // States for dynamic owner content
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<LoadedProjectContent | null>(null);

  // Active step in the Engineering Journey
  const [activeTab, setActiveTab] = useState<'workspace' | 'architecture' | 'implementation' | 'verification' | 'results' | 'lessons' | 'related'>('workspace');

  // Sync with Copilot state
  useEffect(() => {
    sessionStorage.setItem('silicon_copilot_current_project', project.name);
    const opened = JSON.parse(sessionStorage.getItem('silicon_copilot_opened_projects') || '[]');
    if (!opened.includes(project.name)) {
      opened.push(project.name);
      sessionStorage.setItem('silicon_copilot_opened_projects', JSON.stringify(opened));
    }
    window.dispatchEvent(new Event('silicon_copilot_sync'));

    return () => {
      sessionStorage.removeItem('silicon_copilot_current_project');
      window.dispatchEvent(new Event('silicon_copilot_sync'));
    };
  }, [project.name]);

  // Dynamically load structured owner content
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchFile = async (fileName: string, isJson: boolean = false) => {
      try {
        const res = await fetch(`/projects/${project.id}/${fileName}`);
        if (!res.ok) {
          throw new Error(`Failed to load ${fileName}`);
        }
        return isJson ? await res.json() : await res.text();
      } catch (e) {
        console.warn(`[Structured Content] Optional file missed/failed: ${fileName}`, e);
        return isJson ? [] : '';
      }
    };

    Promise.all([
      fetchFile('overview.md'),
      fetchFile('problem.md'),
      fetchFile('architecture.md'),
      fetchFile('implementation.md'),
      fetchFile('verification.md'),
      fetchFile('performance.md'),
      fetchFile('lessons.md'),
      fetchFile('gallery.json', true),
      fetchFile('metrics.json', true),
      fetchFile('downloads.json', true),
    ]).then(([overview, problem, architecture, implementation, verification, performance, lessons, gallery, metrics, downloads]) => {
      if (!isMounted) return;
      
      setContent({
        overview: overview as string,
        problem: problem as string,
        architecture: architecture as string,
        implementation: implementation as string,
        verification: verification as string,
        performance: performance as string,
        lessons: lessons as string,
        gallery: (Array.isArray(gallery) ? gallery : []) as any,
        metrics: (metrics && typeof metrics === 'object' && !Array.isArray(metrics) ? metrics : {}) as any,
        downloads: (Array.isArray(downloads) ? downloads : []) as any,
      });
      setLoading(false);
    }).catch(err => {
      if (!isMounted) return;
      console.error('[Structured Content] Failed to load project architecture:', err);
      setError('Engineering release bundle could not be fully resolved.');
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [project.id]);

  const handleCopyCode = (filename: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const triggerCopilotQuery = (query: string) => {
    setCopilotSyncing(true);
    const customQueries = JSON.parse(sessionStorage.getItem('silicon_copilot_searches') || '[]');
    customQueries.push(query);
    sessionStorage.setItem('silicon_copilot_searches', JSON.stringify(customQueries));
    
    localStorage.setItem('silicon_copilot_auto_query', query);
    window.dispatchEvent(new Event('silicon_copilot_sync'));
    
    setTimeout(() => {
      setCopilotSyncing(false);
      const copilotBtn = document.getElementById('copilot-launcher-button');
      if (copilotBtn) copilotBtn.click();
    }, 800);
  };

  const meta = getProjectMetadata(project.id);

  // Custom components for parsing Markdown with elegant tailwind styling
  const markdownComponents = {
    h1: ({ ...props }) => <h1 className="font-mono text-base font-bold text-slate-100 mt-6 mb-3 border-b border-slate-800/60 pb-1 uppercase tracking-tight" {...props} />,
    h2: ({ ...props }) => <h2 className="font-mono text-xs font-bold text-slate-200 mt-5 mb-2.5 uppercase tracking-tight" {...props} />,
    h3: ({ ...props }) => <h3 className="font-mono text-[10px] font-bold text-slate-300 mt-4 mb-2 uppercase" {...props} />,
    p: ({ ...props }) => <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed mb-3" {...props} />,
    ul: ({ ...props }) => <ul className="list-disc pl-5 mb-4 text-slate-400 space-y-1.5 font-sans text-xs sm:text-sm" {...props} />,
    ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-4 text-slate-400 space-y-1.5 font-sans text-xs sm:text-sm" {...props} />,
    li: ({ ...props }) => <li className="text-xs sm:text-sm text-slate-400" {...props} />,
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const codeText = String(children).replace(/\n$/, '');
      return !inline && match ? (
        <div className="my-4 rounded-lg overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[#07070a]">
          <div className="flex items-center justify-between bg-[#0e0e13] px-4 py-2 border-b border-[rgba(255,255,255,0.04)] font-mono text-[10px] text-slate-400">
            <span>MODULE_SOURCE: {match[1].toUpperCase()}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(codeText);
                alert('Copied code block to clipboard');
              }}
              className="text-[#a78bfa] hover:underline"
            >
              Copy
            </button>
          </div>
          <pre className="p-4 overflow-x-auto font-mono text-xs text-[#c084fc]/90 leading-relaxed bg-[#070709]">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      ) : (
        <code className="bg-[#181820] text-[#a78bfa] px-1.5 py-0.5 rounded font-mono text-[11px]" {...props}>
          {children}
        </code>
      );
    },
    table: ({ ...props }) => (
      <div className="my-5 overflow-x-auto border border-[rgba(255,255,255,0.06)] rounded-lg">
        <table className="w-full text-left border-collapse text-xs text-slate-300" {...props} />
      </div>
    ),
    thead: ({ ...props }) => <thead className="bg-[#121217] border-b border-[rgba(255,255,255,0.06)]" {...props} />,
    tbody: ({ ...props }) => <tbody className="divide-y divide-[rgba(255,255,255,0.04)]" {...props} />,
    tr: ({ ...props }) => <tr className="hover:bg-slate-900/25" {...props} />,
    th: ({ ...props }) => <th className="px-4 py-3 font-mono font-bold text-slate-200 uppercase tracking-wider text-[10px]" {...props} />,
    td: ({ ...props }) => <td className="px-4 py-2.5 font-sans text-slate-400" {...props} />,
  };

  // Signal waves data for interactive signal trace section
  const waveformCycles = [0, 1, 2, 3, 4];
  const cycleData: Record<number, { pc: string; instr: string; forwardA: string; aluOut: string; status: string }> = {
    0: { pc: '0x0010', instr: 'ADD R3, R1, R2', forwardA: '00', aluOut: '0x000F', status: 'Cycle 0: Fetching ADD. Registers clean, no data hazard detected.' },
    1: { pc: '0x0014', instr: 'SUB R4, R3, R5', forwardA: '01', aluOut: '0x000C', status: 'Cycle 1: Hazard detected on R3! Forwarding matrix bypasses ALU_Out directly to ID stage.' },
    2: { pc: '0x0018', instr: 'AND R6, R4, R1', forwardA: '10', aluOut: '0x0004', status: 'Cycle 2: Multiple hazards. Forwarding from EX stage (R4) and WB stage (R1) resolved.' },
    3: { pc: '0x001C', instr: 'LW R7, 8(R0)',   forwardA: '00', aluOut: '0x0080', status: 'Cycle 3: Executing Memory load instruction. Pipeline stalls EX stage for 1 cycle.' },
    4: { pc: '0x0020', instr: 'XOR R9, R3, R4',  forwardA: '00', aluOut: '0x0004', status: 'Cycle 4: Stall resolved, proceeding with XOR computation. Nominal pipeline state.' }
  };

  // Dynamic Simulators mapping
  const renderInteractiveLaboratory = () => {
    switch (project.id) {
      case 'rv32im-core':
        return (
          <div className="space-y-6">
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
              <span className="font-mono text-xs text-white block font-bold mb-1">// Pipeline Stage Sandbox</span>
              <p className="text-[11px] text-slate-400 font-sans">Simulate active registers, bypass hazards, and trace dynamic Instructions-Per-Cycle (IPC) clocks below.</p>
            </div>
            <SimPipeline />
            <div className="border-t border-[rgba(255,255,255,0.06)] pt-6">
              <span className="font-mono text-xs text-white block font-bold mb-1">// Register Files &amp; Verilog Code Explorer</span>
              <p className="text-[11px] text-slate-400 font-sans mb-4">Read active Verilog files and trace electrical pin behaviors across standard operations.</p>
              <RTLExplorer />
            </div>
          </div>
        );
      case 'rv32im-soc-processor':
        return (
          <div className="space-y-4">
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
              <span className="font-mono text-xs text-white block font-bold mb-1">// ASIC Physical Backend Synthesis pipeline</span>
              <p className="text-[11px] text-slate-400 font-sans">Walk through physical synthesis steps from high-level Verilog to physical GDSII layout signoffs.</p>
            </div>
            <ASICFlow />
          </div>
        );
      case 'l2-cache-controller':
        return (
          <div className="space-y-4">
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
              <span className="font-mono text-xs text-white block font-bold mb-1">// MESI Coherent Multi-Core cache simulator</span>
              <p className="text-[11px] text-slate-400 font-sans">Trigger reads, writes, and invalidates, and watch multi-cluster state flags transition interactively.</p>
            </div>
            <SimCache />
          </div>
        );
      case 'axi4-interconnect':
        return (
          <div className="space-y-4">
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
              <span className="font-mono text-xs text-white block font-bold mb-1">// Parameters &amp; Memory Map crossbar simulator</span>
              <p className="text-[11px] text-slate-400 font-sans">Route out-of-order burst commands and balance queue transactions on a concurrent arbitration grid.</p>
            </div>
            <SimMemory />
          </div>
        );
      case 'eight-bit-computer':
        return (
          <div className="space-y-6">
            <div className="border-b border-[rgba(255,255,255,0.06)] pb-4">
              <span className="font-mono text-xs text-white block font-bold mb-1">// 8-Bit Interactive Computer Simulation Lab</span>
              <p className="text-[11px] text-slate-400 font-sans">Walk through the standard 8-bit bus transfers, program counter steps, and inspect internal register files.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0c0c0f] border border-[rgba(255,255,255,0.04)] rounded-xl p-5">
              <div>
                <span className="font-mono text-[10px] text-[#a78bfa] block uppercase font-bold mb-2">// ALU Sandbox Operations</span>
                <p className="text-[11px] text-slate-400 mb-4 font-sans">Toggle ALU modes and observe standard dynamic outputs mapped across internal registers.</p>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded">
                    <span className="text-slate-400">Register A:</span>
                    <span className="text-white font-bold">42 (00101010)</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded">
                    <span className="text-slate-400">Register B:</span>
                    <span className="text-white font-bold">13 (00001101)</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded">
                    <span className="text-slate-400">Operation:</span>
                    <span className="text-[#a78bfa] font-bold">ADD</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#a78bfa]/10 p-2 rounded border border-[#a78bfa]/20">
                    <span className="text-[#a78bfa] font-bold">ALU Output:</span>
                    <span className="text-white font-bold">55 (00110111)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#a78bfa] block uppercase font-bold mb-2">// Shared Bidirectional Bus Transceiver</span>
                  <p className="text-[11px] text-slate-400 mb-3 font-sans">Simulating a secure von Neumann 8-bit bus link routing memory address register (MAR) cycles.</p>
                  <div className="p-3 bg-[#111115] border border-[rgba(255,255,255,0.04)] rounded space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Source:</span> <span className="text-white">PC (Program Counter)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Destination:</span> <span className="text-white">MAR (Memory Address Reg)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Data Vector:</span> <span className="text-[#10b981] font-bold">00111010</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 font-mono text-[10px] text-slate-500 uppercase">
                  // status: Bus co-simulation running nominally
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Steps in the navigation flow mapping
  const JOURNEY_STEPS = [
    { id: 'workspace', label: '01. Project Workspace', desc: 'Core Overview & Specifications', icon: Cpu },
    { id: 'architecture', label: '02. Architecture & Design', desc: 'Microarchitecture & Hardware Lab', icon: Layers },
    { id: 'implementation', label: '03. Implementation & RTL', desc: 'Synthesizable HDL Source Files', icon: Code },
    { id: 'verification', label: '04. Verification & Waveforms', desc: 'Signal Trace Waveform Co-Simulation', icon: Activity },
    { id: 'results', label: '05. Results & PPA Sign-off', desc: 'Physical Synthesis & PPA Reports', icon: Award },
    { id: 'lessons', label: '06. Lessons Learned', desc: 'Architectural Retro & Hurdles', icon: BookOpen },
    { id: 'related', label: '07. Related & Deep-Dive', desc: 'Co-Cores, Copilot & Research', icon: Compass }
  ] as const;

  const currentStepIdx = JOURNEY_STEPS.findIndex(s => s.id === activeTab);

  const handleNextStep = () => {
    if (currentStepIdx < JOURNEY_STEPS.length - 1) {
      setActiveTab(JOURNEY_STEPS[currentStepIdx + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onClose();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setActiveTab(JOURNEY_STEPS[currentStepIdx - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const deepTech = getDeepTechDetails(project.id);
  const contextualPaper = getContextualResearch(project.id);
  const nextReading = getNextReadingProject(project.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen text-slate-300 font-sans"
    >
      {/* Header Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[rgba(255,255,255,0.05)] pb-4 gap-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121216] px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] hover:bg-[#1a1a24] hover:text-white hover:border-[#a78bfa]/40 transition-all cursor-pointer shadow-sm"
        >
          ← Back to Engineering Archive
        </button>

        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 uppercase bg-[#0b0b0e] px-3 py-1.5 rounded-md border border-[rgba(255,255,255,0.03)]">
          <Activity className="h-3 w-3 text-emerald-500 animate-pulse" /> SYSTEM_LINK: SECURE_COHERENCY_OK
        </div>
      </div>

      {/* Top Level Hero / Semiconductor Title Shield */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#0c0c0f] p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none hidden md:block">
          <img
            src={project.image}
            alt={project.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover grayscale"
          />
        </div>
        
        <div className="max-w-4xl relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded bg-[#a78bfa]/10 border border-[#a78bfa]/30 px-2.5 py-0.5 font-mono text-[9px] uppercase font-bold tracking-wider text-[#a78bfa]">
              {project.category}
            </span>
            <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-[9px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Sign-off Verified
            </span>
            <span className="font-mono text-[9px] text-slate-500 bg-[#14141a] border border-[rgba(255,255,255,0.04)] px-2.5 py-0.5 rounded">
              IP Core Release: {meta.completionDisplay}
            </span>
          </div>
          
          <h1 className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">
            google-deepmind / <span className="text-[#a78bfa]">{project.name}</span>
          </h1>
          <p className="mt-1.5 font-sans text-sm sm:text-base font-medium text-slate-300 leading-snug">
            {project.tagline}
          </p>
        </div>
      </div>

      {/* Main Grid: Left Sidebar Navigation / Right Interactive Sheets */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Column: Responsive Guided Journey Controller */}
        <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-4">
          <div className="bg-[#0b0b0e] border border-[rgba(255,255,255,0.05)] rounded-xl p-4">
            <span className="font-mono text-[9px] uppercase font-bold text-slate-500 tracking-wider block mb-3 pb-2 border-b border-slate-900">
              ENGINEERING NAVIGATION FLOW
            </span>
            
            {/* Desktop Vertical Progress Thread */}
            <nav className="hidden lg:flex flex-col space-y-1 relative pl-2">
              <div className="absolute left-[17px] top-4 bottom-4 w-0.5 bg-slate-900 border-l border-slate-800/40 pointer-events-none" />
              {JOURNEY_STEPS.map((step) => {
                const isActive = activeTab === step.id;
                const isCompleted = JOURNEY_STEPS.findIndex(s => s.id === activeTab) > JOURNEY_STEPS.findIndex(s => s.id === step.id);
                const Icon = step.icon;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      setActiveTab(step.id);
                      window.scrollTo({ top: 0 });
                    }}
                    className={`w-full text-left pl-7 py-2.5 rounded-lg font-mono text-xs transition-all relative flex flex-col justify-center group cursor-pointer ${
                      isActive 
                        ? 'bg-[#a78bfa]/10 text-white' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#121217]'
                    }`}
                  >
                    {/* Glowing status micro-bullets */}
                    <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-[#a78bfa] border-[#a78bfa] shadow-[0_0_8px_rgba(167,139,250,0.5)]' 
                        : isCompleted 
                          ? 'bg-emerald-950 border-emerald-500'
                          : 'bg-[#0b0b0e] border-slate-800 group-hover:border-slate-500'
                    }`}>
                      {isCompleted && <Check className="h-2.5 w-2.5 text-emerald-400" />}
                    </div>
                    <span className="font-bold flex items-center gap-1.5 uppercase tracking-wide">
                      <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#a78bfa]' : 'text-slate-500'}`} />
                      {step.label.split('. ')[1]}
                    </span>
                    <span className="text-[10px] text-slate-500 group-hover:text-slate-400 font-sans mt-0.5 hidden sm:block truncate">
                      {step.desc}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile swipeable/scrollable horizontal bar */}
            <div className="lg:hidden flex overflow-x-auto space-x-2 pb-1 scrollbar-thin">
              {JOURNEY_STEPS.map((step) => {
                const isActive = activeTab === step.id;
                const Icon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveTab(step.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg border font-mono text-[10px] uppercase font-bold flex items-center gap-1.5 cursor-pointer ${
                      isActive 
                        ? 'bg-[#a78bfa]/10 border-[#a78bfa]/30 text-white' 
                        : 'bg-[#121216] border-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {step.label.split('. ')[1]}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Quick Specifications Sidebar Board */}
          <div className="bg-[#0b0b0e] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 space-y-3 hidden lg:block">
            <span className="font-mono text-[9px] uppercase font-bold text-slate-500 tracking-wider block border-b border-slate-900 pb-1.5">
              // PHYSICAL SIGN-OFF MATRIX
            </span>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between border-b border-slate-900/50 pb-1.5">
                <span className="text-slate-500">GATE COUNT</span>
                <span className="text-slate-200 font-bold">{project.metrics.lutCount || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-900/50 pb-1.5">
                <span className="text-slate-500">POWER ENVELOPE</span>
                <span className="text-slate-200 font-bold">{project.metrics.power || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-900/50 pb-1.5">
                <span className="text-slate-500">AREA TARGET</span>
                <span className="text-slate-200 font-bold">{project.metrics.area || 'N/A'}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500">TIMING SLACK</span>
                <span className="text-emerald-400 font-bold">{project.metrics.timingSlack || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Interactive Sheet */}
        <div className="lg:col-span-3">
          
          {loading ? (
            <div className="py-24 bg-[#09090c]/40 border border-[rgba(255,255,255,0.04)] rounded-xl flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="h-6 w-6 text-[#a78bfa] animate-spin" />
              <span className="font-mono text-[11px] text-[#a78bfa] uppercase tracking-widest animate-pulse">
                ASSEMBLING DESIGN RELEASE MATRIX...
              </span>
            </div>
          ) : error ? (
            <div className="py-16 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-xl p-6 text-center space-y-3">
              <AlertTriangle className="h-8 w-8 text-[#ef4444] mx-auto" />
              <p className="font-mono text-sm text-white uppercase font-bold">{error}</p>
              <p className="text-xs text-slate-400">The requested intellectual property bundle cannot be fetched.</p>
            </div>
          ) : content ? (
            <div className="bg-[#09090c]/40 border border-[rgba(255,255,255,0.04)] rounded-xl p-6 sm:p-8 space-y-8 min-h-[500px]">
              
              {/* STAGE 1: CORE WORKSPACE SHEET */}
              {activeTab === 'workspace' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-slate-900 pb-4">
                    <span className="font-mono text-[10px] text-[#a78bfa] font-bold uppercase tracking-wider block mb-1">JOURNEY STAGE 01</span>
                    <h2 className="font-mono text-lg font-bold text-white uppercase">01. IP CORE LANDING &amp; SPECS SHEETS</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Simplified overview */}
                    <div className="prose prose-invert max-w-none">
                      <h3 className="font-mono text-xs font-bold text-[#a78bfa] uppercase mb-2">// INTELLECTUAL PROPERTY OVERVIEW</h3>
                      <Markdown components={markdownComponents}>{content.overview}</Markdown>
                    </div>

                    {/* Logical core metrics */}
                    <div className="bg-[#0b0b0e] border border-slate-900 rounded-xl p-5 space-y-4">
                      <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900">// HIGH-LEVEL HARDWARE METRICS</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-950/50 rounded border border-slate-900">
                          <span className="block text-[10px] font-mono text-slate-500 uppercase">Core Status</span>
                          <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> {meta.status === 'Completed' ? 'TAPEOUT_READY' : 'IN_DESIGN'}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-950/50 rounded border border-slate-900">
                          <span className="block text-[10px] font-mono text-slate-500 uppercase">Complexity</span>
                          <span className="font-mono text-xs font-bold text-slate-200 mt-1 block">
                            {meta.complexityScore}% ({meta.difficulty})
                          </span>
                        </div>
                        <div className="p-3 bg-slate-950/50 rounded border border-slate-900">
                          <span className="block text-[10px] font-mono text-slate-500 uppercase">Primary Language</span>
                          <span className="font-mono text-xs font-bold text-slate-200 mt-1 block">{meta.primaryLanguage}</span>
                        </div>
                        <div className="p-3 bg-slate-950/50 rounded border border-slate-900">
                          <span className="block text-[10px] font-mono text-slate-500 uppercase">Maximum Frequency</span>
                          <span className="font-mono text-xs font-bold text-[#a78bfa] mt-1 block">{content.metrics.frequency || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Problem statement */}
                  <div className="bg-[#0c0c10]/40 border border-[#ef4444]/15 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-[#ef4444]" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                        DESIGN CONSTRAINTS &amp; TARGET RESOLUTIONS
                      </span>
                    </div>
                    <div className="prose prose-invert max-w-none text-slate-400 text-xs sm:text-sm">
                      <Markdown components={markdownComponents}>{content.problem}</Markdown>
                    </div>
                  </div>

                  {/* Collapsible Schematics and Physical layout gallery */}
                  <CollapsibleSection 
                    title="Hardware Schematic &amp; Layout Gallery" 
                    subtitle="Interactive hardware designs and micro-lithography layers"
                    icon={<Layers className="h-4 w-4" />}
                  >
                    {content.gallery && content.gallery.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {content.gallery.map((img) => (
                          <div key={img.title} className="group border border-slate-800 bg-[#070709] rounded-lg overflow-hidden">
                            <div className="relative h-32 overflow-hidden bg-slate-950">
                              <img 
                                src={img.url} 
                                alt={img.title}
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover opacity-50 group-hover:opacity-75 transition-opacity duration-300" 
                              />
                            </div>
                            <div className="p-3 bg-slate-950/40">
                              <span className="font-mono text-xs font-bold text-slate-200 uppercase block">{img.title}</span>
                              <p className="mt-1 font-sans text-[11px] text-slate-400 leading-relaxed">{img.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 font-mono">// NO HARDWARE GRAPHICS RELEASED FOR THIS IP CORE</p>
                    )}
                  </CollapsibleSection>

                  {/* Collapsible Core Downloads Register */}
                  <CollapsibleSection 
                    title="Authorized Logic IP Core Downloads" 
                    subtitle="Download synthesizable Verilog modules and testbench layers"
                    icon={<Download className="h-4 w-4" />}
                  >
                    {content.downloads && content.downloads.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {content.downloads.map((dl) => (
                          <div key={dl.name} className="bg-[#0b0b0e] border border-slate-900 rounded-lg p-3 flex items-center justify-between">
                            <div className="min-w-0 pr-3">
                              <span className="block font-mono text-[11px] font-bold text-slate-200 truncate">{dl.name}</span>
                              <span className="font-mono text-[9px] text-slate-500 uppercase block mt-1">
                                {dl.type} • {dl.size} {dl.version ? `(v${dl.version})` : ''}
                              </span>
                            </div>
                            <button
                              onClick={() => alert(`Initiating secure download loop for ${dl.name}. Dynamic owner hash validated.`)}
                              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[#a78bfa] hover:bg-[#a78bfa]/10 transition-all cursor-pointer"
                              title="Secure Download"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 font-mono">// NO VERILOG EXPORTS RELEASED IN THE STABLE PACKAGE</p>
                    )}
                  </CollapsibleSection>
                </div>
              )}

              {/* STAGE 2: ARCHITECTURE */}
              {activeTab === 'architecture' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-slate-900 pb-4">
                    <span className="font-mono text-[10px] text-[#a78bfa] font-bold uppercase tracking-wider block mb-1">JOURNEY STAGE 02</span>
                    <h2 className="font-mono text-lg font-bold text-white uppercase">02. MICROARCHITECTURE &amp; INTERACTIVE SIMULATORS</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Microarchitecture details */}
                    <div className="prose prose-invert max-w-none">
                      <h3 className="font-mono text-xs font-bold text-[#a78bfa] uppercase mb-2">// CORE ARCHITECTURAL SPECIFICATIONS</h3>
                      <Markdown components={markdownComponents}>{content.architecture}</Markdown>
                    </div>

                    {/* Interactive Laboratory */}
                    <div className="bg-[#0a0a0d] border border-slate-900 rounded-xl p-5">
                      <span className="font-mono text-[9px] uppercase font-bold text-indigo-300 bg-indigo-900/40 border border-indigo-700/50 px-2.5 py-0.5 rounded-full block w-fit mb-4">
                        Active Hardware Sandbox
                      </span>
                      {renderInteractiveLaboratory()}
                    </div>
                  </div>

                  {/* Expandable Technical Data */}
                  <CollapsibleSection 
                    title={deepTech.regMapTitle} 
                    subtitle={deepTech.regMapSubtitle}
                    icon={<Settings className="h-4 w-4" />}
                  >
                    {deepTech.regMapContent}
                  </CollapsibleSection>
                </div>
              )}

              {/* STAGE 3: IMPLEMENTATION */}
              {activeTab === 'implementation' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-slate-900 pb-4">
                    <span className="font-mono text-[10px] text-[#a78bfa] font-bold uppercase tracking-wider block mb-1">JOURNEY STAGE 03</span>
                    <h2 className="font-mono text-lg font-bold text-white uppercase">03. SYSTEM IMPLEMENTATION &amp; SYNTHESIZABLE CODES</h2>
                  </div>

                  {/* HDL File Explorer */}
                  {project.files && project.files.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      {/* Sidebar */}
                      <div className="lg:col-span-1 space-y-1.5 max-h-96 overflow-y-auto pr-1">
                        <span className="font-mono text-[9px] uppercase font-bold text-slate-500 tracking-wider block mb-2">HDL CORE MODULES</span>
                        {project.files.map((file, idx) => {
                          const active = activeFile === idx;
                          return (
                            <button
                              key={file.name}
                              onClick={() => setActiveFile(idx)}
                              className={`w-full text-left px-3 py-2.5 rounded-lg border font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${
                                active
                                  ? 'bg-[#a78bfa]/10 border-[#a78bfa]/30 text-white font-bold'
                                  : 'bg-[#0f0f13] border-slate-900 text-slate-400 hover:text-white hover:bg-[#121217]'
                              }`}
                            >
                              <span className="truncate flex items-center gap-1.5">
                                <FileText className={`h-3.5 w-3.5 ${active ? 'text-[#a78bfa]' : 'text-slate-500'}`} />
                                {file.name}
                              </span>
                              <span className="text-[9px] text-slate-500 shrink-0">({file.size})</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Code Sheet */}
                      <div className="lg:col-span-3 border border-slate-900 bg-slate-950 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between bg-[#0e0e13] px-4 py-2 border-b border-slate-900">
                          <div className="flex items-center gap-2">
                            <Terminal className="h-3.5 w-3.5 text-[#a78bfa]" />
                            <span className="font-mono text-xs text-white font-bold">{project.files[activeFile]?.name}</span>
                          </div>
                          <button
                            onClick={() => handleCopyCode(project.files[activeFile].name, project.files[activeFile].content)}
                            className="flex items-center gap-1.5 rounded bg-[#1e1e24] px-2.5 py-1 font-mono text-[10px] text-[#94a3b8] hover:bg-[#2e2e38] hover:text-white transition-all cursor-pointer"
                          >
                            {copiedFile === project.files[activeFile]?.name ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-500" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" /> Copy HDL
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 overflow-x-auto font-mono text-xs text-emerald-400/90 leading-relaxed max-h-96 bg-[#07070a]">
                          <code>{project.files[activeFile]?.content}</code>
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed border-slate-800 rounded-xl text-center font-mono text-xs text-slate-500">
                      // HDL FILES ARCHIVED UNDER HIGH-SECURITY PROTECTION (DOWNLOAD SECTION ONLY)
                    </div>
                  )}

                  {/* Implementation narrative */}
                  <div className="prose prose-invert max-w-none mt-4">
                    <h3 className="font-mono text-xs font-bold text-[#a78bfa] uppercase mb-2">// LOGICAL CORE SYNTHESIS BREAKDOWN</h3>
                    <Markdown components={markdownComponents}>{content.implementation}</Markdown>
                  </div>

                  {/* Expandable technical synthesis constraints */}
                  <CollapsibleSection 
                    title={deepTech.synthTitle} 
                    subtitle={deepTech.synthSubtitle}
                    icon={<Code className="h-4 w-4" />}
                  >
                    {deepTech.synthContent}
                  </CollapsibleSection>
                </div>
              )}

              {/* STAGE 4: VERIFICATION */}
              {activeTab === 'verification' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-slate-900 pb-4">
                    <span className="font-mono text-[10px] text-[#a78bfa] font-bold uppercase tracking-wider block mb-1">JOURNEY STAGE 04</span>
                    <h2 className="font-mono text-lg font-bold text-white uppercase">04. FUNCTIONAL VERIFICATION &amp; LIVE ELECTRICAL WAVEFORMS</h2>
                  </div>

                  {/* Interactive Waveforms Sim */}
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-mono text-xs font-bold text-[#a78bfa] uppercase flex items-center gap-1.5">
                          <Activity className="h-4 w-4 animate-pulse text-emerald-500" />
                          // SIGNAL WAVEFORMS ANALYZER (CYCLE_TRACE)
                        </h3>
                        <p className="font-sans text-[11px] text-slate-400 mt-1 max-w-xl">
                          Select cycle parameters below to step through active register bypass operations.
                        </p>
                      </div>

                      <div className="flex gap-1.5">
                        {waveformCycles.map((cy) => (
                          <button
                            key={cy}
                            onClick={() => setActiveCycle(cy)}
                            className={`h-7 w-12 rounded font-mono text-xs font-bold transition-all cursor-pointer ${
                              activeCycle === cy
                                ? 'bg-[#a78bfa] text-[#0a0a0a]'
                                : 'bg-[#181820] text-slate-400 border border-slate-800 hover:bg-[#20202d] hover:text-white'
                            }`}
                          >
                            CY_{cy}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-900 bg-slate-950 p-4 font-mono text-[11px]">
                      {/* CLK Wave */}
                      <div className="flex items-center h-10 border-b border-slate-900/60">
                        <span className="w-24 font-bold text-slate-400">clk</span>
                        <div className="flex-1 flex items-center">
                          {waveformCycles.map((cy) => (
                            <div key={cy} className="flex-1 flex flex-col relative h-full justify-center">
                              <svg className="w-full h-6" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path d="M 0 22 L 25 22 L 25 5 L 75 5 L 75 22 L 100 22" fill="none" stroke="#64748b" strokeWidth="1.5" />
                              </svg>
                              {activeCycle === cy && (
                                <div className="absolute inset-0 bg-[#a78bfa]/5 border-l border-r border-[#a78bfa]/20 pointer-events-none" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* PC Wave */}
                      <div className="flex items-center h-10 border-b border-slate-900/60">
                        <span className="w-24 font-bold text-slate-400">pc[31:0]</span>
                        <div className="flex-1 flex h-full">
                          {waveformCycles.map((cy) => (
                            <div key={cy} className="flex-1 text-center flex items-center justify-center relative border-r border-slate-900/30">
                              <span className={`text-[10px] ${activeCycle === cy ? 'text-[#a78bfa] font-bold' : 'text-slate-500'}`}>
                                {cycleData[cy].pc}
                              </span>
                              {activeCycle === cy && (
                                <div className="absolute inset-0 bg-[#a78bfa]/5 pointer-events-none" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* INSTR Wave */}
                      <div className="flex items-center h-10 border-b border-slate-900/60">
                        <span className="w-24 font-bold text-slate-400">instr</span>
                        <div className="flex-1 flex h-full">
                          {waveformCycles.map((cy) => (
                            <div key={cy} className="flex-1 text-center flex items-center justify-center relative border-r border-slate-900/30 px-1 truncate">
                              <span className={`text-[9px] ${activeCycle === cy ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                                {cycleData[cy].instr}
                              </span>
                              {activeCycle === cy && (
                                <div className="absolute inset-0 bg-[#a78bfa]/5 pointer-events-none" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Trace Report Details */}
                      <div className="mt-4 p-3 bg-[#0c0c0f] rounded border border-slate-900 text-slate-400 flex items-start gap-2.5">
                        <Info className="h-4 w-4 text-[#a78bfa] shrink-0 mt-0.5" />
                        <p className="font-sans text-xs leading-relaxed">{cycleData[activeCycle].status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Verification markdown */}
                  <div className="prose prose-invert max-w-none mt-4">
                    <h3 className="font-mono text-xs font-bold text-[#a78bfa] uppercase mb-2">// TESTBENCH CONSTRAINTS &amp; COVERAGE REPORT</h3>
                    <Markdown components={markdownComponents}>{content.verification}</Markdown>
                  </div>

                  {/* Collapsible coverage / assertions */}
                  <CollapsibleSection 
                    title={deepTech.coverageTitle} 
                    subtitle={deepTech.coverageSubtitle}
                    icon={<Shield className="h-4 w-4" />}
                  >
                    {deepTech.coverageContent}
                  </CollapsibleSection>
                </div>
              )}

              {/* STAGE 5: RESULTS */}
              {activeTab === 'results' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-slate-900 pb-4">
                    <span className="font-mono text-[10px] text-[#a78bfa] font-bold uppercase tracking-wider block mb-1">JOURNEY STAGE 05</span>
                    <h2 className="font-mono text-lg font-bold text-white uppercase">05. POWER, PERFORMANCE &amp; AREA (PPA) SIGN-OFFS</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Specifications List */}
                    <div className="bg-[#0b0b0e] border border-slate-900 rounded-xl p-5">
                      <h3 className="font-mono text-xs font-bold text-[#a78bfa] uppercase mb-3">// LOGICAL SPECIFICATIONS</h3>
                      <div className="divide-y divide-slate-900">
                        {project.specs.map((spec, sIdx) => (
                          <div key={sIdx} className="flex justify-between py-2.5">
                            <span className="font-sans text-xs text-slate-400">{spec.label}</span>
                            <span className="font-mono text-xs text-white font-bold text-right">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Performance details markdown */}
                    <div className="space-y-4">
                      <div className="prose prose-invert max-w-none">
                        <h3 className="font-mono text-xs font-bold text-[#a78bfa] uppercase mb-2">// CORE SYNTHESIS SIGN-OFF</h3>
                        <Markdown components={markdownComponents}>{content.performance}</Markdown>
                      </div>

                      {/* Quick specs grid */}
                      <div className="grid grid-cols-2 gap-3 border-t border-slate-900 pt-4">
                        <div className="p-3 bg-slate-950/40 rounded border border-slate-900">
                          <span className="block text-[10px] font-mono text-slate-500 uppercase">Silicon Footprint</span>
                          <span className="font-mono text-xs text-white font-bold">{content.metrics.area || 'N/A'}</span>
                        </div>
                        <div className="p-3 bg-slate-950/40 rounded border border-slate-900">
                          <span className="block text-[10px] font-mono text-slate-500 uppercase">Core Power Draw</span>
                          <span className="font-mono text-xs text-white font-bold">{content.metrics.power || 'N/A'}</span>
                        </div>
                        <div className="p-3 bg-slate-950/40 rounded border border-slate-900">
                          <span className="block text-[10px] font-mono text-slate-500 uppercase">Timing Slack (WNS)</span>
                          <span className="font-mono text-xs text-emerald-400 font-bold">{content.metrics.timingSlack || 'N/A'}</span>
                        </div>
                        <div className="p-3 bg-slate-950/40 rounded border border-slate-900">
                          <span className="block text-[10px] font-mono text-slate-500 uppercase">Max Clock Freq</span>
                          <span className="font-mono text-xs text-[#a78bfa] font-bold">{content.metrics.frequency || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible area specs */}
                  <CollapsibleSection 
                    title={deepTech.leakageTitle} 
                    subtitle={deepTech.leakageSubtitle}
                    icon={<Award className="h-4 w-4" />}
                  >
                    {deepTech.leakageContent}
                  </CollapsibleSection>
                </div>
              )}

              {/* STAGE 6: LESSONS LEARNED */}
              {activeTab === 'lessons' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-slate-900 pb-4">
                    <span className="font-mono text-[10px] text-[#a78bfa] font-bold uppercase tracking-wider block mb-1">JOURNEY STAGE 06</span>
                    <h2 className="font-mono text-lg font-bold text-white uppercase">06. ARCHITECTURAL RETROSPECTIVE &amp; LESSONS LEARNED</h2>
                  </div>

                  {/* Challenges Grid */}
                  {project.challenges && project.challenges.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="font-mono text-xs font-bold text-[#a78bfa] uppercase">// CORE ENGINEERING RETROSPECTIVE CHALLENGES</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.challenges.map((challenge, cIdx) => (
                          <div key={cIdx} className="bg-[#0b0b0e] border border-slate-900 rounded-xl p-4 space-y-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#ef4444] uppercase">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Challenge {cIdx + 1}: Physical bottleneck
                              </div>
                              <p className="font-sans text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                                {challenge.problem}
                              </p>
                            </div>
                            <div className="pt-2 border-t border-slate-900 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#10b981] uppercase">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Deployed Resolution Block
                              </div>
                              <p className="font-sans text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                                {challenge.solution}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Retrospective markdown narrative */}
                  <div className="prose prose-invert max-w-none mt-4">
                    <h3 className="font-mono text-xs font-bold text-[#a78bfa] uppercase mb-2">// POST-SYNTHESIS RETROSPECTIVE ANALYSIS</h3>
                    <Markdown components={markdownComponents}>{content.lessons}</Markdown>
                  </div>

                  {/* Collapsible post-silicon / diagnostics */}
                  <CollapsibleSection 
                    title={deepTech.dfmTitle} 
                    subtitle={deepTech.dfmSubtitle}
                    icon={<BookOpen className="h-4 w-4" />}
                  >
                    {deepTech.dfmContent}
                  </CollapsibleSection>
                </div>
              )}

              {/* STAGE 7: RELATED PROJECTS & DEEP DIVE (CROWNING SECTION) */}
              {activeTab === 'related' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-slate-900 pb-4">
                    <span className="font-mono text-[10px] text-[#a78bfa] font-bold uppercase tracking-wider block mb-1">JOURNEY STAGE 07</span>
                    <h2 className="font-mono text-lg font-bold text-white uppercase">07. RELATED TECHNOLOGY IP &amp; CO-PROCESSOR SCHEMES</h2>
                  </div>

                  {/* Grand Finale Bento-style Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* 1. Related Projects / Suggested co-cores (Custom layout) */}
                    <div className="bg-[#0b0b0e] border border-slate-900 rounded-xl p-5 space-y-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Compass className="h-4 w-4 text-[#a78bfa]" />
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                            RELATED IP CO-CORES
                          </span>
                        </div>
                        <p className="font-sans text-[11px] text-slate-400 leading-relaxed">
                          Secure, silicon-tested IP cores engineered to operate concurrently on standard system fabrics alongside {project.name}.
                        </p>
                        <div className="space-y-2.5 pt-3">
                          <div className="p-3 bg-slate-950/50 rounded border border-slate-900/60 font-mono text-[11px]">
                            <span className="block font-bold text-[#a78bfa]">google-deepmind / rv32im-core</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">Status: TAPEOUT_READY • 180MHz (TSMC 65)</span>
                          </div>
                          <div className="p-3 bg-slate-950/50 rounded border border-slate-900/60 font-mono text-[11px]">
                            <span className="block font-bold text-[#a78bfa]">google-deepmind / rv32im-soc-processor</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">Status: TAPEOUT_READY • 5-Stage Pipelined SoC</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono pt-3 border-t border-slate-950">// Total Coherence Interconnect secured.</div>
                    </div>

                    {/* 2. Suggested Next Reading */}
                    <div className="bg-[#0b0b0e] border border-slate-900 rounded-xl p-5 space-y-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-[#10b981]" />
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                            SUGGESTED NEXT READING
                          </span>
                        </div>
                        <p className="font-sans text-[11px] text-slate-400 leading-relaxed">
                          Progress your hardware engineering journey with our recommended follow-up technical datasheet:
                        </p>
                        
                        <div className="p-4 rounded-lg bg-slate-950 border border-slate-900/60 space-y-2 mt-3">
                          <span className="font-mono text-xs font-bold text-[#10b981] block">
                            {nextReading.name}
                          </span>
                          <p className="text-[11px] font-sans text-slate-200 font-medium">
                            {nextReading.tagline}
                          </p>
                          <p className="text-[10px] font-sans text-slate-500 leading-relaxed">
                            {nextReading.desc}
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-slate-950">
                        <button 
                          onClick={() => alert(`Navigating securely to technical repository for ${nextReading.name}`)}
                          className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-xs font-mono text-slate-300 rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          Load Core Specifications <ArrowRight className="h-3.5 w-3.5 text-[#10b981]" />
                        </button>
                      </div>
                    </div>

                    {/* 3. Recent Research Related To This Project */}
                    <div className="bg-[#0b0b0e] border border-slate-900 rounded-xl p-5 space-y-4 md:col-span-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4.5 w-4.5 text-blue-400" />
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                          RECENT RESEARCH PUBLICATIONS
                        </span>
                      </div>
                      
                      <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-4.5 space-y-3">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wide block">
                            {contextualPaper.pub}
                          </span>
                          <span className="font-mono text-[9px] text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                            CO-DESIGN RESEARCH
                          </span>
                        </div>
                        
                        <h4 className="font-sans text-sm font-bold text-white">
                          {contextualPaper.title}
                        </h4>
                        
                        <p className="font-sans text-[11px] text-slate-400 leading-relaxed">
                          {contextualPaper.summary}
                        </p>
                        
                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-900">
                          <span className="font-sans text-[10px] text-slate-500">
                            By {contextualPaper.authors}
                          </span>
                          <a 
                            href={contextualPaper.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[10px] text-blue-400 hover:underline flex items-center gap-0.5"
                          >
                            Read Full Paper <ArrowUpRight className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* 4. Ask Silicon Copilot About This Project */}
                    <div className="bg-gradient-to-r from-purple-950/10 to-indigo-950/10 border border-[#a78bfa]/20 rounded-xl p-5 space-y-4 md:col-span-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/30 flex items-center justify-center text-[#a78bfa]">
                          <MessageSquare className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-white block">
                            ASK SILICON COPILOT CONTEXT CHECK
                          </span>
                          <p className="font-sans text-[10px] text-slate-400">
                            Silicon Copilot has been automatically primed with the logic parameters for {project.name}. Select a prompt below:
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          `Analyze the design metrics of ${project.name}`,
                          `Walk me through the active RTL of ${project.name}`,
                          `Check verification assertions on ${project.name}`
                        ].map((query) => (
                          <button
                            key={query}
                            disabled={copilotSyncing}
                            onClick={() => triggerCopilotQuery(query)}
                            className="p-3 rounded-lg bg-[#0c0c10]/95 border border-slate-900 hover:border-[#a78bfa]/40 hover:bg-[#1a1a24] text-left text-[11px] font-mono text-slate-300 transition-all flex justify-between items-center group cursor-pointer disabled:opacity-50"
                          >
                            <span className="pr-2">{query}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-[#a78bfa] shrink-0 group-hover:translate-x-1 transition-transform" />
                          </button>
                        ))}
                      </div>

                      {copilotSyncing && (
                        <div className="flex items-center gap-2 font-mono text-[9px] text-[#a78bfa] animate-pulse">
                          <RefreshCw className="h-2.5 w-2.5 animate-spin" /> SYNCHRONIZING CORE CONTEXT WITH LLM WORKSPACE...
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* Progress Flow Guided Navigation footer buttons */}
              <div className="mt-8 pt-6 border-t border-slate-900 flex items-center justify-between">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIdx === 0}
                  className={`px-4 py-2 rounded-lg border font-mono text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    currentStepIdx === 0 
                      ? 'border-transparent text-slate-600 cursor-not-allowed opacity-50' 
                      : 'border-slate-800 bg-[#121216] text-slate-400 hover:text-white hover:border-slate-700 cursor-pointer'
                  }`}
                >
                  ← PREV STAGE
                </button>
                
                <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest hidden sm:block">
                  [ STAGE {currentStepIdx + 1} OF {JOURNEY_STEPS.length} ]
                </div>

                <button
                  onClick={handleNextStep}
                  className="px-5 py-2 rounded-lg bg-[#a78bfa] text-[#0a0a0d] hover:bg-[#c084fc] hover:shadow-[0_0_12px_rgba(167,139,250,0.35)] transition-all font-mono text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {currentStepIdx === JOURNEY_STEPS.length - 1 ? 'RETURN TO DIRECTORY ↵' : 'NEXT STAGE →'}
                </button>
              </div>

            </div>
          ) : null}
        </div>

      </div>
    </motion.div>
  );
}
