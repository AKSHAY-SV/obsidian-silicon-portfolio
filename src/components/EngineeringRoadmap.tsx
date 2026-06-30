import React from 'react';
import { motion } from 'motion/react';
import { 
  Code, Cpu, Binary, Layers, Hammer, Settings2, Sliders, 
  Terminal, ShieldCheck, Milestone, ArrowDown 
} from 'lucide-react';

interface RoadmapItem {
  id: string;
  label: string;
  tech: string;
  desc: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  icon: any;
}

export default function EngineeringRoadmap() {
  const milestones: RoadmapItem[] = [
    {
      id: 'programming',
      label: 'Programming Foundation',
      tech: 'C/C++, Python, Tcl',
      desc: 'Algorithm design, data structures, and script automation for synthesis environments.',
      status: 'completed',
      icon: Code,
    },
    {
      id: 'embedded',
      label: 'Embedded Systems',
      tech: 'Bare-metal, RTOS, MCU',
      desc: 'Registers mapping, hardware interruptions, SPI/I2C protocols, firmware development.',
      status: 'completed',
      icon: Terminal,
    },
    {
      id: 'digital',
      label: 'Digital Design Theory',
      tech: 'Boolean Algebra, State Machines',
      desc: 'Synchronous design rules, combinational reduction, Mealy/Moore control machines.',
      status: 'completed',
      icon: Binary,
    },
    {
      id: 'verilog',
      label: 'Verilog & SystemVerilog RTL',
      tech: 'HDL, Synthesizable code',
      desc: 'Hardware Description Languages, clock domain crossings, and parameterized IP logic blocks.',
      status: 'completed',
      icon: Layers,
    },
    {
      id: 'cpudesign',
      label: 'CPU Design Principles',
      tech: 'ISAs, ALU, Decoder',
      desc: 'Designing Arithmetic Logic Units, register files, and execution control matrices.',
      status: 'completed',
      icon: Cpu,
    },
    {
      id: 'rv32i',
      label: 'RV32I ISA Baseline',
      tech: 'RISC-V Base Integer',
      desc: 'Implementing core RISC-V 32-bit instructions, immediate decoding, memory boundaries.',
      status: 'completed',
      icon: Milestone,
    },
    {
      id: 'rv32im',
      label: 'RV32IM Extension',
      tech: 'Hardware Mult/Div',
      desc: 'Designing dynamic Radix-4 Booth multipliers and multi-cycle iterative divider networks.',
      status: 'completed',
      icon: Sliders,
    },
    {
      id: 'pipeline',
      label: '5-Stage Pipeline Engine',
      tech: 'Bypass, Hazards, Branching',
      desc: 'Resolving Read-After-Write logic blocks, operand forwarding registers, branch prediction.',
      status: 'completed',
      icon: Hammer,
    },
    {
      id: 'cache',
      label: 'Coherent Cache Controller',
      tech: 'MESI, Snoop pending',
      desc: 'Dual-core L1/L2 coherence engines, write-back allocate caches, bus arbiters.',
      status: 'completed',
      icon: ShieldCheck,
    },
    {
      id: 'soc',
      label: 'SoC Integration',
      tech: 'AXI4 Crossbar, NPUs',
      desc: 'Cluster-level ring interconnect networks, weight-buffer Systolic NPU matrices, JTAG debug.',
      status: 'completed',
      icon: Settings2,
    },
    {
      id: 'physdesign',
      label: 'Physical Design / PPA',
      tech: 'Floorplan, CTS, STA',
      desc: 'Die boundaries routing, static timing analyses, slack calculations, gate sizing.',
      status: 'completed',
      icon: Sliders,
    },
    {
      id: 'asicflow',
      label: 'ASIC Silicon Flow',
      tech: 'RTL-to-GDSII PDK',
      desc: 'Automating digital workflows using TSMC 7nm technology libraries, DRC/LVS clean tapeout.',
      status: 'completed',
      icon: Hammer,
    },
    {
      id: 'curlearning',
      label: 'Clock Tree Synthesis & Sign-off',
      tech: 'Innovus MSCTS, PrimeTime',
      desc: 'Optimizing skew bounds below 35ps using multi-source clock-tree structures.',
      status: 'in-progress',
      icon: Cpu,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
    },
  };

  return (
    <section className="py-20 border-b border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] relative overflow-hidden" id="architecture-roadmap">
      
      {/* Decorative vertical schematic lines */}
      <div className="absolute left-[10%] sm:left-[50%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#a78bfa]/10 via-[#a78bfa]/30 to-[#a78bfa]/5 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#a78bfa] block">
            Silicon Mastery Roadmap
          </span>
          <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
            Semiconductor Engineering Journey
          </h2>
          <p className="mt-4 font-sans text-sm text-[#94a3b8] leading-relaxed">
            Akshay's structural path from software logic to physical silicon gate synthesis. 
            Tracing 13 technical boundaries from fundamental algorithms to 7nm sign-off.
          </p>
        </div>

        {/* Vertical Milestones Timeline */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative ml-8 sm:ml-0 space-y-12"
        >
          {milestones.map((milestone, idx) => {
            const Icon = milestone.icon;
            const isLeft = idx % 2 === 0;

            return (
              <motion.div
                key={milestone.id}
                variants={itemVariants}
                className={`relative flex flex-col sm:flex-row items-stretch justify-start sm:justify-between ${
                  isLeft ? 'sm:flex-row-reverse' : ''
                }`}
              >
                {/* Central Circle Node */}
                <div className="absolute left-[-40px] sm:left-1/2 sm:-ml-5.5 top-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#0e0e0e] border border-[rgba(255,255,255,0.1)] text-white shadow-lg group z-20">
                  <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    milestone.status === 'completed' 
                      ? 'bg-purple-900/10 border-2 border-purple-500 shadow-[0_0_12px_rgba(167,139,250,0.4)]' 
                      : 'bg-[#1a1a1a] border border-[#a78bfa] border-dashed animate-pulse'
                  }`} />
                  <Icon className={`h-4.5 w-4.5 relative z-10 ${
                    milestone.status === 'completed' ? 'text-[#a78bfa]' : 'text-[#c084fc]'
                  }`} />
                </div>

                {/* Left/Right Card Panel */}
                <div className="w-full sm:w-[45%]">
                  <motion.div
                    whileHover={{ scale: 1.015, borderColor: 'rgba(167, 139, 250, 0.3)' }}
                    className={`p-6 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(18,18,18,0.7)] backdrop-blur-md relative overflow-hidden transition-all duration-300 shadow-xl ${
                      milestone.status === 'in-progress' ? 'border-purple-500/50 shadow-purple-900/10' : ''
                    }`}
                  >
                    {/* Glowing side accent line */}
                    <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                      milestone.status === 'completed' ? 'bg-[#a78bfa]' : 'bg-purple-500 animate-pulse'
                    }`} />

                    {/* Stage number */}
                    <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-[#a78bfa] block mb-1">
                      // MILESTONE STAGE {(idx + 1).toString().padStart(2, '0')}
                    </span>

                    <h3 className="font-sans text-base font-extrabold text-white tracking-tight">
                      {milestone.label}
                    </h3>

                    {/* Tech Stack tag */}
                    <div className="mt-1.5 inline-block rounded bg-[rgba(167,139,250,0.07)] border border-purple-500/20 px-2 py-0.5 font-mono text-[10px] text-[#a78bfa] uppercase font-bold">
                      {milestone.tech}
                    </div>

                    <p className="mt-3 font-sans text-xs text-[#94a3b8] leading-relaxed">
                      {milestone.desc}
                    </p>

                    {/* Status badge */}
                    <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.04)] flex items-center justify-between text-[9px] font-mono">
                      <span className="text-slate-500 uppercase">Current Status:</span>
                      <span className={`uppercase font-bold ${
                        milestone.status === 'completed' ? 'text-green-400' : 'text-purple-400 animate-pulse'
                      }`}>
                        {milestone.status === 'completed' ? '● Mastered' : '● ACTIVE RESEARCH'}
                      </span>
                    </div>

                  </motion.div>
                </div>

                {/* Empty buffer for desktop layouts to align timeline properly */}
                <div className="hidden sm:block w-[45%]" />

              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
