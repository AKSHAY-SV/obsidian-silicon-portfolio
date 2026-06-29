import React, { useState } from 'react';
import { Info, Shield, ShieldAlert, Cpu, Database, Eye } from 'lucide-react';

interface MemoryBlock {
  id: number;
  addrStart: string;
  addrEnd: string;
  regionName: string;
  category: 'BootROM' | 'Flash' | 'SRAM' | 'GPIO_APB';
  permissions: {
    read: boolean;
    write: boolean;
    exec: boolean;
  };
  details: string;
}

export default function SimMemory() {
  const [hoveredBlock, setHoveredBlock] = useState<MemoryBlock | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<MemoryBlock | null>(null);

  // Generate 256 memory grid blocks (representing 0x0000 to 0x07FF block boundaries)
  const blocks: MemoryBlock[] = [];
  for (let i = 0; i < 256; i++) {
    let regionName = 'SRAM Data';
    let category: 'BootROM' | 'Flash' | 'SRAM' | 'GPIO_APB' = 'SRAM';
    let pR = true, pW = true, pX = false;
    let details = 'L1 scratchpad data cache cell';

    const hexStart = (i * 8).toString(16).toUpperCase().padStart(4, '0');
    const hexEnd = (i * 8 + 7).toString(16).toUpperCase().padStart(4, '0');

    if (i < 32) {
      regionName = 'BootROM / Vector Table';
      category = 'BootROM';
      pW = false;
      pX = true;
      details = 'Hardware startup instruction matrix and interrupts vector table.';
    } else if (i >= 32 && i < 112) {
      regionName = 'SPI Flash Segment';
      category = 'Flash';
      pW = false;
      pX = true;
      details = 'Non-volatile program code segment mapping binary execution lines.';
    } else if (i >= 224) {
      regionName = 'APB Peripheral IO';
      category = 'GPIO_APB';
      pX = false;
      if (i < 232) {
        details = 'UART Transmit / Receive buffer buffers mapped at APB boundary.';
      } else if (i >= 232 && i < 240) {
        details = 'I2C controller state registers and device bus nodes.';
      } else if (i >= 240 && i < 248) {
        details = 'Hardware timers and watchdogs clock dividers registers.';
      } else {
        details = 'JTAG debug register boundaries mapping core TAP states.';
      }
    }

    blocks.push({
      id: i,
      addrStart: `0x${hexStart}`,
      addrEnd: `0x${hexEnd}`,
      regionName,
      category,
      permissions: { read: pR, write: pW, exec: pX },
      details
    });
  }

  const getCategoryColor = (category: 'BootROM' | 'Flash' | 'SRAM' | 'GPIO_APB') => {
    switch (category) {
      case 'BootROM':
        return 'bg-sky-500/20 border-sky-500/40 hover:bg-sky-400';
      case 'Flash':
        return 'bg-violet-600/30 border-violet-500/40 hover:bg-violet-500';
      case 'SRAM':
        return 'bg-purple-600/30 border-purple-500/40 hover:bg-purple-500';
      case 'GPIO_APB':
        return 'bg-neutral-600/30 border-neutral-500/40 hover:bg-neutral-400';
    }
  };

  const getPills = (permissions: { read: boolean; write: boolean; exec: boolean }) => {
    return (
      <div className="flex gap-1.5 font-mono text-[9px] font-bold">
        <span className={`px-1.5 rounded ${permissions.read ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          R
        </span>
        <span className={`px-1.5 rounded ${permissions.write ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          W
        </span>
        <span className={`px-1.5 rounded ${permissions.exec ? 'bg-indigo-500/10 text-indigo-400' : 'bg-red-500/10 text-red-400'}`}>
          X
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Simulation Controls Dashboard */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-5">
        <div>
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#a78bfa]">
            Physical Address Space Inspector
          </span>
          <h2 className="text-xl font-bold font-sans text-white">
            Interactive Hardware Memory Map
          </h2>
        </div>

        {/* Legend color codes */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-sky-500/30 border border-sky-500/50" />
            <span className="text-slate-300">BootROM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-violet-600/30 border border-violet-500/50" />
            <span className="text-slate-300">SPI Flash</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-purple-600/30 border border-purple-500/50" />
            <span className="text-slate-300">Coherent SRAM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-neutral-600/30 border border-neutral-500/50" />
            <span className="text-slate-300">Peripheral Mapped (APB)</span>
          </div>
        </div>
      </div>

      {/* Address Space Grid and Tooltip inspector */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Memory Grid blocks Column (Left 2-colspan) */}
        <div className="lg:col-span-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#a78bfa]">
              🎯 ADDRESS SPACE SEGMENTS GRID (1KB)
            </span>
            <span className="font-sans text-[10px] text-[#94a3b8]">
              Hover blocks to inspect physical register cells
            </span>
          </div>

          <div className="grid grid-cols-16 gap-1 border border-[rgba(255,255,255,0.05)] bg-[#0c0c0c] p-3 rounded overflow-x-auto min-w-[400px]">
            {blocks.map((block) => (
              <button
                key={block.id}
                onMouseEnter={() => setHoveredBlock(block)}
                onClick={() => setSelectedBlock(block)}
                className={`h-6 w-full rounded border transition-all duration-150 ${getCategoryColor(block.category)} ${
                  selectedBlock?.id === block.id ? 'ring-2 ring-[#a78bfa] scale-105 border-white' : ''
                }`}
                title={`${block.regionName} (${block.addrStart})`}
              />
            ))}
          </div>

          {/* Grid responsive class definitions */}
          <style dangerouslySetInnerHTML={{__html: `
            .grid-cols-16 {
              grid-template-columns: repeat(16, minmax(0, 1fr));
            }
          `}} />

          <div className="mt-4 flex items-center gap-2 font-sans text-xs text-[#94a3b8] bg-[#181818] p-3 rounded border border-[rgba(255,255,255,0.04)]">
            <Info className="h-4 w-4 text-[#a78bfa] shrink-0" />
            <span>The addressing space is parameterized into 8-byte sectors. Core buses map reads directly based on segment boundaries.</span>
          </div>
        </div>

        {/* Right Side Panel: Interactive Details / Hover Inspector card */}
        <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-5 flex flex-col justify-between items-stretch">
          
          {/* Active Hover / Select Block Details */}
          <div>
            <span className="block font-mono text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] mb-4">
              🔌 PHYSICAL BOUNDARY INSPECTOR
            </span>

            {(hoveredBlock || selectedBlock) ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Region title */}
                <div className="border-b border-[rgba(255,255,255,0.06)] pb-3">
                  <span className="text-[10px] font-mono text-[#a78bfa] block font-bold uppercase">
                    {(hoveredBlock || selectedBlock)?.category} PORT MAPPED
                  </span>
                  <h3 className="text-base font-bold text-white font-sans mt-0.5">
                    {(hoveredBlock || selectedBlock)?.regionName}
                  </h3>
                </div>

                {/* Hex boundaries */}
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="bg-[#181818] p-2.5 rounded border border-[rgba(255,255,255,0.04)]">
                    <span className="block text-[8px] text-slate-500">START ADDR:</span>
                    <span className="font-bold text-white">{(hoveredBlock || selectedBlock)?.addrStart}</span>
                  </div>
                  <div className="bg-[#181818] p-2.5 rounded border border-[rgba(255,255,255,0.04)]">
                    <span className="block text-[8px] text-slate-500">END ADDR:</span>
                    <span className="font-bold text-white">{(hoveredBlock || selectedBlock)?.addrEnd}</span>
                  </div>
                </div>

                {/* Permissions & Security */}
                <div className="bg-[#181818] p-3 rounded border border-[rgba(255,255,255,0.04)] flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-sans flex items-center gap-1">
                    <Shield className="h-4 w-4 text-[#10b981]" /> Hardware Security Flags:
                  </span>
                  {getPills((hoveredBlock || selectedBlock)!.permissions)}
                </div>

                {/* Detailed Spec text */}
                <div className="rounded border border-[rgba(255,255,255,0.05)] bg-[#0a0a0a] p-3.5">
                  <span className="block font-mono text-[9px] uppercase text-[#a78bfa] font-bold mb-1">
                    📖 Cell Register Mappings details:
                  </span>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed">
                    {(hoveredBlock || selectedBlock)?.details}
                  </p>
                </div>

              </div>
            ) : (
              <div className="rounded border border-[rgba(255,255,255,0.05)] bg-[#0a0a0a] p-10 text-center flex flex-col items-center justify-center min-h-[220px]">
                <Eye className="h-8 w-8 text-slate-500 animate-pulse mb-2" />
                <span className="block font-mono text-xs text-slate-500 uppercase font-bold tracking-wider">
                  Hover or select grid cells
                </span>
                <span className="block text-[10px] text-[#64748b] mt-1">
                  Query starting memory limits
                </span>
              </div>
            )}
          </div>

          <div className="rounded border border-[rgba(255,255,255,0.04)] bg-[#181818] p-3 font-sans text-[11px] text-[#94a3b8] flex gap-2">
            <ShieldAlert className="h-4.5 w-4.5 text-[#ef4444] shrink-0" />
            <span>
              Writing outside permitted ranges (e.g., BootROM) triggers hardware exception traps.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
