import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Code, Play, ShieldCheck, Hammer, Sliders, Layout, 
  Cpu, GitMerge, Clock, FileCheck, CheckCircle2, ChevronRight 
} from 'lucide-react';

interface FlowStage {
  id: string;
  name: string;
  tool: string;
  desc: string;
  icon: any;
  status: 'completed' | 'learning' | 'upcoming';
}

export default function DesignFlowVisualizer() {
  const stages: FlowStage[] = [
    { id: 'spec', name: 'Specification', tool: 'Architecture Doc', desc: 'Defining pipeline architecture, registers, instruction mappings, and cache limits.', icon: FileText, status: 'completed' },
    { id: 'rtl', name: 'RTL Design', tool: 'SystemVerilog / Chisel', desc: 'Coding synthesizable behavioral and structural designs.', icon: Code, status: 'completed' },
    { id: 'sim', name: 'Simulation', tool: 'Verilator / Icarus', desc: 'Compiling register transfer modules and running basic testbenches.', icon: Play, status: 'completed' },
    { id: 'verify', name: 'Verification', tool: 'Cocotb / SVA / SymbiYosys', desc: 'Writing formal assertions, checking snoop queues and state machines.', icon: ShieldCheck, status: 'completed' },
    { id: 'synth', name: 'Synthesis', tool: 'Yosys / Synopsys DC', desc: 'Mapping behavioral HDL logic onto logical gates.', icon: Hammer, status: 'completed' },
    { id: 'floorplan', name: 'Floorplanning', tool: 'OpenROAD / Innovus', desc: 'Setting silicon die dimensions, core boundaries, and power grids.', icon: Layout, status: 'completed' },
    { id: 'placement', name: 'Placement', tool: 'OpenROAD Place', desc: 'Placing logical gates onto silicon tracks.', icon: Sliders, status: 'completed' },
    { id: 'cts', name: 'Clock Tree Synthesis', tool: 'Innovus MSCTS', desc: 'Constructing H-Tree clock nets to distribute timing signals.', icon: Clock, status: 'learning' },
    { id: 'route', name: 'Routing', tool: 'TritonRoute / Innovus', desc: 'Connecting wire signals across metal routing layers.', icon: GitMerge, status: 'learning' },
    { id: 'timing', name: 'Timing Analysis', tool: 'OpenSTA / PrimeTime', desc: 'Static Timing Analysis (STA) to calculate worst slacks and timing closures.', icon: FileCheck, status: 'learning' },
    { id: 'drc', name: 'DRC Check', tool: 'Magic / Calibre', desc: 'Design Rule Checks to verify manufacturing layout constraints.', icon: FileCheck, status: 'learning' },
    { id: 'lvs', name: 'LVS Check', tool: 'Netgen / Calibre', desc: 'Layout vs. Schematic check to match source netlists and physical gates.', icon: FileCheck, status: 'learning' },
    { id: 'gdsii', name: 'GDSII Streamout', tool: 'KLayout / Innovus', desc: 'Generating final streamout photomask files for factory tapeouts.', icon: Cpu, status: 'learning' },
  ];

  return (
    <section className="py-20 border-b border-[rgba(255,255,255,0.06)] bg-[#0a0a0a]" id="semiconductor-design-flow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-14">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#a78bfa] block">
            RTL-TO-GDSII PROCESS
          </span>
          <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
            Semiconductor Design Flow
          </h2>
          <p className="mt-4 font-sans text-sm text-[#94a3b8] max-w-3xl leading-relaxed">
            Every step of the digital physical implementation cycle. Tracing logic constraints from initial hardware specification blocks to streamout GDSII silicon.
          </p>
        </div>

        {/* Horizontal Scroll / Grid Flow block */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 font-mono text-xs">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -3, borderColor: 'rgba(167, 139, 250, 0.35)' }}
                className={`relative p-5 rounded-xl border bg-[#111111] transition-all flex flex-col justify-between ${
                  stage.status === 'completed' 
                    ? 'border-purple-500/25' 
                    : stage.status === 'learning' 
                    ? 'border-dashed border-[#a78bfa] shadow-[0_0_15px_rgba(167,139,250,0.08)]' 
                    : 'border-[rgba(255,255,255,0.05)]'
                }`}
              >
                {/* Connection Flow Pulse Ticker (top index count tag) */}
                <div className="absolute top-4 right-4 text-slate-500 font-bold text-[10px] tracking-wide">
                  STAGE {(index + 1).toString().padStart(2, '0')}
                </div>

                <div>
                  {/* Icon Panel */}
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center border mb-4 ${
                    stage.status === 'completed' 
                      ? 'bg-purple-900/10 border-purple-500/35 text-purple-400' 
                      : 'bg-indigo-900/15 border-[#a78bfa]/50 text-[#a78bfa]'
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  {/* Title & Tool */}
                  <h3 className="font-sans text-sm font-bold text-white tracking-tight uppercase">
                    {stage.name}
                  </h3>
                  <div className="mt-1 font-mono text-[9px] text-[#a78bfa] uppercase font-bold tracking-wider">
                    🛠️ {stage.tool}
                  </div>

                  {/* Description */}
                  <p className="mt-2.5 font-sans text-xs text-slate-400 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

                {/* Status indicator line */}
                <div className="mt-5 pt-3.5 border-t border-[rgba(255,255,255,0.03)] flex items-center justify-between text-[9px]">
                  <span className="text-slate-500 uppercase">Verification:</span>
                  <span className={`uppercase font-bold ${
                    stage.status === 'completed' ? 'text-green-400' : 'text-purple-400 animate-pulse'
                  }`}>
                    {stage.status === 'completed' ? '● Verified' : '● In Progress'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
