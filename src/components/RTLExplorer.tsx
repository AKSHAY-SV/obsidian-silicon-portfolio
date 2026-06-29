import React, { useState } from 'react';
import { Terminal, Folder, FolderOpen, FileCode, CheckCircle, Info, RefreshCw, Cpu, Layers, Sliders } from 'lucide-react';

interface RTLFile {
  name: string;
  path: string;
  content: string;
  category: 'cores' | 'peripherals' | 'interconnects';
  stats: {
    area: string;
    maxFreq: string;
    luts: string;
    power: string;
  };
  pins: {
    name: string;
    direction: 'input' | 'output' | 'inout';
    width: string;
    desc: string;
  }[];
}

const RTL_DATABASE: RTLFile[] = [
  {
    name: 'RV32IM_Core.v',
    path: 'cores/RV32IM_Core.v',
    category: 'cores',
    stats: { area: '0.18 mm²', maxFreq: '180 MHz', luts: '4,280 LUTs', power: '32.4 mW' },
    pins: [
      { name: 'clk', direction: 'input', width: '1 bit', desc: 'Global rising-edge master clock' },
      { name: 'rst_n', direction: 'input', width: '1 bit', desc: 'Synchronous active-low reset pulse' },
      { name: 'imem_addr', direction: 'output', width: '32 bits', desc: 'Instruction memory fetch address bus' },
      { name: 'imem_rdata', direction: 'input', width: '32 bits', desc: 'Instruction memory returned opcode' },
      { name: 'dmem_we', direction: 'output', width: '1 bit', desc: 'Data memory write enable high' },
      { name: 'dmem_addr', direction: 'output', width: '32 bits', desc: 'Data memory address target bus' },
      { name: 'dmem_wdata', direction: 'output', width: '32 bits', desc: 'Data write payload buffer' },
      { name: 'dmem_rdata', direction: 'input', width: '32 bits', desc: 'Data read returned payload' }
    ],
    content: `// =================================================================
// SYSTEMVERILOG HARDWARE MODULE: RV32IM_Core
// TARGET SYNTHESIS: TSMC 65nm GPLUS PHYSICAL NODE
// CO-SIMULATED COMPILER: VERILATOR 5.0.4 SPEC
// =================================================================

module RV32IM_Core (
    input  wire        clk,
    input  wire        rst_n,
    
    // Instruction Bus Interface
    output wire [31:0] imem_addr,
    input  wire [31:0] imem_rdata,
    
    // Data Memory Bus Interface
    output wire        dmem_we,
    output wire [31:0] dmem_addr,
    output wire [31:0] dmem_wdata,
    input  wire [31:0] dmem_rdata
);

    // --- INTERNAL PIPELINE BOUNDARIES ---
    reg [31:0] if_pc, id_pc, ex_pc, mem_pc, wb_pc;
    reg [31:0] id_instr;
    
    // Decode Signalling Paths
    wire [4:0]  rs1 = id_instr[19:15];
    wire [4:0]  rs2 = id_instr[24:20];
    wire [4:0]  rd  = id_instr[11:7];
    wire [6:0]  opcode = id_instr[6:0];
    wire [31:0] imm = decode_imm(id_instr);
    
    // Bypass Operands Routing
    wire [1:0] forward_a, forward_b;
    wire [31:0] src_a = (forward_a == 2'b10) ? mem_alu_result :
                        (forward_a == 2'b01) ? wb_result : rf_rdata1;
                        
    // Core ALU Instantiation
    wire [31:0] alu_out;
    wire        alu_zero;
    
    ALU alu_inst (
        .a(src_a),
        .b(src_b_final),
        .ctrl(alu_ctrl),
        .out(alu_out),
        .zero(alu_zero)
    );
    
    // Math Core Dividers (Radix-4 Booth)
    wire [31:0] mult_out;
    M_Extension_Unit m_unit (
        .clk(clk),
        .rst_n(rst_n),
        .rs1_val(src_a),
        .rs2_val(src_b_final),
        .m_op(m_ctrl),
        .out(mult_out)
    );

    // --- SEQUENTIAL PIPELINE TRIGGER ---
    always @(posedge clk) begin
        if (!rst_n) begin
            if_pc    <= 32'h0000_0000;
            id_instr <= 32'h0000_0013; // NOP instruction
        end else begin
            if_pc    <= if_pc_next;
            id_instr <= imem_rdata;
        end
    end

endmodule`
  },
  {
    name: 'L1_Cache.v',
    path: 'cores/L1_Cache.v',
    category: 'cores',
    stats: { area: '0.12 mm²', maxFreq: '200 MHz', luts: '2,840 LUTs', power: '14.8 mW' },
    pins: [
      { name: 'clk', direction: 'input', width: '1 bit', desc: 'System core clock' },
      { name: 'rst_n', direction: 'input', width: '1 bit', desc: 'Synchronous system reset' },
      { name: 'req_valid', direction: 'input', width: '1 bit', desc: 'CPU memory access command valid' },
      { name: 'req_write', direction: 'input', width: '1 bit', desc: 'Write cycle high, read cycle low' },
      { name: 'addr', direction: 'input', width: '32 bits', desc: 'Incoming lookup physical memory address' },
      { name: 'wdata', direction: 'input', width: '32 bits', desc: 'Incoming write payload data buffer' },
      { name: 'rdata', direction: 'output', width: '32 bits', desc: 'Outgoing cache-hit read payload' },
      { name: 'ready', direction: 'output', width: '1 bit', desc: 'Cache controller pipeline step handoff' }
    ],
    content: `// =================================================================
// MODULE: L1_Cache
// TYPE: 4KB Direct-Mapped Data and Instruction Cache
// =================================================================

module L1_Cache (
    input  wire        clk,
    input  wire        rst_n,
    
    // CPU Core Request Channel
    input  wire        req_valid,
    input  wire        req_write,
    input  wire [31:0] addr,
    input  wire [31:0] wdata,
    output reg  [31:0] rdata,
    output reg         ready
);

    // 4KB Split: 128 cachelines * 32 bytes (256 bits)
    reg [255:0] cache_data [0:127];
    reg [19:0]  cache_tags [0:127];
    reg         cache_valid [0:127];
    
    // Address decoding layout
    wire [19:0] addr_tag   = addr[31:12];
    wire [6:0]  addr_index = addr[11:5];
    wire [4:0]  addr_offset= addr[4:0];
    
    // Check hit status
    wire hit = cache_valid[addr_index] && (cache_tags[addr_index] == addr_tag);
    
    always @(posedge clk) begin
        if (!rst_n) begin
            ready <= 1'b0;
        end else if (req_valid) begin
            if (hit) begin
                ready <= 1'b1;
                if (req_write) begin
                    cache_data[addr_index][addr_offset*8 +: 32] <= wdata;
                end else begin
                    rdata <= cache_data[addr_index][addr_offset*8 +: 32];
                end
            end else begin
                ready <= 1'b0; // Cache miss, triggers memory fetch
            end
        end else begin
            ready <= 1'b0;
        end
    end

endmodule`
  },
  {
    name: 'APB_Bridge.v',
    path: 'peripherals/APB_Bridge.v',
    category: 'peripherals',
    stats: { area: '0.04 mm²', maxFreq: '120 MHz', luts: '650 LUTs', power: '4.2 mW' },
    pins: [
      { name: 'pclk', direction: 'input', width: '1 bit', desc: 'Peripheral system slow clock' },
      { name: 'presetn', direction: 'input', width: '1 bit', desc: 'Active-low reset signal' },
      { name: 'paddr', direction: 'output', width: '32 bits', desc: 'APB device address wire' },
      { name: 'psel', direction: 'output', width: '1 bit', desc: 'APB chip select pulse line' },
      { name: 'penable', direction: 'output', width: '1 bit', desc: 'APB strobe pulse line' },
      { name: 'pwrite', direction: 'output', width: '1 bit', desc: 'APB transfer direction wire' }
    ],
    content: `// Parameterized APB Bus peripheral controller`
  },
  {
    name: 'AXI4_Router.v',
    path: 'interconnects/AXI4_Router.v',
    category: 'interconnects',
    stats: { area: '0.11 mm²', maxFreq: '350 MHz', luts: '2,420 LUTs', power: '12.4 mW' },
    pins: [
      { name: 'clk', direction: 'input', width: '1 bit', desc: 'Fabric master clock' },
      { name: 'rst_n', direction: 'input', width: '1 bit', desc: 'Fabric main reset pulse' }
    ],
    content: `// 4-Port high speed non blocking AXI4 crossbar switch router`
  }
];

export default function RTLExplorer() {
  const [activeFile, setActiveFile] = useState<RTLFile>(RTL_DATABASE[0]);
  const [openedFolders, setOpenedFolders] = useState<Record<string, boolean>>({
    cores: true,
    peripherals: false,
    interconnects: false
  });
  const [simRunning, setSimRunning] = useState(false);
  const [simLog, setSimLog] = useState<string>('Simulator ready. Ready to process RTL specifications...');

  const toggleFolder = (folder: string) => {
    setOpenedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const runSimulation = () => {
    setSimRunning(true);
    setSimLog('Executing simulator linting compiler [Verilator 5.0]...\n');
    
    setTimeout(() => {
      setSimLog(prev => prev + `Analyzing target file: ${activeFile.path}\n`);
    }, 400);

    setTimeout(() => {
      setSimLog(prev => prev + `Validating clock boundary trees... [OK]\nChecking CDC paths & latch violations... [0 Warn]\n`);
    }, 1000);

    setTimeout(() => {
      setSimLog(prev => prev + `Synthesis simulation successfully PASSED.\nLogic Area Gates matching target: ${activeFile.stats.luts}.\nEstimated signoff timing: ${activeFile.stats.maxFreq}.\n`);
      setSimRunning(false);
    }, 1800);
  };

  // Syntax highlighting mock logic
  const renderHighlightedCode = (codeText: string) => {
    if (!codeText) return <span className="text-[#64748b]">// Stub module content</span>;
    
    const lines = codeText.split('\n');
    return (
      <div className="font-mono text-xs leading-relaxed overflow-x-auto">
        {lines.map((line, idx) => {
          let lineClass = 'text-slate-300';
          if (line.trim().startsWith('//')) {
            lineClass = 'text-emerald-500'; // Comments
          } else if (line.includes('input') || line.includes('output') || line.includes('inout')) {
            lineClass = 'text-purple-400 font-semibold';
          } else if (line.includes('wire') || line.includes('reg') || line.includes('module') || line.includes('endmodule')) {
            lineClass = 'text-violet-400 font-semibold';
          } else if (line.includes('always @') || line.includes('begin') || line.includes('end')) {
            lineClass = 'text-amber-400 font-medium';
          }
          
          return (
            <div key={idx} className="flex hover:bg-[#1a1a1a] px-4 py-0.5">
              <span className="w-12 text-[#475569] select-none text-right pr-4 text-[10px]">{idx + 1}</span>
              <span className={lineClass}>{line}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8 text-center md:text-left">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#a78bfa]">
            Interactive CAD Environment
          </span>
          <h1 className="mt-2 font-sans text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            RTL FILE EXPLORER
          </h1>
          <p className="mt-3 font-sans text-base text-[#94a3b8]">
            Navigate synthesizable hardware files, trace physical logical ports, compute Gate Area metrics, and trigger real-time syntax checking.
          </p>
        </div>

        {/* IDE Split Pane Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 items-stretch">
          
          {/* Column 1: Directory Tree Navigation Sidebar */}
          <div className="lg:col-span-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-4 flex flex-col justify-between">
            <div>
              <span className="block font-mono text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] mb-4">
                📂 HARDWARE REPO INDEX
              </span>

              <div className="space-y-3 font-mono text-sm text-slate-300">
                {/* Cores Folder */}
                <div>
                  <button
                    onClick={() => toggleFolder('cores')}
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-[#1a1a1a] text-left transition-colors"
                  >
                    {openedFolders.cores ? <FolderOpen className="h-4 w-4 text-[#a78bfa]" /> : <Folder className="h-4 w-4 text-[#94a3b8]" />}
                    <span className="font-bold">cores/</span>
                  </button>
                  {openedFolders.cores && (
                    <div className="pl-6 mt-1 flex flex-col gap-1 border-l border-[rgba(255,255,255,0.06)]">
                      {RTL_DATABASE.filter(f => f.category === 'cores').map(file => (
                        <button
                          key={file.name}
                          onClick={() => {
                            setActiveFile(file);
                            setSimLog(`Swapped active file to: ${file.path}. Simulator cleared.`);
                          }}
                          className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs hover:bg-[#1f1f1f] text-left ${
                            activeFile.name === file.name ? 'text-[#a78bfa] bg-[#1a1a1a] font-semibold' : 'text-[#94a3b8]'
                          }`}
                        >
                          <FileCode className="h-3.5 w-3.5" />
                          {file.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Peripherals Folder */}
                <div>
                  <button
                    onClick={() => toggleFolder('peripherals')}
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-[#1a1a1a] text-left transition-colors"
                  >
                    {openedFolders.peripherals ? <FolderOpen className="h-4 w-4 text-[#a78bfa]" /> : <Folder className="h-4 w-4 text-[#94a3b8]" />}
                    <span className="font-bold">peripherals/</span>
                  </button>
                  {openedFolders.peripherals && (
                    <div className="pl-6 mt-1 flex flex-col gap-1 border-l border-[rgba(255,255,255,0.06)]">
                      {RTL_DATABASE.filter(f => f.category === 'peripherals').map(file => (
                        <button
                          key={file.name}
                          onClick={() => {
                            setActiveFile(file);
                            setSimLog(`Swapped active file to: ${file.path}. Simulator cleared.`);
                          }}
                          className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs hover:bg-[#1f1f1f] text-left ${
                            activeFile.name === file.name ? 'text-[#a78bfa] bg-[#1a1a1a] font-semibold' : 'text-[#94a3b8]'
                          }`}
                        >
                          <FileCode className="h-3.5 w-3.5" />
                          {file.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interconnects Folder */}
                <div>
                  <button
                    onClick={() => toggleFolder('interconnects')}
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-[#1a1a1a] text-left transition-colors"
                  >
                    {openedFolders.interconnects ? <FolderOpen className="h-4 w-4 text-[#a78bfa]" /> : <Folder className="h-4 w-4 text-[#94a3b8]" />}
                    <span className="font-bold">interconnects/</span>
                  </button>
                  {openedFolders.interconnects && (
                    <div className="pl-6 mt-1 flex flex-col gap-1 border-l border-[rgba(255,255,255,0.06)]">
                      {RTL_DATABASE.filter(f => f.category === 'interconnects').map(file => (
                        <button
                          key={file.name}
                          onClick={() => {
                            setActiveFile(file);
                            setSimLog(`Swapped active file to: ${file.path}. Simulator cleared.`);
                          }}
                          className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs hover:bg-[#1f1f1f] text-left ${
                            activeFile.name === file.name ? 'text-[#a78bfa] bg-[#1a1a1a] font-semibold' : 'text-[#94a3b8]'
                          }`}
                        >
                          <FileCode className="h-3.5 w-3.5" />
                          {file.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

            <div className="mt-8 border-t border-[rgba(255,255,255,0.06)] pt-4">
              <span className="text-[10px] text-[#94a3b8] font-mono leading-relaxed block">
                All files verified syntactically using Verilator linter pipelines.
              </span>
            </div>
          </div>

          {/* Column 2 & 3: Editor Central Pane */}
          <div className="lg:col-span-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] flex flex-col overflow-hidden">
            {/* Editor Top Tab Bar */}
            <div className="flex items-center justify-between bg-[#181818] px-4 py-2 border-b border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2 font-mono text-xs">
                <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-[#a78bfa]/10 border border-[#a78bfa]/20">
                  <span className="text-[9px] text-[#a78bfa] font-bold">V</span>
                </div>
                <span className="text-white font-bold">{activeFile.name}</span>
              </div>
              
              <button
                disabled={simRunning}
                onClick={runSimulation}
                className="flex items-center gap-1.5 rounded bg-[#a78bfa] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0a0a0a] hover:bg-[#bca5ff] disabled:opacity-50 transition-all active:scale-95 shadow-md shadow-[#a78bfa]/10"
              >
                {simRunning ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" /> compiling...
                  </>
                ) : (
                  <>
                    <Terminal className="h-3.5 w-3.5" /> run lint verification
                  </>
                )}
              </button>
            </div>

            {/* Custom Interactive Code Editor Display */}
            <div className="flex-1 bg-[#0a0a0a] py-4 border-b border-[rgba(255,255,255,0.05)] overflow-y-auto max-h-[450px]">
              {renderHighlightedCode(activeFile.content)}
            </div>

            {/* Simulated Live Console Console */}
            <div className="bg-[#0e0e0e] p-4 h-32 font-mono text-[10px] text-slate-400 overflow-y-auto border-t border-[rgba(255,255,255,0.04)]">
              <span className="block text-[#a78bfa] font-bold uppercase tracking-wider mb-1 text-[9px]">
                🤖 COMPILER FEEDBACK SYSTEM:
              </span>
              <pre className="whitespace-pre-wrap leading-relaxed">{simLog}</pre>
            </div>
          </div>

          {/* Column 4: Inspector Right Panel */}
          <div className="lg:col-span-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-4 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Block 1: Module Statistics */}
              <div>
                <span className="block font-mono text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] mb-3">
                  📊 AREA & PPA STATS
                </span>
                <div className="grid grid-cols-2 gap-3 bg-[#181818] p-3 rounded border border-[rgba(255,255,255,0.04)] font-mono text-xs">
                  <div>
                    <span className="block text-[9px] text-[#94a3b8]">MAX CLK:</span>
                    <span className="text-white font-bold">{activeFile.stats.maxFreq}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-[#94a3b8]">CELL AREA:</span>
                    <span className="text-white font-bold">{activeFile.stats.area}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                    <span className="block text-[9px] text-[#94a3b8]">LOGIC CELLS:</span>
                    <span className="text-white font-bold">{activeFile.stats.luts}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                    <span className="block text-[9px] text-[#94a3b8]">LEAKAGE POWER:</span>
                    <span className="text-[#a78bfa] font-bold">{activeFile.stats.power}</span>
                  </div>
                </div>
              </div>

              {/* Block 2: Module Interface Pins */}
              <div>
                <span className="block font-mono text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] mb-3">
                  🔌 PIN INTERFACE EXPLORER
                </span>
                <div className="border border-[rgba(255,255,255,0.06)] rounded overflow-hidden max-h-[220px] overflow-y-auto">
                  <table className="w-full text-left font-mono text-[10px] leading-relaxed">
                    <thead className="bg-[#181818] text-[#94a3b8] border-b border-[rgba(255,255,255,0.06)]">
                      <tr>
                        <th className="px-2 py-1">Pin Name</th>
                        <th className="px-1 py-1">Dir</th>
                        <th className="px-1 py-1 text-right">Width</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-slate-300">
                      {activeFile.pins ? (
                        activeFile.pins.map((pin) => (
                          <tr key={pin.name} className="hover:bg-[#1a1a1a]">
                            <td className="px-2 py-1 font-bold text-white" title={pin.desc}>
                              {pin.name}
                            </td>
                            <td className="px-1 py-1">
                              <span className={`px-1 rounded text-[8px] font-bold ${
                                pin.direction === 'input' ? 'bg-sky-500/10 text-sky-400' : 'bg-amber-500/10 text-amber-400'
                              }`}>
                                {pin.direction === 'input' ? 'IN' : 'OUT'}
                              </span>
                            </td>
                            <td className="px-1 py-1 text-right text-[#94a3b8]">
                              {pin.width}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-2 text-center text-[#64748b]">No pin mappings available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] text-emerald-500">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Simulation Status: Passed</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
