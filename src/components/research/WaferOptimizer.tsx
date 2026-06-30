import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, RefreshCw, Terminal, Cpu, Info } from 'lucide-react';
import RippleButton from './RippleButton';
import { usePrefersReducedMotion } from './hooks';

interface WaferOptimizerProps {
  processNodeSize: number;
  setProcessNodeSize: (size: number) => void;
  waferVoltage: number;
  setWaferVoltage: (voltage: number) => void;
  mischiefOverclock: number;
}

export default function WaferOptimizer({
  processNodeSize,
  setProcessNodeSize,
  waferVoltage,
  setWaferVoltage,
  mischiefOverclock,
}: WaferOptimizerProps) {
  const shouldReduceMotion = usePrefersReducedMotion();
  const [isSimulating, setIsSimulating] = useState(false);
  const [terminalFeed, setTerminalFeed] = useState<string>('Experiment 626 Core: Online and waiting for node calibration...');

  const calculateMetrics = () => {
    const siliconDensity = Math.round((1000 / (processNodeSize * processNodeSize)) * (1 + mischiefOverclock / 150));
    const powerConsum = Math.round((waferVoltage * waferVoltage * processNodeSize * 50) * (1 + mischiefOverclock / 100));
    const thermalStress = Math.min(100, Math.round(((mischiefOverclock * 0.6) + (waferVoltage * 30) - processNodeSize * 5)));
    const predictedYield = Math.max(0, Math.round((95 - (10 - processNodeSize) * 3 - (mischiefOverclock > 100 ? (mischiefOverclock - 100) * 0.8 : 0))));

    return {
      siliconDensity,
      powerConsum,
      thermalStress,
      predictedYield,
      status: thermalStress > 85 ? 'THERMAL OVERLOAD DETECTED ⚠️' : predictedYield < 50 ? 'YIELD DEGRADATION ALERT 📉' : 'STITCH ENGINE OPTIMIZED ✦'
    };
  };

  const metrics = calculateMetrics();

  const handleSimulate = () => {
    setIsSimulating(true);
    setTerminalFeed('SYS-626: Locking vacuum chamber seal... [OK]');
    
    setTimeout(() => {
      setTerminalFeed(`SYS-626: Injecting plasma lasers at ${processNodeSize}nm gate node with ${waferVoltage.toFixed(2)}V...`);
      
      setTimeout(() => {
        setIsSimulating(false);
        setTerminalFeed(`SUCCESS: Yield is ${metrics.predictedYield}% (Density: ${metrics.siliconDensity} MTr/mm²). status: ${metrics.status}`);
      }, 900);
    }, 700);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: [0.2, 0, 0, 1], duration: 0.45, delay: 0.45 }}
      whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.005 }}
      className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0d0d0d] p-6 flex flex-col justify-between transition-colors duration-300" 
      id="wafer-optimizer-panel"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.04)] pb-3">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#a78bfa] flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-[#a78bfa] animate-pulse" /> PLASMA REACTOR
          </span>
          <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[9px] uppercase font-bold text-emerald-400">
            SANDBOX
          </span>
        </div>

        <div className="space-y-4">
          {/* Node Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Physical Gate Size:</span>
              <span className="text-white font-bold">{processNodeSize}nm Nanosheet</span>
            </div>
            <input 
              type="range" 
              min={2} 
              max={7} 
              step={1}
              value={processNodeSize} 
              onChange={(e) => setProcessNodeSize(Number(e.target.value))}
              className="w-full accent-[#a78bfa] h-1.5 bg-[#222] rounded-lg cursor-pointer"
            />
          </div>

          {/* Voltage Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Chamber Bias Voltage:</span>
              <span className="text-white font-bold">{waferVoltage.toFixed(2)}V Vdd</span>
            </div>
            <input 
              type="range" 
              min={0.6} 
              max={1.2} 
              step={0.05}
              value={waferVoltage} 
              onChange={(e) => setWaferVoltage(Number(e.target.value))}
              className="w-full accent-[#a78bfa] h-1.5 bg-[#222] rounded-lg cursor-pointer"
            />
          </div>

          {/* Real-time Telemetry Panel */}
          <div className="p-3.5 rounded bg-[#030303] border border-[rgba(255,255,255,0.04)] text-left space-y-2 font-mono text-[10px]">
            <div className="text-[#a78bfa] font-bold uppercase flex items-center gap-1">// TELEMETRY DIAGNOSTICS:</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400">
              <div>Est Yield: <span className="text-white font-bold">{metrics.predictedYield}%</span></div>
              <div>leakage: <span className="text-amber-400 font-bold">{metrics.powerConsum} mW</span></div>
              <div>Density: <span className="text-white font-bold">{metrics.siliconDensity} M/mm²</span></div>
              <div>Thermal: <span className={metrics.thermalStress > 80 ? "text-red-400 font-bold animate-pulse" : "text-emerald-400 font-bold"}>{metrics.thermalStress}°C</span></div>
            </div>
          </div>

          {/* Scrolling Terminal Feed */}
          <div className="p-3.5 rounded bg-[#020202] border border-red-500/10 text-left font-mono text-[9px] min-h-[50px] relative overflow-hidden flex items-start gap-2">
            <Terminal className="h-3.5 w-3.5 text-slate-500 mt-0.5 shrink-0" />
            <div className="text-slate-400 space-y-1 flex-1 leading-normal">
              <span className="text-[#a78bfa] font-bold">// LASER TERMINAL:</span>
              <p className={isSimulating ? "text-indigo-300 animate-pulse" : "text-emerald-400"}>
                {terminalFeed}
              </p>
            </div>
          </div>
        </div>
      </div>

      <RippleButton
        onClick={handleSimulate}
        disabled={isSimulating}
        className="mt-5 w-full rounded-lg bg-[#a78bfa] hover:bg-[#b49dfb] text-black py-2.5 font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"
        rippleColor="rgba(0, 0, 0, 0.15)"
      >
        {isSimulating ? (
          <>
            <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Recalibrating...
          </>
        ) : (
          <>
            <Sliders className="h-3.5 w-3.5" /> Recalculate Yields
          </>
        )}
      </RippleButton>
    </motion.div>
  );
}
