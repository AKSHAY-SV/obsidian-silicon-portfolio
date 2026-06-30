import React, { useState, useEffect } from 'react';
import { 
  Cpu, Award, Zap, BookOpen, Terminal, Sliders, ShieldCheck, Layers, 
  ChevronRight, Play, Check, Copy, FileText, Download, Github, RefreshCw, 
  Eye, ZoomIn, Search, Clock, Info, CheckCircle, Flame, Activity, 
  AlertCircle, ArrowRight, ArrowUpRight, Code, RotateCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PhysicalDesignGallery from './PhysicalDesignGallery';

interface RV32IMSoCDetailProps {
  onClose: () => void;
}

export default function RV32IMSoCDetail({ onClose }: RV32IMSoCDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'pipeline' | 'peripherals' | 'gdsii' | 'verification' | 'code'>('overview');
  const [selectedBlock, setSelectedBlock] = useState<string>('cpu');
  const [pipelineInst, setPipelineInst] = useState<string>('add');
  const [pipelineCycle, setPipelineCycle] = useState<number>(0);
  const [busTransactionType, setBusTransactionType] = useState<'read' | 'write'>('read');
  const [busStep, setBusStep] = useState<number>(0);
  const [selectedPeripheral, setSelectedPeripheral] = useState<string>('uart');
  const [selectedGdsStage, setSelectedGdsStage] = useState<number>(0);
  const [hoveredGdsStage, setHoveredGdsStage] = useState<number | null>(null);
  const [gdsLayers, setGdsLayers] = useState({
    diffusion: true,
    poly: true,
    metal1: true,
    metal2: true,
    clock: true,
    vias: true,
  });
  const [gdsZoom, setGdsZoom] = useState<number>(1);
  const [selectedCodeFile, setSelectedCodeFile] = useState<string>('soc_top.v');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [waveHoverCycle, setWaveHoverCycle] = useState<number | null>(null);

  // Auto-step bus simulation
  useEffect(() => {
    if (busStep > 0 && busStep < 4) {
      const timer = setTimeout(() => setBusStep(prev => prev + 1), 1500);
      return () => clearTimeout(timer);
    }
  }, [busStep]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Peripheral Data
  const peripherals = {
    uart: {
      name: 'UART Controller',
      purpose: 'Asynchronous Serial Interface with dynamic baud rate generator.',
      working: 'Implements an internal 16-deep Tx/Rx FIFO ring buffer. A status state machine tracks transmit/receive shifts and flags framing and parity errors.',
      registers: [
        { name: 'UART_CTRL_REG', addr: '0x40001000', type: 'RW', desc: 'Enable, parity config, stop bits, and baud division selection.' },
        { name: 'UART_TX_DATA_REG', addr: '0x40001004', type: 'WO', desc: 'Write data buffer to transmit serial bitstreams.' },
        { name: 'UART_RX_DATA_REG', addr: '0x40001008', type: 'RO', desc: 'Read oldest received byte from FIFO.' },
        { name: 'UART_STAT_REG', addr: '0x4000100C', type: 'RO', desc: 'FIFO flags (Empty, Full, Ready, Overrun, Parity Error).' }
      ]
    },
    spi: {
      name: 'SPI Master Core',
      purpose: 'Serial Peripheral Interface supporting Modes 0-3 with multiple chip selects.',
      working: 'Utilizes a configurable clock division register to synthesize SCLK from system clk. Operates on full-duplex Shift Registers shifting MOSI/MISO on active edge configurations.',
      registers: [
        { name: 'SPI_CTRL_REG', addr: '0x40002000', type: 'RW', desc: 'Mode selection, clock prescaling, word size, and slave index.' },
        { name: 'SPI_STATUS_REG', addr: '0x40002004', type: 'RO', desc: 'Tracks Busy states, Tx Empty, Rx Ready flags.' },
        { name: 'SPI_TX_REG', addr: '0x40002008', type: 'WO', desc: 'Saves outgoing frame payloads.' },
        { name: 'SPI_RX_REG', addr: '0x4000200C', type: 'RO', desc: 'Retrieves received slave frame payloads.' }
      ]
    },
    gpio: {
      name: 'GPIO Subsystem',
      purpose: 'General Purpose Input/Output controller with independent interrupt mapping.',
      working: 'Controls 16 dynamic IO pins. Incorporates internal pull-up registers, debounce logic filters, and programmable interrupt generation flags (rising/falling edge or level-sensitive).',
      registers: [
        { name: 'GPIO_DIR_REG', addr: '0x40000000', type: 'RW', desc: 'Direction control vector (0: Input, 1: Output) per pin.' },
        { name: 'GPIO_DATA_REG', addr: '0x40000004', type: 'RW', desc: 'Write levels to output pins or read current input states.' },
        { name: 'GPIO_INT_MASK', addr: '0x40000008', type: 'RW', desc: 'Enables interrupts on specific pins.' },
        { name: 'GPIO_INT_TYPE', addr: '0x4000000C', type: 'RW', desc: 'Sets trigger style (Edge, Level, Active High/Low).' }
      ]
    },
    timer: {
      name: 'Dual 32-bit Timer',
      purpose: 'High-precision system tick timer and watchdog timer.',
      working: 'A decremental 32-bit register loaded from a reload value. Generates a physical interrupt line to the PLIC once the counter reaches zero under periodic mode.',
      registers: [
        { name: 'TIM_CTRL_REG', addr: '0x40003000', type: 'RW', desc: 'Enable count, periodic mode trigger, clock source selection.' },
        { name: 'TIM_VAL_REG', addr: '0x40003004', type: 'RW', desc: 'Current ticker state counter value.' },
        { name: 'TIM_RELOAD_REG', addr: '0x40003008', type: 'RW', desc: 'Pre-set reload value for periodic resets.' }
      ]
    },
    plic: {
      name: 'PLIC Interrupt Controller',
      purpose: 'Platform-Level Interrupt Controller managing priority queuing for core peripherals.',
      working: 'Arbitrates multiple hardware interrupt sources. Resolves conflict priorities and pushes the highest pending interrupt ID to the CPU core interrupt pin, tracking dynamic claims and completes.',
      registers: [
        { name: 'PLIC_PRI_REG_1', addr: '0x40004000', type: 'RW', desc: 'Configures interrupt priority level (0-7) for source 1 (GPIO).' },
        { name: 'PLIC_PEND_REG', addr: '0x40004080', type: 'RO', desc: 'Pending status vector for peripheral interrupt requests.' },
        { name: 'PLIC_THR_REG', addr: '0x40004100', type: 'RW', desc: 'Sets interrupt threshold level to filter noisy low-priority ticks.' },
        { name: 'PLIC_CLAIM_REG', addr: '0x40004104', type: 'RW', desc: 'Read to obtain current interrupt ID, write to complete service.' }
      ]
    }
  };

  // Physical ASIC flow stages
  const gdsiiFlow = [
    {
      title: '01 RTL Design & Specification',
      tool: 'VS Code & Vim',
      desc: 'Synthesizable Verilog RTL implementation of the 5-stage CPU, memories, and peripheral blocks.',
      metric: '100% Complete Core IP',
      purpose: 'Model the cycle-accurate logical behavior, instruction decoders, ALU bypass, and registers of the RV32IM processor in clean, synthesizable Verilog HDL.',
      outputs: 'Master synthesizable Verilog codebase for core processor and supporting system blocks.',
      artifacts: 'soc_top.v, cpu_pipeline.v, booth_multiplier.v, axi_decoder.v',
      icon: 'Code'
    },
    {
      title: '02 Functional Verification',
      tool: 'Icarus Verilog & GTKWave',
      desc: 'Logic simulation and coverage checking to ensure cycle-accurate ISA instruction compliance.',
      metric: '100% Instruction Coverage',
      purpose: 'Validate the processor against standard RISC-V architectural compliance test suites, tracing instruction pipeline transitions and hazard-bypassing waves.',
      outputs: 'Cycle-by-cycle logic execution traces confirming correct hazard handling.',
      artifacts: 'VCD (Value Change Dump) traces, testbench suites, compliance logs',
      icon: 'Activity'
    },
    {
      title: '03 Logic Synthesis',
      tool: 'Yosys & OpenLane',
      desc: 'Translating Verilog HDL source into structural gate-level netlists mapped to SkyWater 130nm standard cells.',
      metric: '184,302 gates mapped',
      purpose: 'Compile high-level behavioural descriptions into a structured netlist of physical logic gates, multiplexers, and flip-flops using the SkyWater standard cell libraries.',
      outputs: 'Gate-level digital schematic netlist with mapping reports.',
      artifacts: 'Synthesized Netlist (Verilog format), Area/Power reports',
      icon: 'Cpu'
    },
    {
      title: '04 Core Floorplanning',
      tool: 'OpenROAD Floorplan',
      desc: 'Establishing die boundaries, power distribution networks, and positioning macro memory blocks.',
      metric: 'Core utilization: 62%',
      purpose: 'Determine the absolute outer silicon die size, place dynamic power grid ring straps (VDD/VSS rails), and arrange hard macro boundaries for SRAM and Boot ROM blocks.',
      outputs: 'Physical floorplan coordinate boundaries and macro pads layouts.',
      artifacts: 'Floorplan DEF, LEF configurations',
      icon: 'Layers'
    },
    {
      title: '05 Standard Cell Placement',
      tool: 'OpenROAD RePlace',
      desc: 'Detailed placing of standard digital cells onto pre-routed power rows to minimize congestion.',
      metric: 'Routing congestion: 0.12%',
      purpose: 'Lay down all logical cells and gates inside cell row channels, optimizing placement layout density to limit downstream wire routing congestion.',
      outputs: 'Detailed coordinate configurations of standard cells across the die rows.',
      artifacts: 'Placement DEF, cell density maps',
      icon: 'Sliders'
    },
    {
      title: '06 Power Grid Synthesis',
      tool: 'OpenROAD PDN',
      desc: 'Delivering stable supply voltages across standard cells to prevent IR drop noise.',
      metric: 'IR Drop < 2.5% VDD',
      purpose: 'Construct the intermediate power delivery networks, generating a grid structure of metal straps to assure robust power distribution to all cell rows.',
      outputs: 'Completed power grid distribution topology and metal meshes.',
      artifacts: 'Modified Power Grid DEF, PDN analysis reports',
      icon: 'Zap'
    },
    {
      title: '07 Clock Tree Synthesis',
      tool: 'TritonCTS & OpenLane',
      desc: 'Balance and optimize the clock network to minimize skew and insertion delay across the complete SoC.',
      metric: 'Clock Skew: 34 ps',
      purpose: 'Balance clock signal delivery to all 14,280 clock registers across the entire core, distributing clock buffers to minimize skew and propagation delay.',
      outputs: 'Synthesized balanced tree of clock buffers with matched transmission branches.',
      artifacts: 'CTS DEF, clock skew timing reports',
      icon: 'RefreshCw'
    },
    {
      title: '08 Signal Routing',
      tool: 'TritonRoute & OpenROAD',
      desc: 'Perform global and detailed routing to connect all standard cells, memories, and peripheral interconnects while satisfying design rules.',
      metric: 'Total wire length: 1.45 m',
      purpose: 'Establish physical interconnections between all cell pins across metal layers M1 to M5, checking antenna and crosstalk constraints.',
      outputs: 'Fully routed physical metal interconnections matching schematic nets.',
      artifacts: 'Routed DEF database, routing log reports',
      icon: 'ArrowUpRight'
    },
    {
      title: '09 DRC & LVS Verification',
      tool: 'Magic & Netgen & KLayout',
      desc: 'Verify that the final layout passes Design Rule Check (DRC) and Layout Versus Schematic (LVS) with zero critical errors.',
      metric: 'DRC/LVS Errors: 0',
      purpose: 'Compare the physical standard cell layouts against schematic design rules (DRC) and netlist connectivity (LVS) to guarantee clean mask fabrication.',
      outputs: 'Verification clearance reports with zero design violations.',
      artifacts: 'LVS check logs, DRC rule violations lists, clean extraction models',
      icon: 'ShieldCheck'
    },
    {
      title: '10 Parasitic Extraction',
      tool: 'OpenRCX & OpenLane',
      desc: 'Extract parasitic resistance and capacitance (RC) from the routed layout for accurate post-layout timing and power analysis.',
      metric: 'Parasitics Extracted',
      purpose: 'Extract physical parasitic properties (capacitances and resistances) from the routed wiring layers to ensure realistic post-layout timing simulation.',
      outputs: 'Comprehensive post-layout electrical extraction specifications.',
      artifacts: 'SPEF (Standard Parasitic Exchange Format) files',
      icon: 'Search'
    },
    {
      title: '11 Static Timing Signoff',
      tool: 'OpenSTA & OpenLane',
      desc: 'Perform post-layout Static Timing Analysis (STA) to verify setup, hold, recovery, and removal timing across all operating conditions.',
      metric: 'Setup Slack: +1.24 ns',
      purpose: 'Conduct Static Timing Analysis to certify timing constraint margins (setup, hold, recovery) across worst-case and best-case PVT corners.',
      outputs: 'Timing signoff reports proving core viability at 150 MHz.',
      artifacts: 'Timing slack reports, SDF (Standard Delay Format) outputs',
      icon: 'Clock'
    },
    {
      title: '12 GDSII Tape-out',
      tool: 'Magic & KLayout',
      desc: 'Generate the final manufacturable GDSII database containing the complete RV32IM SoC layout, ready for fabrication.',
      metric: 'Ready for Tape-out',
      purpose: 'Export the entire silicon layout into the standard GDSII stream format, validating mask layer dimensions for physical chip manufacturing.',
      outputs: 'Tape-out ready GDSII graphic stream binary ready for physical mask production.',
      artifacts: 'Master GDSII Database File (rv32im_soc_tapeout.gds)',
      icon: 'Award'
    }
  ];

  // Synthesizable Verilog sources
  const codeFiles = {
    'soc_top.v': `// =================================================================
// PROJECT: RV32IM_Processor_SoC
// FILE: soc_top.v
// DESCRIPTION: Top-Level System-on-Chip integration wrapper
// =================================================================
module soc_top (
    input  wire        clk,
    input  wire        rst_n,
    
    // External Physical IOs
    inout  wire [15:0] gpio_pins,
    input  wire        uart_rx,
    output wire        uart_tx,
    output wire        spi_sclk,
    output wire        spi_mosi,
    input  wire        spi_miso,
    output wire        spi_cs_n
);
    // --- Interconnect Bus Wires ---
    wire [31:0] axi_m_addr, axi_m_wdata, axi_m_rdata;
    wire        axi_m_write, axi_m_read, axi_m_ready;
    
    // --- Peripheral Interrupt Lines ---
    wire [4:0]  irq_lines;
    wire        cpu_irq;

    // RV32IM 5-Stage CPU Instance
    rv32im_core cpu (
        .clk(clk),
        .rst_n(rst_n),
        .bus_addr(axi_m_addr),
        .bus_wdata(axi_m_wdata),
        .bus_rdata(axi_m_rdata),
        .bus_we(axi_m_write),
        .bus_re(axi_m_read),
        .bus_ready(axi_m_ready),
        .ext_irq(cpu_irq)
    );

    // Dynamic AXI Bus Decoder Matrix
    axi_decoder interconnect (
        .clk(clk),
        .rst_n(rst_n),
        .m_addr(axi_m_addr),
        .m_wdata(axi_m_wdata),
        .m_rdata(axi_m_rdata),
        .m_we(axi_m_write),
        .m_re(axi_m_read),
        .m_ready(axi_m_ready),
        
        // APB sub-slaves routes
        .apb_sel_gpio(sel_gpio),
        .apb_sel_uart(sel_uart),
        .apb_sel_spi(sel_spi),
        .apb_sel_timer(sel_timer),
        .apb_sel_plic(sel_plic)
    );

    // GPIO Peripheral
    gpio_peripheral gpio_inst (
        .clk(clk), .rst_n(rst_n),
        .sel(sel_gpio), .addr(axi_m_addr[11:0]),
        .wdata(axi_m_wdata), .rdata(rdata_gpio),
        .pins(gpio_pins), .irq(irq_lines[0])
    );

    // UART Controller
    uart_controller uart_inst (
        .clk(clk), .rst_n(rst_n),
        .sel(sel_uart), .addr(axi_m_addr[11:0]),
        .wdata(axi_m_wdata), .rdata(rdata_uart),
        .rx(uart_rx), .tx(uart_tx), .irq(irq_lines[1])
    );
endmodule`,
    'cpu_pipeline.v': `// =================================================================
// MODULE: rv32im_core (5-Stage RISC-V Exec Pipeline)
// =================================================================
module rv32im_core (
    input  wire        clk,
    input  wire        rst_n,
    output reg  [31:0] bus_addr,
    output reg  [31:0] bus_wdata,
    input  wire [31:0] bus_rdata,
    output reg         bus_we,
    output reg         bus_re,
    input  wire        bus_ready,
    input  wire        ext_irq
);
    // Pipeline intermediate register stages
    reg [31:0] pc_if, pc_id, pc_ex, pc_mem, pc_wb;
    reg [31:0] instr_id;
    reg [31:0] rs1_data_ex, rs2_data_ex;
    reg [31:0] alu_result_mem, dmem_wdata_mem;
    reg [31:0] wb_result_wb;
    
    // --- operand forwarding logic blocks ---
    wire [1:0] forward_a = (mem_reg_write && (mem_rd != 0) && (mem_rd == ex_rs1)) ? 2'b10 :
                           (wb_reg_write  && (wb_rd  != 0) && (wb_rd  == ex_rs1)) ? 2'b01 : 2'b00;
                           
    wire [1:0] forward_b = (mem_reg_write && (mem_rd != 0) && (mem_rd == ex_rs2)) ? 2'b10 :
                           (wb_reg_write  && (wb_rd  != 0) && (wb_rd  == ex_rs2)) ? 2'b01 : 2'b00;

    // Hazard detection logic
    wire load_use_hazard = id_is_load && ((id_rd == rs1) || (id_rd == rs2));
    wire stall_pipeline = load_use_hazard || !bus_ready;
    wire flush_pipeline = branch_taken_ex || ext_irq;

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            pc_if <= 32'h0000_0000;
            instr_id <= 32'h0000_0013; // NOP
        end else if (!stall_pipeline) begin
            pc_if <= next_pc;
            instr_id <= (flush_pipeline) ? 32'h0000_0013 : imem_rdata;
        end
    end
endmodule`,
    'booth_multiplier.v': `// =================================================================
// MODULE: booth_multiplier (RV32M Math Accelerator Unit)
// =================================================================
module booth_multiplier (
    input  wire        clk,
    input  wire        rst_n,
    input  wire        start,
    input  wire [31:0] multi_a,
    input  wire [31:0] multi_b,
    output reg  [63:0] product_out,
    output reg         done
);
    reg [2:0]  state;
    reg [5:0]  counter;
    reg [64:0] accum;
    
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            state <= 3'b000;
            done <= 1'b0;
        end else begin
            case (state)
                3'b000: begin // Idle State
                    if (start) begin
                        accum <= {32'b0, multi_b, 1'b0};
                        counter <= 6'd0;
                        state <= 3'b001;
                        done <= 1'b0;
                    end
                end
                3'b001: begin // Iterative Radix-2 Shift-Add cycles
                    if (counter == 6'd32) begin
                        product_out <= accum[64:1];
                        done <= 1'b1;
                        state <= 3'b000;
                    end else begin
                        case (accum[1:0])
                            2'b01: accum[64:33] <= accum[64:33] + multi_a;
                            2'b10: accum[64:33] <= accum[64:33] - multi_a;
                            default: ; // Do nothing
                        endcase
                        accum <= $signed(accum) >>> 1;
                        counter <= counter + 1;
                    end
                end
            endcase
        end
    end
endmodule`,
    'axi_decoder.v': `// =================================================================
// MODULE: axi_decoder (Parameterized Memory and IP crossbar)
// =================================================================
module axi_decoder (
    input  wire [31:0] m_addr,
    output reg         sel_boot_rom,
    output reg         sel_sram,
    output reg         sel_gpio,
    output reg         sel_uart,
    output reg         sel_spi,
    output reg         sel_timer,
    output reg         sel_plic
);
    always @(*) begin
        // Address Map Routing Decoding Scheme
        sel_boot_rom = 1'b0;
        sel_sram     = 1'b0;
        sel_gpio     = 1'b0;
        sel_uart     = 1'b0;
        sel_spi      = 1'b0;
        sel_timer    = 1'b0;
        sel_plic     = 1'b0;

        case (m_addr[31:12])
            20'h00000: sel_boot_rom = 1'b1; // 0x00000000 - 0x00000FFF
            20'h10000: sel_sram     = 1'b1; // 0x10000000 - 0x10007FFF
            20'h40000: sel_gpio     = 1'b1; // 0x40000000 - 0x40000FFF
            20'h40001: sel_uart     = 1'b1; // 0x40001000 - 0x40001FFF
            20'h40002: sel_spi      = 1'b1; // 0x40002000 - 0x40002FFF
            20'h40003: sel_timer    = 1'b1; // 0x40003000 - 0x40003FFF
            20'h40004: sel_plic     = 1'b1; // 0x40004000 - 0x40004FFF
            default: ; // Invalid address range
        endcase
    end
endmodule`
  };

  // Block diagram data
  const blocks = {
    cpu: { name: 'RV32IM CPU Core', freq: '150 MHz', gates: '34,240 gates', desc: 'Implementing a classic Harvard 5-stage register pipeline with dedicated bypass networks, branch prediction, hardware division, and a custom Multiply-Accumulate block.' },
    rom: { name: 'Boot ROM', freq: '150 MHz', gates: '4,096 bytes', desc: 'Initializes the processor booting state, configures device drivers, executes initial UART hardware diagnostic tests.' },
    ram: { name: 'Static RAM', freq: '150 MHz', gates: '32 Kilobytes', desc: 'Dual-ported synchronous scratchpad SRAM holding active execution code and operational variables.' },
    axi: { name: 'AXI Interconnect', freq: '150 MHz', gates: '8,450 gates', desc: 'Decodes central bus memory addresses, arbitrates pending read/write cycles, and supports pipelined parallel transfers.' },
    bridge: { name: 'APB Subsystem Bridge', freq: '75 MHz', gates: '2,100 gates', desc: 'Converts high-speed AXI channel communications into low-power, simplified peripheral operations.' },
    plic: { name: 'PLIC Module', freq: '75 MHz', gates: '6,200 gates', desc: 'Handles system interrupts from UART, Timer, SPI, and GPIO. Directs core alerts based on prioritizations.' }
  };

  // Pipeline simulation definitions
  const instructions = {
    add: [
      { stage: 'IF', desc: 'pc: 0x0004 - Fetched instr [ADD r3, r1, r2] from SRAM' },
      { stage: 'ID', desc: 'Decoded registers rs1=r1 (val: 12), rs2=r2 (val: 30)' },
      { stage: 'EX', desc: 'ALU execution: 12 + 30 = 42' },
      { stage: 'MEM', desc: 'No memory access. Passing result 42 forward' },
      { stage: 'WB', desc: 'Wrote result 42 back to register r3 successfully' }
    ],
    lw: [
      { stage: 'IF', desc: 'pc: 0x0008 - Fetched instruction [LW r4, 4(r3)]' },
      { stage: 'ID', desc: 'Decoded base rs1=r3 (val: 42). Load use hazard check active.' },
      { stage: 'EX', desc: 'Address math: 42 + 4 = 46. Stall inserted.' },
      { stage: 'MEM', desc: 'Fetched 32-bit data word [0xDEADBEEF] from address 46' },
      { stage: 'WB', desc: 'Wrote loaded word 0xDEADBEEF back to register r4' }
    ],
    flush: [
      { stage: 'IF', desc: 'pc: 0x000C - Fetched instruction [BEQ r1, r1, offset]' },
      { stage: 'ID', desc: 'Decoded registers r1, r1. Branch condition verified taken.' },
      { stage: 'EX', desc: 'Branch offset calculated. Pipeline Flush triggered.' },
      { stage: 'MEM', desc: 'Flushing instruction stages IF and ID into bubbles' },
      { stage: 'WB', desc: 'pc updated to target address. Resuming nominal cycles.' }
    ]
  };

  // Custom wave timeline points
  const waveformTicks = [
    { time: '0ns', clk: 0, pc: '0x0000', instr: 'Boot ROM init', ax_val: 'Idle', irq: 0 },
    { time: '10ns', clk: 1, pc: '0x0000', instr: 'Boot ROM init', ax_val: 'Idle', irq: 0 },
    { time: '20ns', clk: 0, pc: '0x0004', instr: 'ADD r3, r1, r2', ax_val: 'Idle', irq: 0 },
    { time: '30ns', clk: 1, pc: '0x0004', instr: 'ADD r3, r1, r2', ax_val: 'Active Write', irq: 0 },
    { time: '40ns', clk: 0, pc: '0x0008', instr: 'LW r4, 4(r3)', ax_val: 'Active Write', irq: 0 },
    { time: '50ns', clk: 1, pc: '0x0008', instr: 'LW r4, 4(r3)', ax_val: 'Bus Wait', irq: 1 },
    { time: '60ns', clk: 0, pc: '0x000C', instr: 'Stall Bubble', ax_val: 'Active Read', irq: 1 },
    { time: '70ns', clk: 1, pc: '0x0010', instr: 'Timer read', ax_val: 'Idle', irq: 0 }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans pb-24">
      {/* Upper Navigation & Return bar */}
      <div className="border-b border-slate-800/40 bg-[#0c0c0e]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="group flex items-center gap-2 rounded-lg border border-slate-800 bg-[#121214] px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            id="soc-back-to-library"
          >
            ← Return to Library
          </button>
          
          <div className="flex gap-1 overflow-x-auto max-w-full md:max-w-none">
            {['overview', 'architecture', 'pipeline', 'peripherals', 'gdsii', 'verification', 'code'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-[#a78bfa]/10 text-[#a78bfa] border border-[#a78bfa]/25 font-bold' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* HERO TITLE MODULE */}
        <div className="relative mb-10 overflow-hidden rounded-xl border border-slate-800/80 bg-[#121215] p-8 md:p-12 shadow-2xl shadow-purple-950/5">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none bg-[radial-gradient(#a78bfa_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="rounded bg-[#a78bfa]/10 border border-[#a78bfa]/20 px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
                Computer Architecture
              </span>
              <span className="rounded bg-[#10b981]/10 border border-[#10b981]/20 px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-wider text-[#10b981]">
                RTL to GDSII Tapeout-Ready
              </span>
            </div>
            
            <h1 className="font-sans text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Design and Implementation of RV32IM Processor Based System-on-Chip (SoC)
            </h1>
            
            <p className="font-sans text-lg text-slate-300 mb-6 leading-relaxed">
              A comprehensive system-on-chip built from scratch. Features a 5-stage pipelined RISC-V compute processor, parameterized multi-channel bus interconnects, priority interrupt controllers, and a physical design layout verified through the OpenLane ASIC physical signoff pipeline.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {['Verilog', 'RV32IM ISA', 'OpenLane', 'Sky130 PDK', 'Magic Layout', 'KLayout GDSII', 'GTKWave', 'Icarus Verilog'].map(tag => (
                <span key={tag} className="bg-[#18181c] text-slate-400 border border-slate-800 px-2.5 py-1 rounded font-mono text-xs">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <a 
                href="https://github.com/aksh-ai" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#1c1c22] hover:bg-slate-800 border border-slate-700/60 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all text-white font-mono"
              >
                <Github className="h-4 w-4" /> View GitHub Repository
              </a>
              <button 
                onClick={() => handleCopy('https://github.com/aksh-ai/RV32IM-SoC-Report.pdf')}
                className="inline-flex items-center gap-2 bg-[#a78bfa] hover:bg-[#b79cfb] text-[#0a0a0c] px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
              >
                <Download className="h-4 w-4" /> Download Engineering Report
              </button>
            </div>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: 'CPU Architecture', val: 'RV32IM RISC-V' },
            { label: 'Pipeline Stages', val: '5-Stage Bypass' },
            { label: 'Bus Interconnect', val: 'AXI-Lite + APB' },
            { label: 'ASIC Silicon Area', val: '0.38 mm²' },
            { label: 'LVS/DRC Status', val: '100% Verified' }
          ].map((m, idx) => (
            <div key={idx} className="bg-[#121215] border border-slate-800/80 rounded-xl p-5 shadow-sm text-center md:text-left">
              <span className="block font-sans text-xs text-slate-400 uppercase mb-1">{m.label}</span>
              <span className="font-mono text-lg font-bold text-white">{m.val}</span>
            </div>
          ))}
        </div>

        {/* DYNAMIC TAB BODY */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-8">
                {/* Executive Summary */}
                <div className="bg-[#121215] border border-slate-800/80 rounded-xl p-6 md:p-8">
                  <h3 className="font-sans text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-[#a78bfa]" /> Project Vision & Objectives
                  </h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    The principal goal of this engineering study was the architectural design and physical silicon physical implementation of a 32-bit RISC-V System-on-Chip (SoC) optimized for edge computation. Moving beyond isolated CPU simulations, this project bridges computer architecture theory and physical tapeout reality.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    By implementing the base <strong>RV32I</strong> integer pipeline paired with the <strong>RV32M</strong> multiplication extension on the open-source SkyWater 130nm fabrication platform, we have demonstrated a fully cohesive digital architecture ready for hardware tapeout.
                  </p>
                </div>

                {/* Architecture Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#121215] border border-slate-800/80 rounded-xl p-6">
                    <h4 className="font-sans text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Zap className="h-4.5 w-4.5 text-[#a78bfa]" /> Hardware Performance
                    </h4>
                    <ul className="space-y-2.5 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-[#10b981] mt-0.5 shrink-0" />
                        <span>Cycle-accurate 1.0 IPC target on arithmetic instructions.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-[#10b981] mt-0.5 shrink-0" />
                        <span>Forwarding paths minimize hazard stalls to absolute zero.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-[#10b981] mt-0.5 shrink-0" />
                        <span>8-cycle iterative Radix-2 non-blocking hardware division.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#121215] border border-slate-800/80 rounded-xl p-6">
                    <h4 className="font-sans text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Layers className="h-4.5 w-4.5 text-[#10b981]" /> Silicon & Physical PPA
                    </h4>
                    <ul className="space-y-2.5 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-[#10b981] mt-0.5 shrink-0" />
                        <span>Silicon footprint constraint bounded at 0.38 mm².</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-[#10b981] mt-0.5 shrink-0" />
                        <span>Max signoff clock speed: 150 MHz on SkyWater 130nm.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-[#10b981] mt-0.5 shrink-0" />
                        <span>Complete LVS and DRC clean mask compilation output.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Challenges */}
                <div className="bg-[#121215] border border-slate-800/80 rounded-xl p-6">
                  <h3 className="font-sans text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Flame className="h-5 w-5 text-red-400" /> Key Engineering Challenges Handled
                  </h3>
                  <div className="space-y-6">
                    <div className="border-l-2 border-red-500/40 pl-4 space-y-1">
                      <span className="font-mono text-xs font-bold uppercase text-red-400">01 High Propagation Delay in Hardware Multiplier</span>
                      <p className="text-sm text-slate-300">
                        Early single-cycle combinatorial multiplication structures limited critical path speeds to 40 MHz. By re-architecting to an iterative shift-and-add sequential multiplier with Booth encoding, propagation delay path lengths dropped, boosting core speeds to 150 MHz.
                      </p>
                    </div>
                    <div className="border-l-2 border-[#10b981]/40 pl-4 space-y-1">
                      <span className="font-mono text-xs font-bold uppercase text-[#10b981]">02 RAW Hazards in Execution Stages</span>
                      <p className="text-sm text-slate-300">
                        Consecutive instruction register dependencies originally inserted multi-cycle pipeline freezes. Implementing an internal operand-forwarding multiplexer network resolves data paths directly between execution barriers, ensuring high instruction densities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar stats/files */}
              <div className="space-y-6">
                <div className="bg-[#121215] border border-slate-800/80 rounded-xl p-6">
                  <h4 className="font-sans text-base font-bold text-white mb-4">Technology Specs Matrix</h4>
                  <div className="divide-y divide-slate-800/40 text-sm">
                    {[
                      { l: 'Instruction Set', v: 'RV32IM RISC-V' },
                      { l: 'Process Cell node', v: 'SkyWater 130nm' },
                      { l: 'Standard Cell Count', v: '184,302 gates' },
                      { l: 'Memory Layout', v: '8KB ROM / 32KB RAM' },
                      { l: 'Core IP blocks', v: 'UART, SPI, Timer, PLIC' },
                      { l: 'Simulation Engine', v: 'Icarus Verilog' }
                    ].map((spec, i) => (
                      <div key={i} className="flex justify-between py-3">
                        <span className="text-slate-400">{spec.l}</span>
                        <span className="font-mono text-white font-bold">{spec.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#121215] border border-slate-800/80 rounded-xl p-6">
                  <h4 className="font-sans text-base font-bold text-white mb-4">Verification Artifacts</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#18181c] border border-slate-800/60 text-xs">
                      <span className="font-mono text-slate-300">RTL_simulation_suite</span>
                      <span className="text-[#10b981] font-bold">100% Passed</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#18181c] border border-slate-800/60 text-xs">
                      <span className="font-mono text-slate-300">Logic_LVS_Check</span>
                      <span className="text-[#10b981] font-bold">Matched</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#18181c] border border-slate-800/60 text-xs">
                      <span className="font-mono text-slate-300">Physical_DRC_Check</span>
                      <span className="text-[#10b981] font-bold">0 Violations</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'architecture' && (
            <motion.div 
              key="architecture"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Interactive block diagram */}
              <div className="bg-[#121215] border border-slate-800/80 rounded-xl p-6 md:p-8">
                <div className="mb-6">
                  <h3 className="font-sans text-xl font-bold text-white">System-on-Chip Bus Schematic Architecture</h3>
                  <p className="text-slate-400 text-sm mt-1">Click any system block component to review register structures, pin buses, and description metrics.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Interactive SVG block map */}
                  <div className="lg:col-span-2 bg-[#0c0c0e] border border-slate-800 rounded-xl p-6 flex items-center justify-center min-h-[350px]">
                    <svg viewBox="0 0 600 400" className="w-full h-auto">
                      {/* Grid background */}
                      <defs>
                        <pattern id="archGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.8" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#archGrid)" />

                      {/* Main AXI Interconnect Bus Line */}
                      <path d="M 50 160 L 550 160" stroke="#a78bfa" strokeWidth="3" strokeDasharray="6,4" className="animate-pulse" />
                      <text x="300" y="145" fill="#a78bfa" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">AXI SYSTEM DECODER BUS (32-bit)</text>

                      {/* APB Bus Line */}
                      <path d="M 300 240 L 300 320 L 550 320" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" />
                      <line x1="300" y1="160" x2="300" y2="240" stroke="#10b981" strokeWidth="2" />
                      <text x="425" y="305" fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="middle">APB LOW-POWER BUS</text>

                      {/* CPU Block */}
                      <g onClick={() => setSelectedBlock('cpu')} className="cursor-pointer group">
                        <rect x="50" y="40" width="130" height="70" rx="6" fill={selectedBlock === 'cpu' ? '#1e1b4b' : '#141416'} stroke={selectedBlock === 'cpu' ? '#a78bfa' : '#334155'} strokeWidth="1.5" className="transition-all" />
                        <text x="115" y="75" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">RV32IM CPU Core</text>
                        <text x="115" y="92" fill="#a78bfa" fontSize="9" fontFamily="monospace" textAnchor="middle">5-Stage Pipeline</text>
                      </g>

                      {/* ROM Block */}
                      <g onClick={() => setSelectedBlock('rom')} className="cursor-pointer">
                        <rect x="235" y="40" width="130" height="70" rx="6" fill={selectedBlock === 'rom' ? '#1e1b4b' : '#141416'} stroke={selectedBlock === 'rom' ? '#a78bfa' : '#334155'} strokeWidth="1.5" className="transition-all" />
                        <text x="300" y="75" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Boot ROM</text>
                        <text x="300" y="92" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">4KB Core Boot</text>
                      </g>

                      {/* RAM Block */}
                      <g onClick={() => setSelectedBlock('ram')} className="cursor-pointer">
                        <rect x="420" y="40" width="130" height="70" rx="6" fill={selectedBlock === 'ram' ? '#1e1b4b' : '#141416'} stroke={selectedBlock === 'ram' ? '#a78bfa' : '#334155'} strokeWidth="1.5" className="transition-all" />
                        <text x="485" y="75" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Static RAM</text>
                        <text x="485" y="92" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">32KB Scratchpad</text>
                      </g>

                      {/* APB Bridge */}
                      <g onClick={() => setSelectedBlock('bridge')} className="cursor-pointer">
                        <rect x="235" y="200" width="130" height="50" rx="6" fill={selectedBlock === 'bridge' ? '#064e3b' : '#141416'} stroke={selectedBlock === 'bridge' ? '#10b981' : '#334155'} strokeWidth="1.5" className="transition-all" />
                        <text x="300" y="225" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">APB Sub-Bridge</text>
                        <text x="300" y="238" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle">CLK Div: 2</text>
                      </g>

                      {/* Peripherals Block (GPIO/UART/SPI/Timer) */}
                      <g onClick={() => setSelectedBlock('plic')} className="cursor-pointer">
                        <rect x="420" y="200" width="130" height="50" rx="6" fill={selectedBlock === 'plic' ? '#1e1b4b' : '#141416'} stroke={selectedBlock === 'plic' ? '#a78bfa' : '#334155'} strokeWidth="1.5" className="transition-all" />
                        <text x="485" y="225" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">PLIC Controller</text>
                        <text x="485" y="238" fill="#a78bfa" fontSize="8" fontFamily="monospace" textAnchor="middle">Priority Queuing</text>
                      </g>

                      {/* Peripheral Gallery Node */}
                      <g onClick={() => { setActiveTab('peripherals'); }} className="cursor-pointer group">
                        <rect x="350" y="295" width="200" height="50" rx="6" fill="#1c1917" stroke="#ea580c" strokeWidth="1.5" />
                        <text x="450" y="320" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">UART / SPI / GPIO / TIMER</text>
                        <text x="450" y="335" fill="#ea580c" fontSize="8" fontFamily="monospace" textAnchor="middle">Click to view Peripherals →</text>
                      </g>

                      {/* Connections */}
                      <line x1="115" y1="110" x2="115" y2="160" stroke="#a78bfa" strokeWidth="1.5" />
                      <line x1="300" y1="110" x2="300" y2="160" stroke="#a78bfa" strokeWidth="1.5" />
                      <line x1="485" y1="110" x2="485" y2="160" stroke="#a78bfa" strokeWidth="1.5" />
                    </svg>
                  </div>

                  {/* Component description detail card */}
                  <div className="bg-[#141417] border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Cpu className="h-5 w-5 text-[#a78bfa]" />
                        <span className="font-mono text-xs font-bold text-[#a78bfa] uppercase">Hardware block specs</span>
                      </div>
                      
                      <h4 className="font-sans text-xl font-bold text-white mb-2">
                        {blocks[selectedBlock as keyof typeof blocks].name}
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-[#18181c] p-3 rounded-lg text-xs">
                          <span className="text-slate-400 block mb-1">Signoff Freq</span>
                          <span className="font-mono text-white font-bold">{blocks[selectedBlock as keyof typeof blocks].freq}</span>
                        </div>
                        <div className="bg-[#18181c] p-3 rounded-lg text-xs">
                          <span className="text-slate-400 block mb-1">Gate Equivalency</span>
                          <span className="font-mono text-white font-bold">{blocks[selectedBlock as keyof typeof blocks].gates}</span>
                        </div>
                      </div>

                      <p className="text-slate-300 text-sm leading-relaxed">
                        {blocks[selectedBlock as keyof typeof blocks].desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/60 text-xs text-slate-400 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#a78bfa]" />
                      <span>Operating synchronously on primary PLL core clock.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Memory Address space map */}
              <div className="bg-[#121215] border border-slate-800/80 rounded-xl p-6">
                <h3 className="font-sans text-lg font-bold text-white mb-4">System Memory &amp; Register Address Allocations</h3>
                
                <div className="space-y-3">
                  {[
                    { r: '0x00000000 - 0x00000FFF', name: 'Boot ROM Memory Range', size: '4 Kilobytes', perm: 'Read Only (Hardware boot vectors)' },
                    { r: '0x10000000 - 0x10007FFF', name: 'Scratchpad SRAM (Data / Instructions)', size: '32 Kilobytes', perm: 'Read / Write (Nominal core heap)' },
                    { r: '0x40000000 - 0x40000FFF', name: 'GPIO Peripheral registers', size: '4 Kilobytes', perm: 'Read / Write (External hardware controls)' },
                    { r: '0x40001000 - 0x40001FFF', name: 'UART Interface registers', size: '4 Kilobytes', perm: 'Read / Write (Serial Tx/Rx debug ports)' },
                    { r: '0x40004000 - 0x40004FFF', name: 'PLIC Hardware Vector Matrix', size: '4 Kilobytes', perm: 'Read / Write (Interrupt queuing priority)' }
                  ].map((map, idx) => (
                    <div key={idx} className="bg-[#16161a] border border-slate-800/40 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="font-mono text-sm">
                        <span className="text-[#a78bfa] font-bold block sm:inline mr-4">{map.r}</span>
                        <span className="text-white font-sans font-semibold">{map.name}</span>
                      </div>
                      <div className="flex gap-4 text-xs">
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{map.size}</span>
                        <span className="text-slate-400">{map.perm}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'pipeline' && (
            <motion.div 
              key="pipeline"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="bg-[#121215] border border-slate-800/80 rounded-xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className="font-sans text-xl font-bold text-white">5-Stage Register Pipeline Interactive Emulator</h3>
                    <p className="text-slate-400 text-sm mt-1">Select an assembly instruction to simulate register bypassing, forwarding, and stall flushes cycle by cycle.</p>
                  </div>

                  <div className="flex gap-1.5 bg-[#0c0c0e] p-1.5 rounded-lg border border-slate-800">
                    {['add', 'lw', 'flush'].map(inst => (
                      <button
                        key={inst}
                        onClick={() => { setPipelineInst(inst); setPipelineCycle(0); }}
                        className={`px-3 py-1 rounded text-xs font-mono uppercase font-bold transition-all ${
                          pipelineInst === inst ? 'bg-[#a78bfa] text-[#0a0a0c]' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {inst === 'add' ? 'ADD Regs' : inst === 'lw' ? 'LW Stall' : 'Branch Flush'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pipeline visualizer tracks */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                  {['Fetch (IF)', 'Decode (ID)', 'Execute (EX)', 'Memory (MEM)', 'Writeback (WB)'].map((stage, idx) => {
                    const isCurrent = pipelineCycle === idx;
                    const stageInfo = instructions[pipelineInst as keyof typeof instructions][idx];
                    return (
                      <div 
                        key={idx} 
                        onClick={() => setPipelineCycle(idx)}
                        className={`cursor-pointer rounded-xl border p-5 transition-all flex flex-col justify-between h-40 ${
                          isCurrent 
                            ? 'bg-[#1e1b4b] border-[#a78bfa] shadow-lg shadow-purple-950/20' 
                            : 'bg-[#141416] border-slate-800/60 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-[10px] text-slate-400 uppercase">Stage 0{idx + 1}</span>
                            {isCurrent && (
                              <span className="h-2 w-2 rounded-full bg-[#a78bfa] animate-ping" />
                            )}
                          </div>
                          <h4 className="font-sans text-sm font-bold text-white">{stage}</h4>
                        </div>

                        <p className="text-[11px] text-slate-300 font-mono mt-4 leading-tight leading-relaxed">
                          {isCurrent ? stageInfo.desc : 'Active pipeline bubble...'}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Simulation Control bar */}
                <div className="flex items-center justify-between bg-[#0c0c0e] border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setPipelineCycle(prev => (prev > 0 ? prev - 1 : 4))}
                      className="bg-slate-800 hover:bg-slate-700 text-white h-8 px-3 rounded text-xs font-semibold transition-all"
                    >
                      Prev Cycle
                    </button>
                    <button 
                      onClick={() => setPipelineCycle(prev => (prev < 4 ? prev + 1 : 0))}
                      className="bg-[#a78bfa] hover:bg-[#b79cfb] text-[#0a0a0c] h-8 px-4 rounded text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Play className="h-3.5 w-3.5 fill-[#0a0a0c]" /> Step Next
                    </button>
                    <button 
                      onClick={() => setPipelineCycle(0)}
                      className="text-slate-400 hover:text-white h-8 px-2 text-xs transition-all flex items-center gap-1"
                    >
                      <RotateCw className="h-3.5 w-3.5" /> Reset
                    </button>
                  </div>

                  <span className="font-mono text-xs text-slate-400 hidden sm:inline">
                    PIPELINE CLK: <span className="text-[#10b981] font-bold">CYCLE {pipelineCycle + 1}</span>
                  </span>
                </div>
              </div>

              {/* Data forwarding description */}
              <div className="bg-[#121215] border border-slate-800/80 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-sans text-base font-bold text-white mb-3 flex items-center gap-2">
                    <Sliders className="h-4.5 w-4.5 text-[#a78bfa]" /> Hazard Detection &amp; Operand Forwarding
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    Without hardware mitigation, consecutive register dependencies force a compiler to inject clock cycle stalls. This CPU resolves data hazards by mapping multiplexer data paths directly from the output of the EX and MEM registers back to the source registers at the decode boundary.
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    By bypassing the Register File write-before-read stages, arithmetic operands flow dynamically down execution pipelines without reducing the target IPC factor.
                  </p>
                </div>

                <div className="bg-[#0c0c0e] border border-slate-800/80 rounded-xl p-4 font-mono text-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[#64748b] block">// Verilog Bypass logic check</span>
                    <span className="text-white block">always @(*) begin</span>
                    <span className="text-slate-300 block pl-4">if (mem_reg_write && (mem_rd != 0) && (mem_rd == ex_rs1))</span>
                    <span className="text-[#a78bfa] block pl-8">forward_a = 2'b10; // Forward from MEM</span>
                    <span className="text-slate-300 block pl-4">else if (wb_reg_write && (wb_rd != 0) && (wb_rd == ex_rs1))</span>
                    <span className="text-[#10b981] block pl-8">forward_a = 2'b01; // Forward from WB</span>
                    <span className="text-white block">end</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800/60 text-[11px] text-slate-400">
                    Bypass network validated with formal assertions.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'peripherals' && (
            <motion.div 
              key="peripherals"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="bg-[#121215] border border-slate-800/80 rounded-xl p-6 md:p-8">
                <div className="mb-6">
                  <h3 className="font-sans text-xl font-bold text-white">SoC Peripheral Registry Console</h3>
                  <p className="text-slate-400 text-sm mt-1">Review internal hardware design, register files, and operation parameters for each embedded IP core block.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Peripheral pills */}
                  <div className="flex flex-col gap-2">
                    {Object.keys(peripherals).map(key => (
                      <button
                        key={key}
                        onClick={() => setSelectedPeripheral(key)}
                        className={`p-4 rounded-xl text-left border font-mono text-xs uppercase tracking-wider transition-all ${
                          selectedPeripheral === key 
                            ? 'bg-[#1e1b4b] border-[#a78bfa] text-white font-bold' 
                            : 'bg-[#141416] border-slate-800/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {peripherals[key as keyof typeof peripherals].name}
                      </button>
                    ))}
                  </div>

                  {/* Peripheral details */}
                  <div className="lg:col-span-3 bg-[#141416] border border-slate-800 rounded-xl p-6 space-y-6">
                    <div>
                      <h4 className="font-sans text-xl font-bold text-white">
                        {peripherals[selectedPeripheral as keyof typeof peripherals].name}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1">
                        {peripherals[selectedPeripheral as keyof typeof peripherals].purpose}
                      </p>
                    </div>

                    <div className="border-t border-slate-800/60 pt-4">
                      <span className="font-mono text-xs font-bold text-[#ea580c] block mb-2">⚡ Internal hardware operation</span>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {peripherals[selectedPeripheral as keyof typeof peripherals].working}
                      </p>
                    </div>

                    <div className="border-t border-slate-800/60 pt-4">
                      <span className="font-mono text-xs font-bold text-[#a78bfa] block mb-3">Address Register File Map</span>
                      <div className="space-y-2">
                        {peripherals[selectedPeripheral as keyof typeof peripherals].registers.map((reg, rIdx) => (
                          <div key={rIdx} className="bg-[#18181c] border border-slate-800/40 rounded-lg p-3 flex flex-col sm:flex-row justify-between gap-2 text-xs">
                            <div>
                              <span className="font-mono text-[#a78bfa] font-bold mr-4">{reg.addr}</span>
                              <span className="text-white font-mono font-bold">{reg.name}</span>
                            </div>
                            <div className="flex gap-4 text-slate-400">
                              <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-slate-300">{reg.type}</span>
                              <span>{reg.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gdsii' && (
            <motion.div 
              key="gdsii"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Interactive GDSII Canvas */}
              <div className="bg-[#121215] border border-slate-800/80 rounded-xl p-6 md:p-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-sans text-xl font-bold text-white">Synthesized Physical GDSII Silicon Viewer</h3>
                    <p className="text-slate-400 text-sm mt-1">Simulated 0.38 mm² physical layout die mesh. Toggle layer visibility and zoom to inspect standard cell rows.</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setGdsZoom(prev => Math.max(prev - 0.25, 0.75))} 
                      className="bg-slate-800 hover:bg-slate-700 text-white h-8 w-8 rounded flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs text-white min-w-16 text-center">{Math.round(gdsZoom * 100)}%</span>
                    <button 
                      onClick={() => setGdsZoom(prev => Math.min(prev + 0.25, 2.5))} 
                      className="bg-slate-800 hover:bg-slate-700 text-white h-8 w-8 rounded flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Layer Selector */}
                  <div className="bg-[#141416] border border-slate-800 rounded-xl p-5 space-y-4">
                    <span className="font-mono text-xs font-bold text-white uppercase block mb-2">Physical Mask Layers</span>
                    
                    {Object.keys(gdsLayers).map((layer) => (
                      <label key={layer} className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer hover:text-white capitalize font-mono">
                        <input
                          type="checkbox"
                          checked={gdsLayers[layer as keyof typeof gdsLayers]}
                          onChange={(e) => setGdsLayers(prev => ({ ...prev, [layer]: e.target.checked }))}
                          className="rounded border-slate-800 bg-slate-900 text-[#a78bfa] focus:ring-[#a78bfa]"
                        />
                        <span>{layer === 'clock' ? 'Clock Distribution' : layer === 'metal1' ? 'Metal Interconnect M1' : layer === 'metal2' ? 'Metal Routing M2' : layer}</span>
                      </label>
                    ))}
                    
                    <div className="border-t border-slate-800/60 pt-4 text-xs text-slate-400">
                      <span className="block font-bold text-white mb-1">Layout PPA Area Specs</span>
                      <span>Total Core Area: <strong>0.38 mm²</strong></span><br />
                      <span>Transistor Density: <strong>1.2M / mm²</strong></span>
                    </div>
                  </div>

                  {/* SVG Silicon Die */}
                  <div className="lg:col-span-3 bg-[#08080a] border border-slate-800/80 rounded-xl p-4 flex items-center justify-center min-h-[400px] overflow-hidden relative">
                    <div 
                      style={{ transform: `scale(${gdsZoom})`, transition: 'transform 0.2s ease-out' }} 
                      className="w-full h-full max-w-[450px] aspect-square"
                    >
                      <svg viewBox="0 0 400 400" className="w-full h-full">
                        {/* Outer Silicon Guard ring */}
                        <rect x="10" y="10" width="380" height="380" rx="10" fill="none" stroke="#a78bfa" strokeWidth="2.5" opacity="0.4" />
                        <rect x="25" y="25" width="350" height="350" rx="4" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.2" />

                        {/* VDD/VSS Power Straps */}
                        {gdsLayers.metal2 && (
                          <g stroke="#3b82f6" strokeWidth="5" opacity="0.75">
                            <line x1="40" y1="40" x2="360" y2="40" />
                            <line x1="40" y1="120" x2="360" y2="120" />
                            <line x1="40" y1="200" x2="360" y2="200" />
                            <line x1="40" y1="280" x2="360" y2="280" />
                            <line x1="40" y1="360" x2="360" y2="360" />
                          </g>
                        )}

                        {/* Active Diffusion logic wells */}
                        {gdsLayers.diffusion && (
                          <g fill="#10b981" opacity="0.25">
                            <rect x="50" y="60" width="80" height="30" rx="2" />
                            <rect x="150" y="60" width="100" height="30" rx="2" />
                            <rect x="270" y="60" width="80" height="30" rx="2" />
                            
                            <rect x="50" y="140" width="120" height="30" rx="2" />
                            <rect x="190" y="140" width="160" height="30" rx="2" />

                            <rect x="50" y="220" width="90" height="30" rx="2" />
                            <rect x="160" y="220" width="100" height="30" rx="2" />
                            <rect x="280" y="220" width="70" height="30" rx="2" />
                          </g>
                        )}

                        {/* Poly Silicon Gates */}
                        {gdsLayers.poly && (
                          <g stroke="#f59e0b" strokeWidth="1.2" opacity="0.6">
                            {Array.from({ length: 12 }).map((_, i) => (
                              <g key={i}>
                                <line x1={60 + i * 26} y1="50" x2={60 + i * 26} y2="100" />
                                <line x1={60 + i * 26} y1="130" x2={60 + i * 26} y2="180" />
                                <line x1={60 + i * 26} y1="210" x2={60 + i * 26} y2="260" />
                              </g>
                            ))}
                          </g>
                        )}

                        {/* Clock Tree H-distribution */}
                        {gdsLayers.clock && (
                          <g stroke="#ef4444" strokeWidth="1.5" fill="none" opacity="0.8">
                            <path d="M 200 50 L 200 350" />
                            <path d="M 100 100 L 300 100" />
                            <path d="M 100 300 L 300 300" />
                            <path d="M 100 70 L 100 130" />
                            <path d="M 300 70 L 300 130" />
                            <path d="M 100 270 L 100 330" />
                            <path d="M 300 270 L 300 330" />
                          </g>
                        )}

                        {/* Metallization 1 paths */}
                        {gdsLayers.metal1 && (
                          <g stroke="#a78bfa" strokeWidth="0.8" fill="none" opacity="0.7">
                            <path d="M 60 70 h 50 v 20 h -30 v 40" />
                            <path d="M 180 80 v 40 h 50" />
                            <path d="M 280 150 h 40 v -40" />
                            <path d="M 110 230 h 60 v 30 h -20" />
                            <path d="M 250 240 v 50 h 40" />
                          </g>
                        )}

                        {/* Contact Vias */}
                        {gdsLayers.vias && (
                          <g fill="#ffffff" opacity="0.9">
                            <circle cx="110" cy="70" r="2.2" />
                            <circle cx="180" cy="120" r="2.2" />
                            <circle cx="320" cy="110" r="2.2" />
                            <circle cx="170" cy="260" r="2.2" />
                            <circle cx="290" cy="290" r="2.2" />
                          </g>
                        )}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Synthesis Pipeline Timeline */}
              <div className="bg-[#121215] border border-slate-800/80 rounded-xl p-6">
                <div className="mb-6">
                  <h3 className="font-sans text-lg font-bold text-white">RTL-to-GDSII Physical Implementation Pipeline</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Trace the complete 12-stage flow of the RV32IM SoC. Hover or click on any stage to inspect design goals, key tools, and produced physical layout artifacts.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gdsiiFlow.map((stage, idx) => {
                    const isExpanded = selectedGdsStage === idx || hoveredGdsStage === idx;
                    const isLastStage = idx === 11;
                    
                    // Icon mapping helper
                    const getIcon = (iconName: string) => {
                      switch (iconName) {
                        case 'Code': return <Code className="h-5 w-5 text-[#a78bfa]" />;
                        case 'Activity': return <Activity className="h-5 w-5 text-[#a78bfa]" />;
                        case 'Cpu': return <Cpu className="h-5 w-5 text-[#a78bfa]" />;
                        case 'Layers': return <Layers className="h-5 w-5 text-[#a78bfa]" />;
                        case 'Sliders': return <Sliders className="h-5 w-5 text-[#a78bfa]" />;
                        case 'Zap': return <Zap className="h-5 w-5 text-[#a78bfa]" />;
                        case 'RefreshCw': return <RefreshCw className="h-5 w-5 text-[#a78bfa]" />;
                        case 'ArrowUpRight': return <ArrowUpRight className="h-5 w-5 text-[#a78bfa]" />;
                        case 'ShieldCheck': return <ShieldCheck className="h-5 w-5 text-[#a78bfa]" />;
                        case 'Search': return <Search className="h-5 w-5 text-[#a78bfa]" />;
                        case 'Clock': return <Clock className="h-5 w-5 text-[#a78bfa]" />;
                        case 'Award': return <Award className="h-5 w-5 text-[#a78bfa]" />;
                        default: return <Cpu className="h-5 w-5 text-[#a78bfa]" />;
                      }
                    };

                    return (
                      <motion.div 
                        key={idx}
                        onMouseEnter={() => setHoveredGdsStage(idx)}
                        onMouseLeave={() => setHoveredGdsStage(null)}
                        onClick={() => setSelectedGdsStage(idx)}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.03 }}
                        className={`cursor-pointer rounded-xl p-5 border transition-all duration-300 relative flex flex-col justify-between ${
                          selectedGdsStage === idx 
                            ? 'bg-[#1b1530] border-[#a78bfa]' 
                            : isLastStage
                            ? 'bg-[#131124] border-[#a855f7]/60 shadow-[0_0_15px_rgba(168,85,247,0.12)] hover:border-[#a855f7]'
                            : 'bg-[#141416] border-slate-800/60 hover:border-slate-800'
                        }`}
                      >
                        {/* Upper Header Section */}
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800/60">
                                {getIcon(stage.icon)}
                              </div>
                              <div>
                                <span className="font-mono text-[9px] text-slate-400 block font-semibold">STAGE {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                                <h4 className="font-sans text-sm font-bold text-white tracking-tight leading-tight">{stage.title}</h4>
                              </div>
                            </div>
                            
                            {/* Complete Green Checkmark Badge */}
                            <div className="flex items-center gap-1 bg-[#10b981]/10 px-1.5 py-0.5 rounded-full border border-[#10b981]/20">
                              <Check className="h-2.5 w-2.5 text-[#10b981]" />
                              <span className="text-[8px] font-mono font-bold text-[#10b981]">DONE</span>
                            </div>
                          </div>

                          {/* One-line Description */}
                          <p className="text-xs text-slate-400 leading-relaxed mb-4">{stage.desc}</p>
                        </div>

                        {/* Expandable detailed container */}
                        <div className="w-full">
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden border-t border-slate-800/40 pt-4 mt-2 space-y-3"
                              >
                                <div>
                                  <span className="text-[9px] font-mono uppercase text-[#a78bfa] block font-semibold">Purpose</span>
                                  <p className="text-xs text-slate-300 leading-relaxed">{stage.purpose}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <span className="text-[9px] font-mono uppercase text-[#a78bfa] block font-semibold">Tools Used</span>
                                    <span className="text-slate-300 font-mono font-semibold">{stage.tool}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-mono uppercase text-[#a78bfa] block font-semibold">Metric Status</span>
                                    <span className="text-[#10b981] font-mono font-semibold">{stage.metric}</span>
                                  </div>
                                </div>

                                <div>
                                  <span className="text-[9px] font-mono uppercase text-[#a78bfa] block font-semibold">Key Outputs</span>
                                  <p className="text-[11px] text-slate-300 leading-relaxed">{stage.outputs}</p>
                                </div>

                                <div>
                                  <span className="text-[9px] font-mono uppercase text-[#a78bfa] block font-semibold">Artifacts Produced</span>
                                  <span className="font-mono text-[9px] text-slate-400 block bg-slate-900/60 p-2 rounded border border-slate-800/40 select-all">
                                    {stage.artifacts}
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Default Non-expanded footer bar */}
                          {!isExpanded && (
                            <div className="flex items-center justify-between text-[10px] border-t border-slate-800/30 pt-3 text-slate-400">
                              <span className="font-mono truncate">Tool: <strong className="text-slate-300">{stage.tool}</strong></span>
                              <span className="text-[#10b981] font-mono truncate font-semibold">{stage.metric}</span>
                            </div>
                          )}
                        </div>

                        {/* Special Bottom Glow Accent for the final GDSII tape-out */}
                        {isLastStage && (
                          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[#a855f7] to-transparent opacity-100" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* RTL-to-GDSII Physical Signoff Gallery */}
              <div className="mt-8 bg-[#121215] border border-slate-800/80 rounded-xl p-6">
                <PhysicalDesignGallery />
              </div>
            </motion.div>
          )}

          {activeTab === 'verification' && (
            <motion.div 
              key="verification"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Interactive logic trace wave */}
              <div className="bg-[#121215] border border-slate-800/80 rounded-xl p-6 md:p-8">
                <div className="mb-6">
                  <h3 className="font-sans text-xl font-bold text-white">GTKWave-Style SoC RTL Simulation Trace</h3>
                  <p className="text-slate-400 text-sm mt-1">Hover over simulation ticks to review address lines and active state machine handshakes.</p>
                </div>

                <div className="bg-[#08080a] border border-slate-800 rounded-xl p-6 overflow-x-auto">
                  <div className="min-w-[650px] space-y-4">
                    {/* Time ticks indicator */}
                    <div className="flex items-center text-xs text-slate-400 border-b border-slate-800/40 pb-2">
                      <span className="w-28 font-mono">Sim Timestamp</span>
                      <div className="flex-1 flex justify-between font-mono">
                        {waveformTicks.map((tick, i) => (
                          <span 
                            key={i} 
                            onMouseEnter={() => setWaveHoverCycle(i)}
                            className={`flex-1 text-center cursor-pointer transition-colors ${waveHoverCycle === i ? 'text-[#a78bfa] font-bold' : ''}`}
                          >
                            {tick.time}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Clock Signal */}
                    <div className="flex items-center h-8">
                      <span className="w-28 font-mono text-xs text-slate-400 font-semibold">sys_clk</span>
                      <div className="flex-1 flex justify-between">
                        {waveformTicks.map((tick, i) => (
                          <div 
                            key={i} 
                            onMouseEnter={() => setWaveHoverCycle(i)}
                            className={`flex-1 flex items-center justify-center relative h-full cursor-pointer ${waveHoverCycle === i ? 'bg-[#a78bfa]/5' : ''}`}
                          >
                            <svg className="w-full h-6" viewBox="0 0 100 20">
                              <path 
                                d={tick.clk === 1 ? "M 0 15 L 50 15 L 50 5 L 100 5" : "M 0 5 L 50 5 L 50 15 L 100 15"} 
                                fill="none" 
                                stroke="#10b981" 
                                strokeWidth="1.5" 
                              />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Program Counter PC */}
                    <div className="flex items-center h-8">
                      <span className="w-28 font-mono text-xs text-slate-400 font-semibold">cpu_pc[31:0]</span>
                      <div className="flex-1 flex justify-between">
                        {waveformTicks.map((tick, i) => (
                          <div 
                            key={i} 
                            onMouseEnter={() => setWaveHoverCycle(i)}
                            className={`flex-1 text-center font-mono text-xs cursor-pointer border-r border-slate-800/40 relative h-full flex items-center justify-center ${waveHoverCycle === i ? 'bg-[#a78bfa]/10 text-white font-bold' : 'text-slate-400'}`}
                          >
                            <span>{tick.pc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instruction bus description */}
                    <div className="flex items-center h-8">
                      <span className="w-28 font-mono text-xs text-slate-400 font-semibold">instruction</span>
                      <div className="flex-1 flex justify-between">
                        {waveformTicks.map((tick, i) => (
                          <div 
                            key={i} 
                            onMouseEnter={() => setWaveHoverCycle(i)}
                            className={`flex-1 text-center font-mono text-[10px] cursor-pointer border-r border-slate-800/40 relative h-full flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap px-1 ${waveHoverCycle === i ? 'bg-[#a78bfa]/10 text-[#a78bfa] font-bold' : 'text-slate-500'}`}
                          >
                            <span>{tick.instr}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AXI Transaction line */}
                    <div className="flex items-center h-8">
                      <span className="w-28 font-mono text-xs text-slate-400 font-semibold">axi_bus_state</span>
                      <div className="flex-1 flex justify-between">
                        {waveformTicks.map((tick, i) => (
                          <div 
                            key={i} 
                            onMouseEnter={() => setWaveHoverCycle(i)}
                            className={`flex-1 text-center font-mono text-xs cursor-pointer border-r border-slate-800/40 relative h-full flex items-center justify-center ${waveHoverCycle === i ? 'bg-[#a78bfa]/10 text-white font-bold' : 'text-slate-400'}`}
                          >
                            <span className={tick.ax_val !== 'Idle' ? 'text-amber-400 font-bold' : ''}>{tick.ax_val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {waveHoverCycle !== null && (
                  <div className="mt-4 bg-[#141416] border border-slate-800/60 p-4 rounded-xl text-xs flex items-center gap-3">
                    <Info className="h-5 w-5 text-[#a78bfa]" />
                    <p className="text-slate-300">
                      Timestamp <strong>{waveformTicks[waveHoverCycle].time}</strong>: CPU executing instruction <strong>{waveformTicks[waveHoverCycle].instr}</strong> on memory program counter index <strong>{waveformTicks[waveHoverCycle].pc}</strong>.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'code' && (
            <motion.div 
              key="code"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="bg-[#121215] border border-slate-800/80 rounded-xl p-6 md:p-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-sans text-xl font-bold text-white">Synthesizable Hardware Verilog Modules</h3>
                    <p className="text-slate-400 text-sm mt-1">Review synthesizable IP cores, data paths, multipliers, and bus configurations.</p>
                  </div>
                  
                  <button 
                    onClick={() => handleCopy(codeFiles[selectedCodeFile as keyof typeof codeFiles])}
                    className="bg-[#1e1b4b] border border-[#a78bfa]/25 hover:bg-slate-800 text-white h-9 px-4 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all"
                  >
                    {copiedCode ? <Check className="h-4 w-4 text-[#10b981]" /> : <Copy className="h-4 w-4" />}
                    {copiedCode ? 'Copied Module!' : 'Copy Code'}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Code list file tabs */}
                  <div className="flex flex-col gap-2">
                    {Object.keys(codeFiles).map(file => (
                      <button
                        key={file}
                        onClick={() => setSelectedCodeFile(file)}
                        className={`p-3.5 rounded-lg text-left border font-mono text-xs transition-all ${
                          selectedCodeFile === file 
                            ? 'bg-[#1e1b4b] border-[#a78bfa] text-white font-bold' 
                            : 'bg-[#141416] border-slate-800/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {file}
                      </button>
                    ))}
                  </div>

                  {/* Code Editor Area */}
                  <div className="lg:col-span-3 bg-[#08080a] border border-slate-800 rounded-xl p-6 overflow-x-auto font-mono text-xs max-h-[500px]">
                    <pre className="text-slate-300 leading-relaxed">
                      <code>{codeFiles[selectedCodeFile as keyof typeof codeFiles]}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
