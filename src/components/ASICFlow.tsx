import React, { useState } from 'react';
import { TIMELINE_STAGES } from '../data';
import { TimelineStage } from '../types';
import { Check, Rocket, Lock, ArrowRight, ShieldCheck, Terminal, Settings2, HelpCircle } from 'lucide-react';

export default function ASICFlow() {
  const [activeStageId, setActiveStageId] = useState<string>('06-placement'); // Placement is active in data.ts
  
  const currentStage = TIMELINE_STAGES.find(s => s.id === activeStageId) || TIMELINE_STAGES[5];

  const getStatusIcon = (status: 'done' | 'active' | 'pending') => {
    switch (status) {
      case 'done':
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981]">
            <Check className="h-3.5 w-3.5" />
          </div>
        );
      case 'active':
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#a78bfa]/15 border border-[#a78bfa] text-[#a78bfa] animate-pulse">
            <Rocket className="h-3.5 w-3.5" />
          </div>
        );
      case 'pending':
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#242424] border border-[rgba(255,255,255,0.08)] text-[#64748b]">
            <Lock className="h-3.5 w-3.5" />
          </div>
        );
    }
  };

  return (
    <section className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="mb-8 text-center md:text-left">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#a78bfa]">
            Digital Synthesis Pipeline
          </span>
          <h1 className="mt-2 font-sans text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            ASIC RTL-TO-GDSII FLOW
          </h1>
          <p className="mt-3 font-sans text-base text-[#94a3b8]">
            Trace physical backend implementation phases compiled under automated synthesis toolchains (OpenROAD / Synopsys Compiler).
          </p>
        </div>

        {/* Dashboard 2-Column Split */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Column 1: Vertical Stages Navigator (Left Pipeline Rail) */}
          <div className="lg:col-span-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-5 h-[550px] overflow-y-auto">
            <span className="block font-mono text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] mb-4">
              📐 AUTOMATED RTL-TO-GDSII STAGES
            </span>

            <div className="relative pl-4 space-y-4 border-l border-[rgba(255,255,255,0.06)]">
              {TIMELINE_STAGES.map((stage) => {
                const isActive = stage.id === activeStageId;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStageId(stage.id)}
                    className={`relative w-full flex items-center justify-between gap-3 text-left p-2.5 rounded-lg border transition-all duration-300 ${
                      isActive
                        ? 'bg-[#181818] border-[#a78bfa]/50 shadow-md'
                        : 'bg-transparent border-transparent hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {/* Active highlight dot indicator */}
                    {isActive && (
                      <span className="absolute -left-[21px] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-[#a78bfa] border-2 border-[#121212]" />
                    )}
                    
                    <div className="flex flex-col">
                      <span className={`font-mono text-xs font-bold ${isActive ? 'text-[#a78bfa]' : 'text-slate-300'}`}>
                        {stage.name}
                      </span>
                      <span className="font-sans text-[10px] text-[#94a3b8] line-clamp-1">
                        {stage.description}
                      </span>
                    </div>

                    <div>{getStatusIcon(stage.status)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2 & 3: Active Stage Details & Inspector */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Stage Inspector Container */}
            <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6 flex-1 flex flex-col justify-between">
              
              {/* Header */}
              <div>
                <div className="mb-4 flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#a78bfa]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#a78bfa]">
                      Stage ID: {currentStage.id.toUpperCase()}
                    </span>
                    <h2 className="font-mono text-lg font-bold text-white tracking-tight">
                      {currentStage.name}
                    </h2>
                  </div>
                  
                  <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                    currentStage.status === 'done' ? 'bg-[#10b981]/10 text-[#10b981]' :
                    currentStage.status === 'active' ? 'bg-[#a78bfa]/10 text-[#a78bfa] animate-pulse' : 'bg-neutral-800 text-[#64748b]'
                  }`}>
                    {currentStage.status.toUpperCase()}
                  </span>
                </div>

                <p className="font-sans text-sm text-[#e2e8f0] leading-relaxed mb-6">
                  {currentStage.description}
                </p>

                {/* Input vs Output Files Database */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Inputs */}
                  <div className="rounded border border-[rgba(255,255,255,0.04)] bg-[#181818] p-4">
                    <span className="block font-mono text-[9px] uppercase font-bold text-[#94a3b8] mb-2">
                      📥 Source / Input Artifacts
                    </span>
                    <ul className="space-y-1.5 font-mono text-xs text-slate-300">
                      {currentStage.inputFiles.map((file, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-[#94a3b8]" />
                          {file}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Outputs */}
                  <div className="rounded border border-[rgba(255,255,255,0.04)] bg-[#181818] p-4">
                    <span className="block font-mono text-[9px] uppercase font-bold text-[#a78bfa] mb-2">
                      📤 Compiled / Output Targets
                    </span>
                    <ul className="space-y-1.5 font-mono text-xs text-[#a78bfa]">
                      {currentStage.outputFiles.map((file, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-[#a78bfa]" />
                          {file}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Active Toolchains Badges */}
                <div className="mb-6">
                  <span className="block font-mono text-[9px] uppercase font-bold text-[#94a3b8] mb-2">
                    🛠️ ACTIVE HARDWARE CAD TOOLCHAIN
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentStage.toolchains.map((tool, idx) => (
                      <span
                        key={idx}
                        className="rounded border border-[rgba(255,255,255,0.08)] bg-[#202020] px-3 py-1 font-mono text-xs text-white"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Engineering Terminal Logs Notes */}
              <div className="rounded border border-[rgba(255,255,255,0.05)] bg-[#0a0a0a] p-4">
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#94a3b8] uppercase mb-1.5">
                  <Terminal className="h-3.5 w-3.5 text-[#a78bfa]" /> Compiler Engineering Console Notes
                </div>
                <p className="font-mono text-xs text-emerald-400 leading-relaxed">
                  &gt; {currentStage.notes}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Aggregated PPA Sign-off Dashboard (Bottom) */}
        <div className="mt-8 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Settings2 className="h-4.5 w-4.5 text-[#a78bfa]" /> Silicon physical PPA Sign-off estimates
            </span>
            <span className="font-mono text-[10px] text-[#10b981] flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Timing margin fully closed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 font-mono text-center">
            <div className="rounded bg-[#181818] p-4 border border-[rgba(255,255,255,0.04)]">
              <span className="block text-[10px] text-[#94a3b8] uppercase">Target Clock Freq</span>
              <span className="mt-1 block text-lg font-bold text-white">3.2 GHz</span>
            </div>
            <div className="rounded bg-[#181818] p-4 border border-[rgba(255,255,255,0.04)]">
              <span className="block text-[10px] text-[#94a3b8] uppercase">Layout Die Area</span>
              <span className="mt-1 block text-lg font-bold text-white">12.54 mm²</span>
            </div>
            <div className="rounded bg-[#181818] p-4 border border-[rgba(255,255,255,0.04)]">
              <span className="block text-[10px] text-[#94a3b8] uppercase">Static Leakage Power</span>
              <span className="mt-1 block text-lg font-bold text-[#a78bfa]">452 mW</span>
            </div>
            <div className="rounded bg-[#181818] p-4 border border-[rgba(255,255,255,0.04)]">
              <span className="block text-[10px] text-[#94a3b8] uppercase">Corner Lib Matrix</span>
              <span className="mt-1 block text-lg font-bold text-white">SSG_0.675V_125C</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
