import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, MapPin, Download, Copy, Check, Briefcase, GraduationCap, Award, Cpu, 
  FileText, ChevronDown, ChevronUp, ExternalLink, ArrowUpRight, Code, Terminal, 
  Layers, Waves, Settings, Binary, Database, Microscope, ChevronRight, BookOpen, 
  AlertCircle, Sparkles, FolderDown, ArrowRight, Github, Linkedin, Globe, CheckCircle2
} from 'lucide-react';

// ============================================================================
// PROFILE DATA TYPES
// ============================================================================
interface SkillItem {
  name: string;
  proficiency: number; // 0 to 100
}

interface SkillCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  skills: SkillItem[];
}

interface ProjectDetail {
  id: string;
  name: string;
  tagline: string;
  category: string;
  image: string;
  techStack: string[];
  description: string;
  metrics: {
    label: string;
    value: string;
  }[];
  overview: string;
  architecture: string;
  challenges: string;
  solutions: string;
  verification: string;
  simulation: string;
  documentation: string;
  waveforms: string;
  diagram: string;
  futureImprovements: string;
}

// ============================================================================
// COMPONENT IMPLEMENTATION
// ============================================================================
export default function Resume() {
  const [copied, setCopied] = useState(false);
  const [specialtyIndex, setSpecialtyIndex] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<ProjectDetail | null>(null);
  const [activeProjectTab, setActiveProjectTab] = useState<'overview' | 'architecture' | 'verification' | 'downloads'>('overview');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [activeCert, setActiveCert] = useState<any | null>(null);

  // Specialties rotating list
  const specialties = [
    "ASIC Design",
    "RTL Design",
    "Computer Architecture",
    "FPGA Development",
    "Physical Design"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSpecialtyIndex((prev) => (prev + 1) % specialties.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleCopyRaw = () => {
    const text = `AKSHAY SRIKRISHNAN - VLSI & DIGITAL DESIGN ARCHITECT
Email: crazyplayz61@gmail.com | Location: Bengaluru, Karnataka, India
Education: B.Tech Electronics Engineering, VLSI Design & Technology | Manipal Institute of Technology, Bengaluru
Specialties: ASIC Design, RTL Design, Processor Architecture, FPGA Development, Physical Design
--------------------------------------------------------------------------------
CORE PROJECTS:
1. RV32IM Processor (Synthesizable, compliant CPU core)
2. Five Stage Pipeline RV32IM (Classic hazard-bypassing microarchitecture)
3. Cache Memory (MESI Multi-core Coherent Set Associative Cache)
4. APB UART Peripheral (AMBA mapped Tx/Rx FIFO register interface)
5. Mixed Signal ADC (8-bit 1 MS/s Successive Approximation Register ADC)
6. 8 bit CPU (TTL gate breadboard microcomputer from scratch)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navigateToTab = (tabId: string) => {
    document.getElementById(`nav-link-${tabId}`)?.click();
  };

  // Reusable simulated download handler
  const triggerSimulatedDownload = (assetId: string, assetName: string) => {
    setDownloadingId(assetId);
    setDownloadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setDownloadingId(null), 1000);
      }
      setDownloadProgress(progress);
    }, 150);
  };

  const getCertIcon = (logo: string) => {
    switch (logo) {
      case 'cpu':
        return <Cpu className="h-5 w-5 text-[#a78bfa] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />;
      case 'binary':
        return <Binary className="h-5 w-5 text-[#a78bfa] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />;
      case 'code':
        return <Code className="h-5 w-5 text-[#a78bfa] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />;
      case 'sparkles':
        return <Sparkles className="h-5 w-5 text-[#a78bfa] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />;
      case 'terminal':
        return <Terminal className="h-5 w-5 text-[#a78bfa] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />;
      case 'award':
      default:
        return <Award className="h-5 w-5 text-[#a78bfa] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />;
    }
  };

  // --------------------------------------------------------------------------
  // EDUCATION DATA
  // --------------------------------------------------------------------------
  const educationTimeline = [
    {
      institution: "Manipal Institute of Technology, Bengaluru",
      degree: "B.Tech in Electronics Engineering",
      specialization: "VLSI Design & Technology",
      period: "2024 — Present",
      location: "Bengaluru, Karnataka, India",
      details: "Focusing on fundamental semiconductor physics, digital integrated circuit layouts, computer architectures, and hardware description languages. Maintaining prime research focus on pipelined processor design and micro-architectural optimizations.",
      highlights: [
        "First Class academic standing across VLSI design core curriculum",
        "Active Member of IEEE Circuits and Systems Society branch",
        "Developing advanced EDA lab benchmarks for synthesizable micro-cores"
      ]
    }
  ];

  // --------------------------------------------------------------------------
  // SKILLS ARSENAL DATA
  // --------------------------------------------------------------------------
  const skillCategories: SkillCategory[] = [
    {
      id: 'hdls',
      name: 'HDLs & Languages',
      icon: <Code className="h-5 w-5 text-[#a78bfa]" />,
      skills: [
        { name: 'SystemVerilog', proficiency: 98 },
        { name: 'Verilog', proficiency: 98 },
        { name: 'Chisel', proficiency: 75 },
        { name: 'VHDL', proficiency: 65 }
      ]
    },
    {
      id: 'programming',
      name: 'Programming',
      icon: <Terminal className="h-5 w-5 text-[#a78bfa]" />,
      skills: [
        { name: 'C', proficiency: 95 },
        { name: 'C++', proficiency: 85 },
        { name: 'Python', proficiency: 90 },
        { name: 'Tcl Scripts', proficiency: 80 },
        { name: 'RISC-V Assembly', proficiency: 85 }
      ]
    },
    {
      id: 'eda',
      name: 'EDA Synthesis Tools',
      icon: <Settings className="h-5 w-5 text-[#a78bfa]" />,
      skills: [
        { name: 'Synopsys Design Compiler', proficiency: 90 },
        { name: 'Cadence Innovus', proficiency: 90 },
        { name: 'Synopsys PrimeTime', proficiency: 85 },
        { name: 'OpenSTA', proficiency: 88 },
        { name: 'Yosys Open SY', proficiency: 92 }
      ]
    },
    {
      id: 'fpga',
      name: 'FPGA Development Tools',
      icon: <Cpu className="h-5 w-5 text-[#a78bfa]" />,
      skills: [
        { name: 'Xilinx Vivado', proficiency: 95 },
        { name: 'Intel Quartus Prime', proficiency: 80 },
        { name: 'ModelSim / Questa', proficiency: 90 }
      ]
    },
    {
      id: 'analog',
      name: 'Analog IC Design',
      icon: <Waves className="h-5 w-5 text-[#a78bfa]" />,
      skills: [
        { name: 'Cadence Virtuoso', proficiency: 85 },
        { name: 'LTspice', proficiency: 90 },
        { name: 'Microwind', proficiency: 78 }
      ]
    },
    {
      id: 'physical',
      name: 'Physical Backend Design',
      icon: <Layers className="h-5 w-5 text-[#a78bfa]" />,
      skills: [
        { name: 'Floorplanning & Power Grid', proficiency: 92 },
        { name: 'Placement Optimization', proficiency: 88 },
        { name: 'Clock Tree Synthesis (CTS)', proficiency: 85 },
        { name: 'Signal Routing & Congestion', proficiency: 90 },
        { name: 'DRC & LVS Checks', proficiency: 92 }
      ]
    },
    {
      id: 'embedded',
      name: 'Embedded Systems',
      icon: <Binary className="h-5 w-5 text-[#a78bfa]" />,
      skills: [
        { name: 'Arduino Platform', proficiency: 95 },
        { name: 'ESP32 / Microcontrollers', proficiency: 88 },
        { name: 'FreeRTOS basics', proficiency: 75 },
        { name: 'I2C, SPI, UART Protocol Bus', proficiency: 95 }
      ]
    },
    {
      id: 'vcs',
      name: 'Version Control',
      icon: <Database className="h-5 w-5 text-[#a78bfa]" />,
      skills: [
        { name: 'Git version control', proficiency: 95 },
        { name: 'GitHub Actions / CI-CD', proficiency: 85 }
      ]
    },
    {
      id: 'os',
      name: 'Operating Systems',
      icon: <Globe className="h-5 w-5 text-[#a78bfa]" />,
      skills: [
        { name: 'Linux command line', proficiency: 95 },
        { name: 'Ubuntu / Debian systems', proficiency: 95 }
      ]
    },
    {
      id: 'comp_arch',
      name: 'Computer Architecture',
      icon: <Microscope className="h-5 w-5 text-[#a78bfa]" />,
      skills: [
        { name: 'Pipelined Core Microarchitectures', proficiency: 98 },
        { name: 'Multi-Core Cache Coherency (MESI)', proficiency: 95 },
        { name: 'Network-on-Chip (NoC) Crossbars', proficiency: 90 }
      ]
    },
    {
      id: 'digital_design',
      name: 'Digital System Design',
      icon: <Briefcase className="h-5 w-5 text-[#a78bfa]" />,
      skills: [
        { name: 'Finite State Machine (FSM)', proficiency: 98 },
        { name: 'Clock Domain Crossings (CDC)', proficiency: 88 },
        { name: 'Glitch-free Clock Gating', proficiency: 85 }
      ]
    },
    {
      id: 'rtl_design',
      name: 'RTL Coding & Verification',
      icon: <GraduationCap className="h-5 w-5 text-[#a78bfa]" />,
      skills: [
        { name: 'Synthesizable Coding Styles', proficiency: 98 },
        { name: 'Register Transfer Level Timing', proficiency: 95 },
        { name: 'SystemVerilog Assertions (SVA)', proficiency: 85 }
      ]
    }
  ];

  // --------------------------------------------------------------------------
  // ENGINEERING JOURNEY TIMELINE DATA
  // --------------------------------------------------------------------------
  const journeyTimeline = [
    { title: "Logic Design", year: "Phase 1", note: "Basic combinational logic gates, boolean algebra, multiplexers, and decoders." },
    { title: "Finite State Machines", year: "Phase 2", note: "Moore & Mealy sequential logic, sequential registers, setup/hold constraints." },
    { title: "UART", year: "Phase 3", note: "Asynchronous transceiver hardware block with parameterized baud counters." },
    { title: "8-bit CPU", year: "Phase 4", note: "Designed complete TTL breadboard architecture with hardware microcode EEPROMs." },
    { title: "RV32IM Processor", year: "Phase 5", note: "First synthesizable RISC-V digital core implementing base integer & multiply sets." },
    { title: "Five Stage Pipeline RV32IM", year: "Phase 6", note: "Introduced classic hazard detection, bypass routing matrices, and execution stages." },
    { title: "Cache Memory", year: "Phase 7", note: "Coherent L1/L2 multi-core set-associative cache controlled via snoop queues." },
    { title: "RTL to GDSII", year: "Phase 8", note: "Physical ASIC backend compilation under TSMC PDK libraries." },
    { title: "Future Tapeout", year: "Phase 9", note: "Final digital silicon fabrication signoff with zero negative timing slack." }
  ];

  // --------------------------------------------------------------------------
  // FEATURED PROJECTS LIST DATA
  // --------------------------------------------------------------------------
  const featuredProjects: ProjectDetail[] = [
    {
      id: 'rv32im-proc',
      name: 'RV32IM Processor Core',
      tagline: 'High-Performance Synthesizable RISC-V CPU Core',
      category: 'Computer Arch',
      image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=600&auto=format&fit=crop',
      techStack: ['SystemVerilog', 'Verilator', 'C++ Testbench', 'FPGA (Artix-7)', 'OpenSTA'],
      description: 'A fully-synthesizable, cycle-accurate implementation of the RISC-V RV32IM ISA. Features a high-efficiency ALU paired with parameterizable multi-cycle integer divider and multipliers.',
      metrics: [
        { label: 'Frequency', value: '180 MHz (TSMC 65nm)' },
        { label: 'Cell Area', value: '0.18 mm²' },
        { label: 'Logic Gates', value: '38.4k NAND2' }
      ],
      overview: 'This project centers on the implementation of a fully compliant RISC-V RV32IM processor. Special focus was placed on creating synthesizable hardware blocks that do not generate unintended latches and maintain strict synchronous reset parameters.',
      architecture: 'Single-cycle core mapping instruction-level registers to internal hardware pipelines. Employs a parameterizable barrel shifter and pipelined execution logic that integrates closely with memory arrays.',
      challenges: 'Multi-bit hardware multiplication propagation delay heavily restricted maximum clock speed in early synthesis runs.',
      solutions: 'Designed an iterative Radix-4 Booth Multiplier with internal pipelining, splitting critical multiplier path delays over 3 independent clocks.',
      verification: 'Verified through a multi-layered Verilator testbench writing C++ stimulus drivers, achieving full compliance with official RISC-V instruction-level validation suites.',
      simulation: 'Cycle-accurate simulation trace logs compiled to VCD files and viewed in GTKWave to confirm register file and execution timing.',
      documentation: 'Complete architecture reference manual detailing instruction execution clocks, register allocations, and physical block sizes.',
      waveforms: 'Displays the partial product summation waves executing a 32x32-bit hardware multiply.',
      diagram: 'Displays the standard Harvard register architecture feeding custom execute modules.',
      futureImprovements: 'Integrating branch target buffers to reduce multi-cycle delay branches.'
    },
    {
      id: 'five-stage-pipe',
      name: 'Five Stage Pipeline RV32IM',
      tagline: 'Classic Pipelined CPU with Forwarding & Hazard Bypass',
      category: 'RTL Design',
      image: 'https://images.unsplash.com/photo-1601987177651-8edfe6c20009?q=80&w=600&auto=format&fit=crop',
      techStack: ['SystemVerilog', 'Operand Forwarding', 'Hazard Detection', 'ModelSim'],
      description: 'Classic Fetch, Decode, Execute, Memory, and Write-Back hardware pipeline core. Fully equipped with operand-forwarding registers and data hazard detectors to optimize IPC.',
      metrics: [
        { label: 'Pipeline depth', value: '5 Stages' },
        { label: 'Instruction IPC', value: '0.96 peak' },
        { label: 'Lut Count', value: '4,280 LUTs' }
      ],
      overview: 'Pipelining introduces high-speed clock cycles but brings data and control hazards. This project micro-architects a complete forwarding path and bypass matrix to optimize throughput.',
      architecture: 'Features a classic 5-stage setup: Fetch (IF), Decode (ID), Execute (EX), Memory (MEM), and Write-back (WB). Leverages synchronous registers to isolate stages.',
      challenges: 'Read-After-Write (RAW) data hazards caused continuous 2-cycle processor stalls, degrading instructions-per-cycle (IPC) to 0.74.',
      solutions: 'Designed a comprehensive bypass matrix routing ALU results directly from MEM and WB stages back to the execute inputs, reducing stalls to 0 cycles.',
      verification: 'Simulated with randomized instruction streams in ModelSim to track state verification under overlapping load-store cycles.',
      simulation: 'Analyzed using timing-annotated ModelSim tests verifying data-forwarding operations across 10,000 randomized cycles.',
      documentation: 'Includes hazard-bypassing tables, timing delay tables, and routing schematics.',
      waveforms: 'Illustrates forwarding pulses where instruction sequence reads from registers just modified by the previous write back stage.',
      diagram: 'Shows the 5 distinct execution stages connected by explicit pipeline control registers.',
      futureImprovements: 'Transitioning to a dual-issue execution pipeline to exceed 1.0 IPC.'
    },
    {
      id: 'coherent-cache',
      name: 'Cache Memory',
      tagline: 'MESI-Coherent Multi-Core Set Associative L2 Cache',
      category: 'Computer Arch',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop',
      techStack: ['SystemVerilog', 'SymbiYosys', 'SystemVerilog Assertions', 'ModelSim'],
      description: 'A 4-way set associative L2 write-back cache system. Implements tree-based pseudo-LRU line replacement and MESI cache-coherency protocols for multi-core bus systems.',
      metrics: [
        { label: 'Coherence', value: 'MESI Protocol' },
        { label: 'Associativity', value: '4-Way Set' },
        { label: 'Frequency', value: '200 MHz' }
      ],
      overview: 'Ensures absolute memory consistency across multi-cluster processor cores. Tracks cache line states dynamically and responds to global interconnect snoop commands.',
      architecture: 'Includes integrated tag memories, direct SRAM array interfaces, pseudo-LRU age trees, and a state machine implementing standard MESI status (Modified, Exclusive, Shared, Invalid).',
      challenges: 'Overlapping memory write/read misses from separate cores caused rare lockups during stress testing.',
      solutions: 'Developed Snoop Buffer Pending Queues to hold external queries and serialise conflicting transactions safely.',
      verification: 'Formally verified using SystemVerilog Assertions (SVA) inside SymbiYosys, providing absolute proof of coherence and deadlock-free operation.',
      simulation: 'ModelSim logic simulations verifying MESI state transitions under forced cache-line collisions.',
      documentation: 'Complete state transition diagram alongside comprehensive explanation of snooping pathways and bus requests.',
      waveforms: 'Displays the snoop invalidation bus signals transitioning cache lines from SHARED to INVALID on remote write hits.',
      diagram: 'Shows the Tag/Data arrays aligned to snoop buses and LRU logic units.',
      futureImprovements: 'Scaling the coherence scheme to support directory-based tracking for larger core clusters.'
    },
    {
      id: 'apb-uart-periph',
      name: 'APB UART Peripheral',
      tagline: 'Configurable UART Controller with AMBA APB Bus Interface',
      category: 'RTL Design',
      image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=600&auto=format&fit=crop',
      techStack: ['Verilog', 'AMBA APB', 'FIFO Registers', 'Xilinx Vivado'],
      description: 'Synthesizable UART serial transceiver peripheral mapped to the standard AMBA APB bus protocol. Equipped with dual 16-deep FIFO arrays.',
      metrics: [
        { label: 'FIFO Depth', value: '16 Words' },
        { label: 'Baud Rates', value: 'Configurable' },
        { label: 'Bus Width', value: '32-bit APB' }
      ],
      overview: 'Provides robust asynchronous communication capabilities to synthesizable processor cores. Integrates easily into micro-architectures via a clean APB bus interface.',
      architecture: 'Features transmitter/receiver shifting blocks, a baud rate generator utilizing division registers, and independent Tx/Rx FIFO memory blocks.',
      challenges: 'FIFO overflows and asynchronous clock domain glitches on high transmission speeds.',
      solutions: 'Wrote dual gray-coded address pointer synchronization circuits and robust empty/full check logic with meta-stability filtering.',
      verification: 'Validated using self-checking testbenches verifying register write/read access, baud divisions, and error interrupts.',
      simulation: 'Functional simulations illustrating serial transmit bit streams aligned with correct baud tick rates under GTKWave.',
      documentation: 'User-level registers map detailing interrupt mask registers, baud controls, and parity options.',
      waveforms: 'APB bus transaction cycles showcasing zero-wait state register read/write sequences.',
      diagram: 'Internal blocks mapping APB bus controls to UART transmitter shift lines.',
      futureImprovements: 'Adding direct hardware auto-flow control pins (RTS/CTS).'
    },
    {
      id: 'mixed-sig-adc',
      name: 'Mixed Signal ADC',
      tagline: '8-Bit Successive Approximation Register (SAR) ADC',
      category: 'Analog Design',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
      techStack: ['LTspice', 'Cadence Virtuoso', 'Microwind', 'TSMC 180nm PDK'],
      description: 'Custom transistor-level analog/digital mixed SAR ADC. Features an R-2R digital-to-analog ladder, low-power comparator, and digital control register.',
      metrics: [
        { label: 'Resolution', value: '8-bit binary' },
        { label: 'Sampling Rate', value: '1 MS/s' },
        { label: 'Static Power', value: '45 uW @ 1.8V' }
      ],
      overview: 'Bridges analog physical voltage sweeps to digital binary streams. Formed using custom CMOS standard cells designed in a 180nm process node.',
      architecture: 'Integrates an active sample-and-hold circuit, high-speed differential analog comparator, binary-weighted R-2R network, and sequential digital control register.',
      challenges: 'DAC mismatches and comparator voltage offsets caused non-monotonic output codes and severe differential non-linearity.',
      solutions: 'Designed the DAC ladder using strict common-centroid physical layouts and optimized comparator input transistor sizing to bound offsets under 2mV.',
      verification: 'Analyzed through SPICE netlist simulations evaluating Effective Number of Bits (ENOB) and Total Harmonic Distortion (THD).',
      simulation: 'LTspice transient sweeps showing bit-wise digital approximations converging within 8 consecutive clock ticks.',
      documentation: 'SPICE schematics, layout layout plots, and performance spectrum analysis diagrams.',
      waveforms: 'Comparator nodes sweeping through successive approximations before outputting code combinations.',
      diagram: 'Analog comparator feeding digital registers connected to R-2R ladder networks.',
      futureImprovements: 'Re-architecting using capacitive DAC networks to cut power consumption in half.'
    },
    {
      id: 'eight-bit-computer',
      name: '8 bit CPU',
      tagline: 'Custom Discrete TTL Logic Microcomputer',
      category: 'Digital Design',
      image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=600&auto=format&fit=crop',
      techStack: ['Digital Logic', 'Breadboard Design', 'EEPROM Microcode', 'Assembly'],
      description: 'A complete custom-designed 8-bit computer built entirely from discrete 7400-series TTL logic integrated circuits.',
      metrics: [
        { label: 'RAM Capacity', value: '16 Bytes' },
        { label: 'Buses', value: '8-bit common' },
        { label: 'Control Logic', value: 'Microcoded' }
      ],
      overview: 'An educational-focused hardware implementation that isolates every structural block of a processor. Built using discrete chips to provide physical debugging of bus lines.',
      architecture: 'Includes an 8-bit program counter, instruction register, 16-byte RAM, ALU with add/sub gates, accumulator register, and EEPROM microprogram sequencer.',
      challenges: 'Electrical signal bounces and noise glitches on common buses when clock speed exceeded 100 kHz.',
      solutions: 'Wired decoupling bypass capacitors on every chip supply pin and routed common bus rails using star-ground patterns to suppress noise.',
      verification: 'Verified by loading hand-compiled custom assembly programs for Fibonacci calculations and multiplier loops.',
      simulation: 'Trace logs modeled in software mapping instruction register steps to physical pin outputs.',
      documentation: 'Wired schematics, control microcode registers, and instruction-set reference sheets.',
      waveforms: 'Oscilloscope bus probing displaying stable 5V TTL logic level thresholds during clock transitions.',
      diagram: 'Hand-drawn schematics mapping discrete ALU logic gates, buses, and registers.',
      futureImprovements: 'Expanding memory mapping to support up to 256 bytes of RAM.'
    }
  ];

  // --------------------------------------------------------------------------
  // CERTIFICATIONS DATA
  // --------------------------------------------------------------------------
  const certificationCategories = [
    {
      id: "comp-arch-embedded",
      name: "Computer Architecture & Embedded Systems",
      items: [
        {
          title: "Computer Architecture Essentials on Arm",
          issuer: "Arm Education (Coursera)",
          date: "June 2026",
          category: "Computer Architecture",
          skills: ["ARM Architecture", "Processor Design", "Computer Organization", "Instruction Set Architecture"],
          verificationUrl: "https://coursera.org/verify/3NJZHUFQWWDF",
          logo: "cpu",
          authority: "Dr Khaled Benkrid, Senior Director, Education and Research (Arm Ltd)"
        },
        {
          title: "Embedded Software and Hardware Architecture",
          issuer: "University of Colorado Boulder (Coursera)",
          date: "July 2025",
          category: "Embedded Systems",
          skills: ["Embedded Systems", "Hardware Architecture", "Firmware Concepts", "Hardware-Software Co-design"],
          verificationUrl: "https://coursera.org/verify/8KD3Z90X2O44",
          logo: "binary",
          authority: "Alex Fosdick, Instructor (Electrical, Computer, and Energy Engineering)"
        }
      ]
    },
    {
      id: "programming",
      name: "Programming",
      items: [
        {
          title: "Introduction to Python",
          issuer: "Coursera Project Network",
          date: "June 2025",
          category: "Programming",
          skills: ["Python", "Scripting", "Automation"],
          verificationUrl: "https://coursera.org/verify/OK0SWDD53DAP",
          logo: "code",
          authority: "David Dalsveen, Subject Matter Expert (Freedom Learning Group)"
        }
      ]
    },
    {
      id: "artificial-intelligence",
      name: "Artificial Intelligence",
      items: [
        {
          title: "GenAI Basics – How LLMs Work",
          issuer: "Duke University (Coursera)",
          date: "June 2025",
          category: "Artificial Intelligence",
          skills: ["Large Language Models", "Prompt Engineering", "AI Fundamentals"],
          verificationUrl: "https://coursera.org/verify/T6ZM8VUTF7B7",
          logo: "sparkles",
          authority: "Derek Wales, Adjunct Professor (Data Science/Business)"
        },
        {
          title: "ChatGPT Playground for Beginners: Intro to NLP AI",
          issuer: "Coursera Project Network",
          date: "June 2025",
          category: "Artificial Intelligence",
          skills: ["ChatGPT", "NLP", "AI Tools"],
          verificationUrl: "https://coursera.org/verify/ZQK4UR1MH7ZI",
          logo: "terminal",
          authority: "Rudi Hinds, Software Engineer (Coursera Project Network)"
        },
        {
          title: "AI Tools & ChatGPT Workshop",
          issuer: "be10X",
          date: "June 2026",
          category: "Artificial Intelligence",
          skills: ["AI Productivity", "ChatGPT", "AI-assisted Coding", "AI Workflows"],
          logo: "award",
          authority: "Aditya Goenka & Aditya Kachave, Co-founders (be10X)"
        }
      ]
    }
  ];

  // --------------------------------------------------------------------------
  // RESEARCH INTERESTS DATA
  // --------------------------------------------------------------------------
  const researchInterests = [
    { topic: "Computer Architecture", desc: "Out-of-Order pipelines, superscalar architectures, branch target buffers, and multi-core memory consistency." },
    { topic: "ASIC Design", desc: "Deep sub-micron cell library syntheses, low-voltage standard cell configurations, and signoff criteria." },
    { topic: "RTL Design", desc: "Synthesizable digital structures, optimized datapaths, and power-gated register transfer files." },
    { topic: "Physical Design", desc: "Floorplan boundary optimization, multi-source clock trees, and dynamic power mesh layouts." },
    { topic: "Digital IC Design", desc: "Static timing analysis, clock domain crossovers, and formal logical equivalence proofs." },
    { topic: "FPGA Systems", desc: "Hardware-in-the-loop debugging, Vivado block configurations, and physical timing closure constraints." },
    { topic: "Embedded Systems", desc: "Real-time operating systems, serial bus controllers (SPI, APB), and direct sensor interfaces." },
    { topic: "Mixed Signal Design", desc: "SAR analog-to-digital converter blocks, R-2R ladder layouts, and spice transistor optimizations." }
  ];

  // --------------------------------------------------------------------------
  // CORE COMPETENCIES DATA
  // --------------------------------------------------------------------------
  const coreCompetencies = [
    { title: "RTL Design", desc: "Expert SystemVerilog coding with zero latch warnings, utilizing parameterizable blocks." },
    { title: "Processor Architecture", desc: "Microarchitecting high-efficiency RISC-V cores with pipelined multipliers and bypass routes." },
    { title: "Cache Design", desc: "Set-associative L1/L2 caches with MESI state registers and multi-core snooping logic." },
    { title: "Digital Verification", desc: "Functional coverage checking using Cocotb, UVM, and SystemVerilog Assertions." },
    { title: "Physical Design", desc: "Timing closures, floorplanning DEF controls, and custom power grid layouts." }
  ];

  // --------------------------------------------------------------------------
  // ACHIEVEMENTS DATA
  // --------------------------------------------------------------------------
  const achievementsList = [
    { category: "Processor Architecture", title: "RV32IM Design", desc: "Micro-architected and validated a fully compliant RISC-V processor core from scratch." },
    { category: "RTL Development", title: "Verilog / SV Mastery", desc: "Wrote 45+ clean, synthesizable hardware modules with flawless latch-free logs." },
    { category: "Hardware Verification", title: "99.8% Test Coverage", desc: "Verified system core memory maps using Cocotb Python randomized assertions." },
    { category: "FPGA Implementation", title: "Timing Closure", desc: "Achieved clean constraints clocking at 150MHz on Artix-7 and UltraScale+ FPGA targets." },
    { category: "Digital System Design", title: "FSM Optimization", desc: "Designed high-speed state controllers reducing instruction overhead clock cycles." },
    { category: "Cache Architecture", title: "MESI Resolution", desc: "Resolved multi-core coherence transient race deadlocks using explicit Snoop pending queues." },
    { category: "Pipeline Design", title: "Bypass Integration", desc: "Designed complex operand-forwarding matrices that reduced pipeline stalls by 100%." },
    { category: "ASIC Flow Exploration", title: "Power Mesh Grid", desc: "Optimized Innovus power routes, reducing peak dynamic IR drop voltage droop by 42%." }
  ];

  // --------------------------------------------------------------------------
  // ENGINEERING METRICS DATA
  // --------------------------------------------------------------------------
  const engineeringMetrics = [
    { label: "Completed Projects", value: 12, suffix: "+" },
    { label: "Synthesizable RTL Modules", value: 45, suffix: "+" },
    { label: "Processor Architectures", value: 3, suffix: "" },
    { label: "Verified Peripheral IPs", value: 8, suffix: "" },
    { label: "Active EDA Tools", value: 10, suffix: "+" },
    { label: "Documentation Pages", value: 150, suffix: "+" },
    { label: "Research Articles", value: 4, suffix: "" },
    { label: "Simulation Testbenches", value: 30, suffix: "+" }
  ];

  // --------------------------------------------------------------------------
  // DOWNLOADS DATA
  // --------------------------------------------------------------------------
  const downloadCards = [
    { id: 'resume-pdf', name: 'Akshay_Srikrishnan_Resume.pdf', desc: 'Standard print-optimized CV detailing full academic and technical history.', type: 'PDF Document', size: '240 KB' },
    { id: 'proj-rpt', name: 'RV32IM_Core_Design_Report.pdf', desc: 'Detailed 24-page report outlining pipeline, hazard matrix, and Verilator verification tests.', type: 'Technical Report', size: '1.8 MB' },
    { id: 'res-paper', name: 'Power_Mesh_IR_Drop_7nm.pdf', desc: 'Technical white paper investigating dual-grid power distributions in sub-10nm processes.', type: 'Research Paper', size: '1.2 MB' },
    { id: 'arch-doc', name: 'MESI_Coherent_Cache_Spec.pdf', desc: 'Architecture specification including MESI state transition matrices and formal SV assertions.', type: 'Architecture Spec', size: '980 KB' }
  ];

  // --------------------------------------------------------------------------
  // TECHNOLOGY STACK DATA
  // --------------------------------------------------------------------------
  const techStackList = [
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
  ];

  // --------------------------------------------------------------------------
  // COUNT UP COMPONENT
  // --------------------------------------------------------------------------
  function CountingStat({ value, suffix }: { value: number; suffix: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const end = value;
      if (end === 0) return;
      const totalDuration = 1000; // ms
      const stepTime = Math.max(Math.floor(totalDuration / end), 15);
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) {
          clearInterval(timer);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }, [value]);

    return (
      <span className="font-mono text-3xl font-extrabold text-white tracking-tight">
        {count}{suffix}
      </span>
    );
  }

  return (
    <section className="py-12 animate-in fade-in duration-500 text-slate-100" id="resume-profile-page">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 1. PAGE HEADER */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-5">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#a78bfa]">
              Semiconductor Engineering
            </span>
            <h1 className="mt-1 font-sans text-3xl font-extrabold tracking-tight text-white md:text-4xl uppercase">
              Engineering Profile
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopyRaw}
              className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] px-4 py-2 font-mono text-xs text-slate-300 hover:border-[#a78bfa]/40 hover:text-white transition-all active:scale-95"
            >
              {copied ? (
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> Copied Text</span>
              ) : (
                <span className="flex items-center gap-1.5"><Copy className="h-3.5 w-3.5 text-[#a78bfa]" /> Copy Plain Profile</span>
              )}
            </button>
            <button
              onClick={() => navigateToTab('contact')}
              className="rounded-lg bg-[#a78bfa] px-4 py-2 font-mono text-xs font-bold text-black hover:brightness-110 transition-all shadow-md shadow-[#a78bfa]/10 active:scale-95"
            >
              Connect with Me
            </button>
          </div>
        </div>

        {/* 2. HERO SECTION */}
        <div className="mb-12 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0c0c0c] p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-[#a78bfa]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="font-mono text-xs font-bold text-[#a78bfa] tracking-[0.2em] uppercase block">
                // ACTIVE HARDWARE RECRUITMENT PROFILE
              </span>
              
              <h2 className="font-sans text-4xl sm:text-5xl font-black text-white tracking-tight uppercase">
                Akshay Srikrishnan
              </h2>

              {/* ROTATING SPECIALTIES */}
              <div className="h-8 flex items-center overflow-hidden font-mono text-base font-bold text-slate-300">
                <span className="text-[#a78bfa] mr-2">Focus &gt;</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={specialtyIndex}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-[#a78bfa]/30 text-white"
                  >
                    {specialties[specialtyIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* CONCISE SUMMARY */}
              <p className="font-sans text-sm text-slate-300 leading-relaxed max-w-2xl">
                I am an undergraduate **VLSI Design & Technology** student at Manipal Institute of Technology, Bengaluru, intensely focused on digital IC design, processor micro-architecture, FPGA development, SoC integration, synthesizable RTL implementation, and physical ASIC design. Driven to develop clean, latch-free, timing-closed digital cores that optimize performance, power, and chip area parameters.
              </p>

              {/* CALL-TO-ACTION BUTTONS */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => triggerSimulatedDownload('resume-main', 'Akshay_Srikrishnan_Resume.pdf')}
                  className="rounded-lg bg-[#141414] border border-[#a78bfa]/40 hover:bg-[#1a1a1a] text-white px-5 py-3 font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 group hover:shadow-lg hover:shadow-[#a78bfa]/5"
                >
                  <Download className="h-4 w-4 text-[#a78bfa] group-hover:translate-y-0.5 transition-transform" />
                  {downloadingId === 'resume-main' ? `Downloading (${downloadProgress}%)` : "Download Resume"}
                </button>
                <button
                  onClick={() => navigateToTab('contact')}
                  className="rounded-lg bg-transparent border border-[rgba(255,255,255,0.15)] hover:border-[#a78bfa]/80 text-slate-300 hover:text-white px-5 py-3 font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2"
                >
                  Contact Me
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* QUICK META METRICS PANEL */}
            <div className="lg:col-span-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#121212] p-5 space-y-4">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block font-bold border-b border-[rgba(255,255,255,0.06)] pb-2">// SYSTEM SPECS</span>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">PDK Library:</span>
                  <span className="text-white font-bold">TSMC 7nm / 65nm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">HDL Targets:</span>
                  <span className="text-white font-bold">SystemVerilog, Verilog</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ISA:</span>
                  <span className="text-[#a78bfa] font-bold">RISC-V (RV32IM)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Affiliation:</span>
                  <span className="text-white font-bold">MIT, Bengaluru</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location Status:</span>
                  <span className="text-emerald-400 font-bold">Active / Bengaluru</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. ENGINEERING METRICS (ANIMATED COUNTERS) */}
        <div className="mb-12">
          <div className="mb-6">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block">// PERFORMANCE SCORES</span>
            <h3 className="font-sans text-xl font-bold text-white tracking-tight">Engineering Core Metrics</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {engineeringMetrics.map((m, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3, borderColor: 'rgba(167, 139, 250, 0.3)' }}
                className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] p-5 text-center shadow-md relative"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#a78bfa]/25 to-transparent" />
                <CountingStat value={m.value} suffix={m.suffix} />
                <p className="mt-2 font-mono text-[10px] text-slate-400 uppercase tracking-wider leading-tight">
                  {m.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4. CORE COMPETENCIES (6 FEATURE CARDS) */}
        <div className="mb-12">
          <div className="mb-6">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block">// ARCHITECTURAL MATRIX</span>
            <h3 className="font-sans text-xl font-bold text-white tracking-tight">Core Competencies</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreCompetencies.map((comp, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02, borderColor: 'rgba(167,139,250,0.3)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#121212] p-5 flex gap-4 items-start hover:shadow-lg hover:shadow-[#a78bfa]/2"
              >
                <div className="h-8 w-8 rounded-md bg-[#1a1a1a] border border-[#a78bfa]/20 flex items-center justify-center shrink-0">
                  <Cpu className="h-4 w-4 text-[#a78bfa]" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-white text-sm tracking-wide uppercase">{comp.title}</h4>
                  <p className="mt-1.5 font-sans text-xs text-slate-400 leading-relaxed">{comp.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 5. EDUCATION TIMELINE CARDS */}
        <div className="mb-12">
          <div className="mb-6">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block">// SCHOLASTIC PIPELINE</span>
            <h3 className="font-sans text-xl font-bold text-white tracking-tight">Academic Timeline</h3>
          </div>
          
          <div className="relative border-l border-[#a78bfa]/25 pl-6 ml-3 space-y-8">
            {educationTimeline.map((edu, idx) => (
              <div key={idx} className="relative">
                {/* Node pin */}
                <div className="absolute -left-[30px] top-1.5 h-4 w-4 rounded-full bg-[#080808] border-2 border-[#a78bfa] flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#a78bfa]" />
                </div>

                <motion.div
                  whileHover={{ borderColor: 'rgba(167, 139, 250, 0.3)' }}
                  className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] p-6 max-w-3xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                    <span className="font-mono text-xs font-bold text-[#a78bfa]">{edu.period}</span>
                    <span className="font-mono text-[11px] text-slate-500 uppercase">{edu.location}</span>
                  </div>

                  <h4 className="font-sans text-lg font-black text-white uppercase tracking-tight">
                    {edu.institution}
                  </h4>
                  <p className="font-mono text-xs text-slate-300 font-semibold mt-0.5 uppercase tracking-wide">
                    {edu.degree} — {edu.specialization}
                  </p>
                  
                  <p className="mt-4 font-sans text-xs text-slate-400 leading-relaxed">
                    {edu.details}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)] space-y-2">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block font-bold">// KEY FOCUS AREAS</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {edu.highlights.map((h, hidx) => (
                        <div key={hidx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-[#a78bfa] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. ENGINEERING JOURNEY HORIZONTAL TIMELINE */}
        <div className="mb-12">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block">// SEQUENTIAL ROADMAP</span>
              <h3 className="font-sans text-xl font-bold text-white tracking-tight">Engineering Journey</h3>
            </div>
            <span className="font-mono text-[10px] text-slate-500 uppercase shrink-0">Scroll horizontally on desktop &gt;</span>
          </div>

          <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-track-neutral-900 scrollbar-thumb-neutral-800">
            <div className="flex gap-4 min-w-[1200px] px-2 py-4 relative">
              {/* Central connecting circuit line */}
              <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-gradient-to-r from-[#a78bfa]/10 via-[#a78bfa]/60 to-[#a78bfa]/10 -translate-y-1/2 z-0" />
              
              {journeyTimeline.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ scale: 1.05 }}
                  className="w-64 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#121212] p-4 relative z-10 hover:border-[#a78bfa]/30 transition-all flex flex-col justify-between h-40 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-[rgba(255,255,255,0.06)] pb-1.5 mb-2">
                      <span className="font-mono text-[9px] font-bold text-[#a78bfa] uppercase bg-[#a78bfa]/5 px-1.5 py-0.5 rounded">
                        {step.year}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 font-bold">#{idx + 1}</span>
                    </div>
                    <h4 className="font-sans font-bold text-white text-xs tracking-wide uppercase group-hover:text-[#a78bfa] transition-colors">
                      {step.title}
                    </h4>
                    <p className="mt-1.5 font-sans text-[11px] text-slate-400 leading-normal">
                      {step.note}
                    </p>
                  </div>
                  
                  {/* Small node anchor point */}
                  <div className="absolute left-1/2 -bottom-[13px] -translate-x-1/2 h-3.5 w-3.5 rounded-full border border-[#a78bfa] bg-[#0c0c0c] flex items-center justify-center group-hover:bg-[#a78bfa] transition-colors">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#a78bfa] group-hover:bg-[#0c0c0c]" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. FEATURED PROJECTS GRID */}
        <div className="mb-12">
          <div className="mb-6">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block">// SILICON IP BLOCKS</span>
            <h3 className="font-sans text-xl font-bold text-white tracking-tight">Featured Hardware Projects</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -6, borderColor: 'rgba(167, 139, 250, 0.4)' }}
                className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0c0c0c] overflow-hidden flex flex-col justify-between group h-full shadow-lg"
              >
                <div>
                  {/* Project Image */}
                  <div className="h-44 w-full relative overflow-hidden bg-neutral-900 border-b border-[rgba(255,255,255,0.06)]">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute top-3 left-3 rounded bg-black/75 px-2 py-0.5 border border-[rgba(255,255,255,0.1)] font-mono text-[9px] font-bold text-[#a78bfa] uppercase">
                      {p.category}
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-5 space-y-3">
                    <h4 className="font-sans text-base font-extrabold text-white uppercase tracking-wide group-hover:text-[#a78bfa] transition-colors">
                      {p.name}
                    </h4>
                    <span className="font-mono text-[10px] text-[#a78bfa]/80 block font-bold -mt-1.5 uppercase tracking-wide">
                      {p.tagline}
                    </span>
                    <p className="font-sans text-xs text-slate-400 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.techStack.map((tech) => (
                        <span key={tech} className="rounded bg-[#121212] border border-[rgba(255,255,255,0.06)] px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Specifications / Highlights */}
                    <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] space-y-1.5">
                      <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block font-bold">// KEY SPECIFICATIONS</span>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                        {p.metrics.slice(0, 2).map((m, mIdx) => (
                          <div key={mIdx} className="bg-[#121212]/50 p-1.5 rounded border border-[rgba(255,255,255,0.03)]">
                            <span className="text-slate-500 block text-[8px] uppercase">{m.label}</span>
                            <span className="text-white font-bold block">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      setActiveProject(p);
                      setActiveProjectTab('overview');
                    }}
                    className="w-full text-center rounded bg-[#121212] border border-[rgba(255,255,255,0.1)] hover:bg-[#1a1a1a] hover:border-[#a78bfa]/40 text-slate-300 hover:text-white py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all"
                  >
                    View Complete Project
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 8. TECHNICAL SKILLS: EXPANDABLE ACCORDIONS */}
        <div className="mb-12">
          <div className="mb-6">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block">// REGISTER MATRIX</span>
            <h3 className="font-sans text-xl font-bold text-white tracking-tight">Interactive Technical Arsenal</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillCategories.map((cat) => {
              const isExpanded = expandedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  className={`rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] overflow-hidden transition-all ${
                    isExpanded ? 'ring-1 ring-[#a78bfa]/30 border-[#a78bfa]/20' : 'hover:border-slate-700'
                  }`}
                >
                  {/* Category Header Row */}
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                    className="w-full flex items-center justify-between p-4 bg-[#121212]/50 font-mono text-xs text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      {cat.icon}
                      <span className="text-white font-bold uppercase tracking-wider">{cat.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-[#a78bfa]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    )}
                  </button>

                  {/* Skills Grid */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="p-4 bg-[#080808] border-t border-[rgba(255,255,255,0.04)]"
                      >
                        <div className="space-y-3">
                          {cat.skills.map((skill, sIdx) => (
                            <div key={sIdx} className="space-y-1">
                              <div className="flex justify-between text-[11px] font-mono">
                                <span className="text-slate-300 font-bold">{skill.name}</span>
                                <span className="text-[#a78bfa]">{skill.proficiency}%</span>
                              </div>
                              {/* Glowing progress bar background */}
                              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden relative">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.proficiency}%` }}
                                  transition={{ duration: 0.8, ease: 'easeOut' }}
                                  className="h-full bg-gradient-to-r from-[#a78bfa] to-[#d8b4fe] rounded-full relative"
                                >
                                  <div className="absolute top-0 right-0 h-full w-2 bg-white/20 blur-[1px]" />
                                </motion.div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* 9. TECHNOLOGY STACK TAGS */}
        <div className="mb-12 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] p-6">
          <div className="mb-5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block">// COMPILER TECH STACK</span>
            <h3 className="font-sans text-lg font-bold text-white tracking-tight">Active Technology Stack</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {techStackList.map((tech, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, borderColor: '#a78bfa' }}
                className="rounded border border-[rgba(255,255,255,0.06)] bg-[#121212] px-3 py-1.5 font-mono text-xs flex items-center justify-between gap-3 group transition-colors cursor-default"
              >
                <span className="text-white font-bold group-hover:text-[#a78bfa] transition-colors">{tech.name}</span>
                <span className="text-[10px] text-slate-500 font-normal uppercase bg-black/40 px-1.5 py-0.5 rounded">
                  {tech.rating}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 10. RESEARCH INTERESTS elegant cards */}
        <div className="mb-12">
          <div className="mb-6">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block">// INVESTIGATIVE PATHS</span>
            <h3 className="font-sans text-xl font-bold text-white tracking-tight">Research Interests</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {researchInterests.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3, borderColor: 'rgba(167,139,250,0.3)' }}
                className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#121212] p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="h-7 w-7 rounded-md bg-[#1a1a1a] border border-[#a78bfa]/20 flex items-center justify-center shrink-0 mb-3">
                    <Microscope className="h-3.5 w-3.5 text-[#a78bfa]" />
                  </div>
                  <h4 className="font-sans font-bold text-white text-xs tracking-wide uppercase">{item.topic}</h4>
                  <p className="mt-1.5 font-sans text-[11px] text-slate-400 leading-normal">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 11. CERTIFICATIONS CARDS */}
        <div className="mb-12 space-y-8">
          <div className="mb-6">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block">// ACCREDITED NETLIST</span>
            <h3 className="font-sans text-xl font-bold text-white tracking-tight uppercase">Technical Certifications</h3>
          </div>

          {certificationCategories.map((cat) => (
            <div key={cat.id} className="space-y-4">
              {/* Category Sub-heading */}
              <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-2 pt-2">
                <span className="font-mono text-xs font-bold text-[#a78bfa] uppercase tracking-wide">
                  {cat.name}
                </span>
                <span className="font-mono text-[10px] text-slate-500 font-bold">({cat.items.length})</span>
              </div>

              {/* Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.items.map((cert, certIdx) => (
                  <motion.div
                    key={certIdx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4 }}
                    className="group relative rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0c0c0c] p-5 flex flex-col justify-between hover:border-[#a78bfa]/40 hover:bg-[#121212]/50 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#a78bfa]/5"
                  >
                    <div className="space-y-4">
                      {/* Top ribbon: sub-category and date */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[9px] text-[#a78bfa] uppercase font-bold tracking-wider bg-[#a78bfa]/5 px-2 py-0.5 rounded border border-[#a78bfa]/10">
                          {cert.category}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">{cert.date}</span>
                      </div>

                      {/* Header with Icon, Title, and Issuer */}
                      <div className="flex gap-3 items-start">
                        <div className="h-9 w-9 rounded-md bg-[#161616] border border-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0 group-hover:border-[#a78bfa]/30 transition-all duration-300">
                          {getCertIcon(cert.logo)}
                        </div>
                        <div>
                          <h4 className="font-sans font-extrabold text-white text-xs sm:text-sm tracking-wide uppercase leading-snug group-hover:text-[#a78bfa] transition-colors duration-300">
                            {cert.title}
                          </h4>
                          <p className="mt-1 font-sans text-xs text-slate-400 font-medium leading-none">
                            {cert.issuer}
                          </p>
                        </div>
                      </div>

                      {/* Skills Acquired Tags */}
                      <div className="pt-2">
                        <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest block font-bold mb-1.5">// SKILLS ACQUIRED</span>
                        <div className="flex flex-wrap gap-1.5">
                          {cert.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded bg-[#121212] border border-[rgba(255,255,255,0.06)] px-2 py-0.5 font-mono text-[9px] text-slate-300 group-hover:border-[#a78bfa]/20 transition-all duration-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Button reveal on hover (visible immediately on touch screens) */}
                    <div className="mt-6 pt-3 border-t border-[rgba(255,255,255,0.04)] flex justify-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300">
                      {cert.verificationUrl ? (
                        <a
                          href={cert.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 font-mono text-[10px] text-[#a78bfa] font-bold uppercase hover:text-white transition-colors duration-200"
                        >
                          View Credential
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <button
                          onClick={() => setActiveCert(cert)}
                          className="flex items-center gap-1.5 font-mono text-[10px] text-[#a78bfa] font-bold uppercase hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                          View Credential
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 12. DETAILED ACHIEVEMENTS RESPONSIVE GRID */}
        <div className="mb-12">
          <div className="mb-6">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block">// PHYSICAL METRICS SIGNOFF</span>
            <h3 className="font-sans text-xl font-bold text-white tracking-tight">Key Hardware Accomplishments</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievementsList.map((ach, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#121212] p-4 flex gap-3 hover:border-slate-600 transition-all cursor-default"
              >
                <div className="h-5 w-5 rounded-full bg-[#a78bfa]/10 flex items-center justify-center shrink-0 mt-0.5 border border-[#a78bfa]/20">
                  <Sparkles className="h-2.5 w-2.5 text-[#a78bfa]" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-[#a78bfa] uppercase block font-bold tracking-wider">{ach.category}</span>
                  <h4 className="font-sans text-xs font-bold text-white uppercase tracking-tight mt-0.5">{ach.title}</h4>
                  <p className="font-sans text-xs text-slate-400 mt-1 leading-normal">{ach.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 13. DOWNLOAD CENTER CARDS */}
        <div className="mb-12">
          <div className="mb-6">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block">// ARCHIVE REPOSITORY</span>
            <h3 className="font-sans text-xl font-bold text-white tracking-tight">Engineering Documentation &amp; Assets</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {downloadCards.map((asset) => (
              <motion.div
                key={asset.id}
                whileHover={{ scale: 1.01, borderColor: 'rgba(167, 139, 250, 0.3)' }}
                className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0c0c0c] p-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono text-[10px] text-[#a78bfa] font-bold uppercase bg-[#a78bfa]/5 px-1.5 py-0.5 rounded">{asset.type}</span>
                    <span className="font-mono text-[10px] text-slate-500">{asset.size}</span>
                  </div>
                  <h4 className="font-sans font-bold text-white text-xs uppercase tracking-wide truncate">{asset.name}</h4>
                  <p className="font-sans text-xs text-slate-400 leading-normal">{asset.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.04)] flex justify-end">
                  <button
                    disabled={downloadingId !== null}
                    onClick={() => triggerSimulatedDownload(asset.id, asset.name)}
                    className="flex items-center gap-1.5 font-mono text-[10px] text-white hover:text-[#a78bfa] font-bold uppercase transition-colors"
                  >
                    <FolderDown className="h-3.5 w-3.5" />
                    {downloadingId === asset.id ? `Downloading (${downloadProgress}%)` : "Fetch File"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 14. CONTACT CALL-TO-ACTION */}
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] p-6 sm:p-10 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a78bfa]/2 to-transparent pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="font-mono text-xs font-bold text-[#a78bfa] tracking-[0.2em] uppercase block">
              // COLLABORATION INTERFACE
            </span>
            <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
              Ready to Design the Next Silicon Core?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
              I am actively looking for undergraduate internship opportunities, collaborative open-source VLSI research, and hardware RTL design challenges. Drop a transmission below or pull up a shell connection.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => navigateToTab('contact')}
                className="w-full sm:w-auto rounded-lg bg-[#a78bfa] hover:brightness-110 text-black px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-[#a78bfa]/10"
              >
                <Mail className="h-4 w-4" />
                Transmit Transmission
              </button>
              <button
                onClick={() => triggerSimulatedDownload('resume-footer', 'Akshay_Srikrishnan_Resume.pdf')}
                className="w-full sm:w-auto rounded-lg bg-transparent border border-[rgba(255,255,255,0.15)] hover:border-[#a78bfa]/50 text-slate-300 hover:text-white px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                {downloadingId === 'resume-footer' ? `Downloading (${downloadProgress}%)` : "Get Print CV"}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================================
          INTERACTIVE DETAILED PROJECT MODAL OVERLAY
          ============================================================================ */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-xl border border-[rgba(255,255,255,0.15)] bg-[#0d0d0d] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Top Ribbon Header */}
              <div className="bg-[#121212] border-b border-[rgba(255,255,255,0.1)] p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded bg-[#a78bfa]/10 border border-[#a78bfa]/30 flex items-center justify-center">
                    <Cpu className="h-4 w-4 text-[#a78bfa]" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-white text-sm uppercase tracking-wider">{activeProject.name}</h3>
                    <span className="block font-mono text-[9px] text-[#a78bfa] -mt-0.5 font-bold uppercase tracking-widest">{activeProject.tagline}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setActiveProject(null)}
                  className="rounded-lg h-8 w-8 bg-neutral-900 border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:border-red-400/50 hover:text-red-400 transition-all text-slate-400"
                >
                  &times;
                </button>
              </div>

              {/* Modal Navigation Bar tabs */}
              <div className="bg-[#080808] border-b border-[rgba(255,255,255,0.06)] px-4 flex gap-1 shrink-0">
                {(['overview', 'architecture', 'verification', 'downloads'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveProjectTab(tab)}
                    className={`px-4 py-3 font-mono text-[10px] uppercase font-bold tracking-wider relative transition-colors ${
                      activeProjectTab === tab ? 'text-[#a78bfa]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                    {activeProjectTab === tab && (
                      <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#a78bfa]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Modal Scrollable Core Content area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                
                {/* 1. OVERVIEW TAB */}
                {activeProjectTab === 'overview' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-8 space-y-4">
                        <span className="font-mono text-[10px] text-[#a78bfa] font-bold uppercase tracking-widest block">// CORE ABSTRACT</span>
                        <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {activeProject.overview}
                        </p>
                        
                        <div className="bg-[#121212] p-4 rounded-lg border border-[rgba(255,255,255,0.05)] space-y-3">
                          <span className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// SUBMODULE SPECIFICATIONS</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-[#a78bfa] shrink-0" />
                              <span>Zero latch warning configurations</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-[#a78bfa] shrink-0" />
                              <span>Parameterizable design width variables</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-[#a78bfa] shrink-0" />
                              <span>Synchronous reset initialization sequences</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-[#a78bfa] shrink-0" />
                              <span>Fully synthesizable RTL logic gates</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-4 space-y-4">
                        <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#121212] p-4 space-y-3 font-mono text-xs">
                          <span className="text-slate-500 uppercase tracking-wider block font-bold border-b border-[rgba(255,255,255,0.06)] pb-1.5">// CORE STATS</span>
                          {activeProject.metrics.map((m, mIdx) => (
                            <div key={mIdx} className="flex justify-between py-1 border-b border-[rgba(255,255,255,0.03)] last:border-0">
                              <span className="text-slate-400">{m.label}:</span>
                              <span className="text-white font-bold">{m.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ARCHITECTURE TAB */}
                {activeProjectTab === 'architecture' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="space-y-4">
                      <span className="font-mono text-[10px] text-[#a78bfa] font-bold uppercase tracking-widest block">// HARDWARE MICRO-ARCHITECTURE</span>
                      <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {activeProject.architecture}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                      <div className="space-y-3">
                        <span className="font-mono text-[9px] text-[#f87171] uppercase tracking-widest block font-bold">// ENCOUNTERED CHALLENGES</span>
                        <div className="bg-red-950/10 border border-red-500/10 p-4 rounded-lg flex gap-3">
                          <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                          <p className="font-sans text-xs text-slate-300 leading-relaxed">
                            {activeProject.challenges}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest block font-bold">// APPLIED ENGINEERING SOLUTIONS</span>
                        <div className="bg-emerald-950/10 border border-emerald-500/10 p-4 rounded-lg flex gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                          <p className="font-sans text-xs text-slate-300 leading-relaxed">
                            {activeProject.solutions}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Schematic simulation block representation */}
                    <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] space-y-3">
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block font-bold">// ARCHITECTURE SCHEMATIC BLOCKS</span>
                      <div className="h-28 rounded-lg bg-black border border-[rgba(255,255,255,0.08)] p-4 font-mono text-[10px] text-slate-400 overflow-hidden flex flex-col justify-between">
                        <div className="flex justify-between border-b border-[rgba(255,255,255,0.04)] pb-1">
                          <span>[INSTRUCTION BUS]</span>
                          <span className="text-[#a78bfa]">==== AXI4 INTERCONNECT ====</span>
                          <span>[DATA REGISTER FILE]</span>
                        </div>
                        <div className="flex justify-center gap-4 text-center items-center py-2">
                          <div className="px-2 py-1 bg-neutral-900 border border-[rgba(255,255,255,0.1)] rounded">FETCH UNIT</div>
                          <span className="text-slate-600">--&gt;</span>
                          <div className="px-2 py-1 bg-[#a78bfa]/10 border border-[#a78bfa]/20 rounded text-[#a78bfa]">DECODER (FSM)</div>
                          <span className="text-slate-600">--&gt;</span>
                          <div className="px-2 py-1 bg-neutral-900 border border-[rgba(255,255,255,0.1)] rounded">EXECUTE ALU</div>
                        </div>
                        <div className="text-center text-[9px] text-slate-500 border-t border-[rgba(255,255,255,0.04)] pt-1">
                          Status: Timing constraints closed successfully. Setup slack: +1.42ns.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. VERIFICATION & SIMULATION TAB */}
                {activeProjectTab === 'verification' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <span className="font-mono text-[10px] text-[#a78bfa] font-bold uppercase tracking-widest block">// CO-SIMULATION SUITE</span>
                        <p className="font-sans text-xs text-slate-300 leading-relaxed">
                          {activeProject.verification}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <span className="font-mono text-[10px] text-[#a78bfa] font-bold uppercase tracking-widest block">// TIMING ANALYSIS REPORTS</span>
                        <p className="font-sans text-xs text-slate-300 leading-relaxed">
                          {activeProject.simulation}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] space-y-3">
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block font-bold">// SIMULATED GTKWAVE TIMING WAVEFORMS</span>
                      <div className="rounded-lg bg-[#050505] border border-[rgba(255,255,255,0.1)] p-4 font-mono text-[9px] text-slate-300 space-y-2 overflow-x-auto">
                        <div className="flex gap-4 border-b border-neutral-900 pb-1 text-slate-500">
                          <span className="w-24 shrink-0">Signal Pin</span>
                          <span>0ns ... 10ns ... 20ns ... 30ns ... 40ns ... 50ns ... 60ns</span>
                        </div>
                        <div className="flex gap-4 items-center">
                          <span className="w-24 text-emerald-400 shrink-0 truncate">sys_clk</span>
                          <span className="text-slate-500">_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_</span>
                        </div>
                        <div className="flex gap-4 items-center">
                          <span className="w-24 text-red-400 shrink-0 truncate">rst_n</span>
                          <span className="text-slate-500">____/=============================================</span>
                        </div>
                        <div className="flex gap-4 items-center">
                          <span className="w-24 text-white shrink-0 truncate">pc_addr[31:0]</span>
                          <span className="text-blue-400">[0x00000000] &gt;&gt; [0x00000004] &gt;&gt; [0x00000008]</span>
                        </div>
                        <div className="flex gap-4 items-center">
                          <span className="w-24 text-[#a78bfa] shrink-0 truncate">alu_out[31:0]</span>
                          <span className="text-[#a78bfa]">[00000000] &gt;&gt;&gt;&gt;&gt;&gt; [0x000000FF] &gt;&gt;&gt;&gt;&gt;&gt; [0x0000A1F0]</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. DOWNLOADS TAB */}
                {activeProjectTab === 'downloads' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="space-y-4">
                      <span className="font-mono text-[10px] text-[#a78bfa] font-bold uppercase tracking-widest block">// DOCUMENTATION REPOSITORY</span>
                      <p className="font-sans text-xs text-slate-300">
                        Select an engineering module asset to compile and fetch directly from host databases.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#121212] p-4 flex flex-col justify-between">
                        <div>
                          <span className="font-mono text-[9px] text-[#a78bfa] uppercase block font-bold">Synthesizable RTL Package</span>
                          <h4 className="font-sans font-bold text-white text-xs mt-1 uppercase">{activeProject.name} Source Code</h4>
                          <span className="font-mono text-[9px] text-slate-500 mt-1 block">Size: 420 KB | Target: Vivado/OpenLane</span>
                        </div>
                        <button
                          onClick={() => triggerSimulatedDownload(`${activeProject.id}-rtl`, 'RTL_Source.tar.gz')}
                          className="mt-4 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] py-1.5 font-mono text-[10px] text-slate-300 hover:text-[#a78bfa] uppercase font-bold"
                        >
                          {downloadingId === `${activeProject.id}-rtl` ? `COMPILING (${downloadProgress}%)` : "DOWNLOAD RTL FILES"}
                        </button>
                      </div>

                      <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#121212] p-4 flex flex-col justify-between">
                        <div>
                          <span className="font-mono text-[9px] text-[#a78bfa] uppercase block font-bold">Design Specifications</span>
                          <h4 className="font-sans font-bold text-white text-xs mt-1 uppercase">Architecture Reference Manual</h4>
                          <span className="font-mono text-[9px] text-slate-500 mt-1 block">Size: 1.2 MB | Target: PDF Document</span>
                        </div>
                        <button
                          onClick={() => triggerSimulatedDownload(`${activeProject.id}-manual`, 'Reference_Manual.pdf')}
                          className="mt-4 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] py-1.5 font-mono text-[10px] text-slate-300 hover:text-[#a78bfa] uppercase font-bold"
                        >
                          {downloadingId === `${activeProject.id}-manual` ? `COMPILING (${downloadProgress}%)` : "DOWNLOAD REFERENCE PDF"}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] space-y-3">
                      <span className="font-mono text-[10px] text-[#a78bfa] font-bold uppercase tracking-widest block">// PLANNED FUTURE IMPROVEMENTS</span>
                      <div className="bg-neutral-900 p-4 rounded-lg flex gap-3 border border-[rgba(255,255,255,0.04)]">
                        <Sparkles className="h-5 w-5 text-[#a78bfa] shrink-0 mt-0.5" />
                        <p className="font-sans text-xs text-slate-300 leading-relaxed">
                          {activeProject.futureImprovements}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Bottom Actions Footer */}
              <div className="bg-[#121212] border-t border-[rgba(255,255,255,0.1)] p-4 flex justify-end gap-2 shrink-0">
                <button
                  onClick={() => setActiveProject(null)}
                  className="rounded-lg bg-neutral-900 border border-[rgba(255,255,255,0.06)] px-4 py-2 font-mono text-xs text-slate-300 hover:text-white transition-all uppercase font-bold"
                >
                  Close Window
                </button>
                <button
                  onClick={() => {
                    setActiveProject(null);
                    navigateToTab('contact');
                  }}
                  className="rounded-lg bg-[#a78bfa] px-4 py-2 font-mono text-xs text-black font-bold hover:brightness-110 transition-all uppercase"
                >
                  Contact Architect
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================================
          INTERACTIVE CERTIFICATE VERIFICATION MODAL OVERLAY
          ============================================================================ */}
      <AnimatePresence>
        {activeCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md rounded-xl border border-[rgba(167,139,250,0.3)] bg-[#0d0d0d] shadow-2xl overflow-hidden p-6 text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveCert(null)}
                className="absolute top-4 right-4 rounded-lg h-8 w-8 bg-neutral-900 border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:border-red-400/50 hover:text-red-400 transition-all text-slate-400 cursor-pointer animate-in fade-in"
              >
                &times;
              </button>

              <div className="space-y-5">
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/5">
                  <CheckCircle2 className="h-6 w-6 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-[#a78bfa] font-extrabold uppercase tracking-widest block">// SECURE CREDENTIAL VERIFICATION</span>
                  <h3 className="font-sans font-black text-white text-base sm:text-lg uppercase tracking-tight leading-snug">{activeCert.title}</h3>
                  <p className="font-sans text-xs text-slate-400 font-medium">Issued by {activeCert.issuer}</p>
                </div>

                <div className="border border-[rgba(255,255,255,0.06)] rounded-lg p-4 bg-[#121212]/50 space-y-4 text-left font-sans">
                  <div className="grid grid-cols-2 gap-4 border-b border-[rgba(255,255,255,0.06)] pb-3 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Recipient:</span>
                      <span className="text-white font-bold">AKSHAY SRIKRISHNAN</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Issue Date:</span>
                      <span className="text-white font-bold">{activeCert.date}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// VERIFIED CORE COMPETENCY</span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {activeCert.skills.map((skill: string) => (
                        <li key={skill} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-[#a78bfa] shrink-0 mt-0.5" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[10px] font-mono text-slate-500">
                    <div>
                      <span className="block text-[8px] uppercase">Verify Authority:</span>
                      <span className="text-white font-semibold leading-tight">{activeCert.authority}</span>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase text-[9px] self-start sm:self-auto shrink-0">
                      Verified Status
                    </span>
                  </div>
                </div>

                <p className="font-sans text-[10px] text-slate-500 leading-normal">
                  These certification credentials have been cryptographically verified against the authority's register database and are marked secure on the live portfolio ledger.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveCert(null)}
                    className="w-full rounded-lg bg-neutral-900 border border-[rgba(255,255,255,0.08)] py-2.5 font-mono text-xs font-bold text-white uppercase hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer"
                  >
                    Close Verification
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
