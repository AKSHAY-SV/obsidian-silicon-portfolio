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

  const milestones = [
    {
      period: "2024 — Present",
      title: "Undergraduate Student, VLSI Design & Technology",
      institution: "Manipal Institute of Technology, Bengaluru",
      desc: "Deepening my knowledge of digital integrated circuit layouts, processor micro-architectures, synthesizable RTL implementation, and physical ASIC design. Maintaining a focused interest in low-power digital designs and acquiring foundational skills in digital logic compilation.",
      icon: <BookOpen className="h-3.5 w-3.5 text-[#a78bfa]" />
    }
  ];

  return (
    <div className="py-12 text-slate-100 overflow-hidden" id="about-page">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
      >
        
        {/* Editorial Subheader */}
        <div
          className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 mb-10 pb-8 border-b border-[rgba(255,255,255,0.08)]"
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
              <span className="text-slate-400 font-light">Focusing on Silicon Foundations.</span>
            </h1>
            <p className="mt-4 text-lg text-slate-300 font-sans max-w-2xl leading-relaxed font-light">
              I am an undergraduate electronics student exploring the intersection of computer architecture, synthesizable RTL modules, and physical design flows.
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
            <div className="relative h-44 w-44 rounded-full p-[3px] bg-gradient-to-tr from-[#a78bfa] via-[rgba(167,139,250,0.3)] to-[#c084fc] shadow-[0_0_30px_rgba(167,139,250,0.15)] transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(167,139,250,0.4)]">
              <div className="h-full w-full rounded-full bg-[#0a0a0a] overflow-hidden border-2 border-black/90 flex items-center justify-center">
                <img
                  id="about-profile-image"
                  src={potentialSources[sourceIndex]}
                  alt="Akshay Srikrishnan - VLSI Design & Technology Professional Headshot"
                  onError={handleImageError}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
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
          className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12"
        >
          <div className="lg:col-span-3 space-y-6">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-white border-b border-[rgba(255,255,255,0.08)] pb-2.5">
              My Journey into Hardware
            </h2>
            <p className="text-slate-300 leading-relaxed font-sans text-[17px] sm:leading-[1.8]">
              My interest in VLSI started when I realised that every piece of software eventually becomes hardware. I began by learning basic Verilog, which turned into a fascination with how digital circuits are designed, verified, and implemented on silicon. Watching a simple hardware module simulate correctly for the first time made me want to explore processor architecture and chip design more deeply.
            </p>
            <p className="text-slate-300 leading-relaxed font-sans text-[17px] sm:leading-[1.8]">
              As I continued to learn, I moved beyond individual modules and began building complete digital systems. I designed an 8-bit accumulator-based processor before moving on to a fully pipelined RV32IM RISC-V System-on-Chip. In this project, I implemented a 5-stage pipeline, cache memory, APB peripherals, UART communication, and FPGA validation. Working on these projects taught me that successful hardware design involves more than just writing RTL; it requires careful attention to verification, timing, modularity, and system-level integration.
            </p>
            <p className="text-slate-300 leading-relaxed font-sans text-[17px] sm:leading-[1.8]">
              My curiosity eventually led me into the ASIC design flow. To understand how RTL becomes physical silicon, I explored synthesis, floorplanning, placement, clock tree synthesis, routing, timing analysis, and GDSII generation using the OpenLane flow. This experience helped me appreciate the entire journey from writing Verilog to creating a manufacturable chip layout.
            </p>
            <p className="text-slate-300 leading-relaxed font-sans text-[17px] sm:leading-[1.8]">
              Today, I continue to deepen my knowledge of processor design, verification methods, FPGA development, and physical design. My goal is to become an engineer who can take a complex digital system from an initial architectural idea to a verified, tape-out-ready implementation while learning from every project I build.
            </p>
          </div>

          <div className="lg:col-span-1 space-y-6 bg-[#0c0c0c] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 shadow-md hover:border-[#a78bfa]/30 transition-all duration-300 h-fit">
            <h3 className="font-display text-base font-bold uppercase text-white tracking-wide border-b border-[rgba(255,255,255,0.08)] pb-2">
              Design Tenets
            </h3>
            <ul className="space-y-4 font-sans text-xs text-slate-400">
              <li className="flex gap-2.5">
                <Zap className="h-4 w-4 text-[#a78bfa] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-mono text-[11px] uppercase mb-0.5">Synthesizable First</strong>
                  Every single line of RTL is written with hardware compiler targets in mind.
                </div>
              </li>
              <li className="flex gap-2.5">
                <ShieldCheck className="h-4 w-4 text-[#a78bfa] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-mono text-[11px] uppercase mb-0.5">Formal Confidence</strong>
                  Exhaustive mathematical verification via assertions is critical before layout steps.
                </div>
              </li>
              <li className="flex gap-2.5">
                <Sliders className="h-4 w-4 text-[#a78bfa] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-mono text-[11px] uppercase mb-0.5">Physical Co-Design</strong>
                  Floorplanning boundaries, clock trees, and routing mesh density dictate logic partitioning.
                </div>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Milestones & Timeline */}
        <motion.div variants={itemVariants} className="mb-10">
          <span className="font-mono text-xs font-bold text-[#a78bfa] block uppercase tracking-wider mb-1">// Academic & Skills Milestones</span>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-white uppercase mb-6">
            Education & Certifications
          </h2>
          
          <div className="border-l border-[rgba(255,255,255,0.08)] ml-4 pl-6 space-y-8">
            {milestones.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Animated/Glowing Timeline Node */}
                <div className="absolute -left-[33px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0c0c0c] border border-[#a78bfa]/50 text-[#a78bfa] group-hover:border-[#a78bfa] group-hover:shadow-[0_0_8px_rgba(167,139,250,0.5)] transition-all duration-300">
                  {item.icon}
                </div>
                <span className="font-mono text-xs text-[#a78bfa] font-bold">{item.period}</span>
                <h3 className="text-base font-bold text-white font-display uppercase tracking-wide mt-0.5 group-hover:text-[#a78bfa] transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-[#c084fc] text-[11px] font-mono font-semibold uppercase tracking-wider mt-0.5">
                  {item.institution}
                </p>
                <p className="text-slate-400 text-sm mt-1.5 font-sans max-w-2xl leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
