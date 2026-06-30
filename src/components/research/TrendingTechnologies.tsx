import React from 'react';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';
import { usePrefersReducedMotion } from './hooks';

export interface TechItem {
  name: string;
  desc: string;
  status: string;
}

interface TrendingTechnologiesProps {
  technologies: TechItem[];
}

export default function TrendingTechnologies({ technologies }: TrendingTechnologiesProps) {
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <div className="space-y-6" id="trending-technologies-component">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#a78bfa]">
          // ACTIVE ARCHITECTURE WATCH
        </p>
        <h3 className="font-sans text-2xl font-extrabold text-white mt-1">
          Trending Silicon Innovations
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {technologies.map((tech, idx) => (
          <motion.div 
            key={tech.name}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ease: [0.2, 0, 0, 1], duration: 0.4, delay: 0.1 + idx * 0.05 }}
            whileHover={shouldReduceMotion ? {} : { 
              y: -4, 
              scale: 1.02,
              borderColor: 'rgba(167, 139, 250, 0.3)',
              boxShadow: '0 8px 20px rgba(167, 139, 250, 0.03)'
            }}
            className="group relative rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] p-4 text-center cursor-help transition-all duration-300"
            title={`${tech.name}: ${tech.desc}`}
          >
            {/* Soft glowing ambient drop */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#a78bfa]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none" />
            
            <p className="font-mono text-xs text-[#a78bfa] tracking-wider uppercase mb-1 font-bold">
              {tech.name}
            </p>
            <span className="rounded bg-[#111] border border-[rgba(255,255,255,0.03)] px-1.5 py-0.5 font-mono text-[9px] text-slate-500 block w-max mx-auto">
              {tech.status}
            </span>
            <p className="font-sans text-[10px] text-slate-400 leading-normal mt-2 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto overflow-hidden transition-all duration-300">
              {tech.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
