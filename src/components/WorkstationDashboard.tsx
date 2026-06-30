import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { 
  Cpu, Terminal, Sliders, Settings, Activity, Gauge, Zap, 
  Layers, Hammer, Code, Award, Calendar, CheckSquare 
} from 'lucide-react';

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
}

const CountUp: React.FC<CountUpProps> = ({ end, duration = 1.5, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

export default function WorkstationDashboard() {
  const [pulseActive, setPulseActive] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Initializing silicon workstation core...',
    'ROM bios loading complete.',
    'PDK TSMC 7nm libraries verified.',
    'Snoop controller pipeline online.',
  ]);

  // Terminal auto-scrolling log simulator
  useEffect(() => {
    const logs = [
      'Clock signal locked on main DLL: 1.20 GHz.',
      'Analyzing critical paths... Slack: +1.42 ns.',
      'Formal assertions check: 140/140 safe.',
      'Snoop buffer pending queues flushed.',
      'Power rails stable. Core VDD: 0.675V.',
      'Physical design floorplan DRC check: 0 errors.',
      'RTL verification coverage: 99.8% passed.',
      'LVS run finished. Netlists matched perfectly.'
    ];

    const interval = setInterval(() => {
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setTerminalLogs(prev => {
        const next = [...prev.slice(1), `[${new Date().toLocaleTimeString()}] ${randomLog}`];
        return next;
      });
      setPulseActive(p => !p);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: 'Projects Completed', value: 5, suffix: '', icon: CheckSquare, desc: 'Major microarchitectural tapes & cores' },
    { label: 'RTL Modules Designed', value: 142, suffix: '+', icon: Layers, desc: 'Synthesizable cores, ALUs & controllers' },
    { label: 'CPU Architectures Built', value: 2, suffix: '', icon: Cpu, desc: 'RV32IM custom core & 8-bit logic computer' },
    { label: 'FPGA Implementations', value: 8, suffix: '', icon: Sliders, desc: 'Artix-7 & UltraScale+ physical maps' },
    { label: 'ASIC Flow Stages Completed', value: 13, suffix: '/13', icon: Hammer, desc: 'Full spec-to-GDSII flow expertise' },
    { label: 'EDA Tools Configured', value: 12, suffix: '', icon: Settings, desc: 'Cadence Innovus, PrimeTime, Vivado, etc.' },
    { label: 'Programming Languages', value: 6, suffix: '', icon: Code, desc: 'SystemVerilog, C/C++, Python, Tcl, etc.' },
    { label: 'Certificates Earned', value: 4, suffix: '', icon: Award, desc: 'Arm Education, CU Boulder, Duke, be10X' },
    { label: 'Years of Learning', value: 3, suffix: '+', icon: Calendar, desc: 'B.Tech Electronics (VLSI Specialty)' },
  ];

  const statusItems = [
    { label: 'Current Focus', value: 'PHYSICAL DESIGN', sub: 'PPA Optimization & Signoff' },
    { label: 'Current Learning', value: 'CLOCK TREE SYNTHESIS', sub: 'Multi-Source Global H-Tree routing' },
    { label: 'Current Project', value: 'ASIC DESIGN FLOW', sub: 'Automated RTL-to-GDSII pipeline' },
    { label: 'Current Tool', value: 'CADENCE VIRTUOSO / INNOVUS', sub: 'Standard cell placement & timing checks' },
    { label: 'Current Target', value: 'INDUSTRY INTERNSHIP', sub: 'RTL Design & Silicon Architecture' },
  ];

  return (
    <div className="py-12 border-b border-[rgba(255,255,255,0.06)] bg-[#0a0a0a]" id="engineering-workstation-deck">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Workstation Title header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#a78bfa] flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 animate-pulse text-purple-400" />
              SYSTEM DIAGNOSTICS DECK // ONLINE
            </span>
            <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
              Engineering Workstation
            </h2>
          </div>
          <div className="flex items-center gap-3.5 bg-[#121212] border border-[rgba(255,255,255,0.06)] px-4 py-2.5 rounded-lg font-mono text-xs">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-slate-400">CORE STATUS:</span>
            <span className="text-green-400 font-bold">LOCKED (1.20 GHz)</span>
          </div>
        </div>

        {/* Workstation Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT & CENTER: The 9 Engineering Metrics Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {metrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    whileHover={{ y: -3, borderColor: 'rgba(167, 139, 250, 0.25)' }}
                    className="relative group rounded-xl border border-[rgba(255,255,255,0.05)] bg-[rgba(15,15,15,0.6)] backdrop-blur-md p-5 transition-all flex flex-col justify-between"
                  >
                    {/* Background glass effect and dynamic border glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-[#94a3b8]">
                        {metric.label}
                      </span>
                      <Icon className="h-4.5 w-4.5 text-[#a78bfa] opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="relative z-10">
                      <span className="block font-sans text-4.5xl font-black text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-300 transition-colors duration-200">
                        <CountUp end={metric.value} suffix={metric.suffix} />
                      </span>
                      <p className="mt-1 font-mono text-[10px] text-slate-500 leading-snug">
                        {metric.desc}
                      </p>
                    </div>

                    {/* Technical line design decoration */}
                    <div className="mt-4 h-0.5 w-8 bg-purple-500/20 group-hover:w-full transition-all duration-500" />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: Current Engineering Status Console */}
          <div className="space-y-6">
            
            {/* Live Status Console */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0e0e0e] overflow-hidden flex flex-col h-full justify-between">
              
              {/* Header */}
              <div className="bg-[#141414] px-4 py-3 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-[#a78bfa]" />
                  Status Monitor console
                </span>
                <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              </div>

              {/* Status List */}
              <div className="p-5 space-y-4 flex-1">
                {statusItems.map((status, idx) => (
                  <div key={status.label} className="border-b border-[rgba(255,255,255,0.03)] pb-3 last:border-0 last:pb-0">
                    <span className="font-mono text-[9px] uppercase font-bold text-purple-400 tracking-wider">
                      {status.label}
                    </span>
                    <span className="block font-sans text-sm font-black text-white mt-0.5 tracking-tight">
                      {status.value}
                    </span>
                    <span className="block font-mono text-[10px] text-slate-500 mt-0.5">
                      {status.sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* Console logs visualizer ticker at the bottom */}
              <div className="bg-[#050505] p-3 border-t border-[rgba(255,255,255,0.06)] font-mono text-[9px] text-[#8a99ad] space-y-1">
                {terminalLogs.map((log, index) => (
                  <div key={index} className="flex items-center gap-1.5 truncate">
                    <span className="text-purple-500 select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
