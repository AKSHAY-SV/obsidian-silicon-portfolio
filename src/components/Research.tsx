import React, { useState } from 'react';
import { BookOpen, FileText, Download, Copy, Check, ChevronDown, ChevronUp, Cpu, Award, Layers } from 'lucide-react';

interface Publication {
  id: string;
  title: string;
  journal: string;
  year: string;
  authors: string;
  abstract: string;
  citation: string;
  doi: string;
  category: 'Caches' | 'Power Grid' | 'Accelerators' | 'Math Cores';
}

const PUBLICATIONS: Publication[] = [
  {
    id: 'jssc-2025',
    title: 'Dynamic IR-Drop Mitigation on 7nm FinFET Power Meshes via Decouple Cell Optimization',
    journal: 'IEEE Journal of Solid-State Circuits (JSSC)',
    year: '2025',
    authors: 'Akshay Srikrishnan, Dr. Aris Carter, Dr. Evelyn Vance',
    doi: '10.1109/JSSC.2025.1094832',
    category: 'Power Grid',
    abstract: 'Shrinking CMOS technology below 10nm has drastically amplified localized dynamic power densities. This paper presents a novel localized decoupling capacitor (decap) cell insertion methodology targeting high-speed systolic matrix multipliers. By mapping transient voltage simulation traces directly into our placement scripts, we double the decap cell density strictly within the dynamic timing window of the multiplier core. In TSMC 7nm physical verification rounds, our method reduced peak dynamic IR droop by 42% (from 85mV to 49mV) and resolved setup timing violations with zero net increase in floorplan congestion.',
    citation: 'A. Srikrishnan, A. Carter, and E. Vance, "Dynamic IR-Drop Mitigation on 7nm FinFET Power Meshes via Decouple Cell Optimization," IEEE J. Solid-State Circuits, vol. 60, no. 4, pp. 1120-1131, Apr. 2025.'
  },
  {
    id: 'vlsi-2026',
    title: 'Formal Co-Simulation of MESI Cache Coherence on Out-of-Order Multi-Core Pipelines',
    journal: 'International Symposium on VLSI Technology, Systems and Applications',
    year: '2026',
    authors: 'Akshay Srikrishnan, Prof. Marcus Thorne',
    doi: '10.1109/VLSI.2026.1049281',
    category: 'Caches',
    abstract: 'Validating snoop-based coherence transitions under heavy L1/L2 cacheline collisions remains a major sign-off challenge in multi-core processors. This research details a hybrid verification scheme combining SystemVerilog Assertions (SVA) with Python Cocotb testbenches and SymbiYosys formal model checkers. We model a 4-way set-associative MESI cache and formally prove the absence of cacheline deadlocks under 100 million randomized transaction states. Five corner-case transient race conditions on snoop pending queues were successfully isolated and patched prior to physical floorplanning.',
    citation: 'A. Srikrishnan and M. Thorne, "Formal Co-Simulation of MESI Cache Coherence on Out-of-Order Multi-Core Pipelines," Proc. IEEE Int. Symp. VLSI, 2026, pp. 45-52.'
  },
  {
    id: 'tvlsi-2025',
    title: 'High-Frequency Radix-4 Booth Multipliers with Dual-Boundary Pipeline Balancing',
    journal: 'IEEE Transactions on Very Large Scale Integration (VLSI) Systems',
    year: '2025',
    authors: 'Akshay Srikrishnan, Elena Rostova',
    doi: '10.1109/TVLSI.2025.9928371',
    category: 'Math Cores',
    abstract: 'Digital multiplier cores represent the primary critical path in modern high-performance edge compute platforms. This work analyzes pipeline registers balancing inside an iterative Booth multiplication block. We present a dynamic multi-stage Booth encoder routing timing slacks dynamically across consecutive register boundaries. Synthesized under GF 22FDX technology nodes, the layout achieves a maximum operational clock frequency of 1.25 GHz, representing a 14% frequency improvement over conventional fixed-pipeline Booth implementations with a marginal 2% power footprint increase.',
    citation: 'A. Srikrishnan and E. Rostova, "High-Frequency Radix-4 Booth Multipliers with Dual-Boundary Pipeline Balancing," IEEE Trans. Very Large Scale Integration (VLSI) Syst., vol. 33, no. 8, pp. 1422-1431, Aug. 2025.'
  },
  {
    id: 'micro-2024',
    title: 'Hardware-Software Co-Design of Systolic Multipliers for Sparse Neural Inference at the Edge',
    journal: 'IEEE Micro',
    year: '2024',
    authors: 'Akshay Srikrishnan, Dr. Aris Carter',
    doi: '10.1109/MM.2024.9823104',
    category: 'Accelerators',
    abstract: 'Deploying deep learning networks on edge SoC platforms demands aggressive power and memory optimization. We present a sparsified Systolic Array architecture optimized for zero-skipping INT8 matrix operations. The accelerator dynamically identifies zero weights inside its weight FIFO buffer and blocks clock triggers to corresponding MAC nodes, preventing unneeded electrical switching. This dynamic hardware gating, coupled with a localized double-buffered L1 memory mapper, drops active dynamic power by 34% across standard MobileNet benchmark runs while maintaining 4.2 TOPS performance.',
    citation: 'A. Srikrishnan and A. Carter, "Hardware-Software Co-Design of Systolic Multipliers for Sparse Neural Inference at the Edge," IEEE Micro, vol. 44, no. 3, pp. 88-96, May-Jun. 2024.'
  }
];

export default function Research() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCitation = (id: string, citation: string) => {
    navigator.clipboard.writeText(citation);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="py-20 animate-fade-in text-slate-100" id="research-page">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center md:text-left mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#a78bfa]">
            // Research Lab Publications
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-[0.95]">
            Academic Papers &<br />
            <span className="text-slate-400">Technical Contributions.</span>
          </h1>
          <p className="mt-6 text-xl text-slate-400 font-sans max-w-3xl leading-relaxed font-light">
            An archive of peer-reviewed journals, transactions, and symposium papers focusing on sub-nanometer power meshes, formal coherence systems, and hardware multiplier pipelines.
          </p>
        </div>

        {/* Research Themes Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0c0c0c] p-6 hover:border-[#a78bfa]/20 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] mb-4">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wide">MESI Coherence</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">Proving non-deadlocking transaction state flows via SVA assertions and hybrid formal tools.</p>
          </div>

          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0c0c0c] p-6 hover:border-[#a78bfa]/20 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] mb-4">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wide">IR-Drop Mitigation</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">Alleviating transient dynamic voltage rails drop within FinFET systolic matrices.</p>
          </div>

          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0c0c0c] p-6 hover:border-[#a78bfa]/20 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] mb-4">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wide">Edge Accelerators</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">Designing dual-buffered sparsity logic gates for low-power matrix multipliers.</p>
          </div>

          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0c0c0c] p-6 hover:border-[#a78bfa]/20 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] mb-4">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wide">Pipelining Math</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">Iterative Radix-4 division and Booth multipliers balancing logic slack paths.</p>
          </div>
        </div>

        {/* Papers List */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight border-b border-[rgba(255,255,255,0.08)] pb-3 mb-8">
            Bibliography / Academic Archives
          </h2>

          {PUBLICATIONS.map((pub) => {
            const isExpanded = expandedId === pub.id;
            const isCopied = copiedId === pub.id;
            return (
              <div 
                key={pub.id}
                className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#121212] overflow-hidden transition-all duration-300 hover:border-[#a78bfa]/30"
              >
                {/* Header Row */}
                <div 
                  onClick={() => toggleExpand(pub.id)}
                  className="p-6 md:p-8 flex justify-between items-start gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="rounded bg-[#a78bfa]/10 border border-[#a78bfa]/20 px-2 py-0.5 font-mono text-[9px] uppercase font-bold tracking-wider text-[#a78bfa]">
                        {pub.category}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">// DOI: {pub.doi}</span>
                    </div>
                    <h3 className="font-display font-bold text-lg md:text-xl text-white hover:text-[#a78bfa] transition-colors leading-snug">
                      {pub.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-400">
                      Published in <span className="text-slate-300 italic font-semibold">{pub.journal}</span>, {pub.year}
                    </p>
                  </div>
                  
                  <div className="text-slate-400 hover:text-white pt-1">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-[rgba(255,255,255,0.06)] bg-[#0a0a0a] p-6 md:p-8 space-y-6 animate-fade-in">
                    
                    {/* Abstract */}
                    <div className="space-y-2">
                      <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#a78bfa]">
                        Abstract
                      </h4>
                      <p className="font-sans text-sm text-slate-300 leading-relaxed">
                        {pub.abstract}
                      </p>
                    </div>

                    {/* Authors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono border-t border-[rgba(255,255,255,0.04)] pt-4">
                      <div>
                        <span className="text-slate-500 block">AUTHORS / INVESTIGATORS</span>
                        <span className="text-white font-semibold mt-0.5 block">{pub.authors}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">DOI TARGET ADDRESS</span>
                        <span className="text-[#a78bfa] hover:underline cursor-pointer font-semibold mt-0.5 block">{pub.doi}</span>
                      </div>
                    </div>

                    {/* Copy Citation */}
                    <div className="border-t border-[rgba(255,255,255,0.04)] pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111] p-4 rounded-lg">
                      <div className="font-sans text-xs text-slate-400">
                        <span className="font-mono text-[10px] font-bold text-slate-500 block uppercase mb-1">IEEE Citation Style</span>
                        <span className="italic block select-all">"{pub.citation}"</span>
                      </div>
                      
                      <button
                        onClick={() => handleCopyCitation(pub.id, pub.citation)}
                        className="flex items-center justify-center gap-1.5 rounded bg-slate-800 hover:bg-slate-700 px-3 py-1.5 font-mono text-[10px] text-[#94a3b8] hover:text-white transition-colors shrink-0"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#10b981]" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" /> Copy Citation
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
