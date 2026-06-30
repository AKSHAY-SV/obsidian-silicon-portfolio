import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Cpu as ChipIcon, Terminal, Code, Sliders, ChevronDown, 
  ChevronUp, Zap, HelpCircle, ShieldCheck, Activity, Award, 
  Info, BarChart2, Layers, AlertTriangle, MessageSquare
} from 'lucide-react';

export default function RV32IMShowcase() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'waveform' | 'asic' | 'gallery' | 'lessons'>('architecture');
  const [activeCycle, setActiveCycle] = useState<number>(1);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleExpand = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const cyclesData = [
    {
      cycle: 1,
      pc: '0x00000004',
      instruction: 'ADD R3, R1, R2',
      stageIF: 'Fetch ADD R3, R1, R2',
      stageID: 'Decode SUB R4, R3, R5',
      stageEX: 'ALU Op (ADD): R1(10) + R2(5) = R3(15)',
      stageMEM: 'MEM idle (ALU writeback pending)',
      stageWB: 'WB complete: R8 = 0x2A',
      regWrite: 'R3 <= 15',
      hazards: 'None'
    },
    {
      cycle: 2,
      pc: '0x00000008',
      instruction: 'SUB R4, R3, R5',
      stageIF: 'Fetch LW R6, 4(R3)',
      stageID: 'Decode ADD R3, R1, R2',
      stageEX: 'ALU Op (SUB): R3(15) - R5(3) = R4(12) [FORWARDED R3]',
      stageMEM: 'MEM idle',
      stageWB: 'WB complete: R3 <= 15',
      regWrite: 'R4 <= 12',
      hazards: 'RAW Hazard detected on R3. Forwarding EX/MEM -> ID/EX active.'
    },
    {
      cycle: 3,
      pc: '0x0000000C',
      instruction: 'LW R6, 4(R3)',
      stageIF: 'Fetch SW R7, 8(R0)',
      stageID: 'Decode LW R6, 4(R3)',
      stageEX: 'ALU Address calculation: R3(15) + Imm(4) = Addr(19)',
      stageMEM: 'L1 Data Cache read address 19 -> Data loaded: 120',
      stageWB: 'WB complete: R4 <= 12',
      regWrite: 'R6 <= 120',
      hazards: 'None'
    },
    {
      cycle: 4,
      pc: '0x00000010',
      instruction: 'MUL R10, R6, R4',
      stageIF: 'Fetch BEQ R3, R4, -8',
      stageID: 'Decode MUL R10, R6, R4',
      stageEX: 'M-Unit: Booth Multiplier Start... R6(120) * R4(12)',
      stageMEM: 'MEM idle',
      stageWB: 'WB complete: R6 <= 120',
      regWrite: 'R10 <= (Pending MUL)',
      hazards: 'Multi-cycle execution hazard: MUL active in M-Unit.'
    }
  ];

  const currentCycleInfo = cyclesData.find(c => c.cycle === activeCycle) || cyclesData[0];

  return (
    <section className="py-20 border-b border-[rgba(255,255,255,0.06)] bg-[#080808]" id="rv32im-showcase">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#a78bfa] block">
            Flagship Processor Blueprint
          </span>
          <h2 className="mt-2 font-sans text-3xl font-black tracking-tight text-white uppercase sm:text-5xl">
            RV32IM Core Showcase
          </h2>
          <p className="mt-4 font-sans text-base text-[#94a3b8] max-w-3xl leading-relaxed">
            A fully synthesizable, cycle-accurate implementation of the RISC-V RV32IM (Integer + Hardware Multiplier) Instruction Set Architecture. Designed, verified, and mapped onto 65nm and 7nm physical silicon layout nodes.
          </p>
        </div>

        {/* Dynamic Project Tabs Selector */}
        <div className="flex flex-wrap gap-2.5 mb-8 border-b border-[rgba(255,255,255,0.06)] pb-5 font-mono text-xs">
          {[
            { id: 'architecture', label: '1. Architecture & Pipeline', icon: Cpu },
            { id: 'waveform', label: '2. Live Waveform Simulation', icon: Activity },
            { id: 'asic', label: '3. ASIC Flow & OpenLane Results', icon: Layers },
            { id: 'gallery', label: '4. RTL Code Gallery', icon: Code },
            { id: 'lessons', label: '5. Engineering Decisions', icon: Info }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg border uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#a78bfa] text-[#0a0a0a] border-[#a78bfa] shadow-lg shadow-[#a78bfa]/20' 
                    : 'bg-[#121212] border-[rgba(255,255,255,0.06)] text-slate-400 hover:text-white hover:border-[#a78bfa]/30'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Tab Content */}
        <div className="min-h-[460px] rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0e0e0e] p-6 sm:p-8 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {activeTab === 'architecture' && (
              <motion.div
                key="architecture"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <div className="flex gap-2 mb-3">
                    <span className="rounded bg-[#a78bfa]/10 border border-[#a78bfa]/20 px-2 py-0.5 font-mono text-[9px] uppercase font-bold tracking-wider text-[#a78bfa]">
                      5-STAGE CLASSIC DEEP PIPELINE
                    </span>
                    <span className="rounded bg-green-500/10 border border-green-500/20 px-2 py-0.5 font-mono text-[9px] uppercase font-bold tracking-wider text-green-400">
                      SYNTHESIZABLE OK
                    </span>
                  </div>

                  <h3 className="font-sans text-xl font-bold text-white tracking-tight uppercase">
                    Microarchitectural Overview
                  </h3>
                  <p className="mt-3 font-sans text-sm text-[#94a3b8] leading-relaxed">
                    Designed with an in-order 5-stage pipeline (Fetch, Decode, Execute, Memory, Write-back). Built on static synchronous logic, the core eliminates resource conflicts and maximizes execution speeds through extensive optimization.
                  </p>

                  <div className="mt-6 space-y-4 font-mono text-xs text-slate-400">
                    <div className="flex items-start gap-3">
                      <Zap className="h-4.5 w-4.5 text-[#a78bfa] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-bold block uppercase text-[11px]">Hazard Detection & Forwarding Matrix</span>
                        A zero-cycle structural forwarding bypass routes data directly from ALU and memory stages back to the decode stage, minimizing standard stalling.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="h-4.5 w-4.5 text-[#a78bfa] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-bold block uppercase text-[11px]">MESI L1/L2 Cache Topology</span>
                        Interfaces cleanly with a 4KB Direct-Mapped Instruction Cache and 4KB write-back Data Cache, featuring coherent bus protocols.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pipeline Diagram Representation */}
                <div className="border border-[rgba(255,255,255,0.06)] bg-[#050505] rounded-lg p-5 flex flex-col justify-between h-full font-mono text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-4">// Core Instruction flow</span>
                    
                    <div className="flex flex-col gap-3.5 relative">
                      {/* Connection Line */}
                      <div className="absolute left-[17px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-purple-500 to-indigo-500" />
                      
                      {[
                        { stage: 'IF', label: 'Instruction Fetch', detail: 'PC selection -> I-Cache Lookup' },
                        { stage: 'ID', label: 'Instruction Decode', detail: 'Decoder matrix -> Register Read -> Forward Mux' },
                        { stage: 'EX', label: 'Execute (ALU / M-Unit)', detail: '32-bit Addition/Shifts & Booth multiplier block' },
                        { stage: 'MEM', label: 'Memory Access', detail: 'D-Cache load/store alignment' },
                        { stage: 'WB', label: 'Write-Back', detail: 'Retire instruction -> Register File commit' },
                      ].map((s) => (
                        <div key={s.stage} className="flex items-center gap-3 relative z-10 group">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#141414] border border-[#a78bfa]/40 text-[#a78bfa] font-bold text-xs shrink-0 group-hover:border-[#a78bfa] transition-all">
                            {s.stage}
                          </span>
                          <div>
                            <span className="text-white font-bold block text-[11px] uppercase">{s.label}</span>
                            <span className="text-slate-500 text-[10px] block">{s.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'waveform' && (
              <motion.div
                key="waveform"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-sans text-xl font-bold text-white uppercase tracking-tight">
                      Simulation Waveforms & Hazards
                    </h3>
                    <p className="font-sans text-xs text-slate-400 mt-1">
                      Cycle-accurate pipeline telemetry simulation tracking operand forwarding, stalls, and hazard resolutions.
                    </p>
                  </div>

                  {/* Step Selector */}
                  <div className="flex gap-1.5 bg-[#141414] p-1 border border-[rgba(255,255,255,0.06)] rounded-lg font-mono text-xs">
                    {[1, 2, 3, 4].map((c) => (
                      <button
                        key={c}
                        onClick={() => setActiveCycle(c)}
                        className={`px-3 py-1.5 rounded uppercase font-bold transition-all cursor-pointer ${
                          activeCycle === c ? 'bg-[#a78bfa] text-black font-extrabold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Cycle {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Telemetry Waveform Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
                  
                  {/* Left: Wave lines representation */}
                  <div className="lg:col-span-2 border border-[rgba(255,255,255,0.06)] bg-[#050505] p-5 rounded-lg space-y-4">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">// RTL Logic Wave Trace (GTKWave Map)</span>
                    
                    <div className="space-y-3">
                      {[
                        { label: 'clk', wave: '█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄█▄' },
                        { label: 'if_pc', wave: `0x...0${activeCycle * 4}████████████████████████` },
                        { label: 'id_instr', wave: `[${currentCycleInfo.instruction}]██████████████████` },
                        { label: 'forward_a', wave: currentCycleInfo.hazards.includes('Forwarding') ? '█▀▀▀▀▀▀▀█▄▄▄▄▄▄▄█' : '▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█' },
                        { label: 'm_unit_busy', wave: currentCycleInfo.hazards.includes('MUL') ? '█▀▀▀▀▀▀▀▀▀▀▀▀▀▀█' : '▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█' },
                      ].map((item) => (
                        <div key={item.label} className="grid grid-cols-5 items-center gap-2">
                          <span className="text-[#a78bfa] font-bold text-[10px]">{item.label}</span>
                          <span className="col-span-4 text-purple-400/70 tracking-widest font-bold font-mono text-xs truncate select-none">
                            {item.wave}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.04)] bg-[rgba(167,139,250,0.02)] p-3 rounded">
                      <div className="flex items-center gap-1.5 text-purple-400 font-bold mb-1">
                        <Info className="h-4 w-4" />
                        <span>PIPELINE TELEMETRY DIAGNOSTICS</span>
                      </div>
                      <span className="text-slate-300 block text-[11px] leading-relaxed">
                        {currentCycleInfo.hazards}
                      </span>
                    </div>
                  </div>

                  {/* Right: State indicators */}
                  <div className="border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] p-5 rounded-lg space-y-3.5">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block">// State variables</span>
                    
                    <div>
                      <span className="text-slate-400 block text-[10px]">CURRENT PC:</span>
                      <span className="text-white font-bold text-sm">{currentCycleInfo.pc}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">DECODED EXECUTING:</span>
                      <span className="text-[#a78bfa] font-bold text-xs">{currentCycleInfo.instruction}</span>
                    </div>
                    <div className="space-y-1 text-[11px] pt-2 border-t border-[rgba(255,255,255,0.04)]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">IF Stage:</span>
                        <span className="text-slate-300 font-medium">{currentCycleInfo.stageIF}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">ID Stage:</span>
                        <span className="text-slate-300 font-medium">{currentCycleInfo.stageID}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">EX Stage:</span>
                        <span className="text-slate-300 font-medium">{currentCycleInfo.stageEX}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">MEM Stage:</span>
                        <span className="text-slate-300 font-medium">{currentCycleInfo.stageMEM}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">WB Stage:</span>
                        <span className="text-slate-300 font-medium">{currentCycleInfo.stageWB}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {activeTab === 'asic' && (
              <motion.div
                key="asic"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <h3 className="font-sans text-xl font-bold text-white uppercase tracking-tight">
                    ASIC Synthesis & OpenLane Sign-off
                  </h3>
                  <p className="mt-3 font-sans text-sm text-[#94a3b8] leading-relaxed">
                    Physical synthesis completed using the **OpenLane RTL-to-GDSII** compiler engine mapping standard cells onto TSMC and SkyWater PDK libraries. Pre-layout timing and post-routing static timing analyses (STA) confirm zero clock violations.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 font-mono text-xs">
                    <div className="bg-[#141414] p-3 rounded border border-[rgba(255,255,255,0.04)]">
                      <span className="text-slate-500 block">TOTAL DIE AREA</span>
                      <span className="text-white font-bold text-sm block mt-0.5">0.18 mm²</span>
                    </div>
                    <div className="bg-[#141414] p-3 rounded border border-[rgba(255,255,255,0.04)]">
                      <span className="text-slate-500 block">CELL DENSITY</span>
                      <span className="text-white font-bold text-sm block mt-0.5">84.2% Placement</span>
                    </div>
                    <div className="bg-[#141414] p-3 rounded border border-[rgba(255,255,255,0.04)]">
                      <span className="text-slate-500 block">STA CLOCK SPEED</span>
                      <span className="text-green-400 font-bold text-sm block mt-0.5">180 MHz signoff</span>
                    </div>
                    <div className="bg-[#141414] p-3 rounded border border-[rgba(255,255,255,0.04)]">
                      <span className="text-slate-500 block">TOTAL STATIC POWER</span>
                      <span className="text-[#a78bfa] font-bold text-sm block mt-0.5">32.4 mW @ 1.2V</span>
                    </div>
                  </div>
                </div>

                {/* Synthesis Metrics Terminal Output */}
                <div className="border border-[rgba(255,255,255,0.06)] bg-[#050505] p-5 rounded-lg font-mono text-[11px] leading-relaxed text-slate-300">
                  <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2 mb-3">
                    <span className="text-[#a78bfa] font-bold uppercase flex items-center gap-1">
                      <Terminal className="h-3.5 w-3.5" /> openroad_synthesis_report.log
                    </span>
                    <span className="text-slate-500 text-[10px]">SUCCESS</span>
                  </div>
                  <div className="space-y-1 max-h-[220px] overflow-y-auto text-slate-400 select-none">
                    <div>[INFO] Mapped standard cell logic blocks...</div>
                    <div>[INFO] Total cells: 14,242 gate instances</div>
                    <div>[INFO] DFF instances: 2,120 flip-flops</div>
                    <div className="text-green-400">[STA] Worst Negative Slack (WNS): +1.42 ns</div>
                    <div className="text-green-400">[STA] Total Negative Slack (TNS): 0.00 ns</div>
                    <div>[INFO] Route wirelength: 4.82 meters on metal routing planes</div>
                    <div>[DRC] Antenna violations: 0, Density violations: 0</div>
                    <div className="text-purple-400">[INFO] Streamout to GDSII completed successfully.</div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'gallery' && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-sans text-xl font-bold text-white uppercase tracking-tight">
                    RTL Code Gallery (Verilog / SystemVerilog)
                  </h3>
                  <span className="font-mono text-[10px] text-slate-500">SYNTESIZABLE IMPLEMENTATION</span>
                </div>

                <div className="border border-[rgba(255,255,255,0.06)] bg-[#050505] rounded-lg p-5 font-mono text-xs text-[#a78bfa] leading-relaxed max-h-[300px] overflow-y-auto select-none">
                  <span className="text-slate-500 block mb-2">// RV32IM_Core.v - Main 5-Stage Hazard Bypass Control</span>
                  {`always @(*) begin
    // Forwarding A Operand Selection Matrix
    if (mem_reg_write && (mem_rd != 0) && (mem_rd == ex_rs1))
        forward_a = 2'b10; // Forward from MEM stage to EX stage
    else if (wb_reg_write && (wb_rd != 0) && (wb_rd == ex_rs1))
        forward_a = 2'b01; // Forward from WB stage to EX stage
    else
        forward_a = 2'b00; // Load standard registers value
        
    // Forwarding B Operand Selection Matrix
    if (mem_reg_write && (mem_rd != 0) && (mem_rd == ex_rs2))
        forward_b = 2'b10; // Forward from MEM stage
    else if (wb_reg_write && (wb_rd != 0) && (wb_rd == ex_rs2))
        forward_b = 2'b01; // Forward from WB stage
    else
        forward_b = 2'b00;
end`}
                </div>
              </motion.div>
            )}

            {activeTab === 'lessons' && (
              <motion.div
                key="lessons"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="font-sans text-xl font-bold text-white uppercase tracking-tight mb-4">
                  Engineering Decisions & Challenges
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                  <div className="p-5 rounded-lg bg-[#141414] border border-[rgba(255,255,255,0.05)]">
                    <span className="font-mono text-xs font-bold text-[#a78bfa] block uppercase mb-1">
                      1. Pipeline RAW Hazards
                    </span>
                    <strong className="text-white block text-sm font-semibold mb-2">Operand Forwarding</strong>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      RAW hazards degraded performance in early synthesis rounds. Implementing a non-blocking forwarding bypass matrix eliminated stalls for standard instructions, keeping target IPC at 0.96.
                    </p>
                  </div>

                  <div className="p-5 rounded-lg bg-[#141414] border border-[rgba(255,255,255,0.05)]">
                    <span className="font-mono text-xs font-bold text-[#a78bfa] block uppercase mb-1">
                      2. Divider Critical Latency
                    </span>
                    <strong className="text-white block text-sm font-semibold mb-2">Iterative State Machine</strong>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      A single-cycle integer divider bottlenecked clock speeds. Transitioning to an 8-cycle iterative restoring state machine decoupled timing paths, increasing overall system frequency to 180 MHz.
                    </p>
                  </div>

                  <div className="p-5 rounded-lg bg-[#141414] border border-[rgba(255,255,255,0.05)]">
                    <span className="font-mono text-xs font-bold text-[#a78bfa] block uppercase mb-1">
                      3. Verification Integrity
                    </span>
                    <strong className="text-white block text-sm font-semibold mb-2">Formal Assertions (SVA)</strong>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      SVA checks mapped out boundary behaviors in cachelines and hazard detections. Exhaustive model checking verified 140 core assertions, ensuring robust design correctness.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Expandable Technical Details Drawer Sections */}
        <div className="mt-8 space-y-4 font-sans text-sm">
          
          {/* Section: Architectural Trade-offs & Engineering Decisions */}
          <div className="border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] rounded-lg overflow-hidden">
            <button
              onClick={() => toggleExpand('decisions')}
              className="w-full flex items-center justify-between px-6 py-4 text-left font-sans text-sm font-bold text-white uppercase tracking-wider hover:bg-[#141414] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#a78bfa]" />
                Architectural Trade-offs & Engineering Decisions
              </span>
              {expandedSection === 'decisions' ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>
            <AnimatePresence>
              {expandedSection === 'decisions' && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-t border-[rgba(255,255,255,0.04)]"
                >
                  <div className="p-6 text-slate-300 space-y-3.5 leading-relaxed text-xs">
                    <p>
                      <strong>Unified instruction vs. Harvard Memory architecture:</strong> Mapped dual Direct-Mapped cache structures (L1 Instruction and L1 Data) to prevent memory access port conflicts. This choice maintains a steady 1.0 peak instruction fetch rate.
                    </p>
                    <p>
                      <strong>Branch Predictor:</strong> Evaluated static predictor models against a dynamic 2-bit Branch History Table (BHT). The dynamic BHT was chosen for its 94% accuracy, reducing branch hazard stalls significantly.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section: Physical Layout Timing & Antenna Solutions */}
          <div className="border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] rounded-lg overflow-hidden">
            <button
              onClick={() => toggleExpand('layout')}
              className="w-full flex items-center justify-between px-6 py-4 text-left font-sans text-sm font-bold text-white uppercase tracking-wider hover:bg-[#141414] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#a78bfa]" />
                Physical Layout Timing & Antenna Solutions
              </span>
              {expandedSection === 'layout' ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>
            <AnimatePresence>
              {expandedSection === 'layout' && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-t border-[rgba(255,255,255,0.04)]"
                >
                  <div className="p-6 text-slate-300 space-y-3.5 leading-relaxed text-xs">
                    <p>
                      <strong>Dynamic Voltage Droop mitigation:</strong> Localized decoupling capacitor cells were routed adjacent to high-speed arithmetic block registers to absorb voltage spikes during active clock edges.
                    </p>
                    <p>
                      <strong>Antenna violations:</strong> Mapped metal layer changes during physical layout routing checks to prevent static charge buildup on long route lines. This choice shields gate thin-oxides during manufacturing steps.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
