import React, { useState } from 'react';
import { Play, Pause, ChevronRight, RotateCcw, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface PipelineStageState {
  instr: string;
  pc: string;
  desc: string;
}

const PROGRAM_ROM = [
  { instr: 'ADD R3, R1, R2', pc: '0x0000', op: 'ADD', r3: 15, hazard: false, desc: 'Add R1 (5) and R2 (10). Result R3=15.' },
  { instr: 'SUB R4, R3, R5', pc: '0x0004', op: 'SUB', r4: 12, hazard: true, desc: 'RAW Hazard detected on R3! Forwarding active.' },
  { instr: 'AND R6, R4, R1', pc: '0x0008', op: 'AND', r6: 4, hazard: true, desc: 'Hazard detected on R4. Forwarding from WB stage.' },
  { instr: 'LW R7, 4(R0)',   pc: '0x000C', op: 'LW',  r7: 100, hazard: false, desc: 'Load memory address 4. R7=100.' },
  { instr: 'OR R8, R7, R2',  pc: '0x0010', op: 'OR',  r8: 110, hazard: true, desc: 'Data dependency on load. 1-cycle stall inserted.' },
  { instr: 'SW R8, 8(R0)',   pc: '0x0014', op: 'SW',  r8: 110, hazard: false, desc: 'Store R8 (110) to Memory Address 8.' }
];

export default function SimPipeline() {
  const [cycle, setCycle] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hazardDetected, setHazardDetected] = useState<boolean>(false);
  const [registers, setRegisters] = useState<Record<string, number>>({
    R0: 0, R1: 5, R2: 10, R3: 0, R4: 0, R5: 3, R6: 0, R7: 0, R8: 0
  });

  const [stages, setStages] = useState<Record<string, PipelineStageState>>({
    IF: { instr: 'NOP', pc: '--', desc: 'Awaiting instruction cycle.' },
    ID: { instr: 'NOP', pc: '--', desc: 'Decoder pipeline empty.' },
    EX: { instr: 'NOP', pc: '--', desc: 'Execution unit inactive.' },
    MEM: { instr: 'NOP', pc: '--', desc: 'Data memory path nominal.' },
    WB: { instr: 'NOP', pc: '--', desc: 'Writeback register queue empty.' }
  });

  const stepCycle = () => {
    setCycle(prev => prev + 1);

    // Calculate pipeline movement based on cycle count
    const nextIFIndex = cycle % PROGRAM_ROM.length;
    
    // Shift pipeline stages with latency modeling
    const nextWB = stages.MEM;
    const nextMEM = stages.EX;
    const nextEX = stages.ID;
    const nextID = stages.IF;
    const nextIF = {
      instr: PROGRAM_ROM[nextIFIndex].instr,
      pc: PROGRAM_ROM[nextIFIndex].pc,
      desc: PROGRAM_ROM[nextIFIndex].desc
    };

    // Update Register values if something reaches WB stage
    const updatedRegisters = { ...registers };
    let hasHazard = false;

    if (nextWB.instr !== 'NOP') {
      const parts = nextWB.instr.split(' ');
      const op = parts[0];
      const destReg = parts[1]?.replace(',', '');
      
      const matchedRom = PROGRAM_ROM.find(r => r.instr === nextWB.instr);
      if (matchedRom && destReg && updatedRegisters[destReg] !== undefined) {
        if (destReg === 'R3') updatedRegisters.R3 = matchedRom.r3;
        else if (destReg === 'R4') updatedRegisters.R4 = matchedRom.r4;
        else if (destReg === 'R6') updatedRegisters.R6 = matchedRom.r6;
        else if (destReg === 'R7') updatedRegisters.R7 = matchedRom.r7;
        else if (destReg === 'R8') updatedRegisters.R8 = matchedRom.r8;
      }
    }

    // Hazard evaluation (e.g. if the EX stage register depends on previous stages output)
    if (nextEX.instr !== 'NOP' && nextID.instr !== 'NOP') {
      const exDest = nextEX.instr.split(' ')[1]?.replace(',', '');
      const idSource1 = nextID.instr.split(' ')[2]?.replace(',', '');
      const idSource2 = nextID.instr.split(' ')[3]?.replace(',', '');
      
      if (exDest && (exDest === idSource1 || exDest === idSource2)) {
        hasHazard = true;
      }
    }

    setRegisters(updatedRegisters);
    setHazardDetected(hasHazard);
    setStages({
      IF: nextIF,
      ID: nextID,
      EX: nextEX,
      MEM: nextMEM,
      WB: nextWB
    });
  };

  const resetPipeline = () => {
    setCycle(0);
    setHazardDetected(false);
    setRegisters({
      R0: 0, R1: 5, R2: 10, R3: 0, R4: 0, R5: 3, R6: 0, R7: 0, R8: 0
    });
    setStages({
      IF: { instr: 'NOP', pc: '--', desc: 'Awaiting instruction cycle.' },
      ID: { instr: 'NOP', pc: '--', desc: 'Decoder pipeline empty.' },
      EX: { instr: 'NOP', pc: '--', desc: 'Execution unit inactive.' },
      MEM: { instr: 'NOP', pc: '--', desc: 'Data memory path nominal.' },
      WB: { instr: 'NOP', pc: '--', desc: 'Writeback register queue empty.' }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Simulation Controls Dashboard */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-5">
        <div>
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#a78bfa]">
            CPU Micro-Architecture Simulator
          </span>
          <h2 className="text-xl font-bold font-sans text-white">
            RV32IM Core Pipeline Explorer
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={stepCycle}
            className="flex items-center gap-1.5 rounded bg-[#a78bfa] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#0a0a0a] hover:bg-[#bca5ff] active:scale-95 transition-all"
          >
            Step Cycle <ChevronRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={resetPipeline}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] text-[#94a3b8] hover:bg-[#1a1a1a] hover:text-white transition-all"
            title="Reset CPU Simulation"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <div className="ml-2 rounded border border-[rgba(255,255,255,0.08)] bg-[#181818] px-3 py-1.5 font-mono text-xs">
            CYCLE COUNT: <span className="text-[#a78bfa] font-bold">{cycle}</span>
          </div>
        </div>
      </div>

      {/* Interactive Visual Pipeline Datapath Stages */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        
        {/* Stage 1: IF */}
        <div className={`rounded-lg border p-4 transition-all duration-300 ${
          stages.IF.instr !== 'NOP' ? 'bg-[#181818] border-[#a78bfa]/40 shadow-lg shadow-[#a78bfa]/5' : 'bg-[#121212] border-[rgba(255,255,255,0.04)] opacity-50'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#a78bfa]">
              01 Fetch (IF)
            </span>
            <span className="font-mono text-[9px] text-slate-500">PC: {stages.IF.pc}</span>
          </div>
          <div className="rounded bg-[#0c0c0c] p-2.5 text-center font-mono text-xs font-bold text-white border border-[rgba(255,255,255,0.04)]">
            {stages.IF.instr}
          </div>
          <p className="mt-2 text-[10px] font-sans text-[#94a3b8] leading-normal">
            Fetches next instruction from L1 Instruction Cache.
          </p>
        </div>

        {/* Stage 2: ID */}
        <div className={`rounded-lg border p-4 transition-all duration-300 ${
          stages.ID.instr !== 'NOP' ? 'bg-[#181818] border-[#a78bfa]/40' : 'bg-[#121212] border-[rgba(255,255,255,0.04)] opacity-50'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#a78bfa]">
              02 Decode (ID)
            </span>
            <span className="font-mono text-[9px] text-slate-500">PC: {stages.ID.pc}</span>
          </div>
          <div className="rounded bg-[#0c0c0c] p-2.5 text-center font-mono text-xs font-bold text-white border border-[rgba(255,255,255,0.04)]">
            {stages.ID.instr}
          </div>
          <p className="mt-2 text-[10px] font-sans text-[#94a3b8] leading-normal">
            Decodes registers and identifies ALU operations.
          </p>
        </div>

        {/* Stage 3: EX */}
        <div className={`relative rounded-lg border p-4 transition-all duration-300 ${
          stages.EX.instr !== 'NOP'
            ? hazardDetected ? 'bg-[#3b2314] border-[#f59e0b]/50 shadow-lg shadow-[#f59e0b]/5' : 'bg-[#181818] border-[#a78bfa]/40'
            : 'bg-[#121212] border-[rgba(255,255,255,0.04)] opacity-50'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#a78bfa]">
              03 Execute (EX)
            </span>
            <span className="font-mono text-[9px] text-slate-500">PC: {stages.EX.pc}</span>
          </div>
          <div className="rounded bg-[#0c0c0c] p-2.5 text-center font-mono text-xs font-bold text-white border border-[rgba(255,255,255,0.04)]">
            {stages.EX.instr}
          </div>
          <p className="mt-2 text-[10px] font-sans text-[#94a3b8] leading-normal">
            Executes logic addition or integer divisions.
          </p>

          {/* Hazard flag inside block */}
          {hazardDetected && (
            <div className="absolute -top-2.5 -right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#f59e0b] shadow-md shadow-[#f59e0b]/20" title="Bypassing Raw Hazard!">
              <AlertTriangle className="h-3 w-3 text-black font-bold" />
            </div>
          )}
        </div>

        {/* Stage 4: MEM */}
        <div className={`rounded-lg border p-4 transition-all duration-300 ${
          stages.MEM.instr !== 'NOP' ? 'bg-[#181818] border-[#a78bfa]/40' : 'bg-[#121212] border-[rgba(255,255,255,0.04)] opacity-50'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#a78bfa]">
              04 Memory (MEM)
            </span>
            <span className="font-mono text-[9px] text-slate-500">PC: {stages.MEM.pc}</span>
          </div>
          <div className="rounded bg-[#0c0c0c] p-2.5 text-center font-mono text-xs font-bold text-white border border-[rgba(255,255,255,0.04)]">
            {stages.MEM.instr}
          </div>
          <p className="mt-2 text-[10px] font-sans text-[#94a3b8] leading-normal">
            Loads/Stores data payloads from SRAM cache banks.
          </p>
        </div>

        {/* Stage 5: WB */}
        <div className={`rounded-lg border p-4 transition-all duration-300 ${
          stages.WB.instr !== 'NOP' ? 'bg-[#181818] border-[#10b981]/40 shadow-lg shadow-[#10b981]/5' : 'bg-[#121212] border-[rgba(255,255,255,0.04)] opacity-50'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#10b981]">
              05 Writeback (WB)
            </span>
            <span className="font-mono text-[9px] text-slate-500">PC: {stages.WB.pc}</span>
          </div>
          <div className="rounded bg-[#0c0c0c] p-2.5 text-center font-mono text-xs font-bold text-white border border-[rgba(255,255,255,0.04)]">
            {stages.WB.instr}
          </div>
          <p className="mt-2 text-[10px] font-sans text-[#94a3b8] leading-normal">
            Writes calculated output back into General Registers.
          </p>
        </div>

      </div>

      {/* Hazard Bypass Alerts & Register files */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Register File Panel */}
        <div className="lg:col-span-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-5">
          <span className="block font-mono text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] mb-4">
            💾 CPU GENERAL PURPOSE REGISTER FILE
          </span>
          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            {Object.entries(registers).map(([reg, val]) => (
              <div key={reg} className="flex justify-between items-center p-2.5 rounded bg-[#181818] border border-[rgba(255,255,255,0.04)]">
                <span className="text-[#a78bfa] font-bold">{reg}</span>
                <span className="text-white font-semibold">
                  {val} <span className="text-[10px] text-slate-500">(0x{("000" + Number(val).toString(16).toUpperCase()).slice(-4)})</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hazard Diagnostic Console */}
        <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-5 flex flex-col justify-between">
          <div>
            <span className="block font-mono text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] mb-3">
              📢 DYNAMIC PIPELINE TELEMETRY
            </span>
            
            {hazardDetected ? (
              <div className="rounded border border-[#f59e0b]/20 bg-[#f59e0b]/5 p-3.5 mb-4">
                <div className="flex items-center gap-2 text-[#f59e0b] font-mono text-xs font-bold">
                  <AlertTriangle className="h-4 w-4" /> Hazard Detoured!
                </div>
                <p className="mt-1.5 font-sans text-xs text-[#94a3b8] leading-relaxed">
                  RAW (Read After Write) Hazard detected! Operand bypass network has hot-wired ALU EX inputs to prevent insertion of 3-cycle bubbles.
                </p>
              </div>
            ) : (
              <div className="rounded border border-[#10b981]/20 bg-[#10b981]/5 p-3.5 mb-4">
                <div className="flex items-center gap-2 text-[#10b981] font-mono text-xs font-bold">
                  <CheckCircle className="h-4 w-4" /> Pipeline Nominal
                </div>
                <p className="mt-1.5 font-sans text-xs text-[#94a3b8] leading-relaxed">
                  Datapath instructions are flowing seamlessly. Zero stalls or register collision events encountered in the current cycle.
                </p>
              </div>
            )}
          </div>

          <div className="rounded border border-[rgba(255,255,255,0.04)] bg-[#181818] p-3 font-sans text-[11px] text-[#94a3b8]">
            <span className="font-mono text-[10px] font-bold text-white block uppercase mb-1">
              💡 PIPELINE NOTES:
            </span>
            Step cycles repeatedly to view consecutive instruction memory loading and physical bypassing mechanics.
          </div>
        </div>

      </div>

    </div>
  );
}
