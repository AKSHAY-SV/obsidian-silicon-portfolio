import React from 'react';
import { Cpu, Award, Zap, BookOpen, Terminal, Sliders, ShieldCheck, Layers } from 'lucide-react';
import { motion } from 'motion/react';
// @ts-ignore
import profilePic from '../assets/images/regenerated_image_1782761115139.png';

export default function About() {
  const potentialSources = [
    profilePic,
    'https://avatars.githubusercontent.com/aksh-ai',
    '/profile.png',
    '/profile.jpg',
    '/profile.jpeg',
    '/avatar.png',
    '/avatar.jpg',
    '/avatar.jpeg',
    'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?q=80&w=400&auto=format&fit=crop'
  ];
  const [sourceIndex, setSourceIndex] = React.useState(0);

  const handleImageError = () => {
    if (sourceIndex < potentialSources.length - 1) {
      setSourceIndex(sourceIndex + 1);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <div className="py-20 text-slate-100 overflow-hidden" id="about-page">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
      >
        
        {/* Editorial Subheader */}
        <div
          className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 mb-16 pb-12 border-b border-[rgba(255,255,255,0.08)]"
        >
          <motion.div
            variants={itemVariants}
            className="text-center md:text-left flex-1"
          >
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#a78bfa]">
              // Biography & Philosophy
            </span>
            <h1 className="mt-3 font-display text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-[0.95]">
              Akshay Srikrishnan:<br />
              <span className="text-slate-400">Pursuing Nanometer Precision.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 font-sans max-w-2xl leading-relaxed font-light">
              I design synthesizable micro-architectures, low-latency coherent cache fabrics, high-speed interconnect switches, and automate silicon physical implementation flows.
            </p>
          </motion.div>
 
          {/* Profile Picture with Elegant Circular Border */}
          <motion.div
            variants={itemVariants}
            className="shrink-0 relative group"
          >
            {/* Glowing background ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#a78bfa] to-[#d8b4fe] opacity-30 blur-2xl group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
            
            {/* Outer border container */}
            <div className="relative h-48 w-48 rounded-full p-[3px] bg-gradient-to-tr from-[#a78bfa] via-[rgba(167,139,250,0.3)] to-[#c084fc] shadow-[0_0_35px_rgba(167,139,250,0.2)] transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_45px_rgba(167,139,250,0.45)]">
              <div className="h-full w-full rounded-full bg-[#0a0a0a] overflow-hidden border-2 border-black/90">
                <img
                  id="about-profile-image"
                  src={potentialSources[sourceIndex]}
                  alt="Akshay Srikrishnan - VLSI Design & Technology Professional Headshot"
                  onError={handleImageError}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>
            
            {/* Active Status Badge */}
            <div className="absolute bottom-1 right-2 bg-[#0c0c0c] border-2 border-[#a78bfa]/50 rounded-full h-5.5 w-5.5 flex items-center justify-center shadow-lg shadow-black z-10">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Storytelling Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24"
        >
          <div className="md:col-span-2 space-y-8">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-white border-b border-[rgba(255,255,255,0.08)] pb-3">
              The Engineering Journey
            </h2>
            <p className="text-slate-300 leading-relaxed font-sans text-base">
              Ever since I compiled my first logic gate description in Verilog, I was captivated by the sheer power of silicon. The transition from abstract mathematical algorithms to physical, microscopic electrical pathways operating at billions of cycles per second felt like a modern alchemy.
            </p>
            <p className="text-slate-300 leading-relaxed font-sans text-base">
              My professional focus resides at the critical junction between **Computer Architecture** and **Physical Implementation**. To me, a beautiful micro-architecture is useless if it cannot be synthesized within optimal power grids, or if clock tree skew degrades maximum frequencies. Conversely, a great layout must serve a clever, non-blocking pipeline.
            </p>
            <p className="text-slate-300 leading-relaxed font-sans text-base">
              Through my work at Obsidian Architecture, I have tape-out verified complex System-on-Chips (such as the TSMC 7nm Helios-7 SoC), built highly scalable RISC-V compute cores with advanced forwarding metrics, and formally proven complex cache coherence protocols. My mission is to build synthesizable, robust hardware that pushes the physical boundaries of PPA (Power, Performance, and Area).
            </p>
          </div>

          <div className="space-y-8 bg-[#0c0c0c] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 shadow-md hover:border-[#a78bfa]/30 transition-all duration-300">
            <h3 className="font-display text-lg font-bold uppercase text-white tracking-wide border-b border-[rgba(255,255,255,0.08)] pb-2">
              Design Tenets
            </h3>
            <ul className="space-y-4 font-sans text-sm text-slate-400">
              <li className="flex gap-3">
                <Zap className="h-5 w-5 text-[#a78bfa] shrink-0" />
                <div>
                  <strong className="text-white block font-mono text-xs uppercase mb-1">Synthesizable First</strong>
                  Every single line of RTL is written with hardware compiler targets in mind. No simulated vaporware.
                </div>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="h-5 w-5 text-[#a78bfa] shrink-0" />
                <div>
                  <strong className="text-white block font-mono text-xs uppercase mb-1">Formal Confidence</strong>
                  Exhaustive mathematical verification via assertions is critical before layout steps. Proving is better than hoping.
                </div>
              </li>
              <li className="flex gap-3">
                <Sliders className="h-5 w-5 text-[#a78bfa] shrink-0" />
                <div>
                  <strong className="text-white block font-mono text-xs uppercase mb-1">Physical Co-Design</strong>
                  Floorplanning boundaries, clock trees, and routing mesh density dictate logic partitioning.
                </div>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Milestones & Timeline */}
        <motion.div variants={itemVariants} className="mb-20">
          <span className="font-mono text-xs font-bold text-[#a78bfa] block uppercase tracking-wider mb-2">// Academic & Research Timeline</span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase mb-10">
            Education & Silicon Milestones
          </h2>
          
          <div className="border-l border-[rgba(255,255,255,0.08)] ml-4 pl-8 space-y-12">
            {/* Year 2024 — Present */}
            <div className="relative group">
              {/* Animated/Glowing Timeline Node */}
              <div className="absolute -left-[41px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#0c0c0c] border border-[#a78bfa]/50 text-[#a78bfa] group-hover:border-[#a78bfa] group-hover:shadow-[0_0_10px_rgba(167,139,250,0.5)] transition-all duration-300">
                <div className="h-2 w-2 rounded-full bg-[#a78bfa] group-hover:scale-125 transition-transform" />
              </div>
              <span className="font-mono text-sm text-[#a78bfa] font-bold">2024 — Present</span>
              <h3 className="text-lg font-bold text-white font-display uppercase tracking-wide mt-1 group-hover:text-[#a78bfa] transition-colors duration-200">
                Undergraduate Student, VLSI Design & Technology
              </h3>
              <p className="text-[#c084fc] text-xs font-mono font-semibold uppercase tracking-wider mt-1">
                Manipal Institute of Technology, Bengaluru
              </p>
              <p className="text-slate-400 text-sm mt-2.5 font-sans max-w-2xl leading-relaxed">
                Intensely focused on digital integrated circuit layouts, processor micro-architecture, synthesizable RTL implementation, and physical ASIC design. Demonstrating high-contrast visual engineering excellence and academic focus in low-power digital designs, while acquiring specialized certifications in Arm architecture and embedded system design.
              </p>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
