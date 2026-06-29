import React, { useState } from 'react';
import { Terminal, Calendar, Clock, BookOpen, ArrowUpRight, Search, FileText } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: 'Clocking' | 'Pipelining' | 'Formal Verification' | 'SoC Integration';
  tagline: string;
  summary: string;
  content: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'clock-tree-synthesis',
    title: 'Demystifying Clock Tree Synthesis (CTS) Under 7nm FinFET Nodes',
    date: '2026-06-15',
    readTime: '8 min read',
    category: 'Clocking',
    tagline: 'Balancing insertion delay and clock skew across multi-million gate boundaries using global H-Tree networks.',
    summary: 'Routing a balanced clock to millions of synchronous registers at 1.2GHz requires overcoming metal resistances, dynamic temperature shifts, and cell degradation constraints. Here is how we limit skew to under 30ps on TSMC 7nm.',
    content: [
      'In deep sub-micron nodes (sub-10nm), wire resistance increases exponentially with narrowing track widths. Clock tree distribution network synthesis is no longer just a buffering problem—it is a physical parasitics and clock gating latency bottleneck.',
      'To deliver a pristine clock trigger with minimum skew (under 30ps), we implement Multi-Source CTS (MSCTS). We route a global clock mesh on thick, low-resistance top metal layers (Metal 7 & Metal 8) in a symmetrical H-Tree topology.',
      'From this global grid, we tap local trunk buffers. This bounds the insertion delay skew and eliminates localized hot-spot clock skew variances during high switching cycles (such as intensive matrix multiplier workloads).',
      'Additionally, we place stringent shielding requirements on high-speed nets. Standard 2x spacing with VSS-grounded routing tracks minimizes crosstalk noise from neighboring data signals.'
    ]
  },
  {
    id: 'pipeline-bypassing',
    title: 'How We Eliminated RAW Hazards in an RV32IM Core with 0-Cycle Penalty',
    date: '2026-05-28',
    readTime: '10 min read',
    category: 'Pipelining',
    tagline: 'Architecting dynamic operand forwarding matrices to map register dependencies across concurrent pipeline stages.',
    summary: 'A classic 5-stage CPU pipeline suffers stalling if instruction dependencies are not bypassed. Here is the mathematical forwarding matrix that resolves RAW hazards with zero cycle overhead.',
    content: [
      'In pipelined instruction sets, a Read-After-Write (RAW) hazard occurs when an instruction relies on a register value computed by an active predecessor. Without forwarding, the pipeline must stall for up to 2 cycles until the writeback stage completes.',
      'To maintain optimal Instructions Per Cycle (IPC close to 0.98), we design a dedicated Forwarding Unit. This block continuously inspects active destination registers (rd) in the EX/MEM and MEM/WB stages.',
      'If a matching register address is identified on either source operand path (rs1 or rs2) of the active Decode instruction, the bypass mux routes the intermediate ALU results directly back to the execution multiplexer input.',
      'By utilizing the forwarding equations: "if (mem_reg_write && mem_rd == ex_rs1) forward_a = 2\'b10", operands are hijacked at the boundary, ensuring consecutive arithmetic instructions execute with zero stalling penalty.'
    ]
  },
  {
    id: 'formal-verification-cache',
    title: 'Formal vs. Simulation: Achieving 100% Assertion Density on Cache Controllers',
    date: '2026-04-12',
    readTime: '12 min read',
    category: 'Formal Verification',
    tagline: 'Why randomized simulation suites miss transient MESI states, and how to verify cache coherence using formal assertions.',
    summary: 'Snoop-based cache coherence suffers from complex race conditions. This post contrasts randomized UVM simulations with formal proofs and details writing robust SystemVerilog Assertions.',
    content: [
      'Randomized simulation suites are highly effective for general functional verification, but they fail to exhaustively hit concurrent transient states in cache coherence protocols. A snoop collision during a simultaneous write-back and invalidate sequence represents a microscopic timing window.',
      'Formal Verification mathematically guarantees behavior across all possible input scenarios. We inject SystemVerilog Assertions (SVA) directly into our cacheline state structures, writing strict rules.',
      'For example, the assertion: "assert property (@(posedge clk) disable iff (!rst_n) (mesi_state == INVALID) |-> !cache_hit)" ensures that invalid lines can never trigger a hit.',
      'Using SymbiYosys, we execute bounded model checking. This proves that our snoop-queue buffers are safe from deadlocks under any multi-processor read/write sequence, giving 100% sign-off confidence.'
    ]
  }
];

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="py-20 animate-fade-in text-slate-100" id="blog-page">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* If no post is selected, show blog list */}
        {!selectedPost ? (
          <div>
            {/* Header */}
            <div className="text-center md:text-left mb-16">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#a78bfa]">
                // Technical Articles
              </span>
              <h1 className="mt-3 font-display text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-[0.95]">
                Silicon Logbooks &<br />
                <span className="text-slate-400">Micro-Architecture Deep Dives.</span>
              </h1>
              <p className="mt-6 text-xl text-slate-400 font-sans max-w-3xl leading-relaxed font-light">
                Documenting engineering challenges, compiler models, and sub-micron physical backend solutions. Written by a practicing hardware architect.
              </p>
            </div>

            {/* Grid of Blog Posts */}
            <div className="space-y-8">
              {BLOG_POSTS.map((post) => (
                <article 
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#121212] p-8 cursor-pointer transition-all duration-300 hover:border-[#a78bfa]/40 hover:bg-[#151515] hover:shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="rounded bg-[#a78bfa]/10 border border-[#a78bfa]/20 px-2.5 py-1 font-mono text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
                        {post.category}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {post.date}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-slate-500 flex items-center gap-1 font-semibold">
                      <Clock className="h-3.5 w-3.5 text-[#a78bfa]" /> {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-display font-bold text-2xl text-white group-hover:text-[#a78bfa] transition-colors tracking-tight leading-snug">
                    {post.title}
                  </h2>
                  <p className="mt-2 font-sans text-sm text-[#a78bfa] italic">
                    "{post.tagline}"
                  </p>
                  <p className="mt-4 font-sans text-sm text-slate-400 leading-relaxed">
                    {post.summary}
                  </p>

                  <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.04)] flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-500 flex items-center gap-1">
                      <Terminal className="h-3.5 w-3.5 text-slate-600" /> STAGED UNDER STATIC ROM
                    </span>
                    <span className="font-sans text-xs font-bold text-[#a78bfa] flex items-center gap-1 group-hover:translate-x-1 transition-all">
                      Read full log <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          // Post Content View
          <div className="animate-in fade-in duration-300">
            {/* Return Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="mb-8 flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#121212] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#94a3b8] hover:bg-[#1a1a1a] hover:text-white transition-all"
            >
              ← Return to Articles
            </button>

            {/* Post Layout */}
            <article className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#121212] p-8 md:p-12">
              <div className="flex flex-wrap gap-2.5 items-center mb-6">
                <span className="rounded bg-[#a78bfa]/10 border border-[#a78bfa]/20 px-2.5 py-1 font-mono text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
                  {selectedPost.category}
                </span>
                <span className="font-mono text-[11px] text-slate-500">{selectedPost.date}</span>
                <span className="font-mono text-[11px] text-slate-500">•</span>
                <span className="font-mono text-[11px] text-[#a78bfa] font-bold uppercase">{selectedPost.readTime}</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-none mb-6">
                {selectedPost.title}
              </h1>

              <p className="text-lg text-slate-300 italic border-l-2 border-[#a78bfa]/60 pl-4 py-1 font-sans mb-10">
                "{selectedPost.tagline}"
              </p>

              {/* Storytelling Text paragraphs */}
              <div className="space-y-6 font-sans text-slate-300 leading-relaxed text-base max-w-4xl border-t border-[rgba(255,255,255,0.06)] pt-8">
                {selectedPost.content.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* Signoff */}
              <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.06)] flex justify-between items-center text-xs font-mono text-slate-500">
                <span>By Akshay Srikrishnan</span>
                <span>SHA-256 Verified Log</span>
              </div>
            </article>
          </div>
        )}

      </div>
    </div>
  );
}
