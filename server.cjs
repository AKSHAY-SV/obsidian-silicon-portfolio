var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_vite = require("vite");

// src/services/portfolioKnowledge.ts
var PORTFOLIO_KNOWLEDGE = {
  about: {
    name: "Akshay Srikrishnan",
    role: "Silicon Architect & RTL Engineer",
    location: "Bengaluru, Karnataka, India",
    email: "crazyplayz61@gmail.com",
    bio: "Designing synthesizable micro-architectures, low-latency coherent cache fabrics, high-speed interconnect switches, and automating silicon physical implementation GDS flows.",
    specialties: [
      "ASIC Design",
      "RTL Design",
      "Computer Architecture",
      "FPGA Development",
      "Physical Design"
    ],
    summaryText: "Manipal Institute of Technology, Bengaluru B.Tech student focusing on fundamental semiconductor physics, digital integrated circuit layouts, computer architectures, and hardware description languages."
  },
  projects: [
    {
      id: "rv32im-core",
      name: "RV32IM_PROCESSOR",
      category: "Computer Architecture",
      tagline: "High-Performance 5-Stage Pipelined RISC-V CPU Core",
      description: "A fully-synthesizable, cycle-accurate implementation of the RISC-V RV32IM instruction set architecture. Features a 5-stage classic pipeline (Fetch, Decode, Execute, Memory, Write-back) with full data-forwarding, hazard detection, and a parameterizable hardware integer multiplier/divider unit.",
      techStack: ["SystemVerilog", "Verilator", "C++ Testbench", "FPGA (Artix-7)", "OpenSTA"],
      metrics: {
        lutCount: "4,280 LUTs",
        timingSlack: "+1.42 ns @ 150MHz",
        area: "0.18 mm\xB2",
        power: "32.4 mW",
        frequency: "180 MHz (TSMC 65nm)"
      },
      specs: [
        { label: "ISA Extension", value: "RV32IM (Base Integer + M Extension)" },
        { label: "Pipeline Depth", value: "5 Stages with Bypass paths" },
        { label: "Branch Predictor", value: "Dynamic 2-bit BHT (94% Accuracy)" },
        { label: "Multiplier Unit", value: "Pipelined Radix-4 Booth Multiplier" },
        { label: "L1 Cache", value: "Direct Mapped, 4KB I-Cache / 4KB D-Cache" },
        { label: "Verification Suite", value: "RISCOF (99.8% Suite Coverage)" }
      ],
      challenges: [
        {
          problem: "RAW (Read-After-Write) Hazards on consecutive arithmetic operations caused 2-cycle stalls in early synthesis rounds, degrading IPC to 0.74.",
          solution: "Implemented a multi-level Operand Forwarding network mapping ALU outputs and MEM stage registers back to the ID/EX boundary, reducing hazard-related stalls to 0 cycles for general instructions and improving performance to 0.96 IPC."
        },
        {
          problem: "Hardware Divider propagation delay dominated the critical path, restricting maximum clock frequency to 80 MHz in physical layout checks.",
          solution: "Redesigned the division architecture from a single-cycle restoring layout into an 8-cycle state-machine iterative division block, decoupling timing and boosting max frequency to 180 MHz."
        }
      ]
    },
    {
      id: "helios-7-soc",
      name: "HELIOS-7_SOC",
      category: "ASIC",
      tagline: "Multi-Core RISC-V Edge AI System on Chip (7nm FinFET)",
      description: "A fully integrated mixed-signal Edge AI SoC combining 4 cluster-coupled high-efficiency RISC-V application processors with a custom Systolic Array NPU Accelerator, sharing an L1/L2 coherence fabric and interfacing via high-speed APB/AXI4 interconnects.",
      techStack: ["Chisel", "Verilog", "TSMC 7nm PDK", "Synopsys Design Compiler", "Cadence Innovus"],
      metrics: {
        lutCount: "28.4M Transistors",
        timingSlack: "+0.11 ns @ 1.2GHz",
        area: "12.54 mm\xB2",
        power: "452 mW (Peak)",
        frequency: "1.2 GHz (7nm FinFET)"
      },
      specs: [
        { label: "Process Node", value: "TSMC 7nm FinFET N7" },
        { label: "CPU Cluster", value: "4x RV64GCX Dual-Issue Out-of-Order Cores" },
        { label: "NPU Performance", value: "4.2 TOPS @ 800MHz INT8 Matrix Engine" },
        { label: "Memory Host", value: "Integrated LPDDR4/5 Physical Layer (PHY)" },
        { label: "Interconnect", value: "128-bit AXI4 Non-blocking Ring Network" },
        { label: "Cache Hierarchy", value: "32KB L1 + Shared 1MB L2 Cache Coherent SRAM" }
      ],
      challenges: [
        {
          problem: "High IR drop in the core NPU region during peak 4.2 TOPS matrix workloads led to severe dynamic voltage fluctuations and setup-time errors.",
          solution: "Re-architected the power mesh using a dual-grid layout in Metal 7 & Metal 8, doubling standard cell tap densities and placing decaps adjacent to structural multiplier groups."
        },
        {
          problem: "Clock skew across the 12.54 mm\xB2 die boundary exceeded 180ps, causing hold timing violations on deep FIFO registers.",
          solution: "Deployed Multi-Source Clock Tree Synthesis (MSCTS) via Cadence Innovus, routing a global H-Tree grid using ultra-thick top metal layers to bound skew within 35ps."
        }
      ]
    },
    {
      id: "axi4-interconnect",
      name: "AXI4_CROSSBAR",
      category: "Computer Architecture",
      tagline: "High-Throughput Non-Blocking AXI4 Crossbar Interconnect",
      description: "A parameterized 4-Master to 4-Slave AXI4 Switch Core enabling fully concurrent read/write transactions, utilizing custom split-address pathways, credit-based buffer flow control, and dynamic round-robin arbitration modules.",
      techStack: ["SystemVerilog", "ModelSim", "SVA (Assertions)", "UVM", "FPGA (UltraScale+)"],
      metrics: {
        lutCount: "8,450 LUTs",
        timingSlack: "+2.10 ns @ 250MHz",
        area: "0.09 mm\xB2",
        power: "18.2 mW",
        frequency: "350 MHz (TSMC 65nm)"
      },
      specs: [
        { label: "Protocols Supported", value: "AXI4, AXI4-Lite" },
        { label: "Arbitration Scheme", value: "Weighted Round-Robin (Dynamic)" },
        { label: "Data Bus Width", value: "64/128/256-bit configurable" },
        { label: "Address Channels", value: "Split Address, Read-Write De-coupled" },
        { label: "Verification Method", value: "UVM Agent with Scoreboards & Coverage" }
      ],
      challenges: [
        {
          problem: "HoL (Head-of-Line) Blocking occurred on Slow Peripheral channels, stalling fast memory transactions during overlapping burst operations.",
          solution: "Designed and implemented Out-of-Order Transaction ID routing, isolating traffic lanes and allowing non-blocking command pipelines."
        }
      ]
    },
    {
      id: "l2-cache-controller",
      name: "L2_CACHE_SYSTEM",
      category: "Verification",
      tagline: "MESI-Coherent Multi-Core Cache Controller System",
      description: "A 4-way set associative L2 write-back cache, implementing a pseudo-LRU replacement policy, MESI cache coherence protocol, and complete formal coverage verification mapping complex CPU core coherence matrices.",
      techStack: ["SystemVerilog", "SymbiYosys", "SystemVerilog Assertions", "ModelSim"],
      metrics: {
        lutCount: "12,240 LUTs",
        timingSlack: "+0.85 ns @ 200MHz",
        area: "0.22 mm\xB2",
        power: "42.5 mW",
        frequency: "200 MHz"
      },
      specs: [
        { label: "Associativity", value: "4-Way Set Associative" },
        { label: "Coherency Protocol", value: "MESI (Modified, Exclusive, Shared, Invalid)" },
        { label: "Line Replacement", value: "Pseudo-LRU (Tree-based)" },
        { label: "Write Policy", value: "Write-Back with Write-Allocate" }
      ],
      challenges: [
        {
          problem: "Transient coherency race conditions between CPU0 writing and CPU1 reading simultaneously triggered deadlocks in formal assertions tests.",
          solution: "Developed an explicit 'Snoop Buffer Pending Queue' holding read requests until local cache-lines successfully complete write-back sequences."
        }
      ]
    },
    {
      id: "apb-uart-periph",
      name: "APB UART Peripheral",
      category: "RTL Design",
      tagline: "Configurable UART Controller with AMBA APB Bus Interface",
      description: "Synthesizable UART serial transceiver peripheral mapped to the standard AMBA APB bus protocol. Equipped with dual 16-deep FIFO arrays, receiver/transmitter shift registers, and a baud rate division register.",
      techStack: ["Verilog", "AMBA APB", "FIFO Registers", "Xilinx Vivado"],
      metrics: {
        fifoDepth: "16 Words",
        baudRates: "Configurable",
        busWidth: "32-bit APB"
      },
      specs: [
        { label: "Protocol", value: "AMBA APB Protocol Compliant" },
        { label: "Buffer", value: "Dual 16-deep Tx/Rx FIFOs" },
        { label: "Baud Generator", value: "Highly configurable baud ticks divider" }
      ],
      challenges: [
        {
          problem: "FIFO overflows and asynchronous clock domain glitches on high transmission speeds.",
          solution: "Wrote dual gray-coded address pointer synchronization circuits and robust empty/full check logic with meta-stability filtering."
        }
      ]
    },
    {
      id: "mixed-sig-adc",
      name: "Mixed Signal ADC",
      category: "Analog Design",
      tagline: "8-Bit Successive Approximation Register (SAR) ADC",
      description: "Custom transistor-level analog/digital mixed SAR ADC. Features an R-2R digital-to-analog ladder, low-power comparator, and digital control register, developed in a 180nm process node.",
      techStack: ["LTspice", "Cadence Virtuoso", "Microwind", "TSMC 180nm PDK"],
      metrics: {
        resolution: "8-bit binary",
        samplingRate: "1 MS/s",
        staticPower: "45 uW @ 1.8V"
      },
      specs: [
        { label: "Process Node", value: "TSMC 180nm PDK" },
        { label: "Resolution", value: "8-Bit Successive Approximation" },
        { label: "Sampling Speed", value: "1 Mega Sample per second" }
      ],
      challenges: [
        {
          problem: "DAC mismatches and comparator voltage offsets caused non-monotonic output codes and severe differential non-linearity.",
          solution: "Designed the DAC ladder using strict common-centroid physical layouts and optimized comparator input transistor sizing to bound offsets under 2mV."
        }
      ]
    },
    {
      id: "eight-bit-computer",
      name: "8-BIT_COMPUTER",
      category: "Computer Architecture",
      tagline: "Classic Accumulator-Based von Neumann 8-Bit Computer",
      description: "A complete custom accumulator-based 8-bit computer implemented in synthesizable Verilog. Follows a classical von Neumann architecture, coordinated over an 8-bit shared tri-state bus. Features a custom 16-instruction ISA microsequenced by a control unit state machine and verified cycle-by-cycle inside Xilinx Vivado XSim.",
      techStack: ["Verilog HDL", "Vivado", "Xilinx XSim", "Computer Architecture", "Digital Design"],
      metrics: {
        lutCount: "342 LUTs",
        timingSlack: "+4.12 ns @ 50MHz",
        area: "FPGA Artix-7 Mapping",
        power: "4.2 mW (Est.)",
        frequency: "50 MHz"
      },
      specs: [
        { label: "Architecture Type", value: "Accumulator-based von Neumann" },
        { label: "Data Width", value: "8-bit Word" },
        { label: "Address Space", value: "4-bit (16 addressed Bytes)" },
        { label: "Instruction Set", value: "16 core operations (Custom ISA)" },
        { label: "Bus Structure", value: "8-bit shared tri-state parallel" },
        { label: "Verification Tools", value: "Xilinx Vivado XSim RTL Simulator" }
      ],
      challenges: [
        {
          problem: "Logical bus contention and dynamic meta-stability risks when multiple registers drive high/low values onto the shared 8-bit bus concurrently.",
          solution: "Implemented high-impedance tri-state buffers (assign bus = output_enable ? register_data : 8'bZ) on all modules connected to the shared interconnect. Integrated mutually-exclusive output control signals in the microsequence decoder to ensure at most one transmitter active per T-state."
        },
        {
          problem: "Flickering ALU comparison outputs and asynchronous timing loops causing unstable conditional branching flags on LDA, ADD and SUB commands.",
          solution: "Isolated ALU carry and zero calculation paths by synchronizing physical flag outputs into a dedicated Flags Register. The register is latched on the positive clock edge only when the alu_flags_load control line is active, stabilizing jump calculations."
        }
      ]
    }
  ],
  education: [
    {
      institution: "Manipal Institute of Technology, Bengaluru",
      degree: "B.Tech in Electronics Engineering",
      specialization: "VLSI Design & Technology",
      period: "2024 \u2014 Present",
      location: "Bengaluru, Karnataka, India",
      details: "Focusing on fundamental semiconductor physics, digital integrated circuit layouts, computer architectures, and hardware description languages. Maintaining prime research focus on pipelined processor design and micro-architectural optimizations.",
      highlights: [
        "First Class academic standing across VLSI design core curriculum",
        "Active Member of IEEE Circuits and Systems Society branch",
        "Developing advanced EDA lab benchmarks for synthesizable micro-cores"
      ]
    }
  ],
  certifications: [
    {
      title: "Computer Architecture Essentials on Arm",
      issuer: "Arm Education (Coursera)",
      date: "June 2026",
      category: "Computer Architecture",
      skills: ["ARM Architecture", "Processor Design", "Computer Organization", "Instruction Set Architecture"],
      verificationUrl: "https://coursera.org/verify/3NJZHUFQWWDF",
      authority: "Dr Khaled Benkrid, Senior Director, Education and Research (Arm Ltd)"
    },
    {
      title: "Embedded Software and Hardware Architecture",
      issuer: "University of Colorado Boulder (Coursera)",
      date: "July 2025",
      category: "Embedded Systems",
      skills: ["Embedded Systems", "Hardware Architecture", "Firmware Concepts", "Hardware-Software Co-design"],
      verificationUrl: "https://coursera.org/verify/8KD3Z90X2O44",
      authority: "Alex Fosdick, Instructor (Electrical, Computer, and Energy Engineering)"
    },
    {
      title: "Introduction to Python",
      issuer: "Coursera Project Network",
      date: "June 2025",
      category: "Programming",
      skills: ["Python", "Scripting", "Automation"],
      verificationUrl: "https://coursera.org/verify/OK0SWDD53DAP",
      authority: "David Dalsveen, Subject Matter Expert (Freedom Learning Group)"
    },
    {
      title: "GenAI Basics \u2013 How LLMs Work",
      issuer: "Duke University (Coursera)",
      date: "June 2025",
      category: "Artificial Intelligence",
      skills: ["Large Language Models", "Prompt Engineering", "AI Fundamentals"],
      verificationUrl: "https://coursera.org/verify/T6ZM8VUTF7B7",
      authority: "Derek Wales, Adjunct Professor (Data Science/Business)"
    },
    {
      title: "ChatGPT Playground for Beginners: Intro to NLP AI",
      issuer: "Coursera Project Network",
      date: "June 2025",
      category: "Artificial Intelligence",
      skills: ["ChatGPT", "NLP", "AI Tools"],
      verificationUrl: "https://coursera.org/verify/ZQK4UR1MH7ZI",
      authority: "Rudi Hinds, Software Engineer (Coursera Project Network)"
    },
    {
      title: "AI Tools & ChatGPT Workshop",
      issuer: "be10X",
      date: "June 2026",
      category: "Artificial Intelligence",
      skills: ["AI Productivity", "ChatGPT", "AI-assisted Coding", "AI Workflows"],
      authority: "Aditya Goenka & Aditya Kachave, Co-founders (be10X)"
    }
  ],
  skills: [
    {
      id: "hdls",
      name: "HDLs & Languages",
      skills: [
        { name: "SystemVerilog", proficiency: 98 },
        { name: "Verilog", proficiency: 98 },
        { name: "Chisel", proficiency: 75 },
        { name: "VHDL", proficiency: 65 }
      ]
    },
    {
      id: "programming",
      name: "Programming",
      skills: [
        { name: "C", proficiency: 95 },
        { name: "C++", proficiency: 85 },
        { name: "Python", proficiency: 90 },
        { name: "Tcl Scripts", proficiency: 80 },
        { name: "RISC-V Assembly", proficiency: 85 }
      ]
    },
    {
      id: "eda",
      name: "EDA Synthesis Tools",
      skills: [
        { name: "Synopsys Design Compiler", proficiency: 90 },
        { name: "Cadence Innovus", proficiency: 90 },
        { name: "Synopsys PrimeTime", proficiency: 85 },
        { name: "OpenSTA", proficiency: 88 },
        { name: "Yosys Open SY", proficiency: 92 }
      ]
    },
    {
      id: "fpga",
      name: "FPGA Development Tools",
      skills: [
        { name: "Xilinx Vivado", proficiency: 95 },
        { name: "Intel Quartus Prime", proficiency: 80 },
        { name: "ModelSim / Questa", proficiency: 90 }
      ]
    }
  ],
  journey: [
    { phase: "Phase 1", title: "Logic Design", note: "Basic combinational logic gates, boolean algebra, multiplexers, and decoders." },
    { phase: "Phase 2", title: "Finite State Machines", note: "Moore & Mealy sequential logic, sequential registers, setup/hold constraints." },
    { phase: "Phase 3", title: "UART", note: "Asynchronous transceiver hardware block with parameterized baud counters." },
    { phase: "Phase 4", title: "8-bit Computer", note: "Designed complete TTL breadboard architecture with hardware microcode EEPROMs." },
    { phase: "Phase 5", title: "RV32IM Processor", note: "First synthesizable RISC-V digital core implementing base integer & multiply sets." },
    { phase: "Phase 6", title: "Five Stage Pipeline", note: "Introduced classic hazard detection, bypass routing matrices, and execution stages." },
    { phase: "Phase 7", title: "Cache Memory", note: "Coherent L1/L2 multi-core set-associative cache controlled via snoop queues." },
    { phase: "Phase 8", title: "System on Chip", note: "Interconnected multi-core RISC-V nodes with a custom systolic array matrix engine." },
    { phase: "Phase 9", title: "RTL to GDSII", note: "Physical ASIC backend compilation under TSMC PDK libraries." },
    { phase: "Phase 10", title: "Future Tapeout", note: "Final digital silicon fabrication signoff with zero negative timing slack." }
  ],
  downloadableAssets: [
    { id: "resume-pdf", name: "Akshay_Srikrishnan_Resume.pdf", type: "PDF Document", size: "240 KB", description: "Standard print-optimized CV detailing full academic and technical history." },
    { id: "proj-rpt", name: "RV32IM_Core_Design_Report.pdf", type: "Technical Report", size: "1.8 MB", description: "Detailed 24-page report outlining pipeline, hazard matrix, and Verilator verification tests." },
    { id: "res-paper", name: "Power_Mesh_IR_Drop_7nm.pdf", type: "Research Paper", size: "1.2 MB", description: "Technical white paper investigating dual-grid power distributions in sub-10nm processes." },
    { id: "arch-doc", name: "MESI_Coherent_Cache_Spec.pdf", type: "Architecture Spec", size: "980 KB", description: "Architecture specification including MESI state transition matrices and formal SV assertions." },
    { id: "pres-slides", name: "Helios7_SoC_Tapeout_Slides.pdf", type: "Slides Deck", size: "3.4 MB", description: "Presentation deck from the physical design review highlighting floorplan DEF and clock tree results." }
  ],
  achievements: [
    { category: "Processor Architecture", title: "RV32IM Design", desc: "Micro-architected and validated a fully compliant RISC-V processor core from scratch." },
    { category: "SoC Integration", title: "Helios-7 Synthesis", desc: "Successfully mapped multi-core cluster nets and NPU multipliers onto TSMC 7nm technology libraries." },
    { category: "RTL Development", title: "Verilog / SV Mastery", desc: "Wrote 45+ clean, synthesizable hardware modules with flawless latch-free logs." },
    { category: "Hardware Verification", title: "99.8% Test Coverage", desc: "Verified system core memory maps using Cocotb Python randomized assertions." },
    { category: "FPGA Implementation", title: "Timing Closure", desc: "Achieved clean constraints clocking at 150MHz on Artix-7 and UltraScale+ FPGA targets." },
    { category: "Digital System Design", title: "FSM Optimization", desc: "Designed high-speed state controllers reducing instruction overhead clock cycles." },
    { category: "Cache Architecture", title: "MESI Resolution", desc: "Resolved multi-core coherence transient race deadlocks using explicit Snoop pending queues." },
    { category: "Pipeline Design", title: "Bypass Integration", desc: "Designed complex operand-forwarding matrices that reduced pipeline stalls by 100%." },
    { category: "ASIC Flow Exploration", title: "Power Mesh Grid", desc: "Optimized Innovus power routes, reducing peak dynamic IR drop voltage droop by 42%." }
  ],
  techStackSummary: [
    { name: "Verilog", rating: "Core HDL" },
    { name: "SystemVerilog", rating: "Verification" },
    { name: "C", rating: "Firmware" },
    { name: "Vivado", rating: "FPGA Design" },
    { name: "Cadence Virtuoso", rating: "Analog PDK" },
    { name: "LTspice", rating: "Simulations" },
    { name: "Microwind", rating: "CMOS Layout" },
    { name: "OpenLane", rating: "ASIC RTL-GDS" },
    { name: "GTKWave", rating: "Wave Viewer" },
    { name: "Linux", rating: "CLI Host" },
    { name: "Git", rating: "Versioning" },
    { name: "Arduino", rating: "Prototyping" },
    { name: "Computer Architecture", rating: "Micro-Arch" },
    { name: "RTL Design", rating: "Synthesis" },
    { name: "ASIC Design", rating: "Signoff" },
    { name: "FPGA Development", rating: "Bitstream" }
  ]
};

// src/services/contextBuilder.ts
function buildSystemInstruction() {
  const about = PORTFOLIO_KNOWLEDGE.about;
  const projects = PORTFOLIO_KNOWLEDGE.projects;
  const education = PORTFOLIO_KNOWLEDGE.education;
  const certifications = PORTFOLIO_KNOWLEDGE.certifications;
  const skills = PORTFOLIO_KNOWLEDGE.skills;
  const journey = PORTFOLIO_KNOWLEDGE.journey;
  const downloadableAssets = PORTFOLIO_KNOWLEDGE.downloadableAssets;
  const achievements = PORTFOLIO_KNOWLEDGE.achievements;
  const techStack = PORTFOLIO_KNOWLEDGE.techStackSummary;
  let prompt = `You are "Silicon Copilot", the flagship AI intelligence assistant for Akshay Srikrishnan's engineering portfolio.
Your role is to act as a Principal AI Engineer at Google DeepMind and a senior React, TypeScript, Gemini API, and AI Systems architect, representing Akshay's achievements and engineering capabilities.

=========================================
CRITICAL DIRECTIVES:
=========================================
1. Rely ONLY on the portfolio knowledge base below to answer questions.
2. If a query is unrelated to Akshay, his projects, experience, skills, education, achievements, or career prospects, politely refuse to answer. Do NOT talk about general topics (e.g., "how to cook a cake", "current news", general programming topics not related to his work). Instead, guide the user back to the portfolio and suggest topics to ask about.
3. Keep answers highly professional, precise, technical, and objective. Never hallucinate, lie, or extrapolate beyond the provided data.
4. Format all responses beautifully in Markdown. Use clean bold headings, bullet lists, tables for metrics, and syntax-highlighted code blocks (e.g. \`\`\`systemverilog, \`\`\`typescript, \`\`\`c) where helpful.
5. Identify yourself as "Silicon Copilot", created specifically to represent Akshay Srikrishnan.

=========================================
AKSHAY SRIKRISHNAN PORTFOLIO KNOWLEDGE BASE:
=========================================

--- ABOUT ---
- Name: ${about.name}
- Role: ${about.role}
- Location: ${about.location}
- Email: ${about.email}
- Bio: ${about.bio}
- Specialties: ${about.specialties.join(", ")}
- Academic Context: ${about.summaryText}

--- EDUCATION ---
${education.map((e) => `
* Institution: ${e.institution}
  Degree: ${e.degree}
  Specialization: ${e.specialization}
  Period: ${e.period}
  Location: ${e.location}
  Details: ${e.details}
  Highlights:
  ${e.highlights.map((h) => `  - ${h}`).join("\n")}
`).join("\n")}

--- CORE TECHNICAL PROJECTS ---
${projects.map((p) => `
* Name: ${p.name}
  Category: ${p.category}
  Tagline: ${p.tagline}
  Description: ${p.description}
  Tech Stack: ${p.techStack.join(", ")}
  Key Metrics:
  ${Object.entries(p.metrics).map(([key, val]) => `  - ${key}: ${val}`).join("\n")}
  Detailed Specifications:
  ${p.specs.map((s) => `  - ${s.label}: ${s.value}`).join("\n")}
  Architectural Challenges & Solutions:
  ${p.challenges.map((c) => `  - Challenge: ${c.problem}
    Solution: ${c.solution}`).join("\n")}
`).join("\n")}

--- CERTIFICATIONS & MICRO-CREDENTIALS ---
${certifications.map((c) => `
* Title: ${c.title}
  Issuer: ${c.issuer}
  Date: ${c.date}
  Category: ${c.category}
  Skills Acquired: ${c.skills.join(", ")}
  Verification URL: ${c.verificationUrl || "N/A"}
  Authority: ${c.authority || "N/A"}
`).join("\n")}

--- CORE COMPETENCIES & SKILLS ---
${skills.map((s) => `
* Category: ${s.name}
  Skills:
  ${s.skills.map((item) => `  - ${item.name} (${item.proficiency}% proficiency)`).join("\n")}
`).join("\n")}

--- ARCHITECTURAL & RTL JOURNEY TIMELINE ---
${journey.map((j) => `
* ${j.phase} - ${j.title}: ${j.note}
`).join("\n")}

--- KEY ACHIEVEMENTS ---
${achievements.map((a) => `
* [${a.category}] ${a.title} - ${a.desc}
`).join("\n")}

--- FULL TECHNOLOGY STACK ---
${techStack.map((t) => `
* ${t.name} (${t.rating})
`).join("\n")}

--- DOWNLOADABLE ASSETS (AVAILABLE ON PORTFOLIO) ---
${downloadableAssets.map((d) => `
* Asset: ${d.name} (${d.type}, ${d.size})
  Description: ${d.description}
  ID to trigger download: ${d.id}
`).join("\n")}

=========================================
RESPONSE FORMATTING INSTRUCTIONS:
=========================================
- Be precise.
- When referencing code, always provide a complete syntax-highlighted block if applicable.
- If asked about downloads, tell the user they can download the file "${downloadableAssets[0].name}" or others from the downloads section, or you can supply the links directly if they request it.
- Remember, keep conversations strictly relevant to Akshay. If the user says "Hello" or "Who are you?", introduce yourself as Akshay's Silicon Copilot and state your key capabilities.
`;
  return prompt;
}

// server.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
var analytics = {
  interactionsCount: 0,
  averageConversationLength: 0,
  totalSessions: 0,
  mostAskedQuestions: [],
  popularProjects: []
};
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});
app.post("/api/copilot/track", (req, res) => {
  try {
    const { question, projectName, sessionLength } = req.body;
    analytics.interactionsCount += 1;
    if (sessionLength !== void 0) {
      if (analytics.totalSessions === 0) {
        analytics.totalSessions = 1;
        analytics.averageConversationLength = sessionLength;
      } else {
        const totalLen = analytics.averageConversationLength * analytics.totalSessions + sessionLength;
        analytics.totalSessions += 1;
        analytics.averageConversationLength = Math.round(totalLen / analytics.totalSessions * 10) / 10;
      }
    }
    if (question) {
      const qLower = question.trim().toLowerCase();
      const existingQ = analytics.mostAskedQuestions.find(
        (q) => q.question.toLowerCase() === qLower
      );
      if (existingQ) {
        existingQ.count += 1;
      } else {
        analytics.mostAskedQuestions.push({ question: question.trim(), count: 1 });
      }
      analytics.mostAskedQuestions.sort((a, b) => b.count - a.count);
      analytics.mostAskedQuestions = analytics.mostAskedQuestions.slice(0, 10);
    }
    if (projectName) {
      const pTrimmed = projectName.trim();
      const existingP = analytics.popularProjects.find(
        (p) => p.projectName === pTrimmed
      );
      if (existingP) {
        existingP.count += 1;
      } else {
        analytics.popularProjects.push({ projectName: pTrimmed, count: 1 });
      }
      analytics.popularProjects.sort((a, b) => b.count - a.count);
      analytics.popularProjects = analytics.popularProjects.slice(0, 10);
    }
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/copilot/analytics", (req, res) => {
  res.json(analytics);
});
app.post("/api/copilot/chat", async (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.write("Error: 'messages' array is required in the request body.");
      res.end();
      return;
    }
    const ai = getAI();
    const systemInstruction = buildSystemInstruction();
    const contents = messages.map((m) => {
      const role = m.role === "assistant" ? "model" : "user";
      return {
        role,
        parts: [{ text: m.content }]
      };
    });
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.2
        // Keep it precise and deterministic for factual Q&A
      }
    });
    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }
    res.end();
  } catch (err) {
    console.error("Gemini stream error:", err);
    res.write(`Error: ${err.message || "Internal server error connecting to Gemini API."}`);
    res.end();
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static files...");
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
