import React, { useState, useEffect } from 'react';
import { 
  Cpu, Award, Zap, BookOpen, Terminal, Sliders, ShieldCheck, Layers, 
  ChevronRight, Play, Check, Copy, FileText, Download, Github, RefreshCw, 
  Eye, ZoomIn, Search, Clock, Info, CheckCircle, Flame, Activity, 
  AlertCircle, ArrowRight, ArrowUpRight, Code, RotateCw, CheckSquare, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EightBitComputerDetailProps {
  onClose: () => void;
}

export default function EightBitComputerDetail({ onClose }: EightBitComputerDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'alu' | 'instructions' | 'hierarchy' | 'verification'>('overview');
  
  // Shared Bus State
  const [busSource, setBusSource] = useState<string>('PC');
  const [busDest, setBusDest] = useState<string>('MAR');
  const [busData, setBusData] = useState<string>('00111010');
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [transferLog, setTransferLog] = useState<string>('Ready for bus co-simulation.');

  // ALU State
  const [regA, setRegA] = useState<number>(42); // decimal
  const [regB, setRegB] = useState<number>(13); // decimal
  const [aluOp, setAluOp] = useState<'ADD' | 'SUB' | 'AND' | 'OR' | 'XOR' | 'SHL' | 'SHR' | 'NOT'>('ADD');

  // Control Unit State
  const [selectedCuInstruction, setSelectedCuInstruction] = useState<'LDA' | 'ADD' | 'SUB' | 'OUT'>('LDA');
  const [currentTState, setCurrentTState] = useState<number>(1);
  const [isCuPlaying, setIsCuPlaying] = useState<boolean>(false);

  // Verification Gallery Lightbox State
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxCaption, setLightboxCaption] = useState<string>('');

  // Code Copy State
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);

  // Micro-architectural Blocks State
  const [selectedBlock, setSelectedBlock] = useState<string>('pc');

  // Helper: decimal to 8-bit binary string
  const decToBin = (dec: number): string => {
    const clamped = Math.max(0, Math.min(255, dec));
    return clamped.toString(2).padStart(8, '0');
  };

  // Helper: toggle a specific bit of an 8-bit number
  const toggleBit = (val: number, bitIdx: number): number => {
    return val ^ (1 << (7 - bitIdx));
  };

  // ALU Arithmetic & Logic Execution
  const calculateAlu = () => {
    let result = 0;
    let carry = false;
    let negative = false;

    switch (aluOp) {
      case 'ADD':
        result = regA + regB;
        carry = result > 255;
        result = result & 255;
        break;
      case 'SUB':
        result = regA - regB;
        carry = result < 0;
        result = (result + 256) & 255;
        break;
      case 'AND':
        result = regA & regB;
        break;
      case 'OR':
        result = regA | regB;
        break;
      case 'XOR':
        result = regA ^ regB;
        break;
      case 'SHL':
        result = regA << 1;
        carry = result > 255;
        result = result & 255;
        break;
      case 'SHR':
        carry = (regA & 1) === 1;
        result = regA >> 1;
        break;
      case 'NOT':
        result = (~regA) & 255;
        break;
    }

    const zero = result === 0;
    negative = (result & 128) !== 0;

    return {
      result,
      binary: decToBin(result),
      flags: { carry, zero, negative }
    };
  };

  const aluOutput = calculateAlu();

  // Control Unit Auto Step logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCuPlaying) {
      interval = setInterval(() => {
        setCurrentTState(prev => (prev === 6 ? 1 : prev + 1));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isCuPlaying]);

  // Shared Bus Presets
  const busPresets = [
    { name: 'PC to MAR (Fetch T1)', src: 'PC', dest: 'MAR', data: '00000100', log: 'T1 Cycle: Program Counter places instruction address [0x4] onto bus; MAR latches address.' },
    { name: 'RAM to IR (Fetch T3)', src: 'RAM', dest: 'IR', data: '00101111', log: 'T3 Cycle: RAM addressed by MAR drives instruction [ADD 0xF] onto bus; Instruction Register latches payload.' },
    { name: 'IR to MAR (LDA Execute T4)', src: 'IR', dest: 'MAR', data: '00001010', log: 'T4 Cycle: Instruction Register operand address [0xA] placed onto bus; MAR latches for variable read.' },
    { name: 'ALU to Acc (ADD Execute T6)', src: 'ALU', dest: 'ACC', data: '00110111', log: 'T6 Cycle: ALU drives computed addition sum onto shared bus; Accumulator captures results.' },
    { name: 'Acc to Output (OUT Execute T4)', src: 'ACC', dest: 'OUT', data: '01010101', log: 'T4 Cycle: Accumulator places processed result [0x55] onto bus; Output register latches display value.' }
  ];

  const applyBusPreset = (preset: typeof busPresets[0]) => {
    setBusSource(preset.src);
    setBusDest(preset.dest);
    setBusData(preset.data);
    setTransferLog(preset.log);
  };

  const triggerBusTransfer = () => {
    setIsTransferring(true);
    setTransferLog(`Bus arbitration active. Moving byte ${busData} from ${busSource} to ${busDest}...`);
    setTimeout(() => {
      setIsTransferring(false);
      setTransferLog(`Data transaction completed successfully. ${busDest} latched value 0x${parseInt(busData, 2).toString(16).toUpperCase().padStart(2, '0')} (binary: ${busData}).`);
    }, 1200);
  };

  // Hardware Blocks Metadata
  const hardwareBlocks: Record<string, { name: string; purpose: string; inputs: string; outputs: string; working: string }> = {
    pc: {
      name: 'Program Counter (PC)',
      purpose: 'Stores the memory address of the next instruction to be fetched.',
      inputs: 'Clock (clk), Reset (rst_n), Load Address (bus[3:0] for JMP), Increment Enable (pc_count).',
      outputs: 'PC address (pc_out[3:0]) mapped onto the shared bus.',
      working: 'A 4-bit synchronous counter that increments by 1 on T2 stage, or loads target address from the bus on active JMP/conditional jump branches.'
    },
    mar: {
      name: 'Memory Address Register (MAR)',
      purpose: 'Holds the memory address during memory read/write operations.',
      inputs: 'Clock (clk), MAR Load Enable (mar_load), Address data (bus[3:0]).',
      outputs: 'Address path directly connected to RAM block (ram_addr[3:0]).',
      working: 'Captures the lowest 4 bits of the shared bus on the clock edge when mar_load is asserted, addressing the RAM array.'
    },
    ram: {
      name: 'RAM (16 x 8-bit)',
      purpose: 'Primary system memory storing instructions and variables.',
      inputs: 'RAM Address (from MAR[3:0]), Write Enable (ram_we), RAM Output Enable (ram_oe), Data (bus[7:0]).',
      outputs: 'Memory byte (bus[7:0]) driven onto bus when ram_oe is asserted.',
      working: 'An asynchronous-read, synchronous-write registers matrix representing 16 bytes of scratchpad memory.'
    },
    ir: {
      name: 'Instruction Register (IR)',
      purpose: 'Holds the fetched instruction opcode and operand.',
      inputs: 'Clock (clk), IR Load Enable (ir_load), Instruction byte (bus[7:0]).',
      outputs: 'Opcode (ir_out[7:4] to Control Unit), Operand (ir_out[3:0] to bus when ir_oe is asserted).',
      working: 'Latching the bus value on T3 fetch state; splits the instruction word into a 4-bit instruction opcode and a 4-bit memory address operand.'
    },
    acc: {
      name: 'Register A (Accumulator)',
      purpose: 'Primary register for arithmetic calculations and computational results.',
      inputs: 'Clock (clk), Accumulator Load (acc_load), Data (bus[7:0]).',
      outputs: 'Accumulator contents (acc_out[7:0] to ALU input, and to bus when acc_oe is asserted).',
      working: 'Provides the default primary operand for all ALU operations and receives computed ALU results on Write-back stages.'
    },
    regb: {
      name: 'Register B (Operand Register)',
      purpose: 'Holds secondary operand for dual-input ALU operations.',
      inputs: 'Clock (clk), Reg B Load (regb_load), Data (bus[7:0]).',
      outputs: 'Reg B contents directly routed as ALU input B (regb_out[7:0]).',
      working: 'Acts as temporary storage buffer for RAM reads, feeding the second argument of addition/subtraction or logical filters.'
    },
    alu: {
      name: 'ALU (Arithmetic Logic Unit)',
      purpose: 'Performs mathematical and logic calculations on Register A and Register B.',
      inputs: 'Input A (Register A[7:0]), Input B (Register B[7:0]), Opcode selectors (alu_sub, alu_op).',
      outputs: 'Computed result (bus[7:0] when alu_oe is asserted), Status flags (Carry, Zero, Negative).',
      working: 'Fully combinational logic blocks implementing addition, subtraction, AND, OR, XOR, logical shifts, and logical NOT.'
    },
    flags: {
      name: 'Flags Register',
      purpose: 'Latches the CPU status flags to manage conditional branching.',
      inputs: 'Clock (clk), Flags Load (flags_load), ALU flags (carry_in, zero_in, neg_in).',
      outputs: 'Stable latched status bits (Carry, Zero, Negative) routed directly to the Control Unit.',
      working: 'Saves transient ALU mathematical flags during active operations to prevent race conditions during conditional jumps.'
    },
    outreg: {
      name: 'Output Register',
      purpose: 'Presents latched computer output results to the external world.',
      inputs: 'Clock (clk), Output Latch (out_load), Data (bus[7:0]).',
      outputs: 'Output value (out_display[7:0]) displayed via physical hexadecimal/LED devices.',
      working: 'Captures bus state on explicit OUT instructions, freezing data values for user display feedback.'
    },
    cu: {
      name: 'Control Unit',
      purpose: 'Synchronizes and sequences instruction cycles.',
      inputs: 'Clock (clk), Reset (rst_n), Opcode (IR[7:4]), Latched flags (Carry, Zero, Negative).',
      outputs: '16-bit control signal vector (pc_oe, pc_count, mar_load, ram_oe, ram_we, ir_load, ir_oe, acc_load, acc_oe, regb_load, alu_oe, alu_sub, out_load, flags_load, etc.).',
      working: 'A microsequenced state machine dividing execution into 6 sequential T-states (Fetch: T1-T3, Execute: T4-T6), mapping opcode bits to active physical controls.'
    }
  };

  // Module Hierarchy list
  const moduleHierarchy = [
    {
      name: 'complete.v',
      type: 'Top Level Envelope',
      purpose: 'System root orchestrating the full computer layout.',
      internalBlocks: 'upper.v, lower.v, control_unit.v, OutputRegister.v',
      responsibilities: 'Defines global clock/reset buses, maps physical IO ports, and binds all sub-modules to the shared 8-bit parallel bus wires.'
    },
    {
      name: 'upper.v',
      type: 'Middle Layer Datapath',
      purpose: 'Coordinates address and instruction register registers.',
      internalBlocks: 'ProgramCounter (PC), MemoryAddressRegister (MAR), InstructionRegister (IR), Accumulator (Reg A).',
      responsibilities: 'Maintains program execution address pointer, decodes instruction registers, and buffers primary computational results.'
    },
    {
      name: 'lower.v',
      type: 'Middle Layer Computations',
      purpose: 'Handles auxiliary operands and ALU computation.',
      internalBlocks: 'RegisterB, ALU, FlagsRegister.',
      responsibilities: 'Saves dual-argument operations buffers, calculates multi-mode ALU results, and latches persistent carry/zero/negative flags.'
    },
    {
      name: 'control_unit.v',
      type: 'Standalone Microsequencer',
      purpose: 'The central system decoder.',
      internalBlocks: 'T-State Counter, Control Logic Matrix.',
      responsibilities: 'Translates 4-bit fetched opcode vectors into 16 mutually-exclusive logical control signals across 6 timed stages.'
    }
  ];

  // Instructions Metadata
  const instructionsList = [
    { op: 'LDA', opcode: '0000', operation: 'Acc <- RAM[Addr]', desc: 'Load the value stored at RAM address into the Accumulator.', ex: 'LDA 0x9 -> Fetches RAM[0x9] and registers it in Accumulator A.' },
    { op: 'STA', opcode: '0001', operation: 'RAM[Addr] <- Acc', desc: 'Store current Accumulator value into targeted RAM memory address.', ex: 'STA 0xC -> Writes Accumulator A byte into RAM storage at 0xC.' },
    { op: 'ADD', opcode: '0010', operation: 'Acc <- Acc + RAM[Addr]', desc: 'Add targeted RAM cell value to Accumulator, updating flags.', ex: 'ADD 0x4 -> Loads RAM[0x4] into Reg B, adds with Acc, writes back to Acc.' },
    { op: 'SUB', opcode: '0011', operation: 'Acc <- Acc - RAM[Addr]', desc: 'Subtract RAM memory cell from Accumulator, updating flags.', ex: 'SUB 0x8 -> Subtracts RAM[0x8] from Acc, updates Carry/Zero flag registers.' },
    { op: 'AND', opcode: '0100', operation: 'Acc <- Acc & RAM[Addr]', desc: 'Bitwise AND Accumulator with RAM cell value.', ex: 'AND 0x2 -> Filters Accumulator against RAM bitmask.' },
    { op: 'OR',  opcode: '0101', operation: 'Acc <- Acc | RAM[Addr]', desc: 'Bitwise OR Accumulator with RAM memory operand.', ex: 'OR 0x3 -> Logical OR Accumulator with RAM[0x3].' },
    { op: 'XOR', opcode: '0110', operation: 'Acc <- Acc ^ RAM[Addr]', desc: 'Bitwise XOR Accumulator with RAM address contents.', ex: 'XOR 0xA -> Exclusive OR calculation with memory.' },
    { op: 'SHL', opcode: '0111', operation: 'Acc <- Acc << 1', desc: 'Shift Accumulator values left by 1 bit position.', ex: 'SHL -> Multiplies Accumulator value by 2.' },
    { op: 'SHR', opcode: '1000', operation: 'Acc <- Acc >> 1', desc: 'Shift Accumulator values right by 1 bit position.', ex: 'SHR -> Performs logical division of Accumulator by 2.' },
    { op: 'NOT', opcode: '1001', operation: 'Acc <- ~Acc', desc: 'Invert all bits of the Accumulator register contents.', ex: 'NOT -> Performs 1s complement of Accumulator.' },
    { op: 'JMP', opcode: '1010', operation: 'PC <- Addr', desc: 'Unconditional jump. Set Program Counter to destination address.', ex: 'JMP 0x2 -> Sets PC to 0x2, continuing fetch sequence there.' },
    { op: 'JZ',  opcode: '1011', operation: 'If Z=1, PC <- Addr', desc: 'Conditional branch. Jump if the zero flag is currently set.', ex: 'JZ 0x5 -> Branches execution to address 0x5 if last result was zero.' },
    { op: 'JC',  opcode: '1100', operation: 'If C=1, PC <- Addr', desc: 'Conditional branch. Jump if carry flag is currently set.', ex: 'JC 0xE -> Branches if overflow carry was previously logged.' },
    { op: 'JN',  opcode: '1101', operation: 'If N=1, PC <- Addr', desc: 'Conditional branch. Jump if negative flag is set.', ex: 'JN 0x1 -> Branches if result has sign bit active.' },
    { op: 'OUT', opcode: '1110', operation: 'OutReg <- Acc', desc: 'Outputs Accumulator data to display register latch.', ex: 'OUT -> Displays the current accumulator value on physical LEDs.' },
    { op: 'HLT', opcode: '1111', operation: 'Halt computer clock', desc: 'Suspends clock pulses, halting program execution.', ex: 'HLT -> Ends simulation run loop safely.' }
  ];

  const [selectedInstrIdx, setSelectedInstrIdx] = useState<number>(0);

  // Control Unit T-States timeline signals mapping
  const getTStateSignals = (instr: string, t: number) => {
    switch (t) {
      case 1: return { active: ['PC', 'MAR', 'Shared Bus'], signals: ['pc_oe', 'mar_load'], desc: 'T1 State: The Program Counter places the address of the next instruction on the Shared Bus, and the Memory Address Register latches it.' };
      case 2: return { active: ['PC'], signals: ['pc_count'], desc: 'T2 State: The Program Counter increments by 1 on the positive clock edge, preparing for the next fetch cycle.' };
      case 3: return { active: ['RAM', 'IR', 'Shared Bus'], signals: ['ram_oe', 'ir_load'], desc: 'T3 State: RAM drives the instruction byte pointed to by the MAR onto the Shared Bus, and the Instruction Register loads it.' };
      case 4:
        if (instr === 'LDA') return { active: ['IR', 'MAR', 'Shared Bus'], signals: ['ir_oe', 'mar_load'], desc: 'T4 Execute: Instruction Register places operand address onto the bus; MAR latches address for RAM variable access.' };
        if (instr === 'ADD' || instr === 'SUB') return { active: ['IR', 'MAR', 'Shared Bus'], signals: ['ir_oe', 'mar_load'], desc: 'T4 Execute: Operand address placed on bus; MAR latches to address variable.' };
        if (instr === 'OUT') return { active: ['ACC', 'OUT', 'Shared Bus'], signals: ['acc_oe', 'out_load'], desc: 'T4 Execute: Accumulator contents driven onto bus; Output Register latches byte.' };
        return { active: [], signals: [], desc: 'T4 Execute: Halting or idle instruction state.' };
      case 5:
        if (instr === 'LDA') return { active: ['RAM', 'ACC', 'Shared Bus'], signals: ['ram_oe', 'acc_load'], desc: 'T5 Execute: RAM drives addressed variable onto the bus; Accumulator latches value.' };
        if (instr === 'ADD' || instr === 'SUB') return { active: ['RAM', 'REGB', 'Shared Bus'], signals: ['ram_oe', 'regb_load'], desc: 'T5 Execute: RAM drives variable onto bus; Register B (second operand) latches it.' };
        return { active: [], signals: [], desc: 'T5 Execute: Operation complete or idle.' };
      case 6:
        if (instr === 'ADD') return { active: ['ALU', 'ACC', 'Shared Bus'], signals: ['alu_oe', 'acc_load', 'flags_load'], desc: 'T6 Execute: ALU executes addition sum; places value on bus; Accumulator captures it, and Flags Register updates.' };
        if (instr === 'SUB') return { active: ['ALU', 'ACC', 'Shared Bus'], signals: ['alu_oe', 'alu_sub', 'acc_load', 'flags_load'], desc: 'T6 Execute: ALU subtracts Reg B from Acc; drives result to bus; Accumulator captures, flags loaded.' };
        return { active: [], signals: [], desc: 'T6 Execute: Operation complete, preparing for next Fetch.' };
      default: return { active: [], signals: [], desc: '' };
    }
  };

  const currentTStateSignals = getTStateSignals(selectedCuInstruction, currentTState);

  // Verilog Code Snippets for Showcase
  const codeFiles = [
    {
      name: 'complete.v',
      code: `// =================================================================
// PROJECT: 8-BIT_COMPUTER_DESIGN
// FILE: complete.v
// DESCRIPTION: Top-Level Module Mapping Datapath Bus Drivers
// =================================================================

module complete (
    input  wire       clk,
    input  wire       rst_n,
    output wire [7:0] out_display
);

    // --- CENTRAL TRI-STATE SHARED BUS ---
    wire [7:0] bus;

    // --- CPU CONTROL PATH CONNECTIONS ---
    wire [15:0] ctrl;
    wire [3:0]  pc_val, mar_val;
    wire [7:0]  ram_val, ir_val, acc_val, regb_val, alu_val;
    wire [2:0]  flags;

    // Top Level Structural Mapping
    upper upper_inst (
        .clk(clk),
        .rst_n(rst_n),
        .bus(bus),
        .ctrl(ctrl),
        .pc_out(pc_val),
        .mar_out(mar_val),
        .ir_out(ir_val),
        .acc_out(acc_val)
    );

    lower lower_inst (
        .clk(clk),
        .rst_n(rst_n),
        .bus(bus),
        .ctrl(ctrl),
        .acc_in(acc_val),
        .regb_out(regb_val),
        .alu_out(alu_val),
        .flags_out(flags)
    );

    control_unit cu_inst (
        .clk(clk),
        .rst_n(rst_n),
        .opcode(ir_val[7:4]),
        .flags(flags),
        .ctrl(ctrl)
    );

    OutputRegister out_reg (
        .clk(clk),
        .load(ctrl[12]), // out_load
        .in_val(bus),
        .out_val(out_display)
    );

endmodule`
    },
    {
      name: 'control_unit.v',
      code: `// =================================================================
// PROJECT: 8-BIT_COMPUTER_DESIGN
// FILE: control_unit.v
// DESCRIPTION: 6-State Microprogrammed Sequencer and Logic Matrix
// =================================================================

module control_unit (
    input  wire       clk,
    input  wire       rst_n,
    input  wire [3:0] opcode,
    input  wire [2:0] flags, // [Carry, Zero, Negative]
    output reg  [15:0] ctrl
);

    reg [2:0] t_state;

    // T-State Generator (Sequential Ring Counter)
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            t_state <= 3'd1;
        end else begin
            if (t_state == 3'd6)
                t_state <= 3'd1;
            else
                t_state <= t_state + 1'b1;
        end
    end

    // Control Line Mapping Arrays
    // ctrl[0]  = pc_oe,      ctrl[1]  = pc_count
    // ctrl[2]  = mar_load,    ctrl[3]  = ram_oe
    // ctrl[4]  = ram_we,      ctrl[5]  = ir_load
    // ctrl[6]  = ir_oe,       ctrl[7]  = acc_load
    // ctrl[8]  = acc_oe,      ctrl[9]  = regb_load
    // ctrl[10] = alu_oe,      ctrl[11] = alu_sub
    // ctrl[12] = out_load,    ctrl[13] = flags_load

    always @(*) begin
        ctrl = 16'b0;
        case (t_state)
            3'd1: begin // T1: MAR <- PC
                ctrl[0] = 1'b1; // pc_oe
                ctrl[2] = 1'b1; // mar_load
            end
            3'd2: begin // T2: PC <- PC + 1
                ctrl[1] = 1'b1; // pc_count
            end
            3'd3: begin // T3: IR <- RAM[MAR]
                ctrl[3] = 1'b1; // ram_oe
                ctrl[5] = 1'b1; // ir_load
            end
            default: begin
                case (opcode)
                    4'b0000: begin // LDA (Load Accumulator)
                        if (t_state == 3'd4) begin ctrl[6] = 1'b1; ctrl[2] = 1'b1; end // MAR <- IR[3:0]
                        if (t_state == 3'd5) begin ctrl[3] = 1'b1; ctrl[7] = 1'b1; end // Acc <- RAM[MAR]
                    end
                    4'b0010: begin // ADD (Add RAM to Acc)
                        if (t_state == 3'd4) begin ctrl[6] = 1'b1; ctrl[2] = 1'b1; end // MAR <- IR[3:0]
                        if (t_state == 3'd5) begin ctrl[3] = 1'b1; ctrl[9] = 1'b1; end // Reg B <- RAM[MAR]
                        if (t_state == 3'd6) begin ctrl[10] = 1'b1; ctrl[7] = 1'b1; ctrl[13] = 1'b1; end // Acc <- Acc + B, Load Flags
                    end
                    4'b0011: begin // SUB (Subtract RAM from Acc)
                        if (t_state == 3'd4) begin ctrl[6] = 1'b1; ctrl[2] = 1'b1; end
                        if (t_state == 3'd5) begin ctrl[3] = 1'b1; ctrl[9] = 1'b1; end
                        if (t_state == 3'd6) begin ctrl[10] = 1'b1; ctrl[11] = 1'b1; ctrl[7] = 1'b1; ctrl[13] = 1'b1; end // alu_sub enabled
                    end
                    4'b1110: begin // OUT (Output Accumulator)
                        if (t_state == 3'd4) begin ctrl[8] = 1'b1; ctrl[12] = 1'b1; end // acc_oe, out_load
                    end
                    default: ctrl = 16'b0;
                endcase
            end
        endcase
    end

endmodule`
    },
    {
      name: 'tri_state_bus.v',
      code: `// =================================================================
// PROJECT: 8-BIT_COMPUTER_DESIGN
// DESCRIPTION: Dynamic Shared Parallel Bus Driver
// =================================================================

module tri_state_bus (
    input  wire        pc_oe,
    input  wire [3:0]  pc_out,
    input  wire        ram_oe,
    input  wire [7:0]  ram_out,
    input  wire        ir_oe,
    input  wire [3:0]  ir_out,
    input  wire        acc_oe,
    input  wire [7:0]  acc_out,
    input  wire        alu_oe,
    input  wire [7:0]  alu_out,
    output wire [7:0]  bus
);

    // Place high impedance (Z) on bus for all non-selected drivers
    assign bus = (pc_oe)   ? {4'b0000, pc_out} :
                 (ram_oe)  ? ram_out            :
                 (ir_oe)   ? {4'b0000, ir_out}  :
                 (acc_oe)  ? acc_out            :
                 (alu_oe)  ? alu_out            :
                 8'bzzzzzzzz;

endmodule`
    }
  ];

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* Return to Library Button */}
      <button
        onClick={onClose}
        className="mb-8 flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#121212] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#94a3b8] hover:bg-[#1a1a1a] hover:text-white transition-all"
        id="return-to-library-btn"
      >
        ← Return to Library
      </button>

      {/* Hero Section */}
      <div className="relative mb-10 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-8 md:p-12" id="8bit-hero">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-15 pointer-events-none">
          <svg className="w-full h-full text-[#a78bfa]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
            <rect x="10" y="10" width="80" height="80" rx="5" />
            <line x1="20" y1="10" x2="20" y2="90" />
            <line x1="30" y1="10" x2="30" y2="90" />
            <line x1="40" y1="10" x2="40" y2="90" />
            <line x1="50" y1="10" x2="50" y2="90" />
            <line x1="60" y1="10" x2="60" y2="90" />
            <line x1="70" y1="10" x2="70" y2="90" />
            <line x1="80" y1="10" x2="80" y2="90" />
            <line x1="10" y1="20" x2="90" y2="20" />
            <line x1="10" y1="30" x2="90" y2="30" />
            <line x1="10" y1="40" x2="90" y2="40" />
            <line x1="10" y1="50" x2="90" y2="50" />
            <line x1="10" y1="60" x2="90" y2="60" />
            <line x1="10" y1="70" x2="90" y2="70" />
            <line x1="10" y1="80" x2="90" y2="80" />
          </svg>
        </div>
        <div className="max-w-3xl relative z-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="rounded bg-[#a78bfa]/10 border border-[#a78bfa]/20 px-2.5 py-0.5 font-mono text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
              FPGA / Computer Architecture
            </span>
            <span className="rounded bg-[#10b981]/10 border border-[#10b981]/20 px-2.5 py-0.5 font-mono text-[10px] uppercase font-bold tracking-wider text-[#10b981]">
              Xilinx Vivado Verified
            </span>
          </div>
          <h1 className="font-mono text-3xl font-extrabold text-[#a78bfa] tracking-tight sm:text-5xl uppercase">
            8-BIT COMPUTER DESIGN
          </h1>
          <p className="mt-2 font-sans text-xl font-bold text-white tracking-tight leading-snug">
            Classic Accumulator-Based von Neumann Hardware Implementation
          </p>
          <p className="mt-4 font-sans text-base text-[#94a3b8] leading-relaxed">
            A fully synthesizable, cycle-accurate implementation of a classical 8-bit accumulator computer in Verilog HDL. Incorporates an 8-bit shared tri-state parallel interconnect bus, 16-instruction custom ISA, and a 6-stage microprogram-equivalent Control Unit.
          </p>

          {/* Technology chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {['Vivado', 'Verilog HDL', 'Xilinx XSim', 'Computer Architecture', 'Digital Design'].map((chip) => (
              <span
                key={chip}
                className="rounded-md bg-[#1a1a1a] border border-[rgba(255,255,255,0.06)] px-3 py-1 font-mono text-[11px] text-[#94a3b8] font-medium"
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://github.com/AKSHAY-SV"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-[#a78bfa] px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider text-[#0a0a0a] hover:bg-[#b49dfb] transition-all"
            >
              <Github className="h-4 w-4" /> GitHub Repository
            </a>
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.15)] bg-[#181818] px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-[#202020] transition-all"
            >
              <FileText className="h-4 w-4 text-[#a78bfa]" /> Project Documentation
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="mb-8 flex flex-wrap border-b border-[rgba(255,255,255,0.06)] pb-px" id="8bit-tabs">
        {(['overview', 'architecture', 'alu', 'instructions', 'hierarchy', 'verification'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative py-4 px-6 font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === tab ? 'text-[#a78bfa]' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeDetailTabBorder"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a78bfa]"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT AREA */}
      <div className="space-y-10">

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {/* Left Col: Core Story */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Project Summary */}
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
                <h3 className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#a78bfa] mb-4">
                  // PROJECT SPECS OVERVIEW
                </h3>
                <h2 className="font-sans text-2xl font-bold text-white tracking-tight mb-4">
                  What is this project?
                </h2>
                <p className="font-sans text-sm text-[#94a3b8] leading-relaxed mb-4">
                  The **8-Bit Computer Design** is a modular, accumulator-based microcomputer implemented in synthesizable Verilog HDL, following the classical **von Neumann architecture**. Built entirely from clean, structural logic descriptions, it serves as an educational and engineering model of a functional computer.
                </p>
                <p className="font-sans text-sm text-[#94a3b8] leading-relaxed mb-4">
                  The primary objective of this project was to design and structurally verify a basic CPU datapath from scratch. Guided by an 8-bit shared tri-state bus, data moves dynamically between custom modules (such as Registers, Accumulator, ALU, RAM, and the Program Counter), scheduled precisely by a microsequenced state machine Control Unit.
                </p>
                <p className="font-sans text-sm text-[#94a3b8] leading-relaxed">
                  The complete system is functionally verified using **Xilinx Vivado XSim**, successfully compiling and running custom programs containing arithmetic calculations, register loads, outputs, and conditional jumping logic.
                </p>
              </div>

              {/* Achievements */}
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
                <h3 className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#a78bfa] mb-4">
                  // CORE ACHIEVEMENTS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Tri-State Bus Arbitration', text: 'Secured high-impedance tri-state isolation on shared bus nodes, achieving 100% hazard-free register transactions.' },
                    { title: 'Microsequenced Control Path', text: 'Engineered a 6-stage sequential timing counter (Fetch + Execute) triggering precise control lines.' },
                    { title: 'ALU Register Pairing', text: 'Implemented dual-operand arithmetic, logical, and shift operations paired with accumulator feedback.' },
                    { title: 'RTL Simulation & Signoff', text: 'Achieved complete instruction coverage verified inside Xilinx Vivado simulation environments.' }
                  ].map((ach, idx) => (
                    <div key={idx} className="p-4 rounded-lg border border-[rgba(255,255,255,0.04)] bg-[#161616] flex gap-3">
                      <div className="h-6 w-6 shrink-0 rounded bg-[#a78bfa]/10 border border-[#a78bfa]/20 flex items-center justify-center text-[#a78bfa] text-xs font-bold font-mono">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-sans text-sm font-bold text-white mb-1">{ach.title}</h4>
                        <p className="font-sans text-xs text-[#94a3b8] leading-relaxed">{ach.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engineering Challenges */}
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
                <div className="mb-6 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-[#ef4444]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    Design Challenges & Solutions
                  </span>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      prob: 'Logical bus contention and dynamic meta-stability risks when multiple registers drive high/low values onto the shared 8-bit bus concurrently.',
                      sol: 'Implemented high-impedance tri-state buffers (assign bus = output_enable ? register_data : 8\'bZ) on all modules connected to the shared interconnect. Integrated mutually-exclusive output control signals in the microsequence decoder to ensure at most one transmitter active per T-state.'
                    },
                    {
                      prob: 'Flickering ALU comparison outputs and asynchronous timing loops causing unstable conditional branching flags on LDA, ADD and SUB commands.',
                      sol: 'Isolated ALU carry and zero calculation paths by synchronizing physical flag outputs into a dedicated Flags Register. The register is latched on the positive clock edge only when the alu_flags_load control line is active, stabilizing jump calculations.'
                    }
                  ].map((chal, cIdx) => (
                    <div key={cIdx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border border-[rgba(255,255,255,0.04)] bg-[#161616]">
                      <div>
                        <span className="rounded bg-[#ef4444]/10 border border-[#ef4444]/20 px-2 py-0.5 font-mono text-[9px] uppercase font-bold text-[#ef4444]">
                          Physical obstacle
                        </span>
                        <p className="mt-2 font-sans text-xs text-[#e2e8f0] leading-relaxed">
                          {chal.prob}
                        </p>
                      </div>
                      <div>
                        <span className="rounded bg-[#10b981]/10 border border-[#10b981]/20 px-2 py-0.5 font-mono text-[9px] uppercase font-bold text-[#10b981]">
                          RTL Solution
                        </span>
                        <p className="mt-2 font-sans text-xs text-[#94a3b8] leading-relaxed">
                          {chal.sol}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col: Stats & Downloads */}
            <div className="space-y-8">
              
              {/* Stats Card */}
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
                <h3 className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#a78bfa] mb-4">
                  // HARDWARE METRICS
                </h3>
                <div className="grid grid-cols-2 gap-4 text-left font-mono">
                  {[
                    { label: 'Architecture', val: 'von Neumann' },
                    { label: 'Data Width', val: '8-Bit Word' },
                    { label: 'ISA Size', val: '16 Instructions' },
                    { label: 'Address Space', val: '4-Bit Address' },
                    { label: 'RAM Size', val: '16 Bytes' },
                    { label: 'Logic Size', val: '342 LUTs' },
                    { label: 'Simulator', val: 'Vivado XSim' },
                    { label: 'Status', val: 'Verified' }
                  ].map((stat, idx) => (
                    <div key={idx} className="border-b border-[rgba(255,255,255,0.04)] pb-2">
                      <span className="block text-[10px] text-[#94a3b8] uppercase">{stat.label}</span>
                      <span className="text-sm text-white font-bold">{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Downloads Latch */}
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
                <h3 className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#a78bfa] mb-4">
                  // DOCUMENT ARCHIVE
                </h3>
                <div className="space-y-3">
                  {[
                    { name: '8bit_Core_Schematics.pdf', size: '1.2 MB', type: 'Schematics' },
                    { name: 'RTL_Simulation_Report.pdf', size: '2.4 MB', type: 'Test Report' },
                    { name: 'Verilog_Source_v1.0.tar.gz', size: '84 KB', type: 'Code archive' }
                  ].map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded border border-[rgba(255,255,255,0.04)] bg-[#161616] text-xs">
                      <div>
                        <span className="block font-bold text-white">{file.name}</span>
                        <span className="font-mono text-[9px] text-[#94a3b8]">{file.type} • {file.size}</span>
                      </div>
                      <button className="h-8 w-8 rounded bg-[#222222] hover:bg-[#a78bfa] hover:text-[#0a0a0a] transition-all flex items-center justify-center text-slate-400">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ARCHITECTURE & BUS VISUALIZATION */}
        {activeTab === 'architecture' && (
          <div className="space-y-10">
            
            {/* System Layout Block diagram & Detail */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              
              {/* Left Column: Interactive Block Selector Grid */}
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6 lg:col-span-1">
                <h3 className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#a78bfa] mb-4">
                  // CPU MICRO-BLOCKS
                </h3>
                <p className="font-sans text-xs text-[#94a3b8] mb-6">
                  Select any CPU hardware component block below to review its inputs, outputs, and internal execution logic.
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.keys(hardwareBlocks).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedBlock(key)}
                      className={`py-3 px-4 rounded-lg font-mono text-xs font-bold uppercase transition-all text-left flex flex-col justify-between h-20 border ${
                        selectedBlock === key
                          ? 'bg-[#a78bfa]/10 border-[#a78bfa] text-[#a78bfa]'
                          : 'bg-[#181818] border-[rgba(255,255,255,0.05)] text-[#94a3b8] hover:bg-[#202020] hover:text-white'
                      }`}
                    >
                      <span className="block">{hardwareBlocks[key].name.split(' (')[0]}</span>
                      <span className="text-[9px] text-slate-500 font-normal">Details →</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Center / Right Column: Hardware Block Specs Sheet */}
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-8 lg:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.06)] pb-4 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 flex items-center justify-center text-[#a78bfa]">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-sans text-lg font-extrabold text-white">
                        {hardwareBlocks[selectedBlock].name}
                      </h4>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#a78bfa]">
                        Active Block Specifications
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <span className="block font-mono text-[10px] text-[#94a3b8] uppercase font-bold mb-1">// Block Purpose</span>
                      <p className="font-sans text-sm text-white leading-relaxed">
                        {hardwareBlocks[selectedBlock].purpose}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 rounded border border-[rgba(255,255,255,0.04)] bg-[#161616]">
                        <span className="block font-mono text-[9px] text-[#10b981] uppercase font-bold mb-1">Inputs</span>
                        <p className="font-mono text-xs text-[#94a3b8] leading-normal">
                          {hardwareBlocks[selectedBlock].inputs}
                        </p>
                      </div>
                      <div className="p-3 rounded border border-[rgba(255,255,255,0.04)] bg-[#161616]">
                        <span className="block font-mono text-[9px] text-[#f43f5e] uppercase font-bold mb-1">Outputs</span>
                        <p className="font-mono text-xs text-[#94a3b8] leading-normal">
                          {hardwareBlocks[selectedBlock].outputs}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="block font-mono text-[10px] text-[#94a3b8] uppercase font-bold mb-1">// Structural Mechanics</span>
                      <p className="font-sans text-sm text-[#94a3b8] leading-relaxed">
                        {hardwareBlocks[selectedBlock].working}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-[rgba(255,255,255,0.04)] pt-4 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>SYSTEM: ACCUMULATOR BUS MODEL</span>
                  <span className="text-[#a78bfa]">STATUS: ONLINE</span>
                </div>
              </div>

            </div>

            {/* Tri-State Shared Bus Animation Section */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
              <div className="mb-6">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block">
                  ⚡ INTERACTIVE SHARED 8-BIT TRI-STATE BUS CO-SIMULATOR
                </span>
                <p className="font-sans text-xs text-[#94a3b8] mt-1">
                  Witness how parallel data streams navigate across structural registers utilizing tri-state isolation gates.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Control Panel */}
                <div className="p-5 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#181818] space-y-5">
                  <span className="block font-mono text-[10px] uppercase font-bold text-[#a78bfa] mb-3">
                    // Arbitration Controls
                  </span>

                  {/* Presets */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-2">Simulation Presets</label>
                    <div className="space-y-1.5">
                      {busPresets.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => applyBusPreset(preset)}
                          className="w-full text-left p-2 rounded bg-[#202020] hover:bg-[#a78bfa]/10 hover:text-white font-sans text-xs text-slate-300 border border-[rgba(255,255,255,0.04)] transition-all flex justify-between items-center"
                        >
                          <span>{preset.name}</span>
                          <ChevronRight className="h-3 w-3 text-[#a78bfa]" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[rgba(255,255,255,0.04)] pt-4 space-y-4">
                    {/* Source Selector */}
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Source Transmitter</label>
                      <select
                        value={busSource}
                        onChange={(e) => setBusSource(e.target.value)}
                        className="w-full rounded bg-[#0e0e0e] border border-[rgba(255,255,255,0.1)] px-2.5 py-1.5 text-xs text-white"
                      >
                        {['PC', 'RAM', 'IR', 'ACC', 'ALU'].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    {/* Dest Selector */}
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Destination Receiver</label>
                      <select
                        value={busDest}
                        onChange={(e) => setBusDest(e.target.value)}
                        className="w-full rounded bg-[#0e0e0e] border border-[rgba(255,255,255,0.1)] px-2.5 py-1.5 text-xs text-white"
                      >
                        {['MAR', 'RAM', 'IR', 'ACC', 'REGB', 'OUT'].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    {/* Data byte input */}
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Data Word (8-bit binary)</label>
                      <input
                        type="text"
                        maxLength={8}
                        value={busData}
                        onChange={(e) => setBusData(e.target.value.replace(/[^01]/g, ''))}
                        className="w-full rounded bg-[#0e0e0e] border border-[rgba(255,255,255,0.1)] px-2.5 py-1.5 font-mono text-xs text-[#a78bfa] text-center font-bold tracking-widest"
                      />
                    </div>
                  </div>

                  <button
                    onClick={triggerBusTransfer}
                    disabled={isTransferring}
                    className="w-full rounded-md bg-[#a78bfa] py-2.5 text-[#0a0a0a] font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#b49dfb] transition-all disabled:opacity-50"
                  >
                    <Play className="h-4.5 w-4.5" /> Simulate Transfer
                  </button>

                </div>

                {/* Bus Animation Stage */}
                <div className="lg:col-span-2 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#0a0a0a] p-6 flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Schematic Animation Grid */}
                  <div className="relative h-60 w-full flex flex-col justify-between border border-[rgba(255,255,255,0.03)] bg-[#0d0d0d] rounded p-4">
                    
                    {/* Top Row: Sources */}
                    <div className="flex justify-around">
                      {['PC', 'RAM', 'IR', 'ACC', 'ALU'].map((src) => {
                        const isSelectedSrc = busSource === src;
                        return (
                          <div
                            key={src}
                            className={`px-3 py-1.5 rounded border text-[10px] font-mono font-bold uppercase transition-all duration-300 relative ${
                              isSelectedSrc
                                ? 'bg-[#a78bfa]/20 border-[#a78bfa] text-white ring-1 ring-[#a78bfa]/50'
                                : 'bg-[#141414] border-[rgba(255,255,255,0.06)] text-slate-500'
                            }`}
                          >
                            {src}
                            {isSelectedSrc && (
                              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 bg-[#a78bfa] rounded-full animate-ping" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Shared Bus Rail */}
                    <div className="relative h-12 flex items-center justify-center border-t-2 border-b-2 border-dashed border-[#a78bfa]/40 bg-[#121118]/50">
                      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#a78bfa] font-black z-10">
                        SHARED 8-BIT TRI-STATE BUS RAIL [Z-STATE]
                      </span>

                      {/* Moving bits animation */}
                      {isTransferring && (
                        <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden flex items-center">
                          <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.2, ease: 'easeInOut' }}
                            className="h-1 bg-gradient-to-r from-transparent via-[#a78bfa] to-transparent w-full flex justify-around items-center absolute"
                          >
                            {busData.split('').map((bit, bitIdx) => (
                              <span key={bitIdx} className="font-mono text-[10px] font-bold text-white bg-black/80 border border-[#a78bfa] px-1 rounded shadow-lg shadow-[#a78bfa]/50">
                                {bit}
                              </span>
                            ))}
                          </motion.div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Row: Destinations */}
                    <div className="flex justify-around">
                      {['MAR', 'RAM', 'IR', 'ACC', 'REGB', 'OUT'].map((dst) => {
                        const isSelectedDst = busDest === dst;
                        return (
                          <div
                            key={dst}
                            className={`px-3 py-1.5 rounded border text-[10px] font-mono font-bold uppercase transition-all duration-300 relative ${
                              isSelectedDst
                                ? 'bg-[#10b981]/20 border-[#10b981] text-white ring-1 ring-[#10b981]/50'
                                : 'bg-[#141414] border-[rgba(255,255,255,0.06)] text-slate-500'
                            }`}
                          >
                            {dst}
                            {isSelectedDst && (
                              <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 bg-[#10b981] rounded-full animate-ping" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* Status update box */}
                  <div className="mt-4 p-4 rounded bg-[#121212] border border-[rgba(255,255,255,0.05)] font-mono text-[11px] leading-relaxed">
                    <span className="block text-[9px] text-[#a78bfa] font-black uppercase tracking-widest mb-1">
                      // CO-SIMULATOR LOGS
                    </span>
                    <p className="text-[#94a3b8]">{transferLog}</p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ALU & COMPUTATION */}
        {activeTab === 'alu' && (
          <div className="space-y-10">
            
            {/* Explanatory intro */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
              <h3 className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#a78bfa] mb-3">
                // ARITHMETIC LOGIC UNIT
              </h3>
              <h2 className="font-sans text-2xl font-bold text-white tracking-tight mb-2">
                ALU Specifications
              </h2>
              <p className="font-sans text-sm text-[#94a3b8] leading-relaxed">
                The Arithmetic Logic Unit (ALU) is the core calculation engine of the processor. It operates combinational logic on the 8-bit contents of Register A (Accumulator) and Register B, selecting operations based on active control pins and feeding the latch state flags (Carry, Zero, Negative).
              </p>
            </div>

            {/* ALU Interactive Binary Calculator */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
              <div className="mb-6">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block">
                  ⚡ 8-BIT ALU BINARY LOGIC EXPLORER
                </span>
                <p className="font-sans text-xs text-[#94a3b8] mt-1">
                  Configure Register inputs bit-by-bit or manipulate parameters below. See immediate binary updates and flags calculations.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Inputs area */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Register A */}
                  <div className="p-4 rounded-lg border border-[rgba(255,255,255,0.04)] bg-[#161616]">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-mono text-xs font-bold text-white uppercase">Register A (Acc)</span>
                      <span className="font-mono text-xs text-[#a78bfa] font-bold">dec: {regA}</span>
                    </div>
                    {/* Bit buttons */}
                    <div className="flex justify-between gap-1 mb-3">
                      {decToBin(regA).split('').map((bit, idx) => (
                        <button
                          key={idx}
                          onClick={() => setRegA(toggleBit(regA, idx))}
                          className={`flex-1 h-7 rounded font-mono text-[10px] font-bold transition-all ${
                            bit === '1'
                              ? 'bg-[#a78bfa] text-black font-black'
                              : 'bg-[#222] text-slate-500 border border-[rgba(255,255,255,0.04)]'
                          }`}
                        >
                          {bit}
                        </button>
                      ))}
                    </div>
                    {/* Slider input */}
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={regA}
                      onChange={(e) => setRegA(parseInt(e.target.value))}
                      className="w-full accent-[#a78bfa]"
                    />
                  </div>

                  {/* Register B */}
                  <div className="p-4 rounded-lg border border-[rgba(255,255,255,0.04)] bg-[#161616]">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-mono text-xs font-bold text-white uppercase">Register B (Operand)</span>
                      <span className="font-mono text-xs text-[#a78bfa] font-bold">dec: {regB}</span>
                    </div>
                    {/* Bit buttons */}
                    <div className="flex justify-between gap-1 mb-3">
                      {decToBin(regB).split('').map((bit, idx) => (
                        <button
                          key={idx}
                          onClick={() => setRegB(toggleBit(regB, idx))}
                          className={`flex-1 h-7 rounded font-mono text-[10px] font-bold transition-all ${
                            bit === '1'
                              ? 'bg-[#a78bfa] text-black font-black'
                              : 'bg-[#222] text-slate-500 border border-[rgba(255,255,255,0.04)]'
                          }`}
                        >
                          {bit}
                        </button>
                      ))}
                    </div>
                    {/* Slider input */}
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={regB}
                      onChange={(e) => setRegB(parseInt(e.target.value))}
                      className="w-full accent-[#a78bfa]"
                    />
                  </div>

                </div>

                {/* Selector Operations */}
                <div className="lg:col-span-3 p-4 rounded-lg border border-[rgba(255,255,255,0.04)] bg-[#161616] space-y-2">
                  <span className="block font-mono text-[10px] text-slate-400 uppercase mb-2 font-bold">
                    SELECT OPERATION
                  </span>
                  {[
                    { op: 'ADD', desc: 'Arithmetic ADD (A + B)' },
                    { op: 'SUB', desc: 'Arithmetic SUB (A - B)' },
                    { op: 'AND', desc: 'Bitwise Logical AND' },
                    { op: 'OR',  desc: 'Bitwise Logical OR' },
                    { op: 'XOR', desc: 'Bitwise Logical XOR' },
                    { op: 'SHL', desc: 'Acc Bitshift Left (A << 1)' },
                    { op: 'SHR', desc: 'Acc Bitshift Right (A >> 1)' },
                    { op: 'NOT', desc: 'Invert Acc (NOT A)' }
                  ].map((item) => (
                    <button
                      key={item.op}
                      onClick={() => setAluOp(item.op as any)}
                      className={`w-full text-left p-2 rounded text-xs font-mono transition-all flex justify-between items-center ${
                        aluOp === item.op
                          ? 'bg-[#a78bfa] text-black font-extrabold'
                          : 'bg-[#222] text-[#94a3b8] hover:bg-[#2e2e2e] hover:text-white'
                      }`}
                    >
                      <span>{item.op}</span>
                      <span className="text-[9px] opacity-80">{item.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Results Screen Display */}
                <div className="lg:col-span-5 p-6 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0a0a0a] space-y-6 flex flex-col justify-between h-full min-h-[300px]">
                  
                  {/* Result Header */}
                  <div>
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block mb-2">
                      // COMPUTED OUTPUT BINARY REGISTER
                    </span>
                    
                    {/* Giant Output Bits */}
                    <div className="flex justify-between gap-1.5 mb-4">
                      {aluOutput.binary.split('').map((bit, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 text-center py-2.5 rounded font-mono text-lg font-black ${
                            bit === '1'
                              ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                              : 'bg-[#1e1e1e] text-slate-600 border border-[rgba(255,255,255,0.02)]'
                          }`}
                        >
                          {bit}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between text-sm font-mono border-b border-[rgba(255,255,255,0.04)] pb-3">
                      <span className="text-[#94a3b8]">Result (Decimal):</span>
                      <span className="text-white font-extrabold text-base">{aluOutput.result}</span>
                    </div>
                  </div>

                  {/* Flags register */}
                  <div>
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block mb-2">
                      // PERSISTENT CPU STATUS FLAGS
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Carry (C)', active: aluOutput.flags.carry, desc: 'Overflow/Underflow' },
                        { label: 'Zero (Z)', active: aluOutput.flags.zero, desc: 'Result is 0x00' },
                        { label: 'Negative (N)', active: aluOutput.flags.negative, desc: 'Sign bit active' }
                      ].map((flag, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-md border text-center font-mono ${
                            flag.active
                              ? 'bg-[#a78bfa]/10 border-[#a78bfa] text-[#a78bfa]'
                              : 'bg-[#161616] border-[rgba(255,255,255,0.04)] text-slate-600'
                          }`}
                        >
                          <span className="block text-xs font-black">{flag.label}</span>
                          <span className="text-[9px] block text-slate-400 mt-1">{flag.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 text-center leading-normal">
                    ALU arithmetic and flag vectors computed natively in real-time.
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 4: INSTRUCTION SET & CONTROL UNIT */}
        {activeTab === 'instructions' && (
          <div className="space-y-10">
            
            {/* Instruction explorer */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
              <h3 className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#a78bfa] mb-3">
                // INSTRUCTION SET ARCHITECTURE (ISA)
              </h3>
              <h2 className="font-sans text-2xl font-bold text-white tracking-tight mb-2">
                Custom 16-Instruction ISA Explorer
              </h2>
              <p className="font-sans text-sm text-[#94a3b8] mb-6">
                Click any core instruction to review its corresponding 4-bit binary opcode, operation mathematical format, and execution cycle state pathways.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Selector table */}
                <div className="lg:col-span-7 border border-[rgba(255,255,255,0.06)] rounded-lg overflow-hidden max-h-[420px] overflow-y-auto">
                  <table className="w-full text-left font-sans text-xs">
                    <thead className="bg-[#181818] font-mono uppercase text-[#a78bfa] text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
                      <tr>
                        <th className="p-3">Instruction</th>
                        <th className="p-3">Opcode</th>
                        <th className="p-3">Operation</th>
                        <th className="p-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.04)] bg-[#101010]">
                      {instructionsList.map((inst, idx) => (
                        <tr
                          key={inst.op}
                          onClick={() => setSelectedInstrIdx(idx)}
                          className={`cursor-pointer transition-colors ${
                            selectedInstrIdx === idx
                              ? 'bg-[#a78bfa]/10 text-white'
                              : 'hover:bg-[#181818] text-[#94a3b8]'
                          }`}
                        >
                          <td className="p-3 font-bold font-mono text-white">{inst.op}</td>
                          <td className="p-3 font-mono">{inst.opcode}</td>
                          <td className="p-3 font-mono text-slate-300">{inst.operation}</td>
                          <td className="p-3 truncate max-w-xs">{inst.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Details sidecard */}
                <div className="lg:col-span-5 p-6 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0a0a0a] flex flex-col justify-between min-h-[300px]">
                  <div>
                    <div className="flex items-center gap-2 mb-4 border-b border-[rgba(255,255,255,0.05)] pb-3">
                      <span className="font-mono text-2xl font-black text-[#a78bfa]">{instructionsList[selectedInstrIdx].op}</span>
                      <span className="font-mono text-xs bg-[#1a1a1a] px-2 py-0.5 rounded border border-[rgba(255,255,255,0.05)] text-[#10b981]">OPCODE: {instructionsList[selectedInstrIdx].opcode}</span>
                    </div>

                    <div className="space-y-4 font-sans text-xs">
                      <div>
                        <span className="block font-mono text-[9px] text-[#94a3b8] uppercase font-bold mb-1">RTL Abstract Expression</span>
                        <code className="block p-2 rounded bg-[#161616] font-mono text-xs text-white">{instructionsList[selectedInstrIdx].operation}</code>
                      </div>
                      <div>
                        <span className="block font-mono text-[9px] text-[#94a3b8] uppercase font-bold mb-1">Functional Description</span>
                        <p className="text-slate-300 leading-relaxed text-sm">{instructionsList[selectedInstrIdx].desc}</p>
                      </div>
                      <div>
                        <span className="block font-mono text-[9px] text-[#94a3b8] uppercase font-bold mb-1">Example Walkthrough</span>
                        <p className="text-[#a78bfa] leading-relaxed italic">{instructionsList[selectedInstrIdx].ex}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[rgba(255,255,255,0.04)] pt-4 text-center">
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                      1 of 16 custom instruction sets verified.
                    </span>
                  </div>

                </div>

              </div>

            </div>

            {/* Control Unit sequences section */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block">
                    ⚡ MICRO-SEQUENCED CONTROL PATH EXPLAINER
                  </span>
                  <p className="font-sans text-xs text-[#94a3b8] mt-1">
                    Trace how instructions execute state-by-state over 6 timed micro-states (T-States).
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <label className="font-mono text-xs text-slate-400">Target Instruction:</label>
                  <select
                    value={selectedCuInstruction}
                    onChange={(e) => {
                      setSelectedCuInstruction(e.target.value as any);
                      setCurrentTState(1);
                    }}
                    className="rounded bg-[#181818] border border-[rgba(255,255,255,0.1)] px-2.5 py-1.5 text-xs text-white"
                  >
                    {['LDA', 'ADD', 'SUB', 'OUT'].map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                
                {/* Left Column: T-State Stepper */}
                <div className="p-4 rounded-lg border border-[rgba(255,255,255,0.04)] bg-[#181818] space-y-4">
                  <span className="block font-mono text-[10px] text-[#a78bfa] uppercase font-bold">
                    // T-STATE GENERATOR
                  </span>

                  <div className="space-y-1.5">
                    {[1, 2, 3, 4, 5, 6].map((t) => (
                      <button
                        key={t}
                        onClick={() => setCurrentTState(t)}
                        className={`w-full p-2.5 rounded text-left font-mono text-xs flex justify-between items-center transition-all ${
                          currentTState === t
                            ? 'bg-[#a78bfa] text-black font-extrabold'
                            : 'bg-[#202020] text-slate-400 border border-[rgba(255,255,255,0.02)]'
                        }`}
                      >
                        <span>T-State T{t}</span>
                        <span className="text-[9px] opacity-85">
                          {t <= 3 ? 'Fetch Phase' : 'Execute Phase'}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsCuPlaying(!isCuPlaying)}
                      className={`flex-1 rounded py-2 font-mono text-xs uppercase font-bold flex items-center justify-center gap-1.5 ${
                        isCuPlaying
                          ? 'bg-red-500/10 border border-red-500/30 text-red-500'
                          : 'bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]'
                      }`}
                    >
                      <RotateCw className={`h-3 w-3 ${isCuPlaying ? 'animate-spin' : ''}`} />
                      {isCuPlaying ? 'Stop' : 'Auto Play'}
                    </button>
                  </div>

                </div>

                {/* Right / Center Columns: Schematic Signal Flow Map */}
                <div className="lg:col-span-3 p-6 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#0a0a0a] flex flex-col justify-between min-h-[300px]">
                  
                  <div>
                    <div className="flex justify-between items-center mb-4 border-b border-[rgba(255,255,255,0.04)] pb-2">
                      <span className="font-mono text-xs font-bold text-[#a78bfa]">STAGE: T{currentTState} MICROOPERATION</span>
                      <span className="font-mono text-[10px] text-slate-500">CYCLE STATE</span>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <span className="block font-mono text-[9px] text-[#94a3b8] uppercase font-semibold mb-1">Active Blocks</span>
                        <div className="flex flex-wrap gap-1.5">
                          {currentTStateSignals.active.map(b => (
                            <span key={b} className="rounded bg-[#a78bfa]/10 border border-[#a78bfa]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#a78bfa] uppercase">
                              {b}
                            </span>
                          ))}
                          {currentTStateSignals.active.length === 0 && <span className="text-slate-500 font-mono text-xs">No active transfers</span>}
                        </div>
                      </div>

                      <div>
                        <span className="block font-mono text-[9px] text-[#94a3b8] uppercase font-semibold mb-1">Asserted Control Lines</span>
                        <div className="flex flex-wrap gap-1.5">
                          {currentTStateSignals.signals.map(sig => (
                            <span key={sig} className="rounded bg-[#10b981]/10 border border-[#10b981]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#10b981]">
                              {sig}
                            </span>
                          ))}
                          {currentTStateSignals.signals.length === 0 && <span className="text-slate-500 font-mono text-xs">None (Idle)</span>}
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="block font-mono text-[9px] text-[#94a3b8] uppercase font-semibold mb-1">Step Mechanics</span>
                        <p className="font-sans text-xs text-white leading-relaxed">
                          {currentTStateSignals.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-[rgba(255,255,255,0.04)] pt-3 text-[10px] font-mono text-slate-500 text-center leading-normal">
                    Microsequences model hardware execution cycles step-by-step.
                  </div>

                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 5: MODULE HIERARCHY & CODE */}
        {activeTab === 'hierarchy' && (
          <div className="space-y-10">
            
            {/* Hierarchy grid */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
              <h3 className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#a78bfa] mb-4">
                // MODULE HIERARCHY MAP
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moduleHierarchy.map((mod, idx) => (
                  <div key={idx} className="p-5 rounded-lg border border-[rgba(255,255,255,0.04)] bg-[#161616] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="font-mono text-sm font-bold text-white flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-[#a78bfa]" /> {mod.name}
                        </span>
                        <span className="rounded bg-[#1a1a1a] px-2 py-0.5 font-mono text-[9px] uppercase border border-[rgba(255,255,255,0.05)] text-[#a78bfa]">
                          {mod.type}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-[#94a3b8] leading-relaxed mb-4">
                        {mod.purpose}
                      </p>
                      <div className="space-y-2 text-[11px] font-sans">
                        <div>
                          <strong className="text-slate-300 block font-mono text-[9px] uppercase">Internal Blocks</strong>
                          <span className="text-slate-400 leading-normal">{mod.internalBlocks}</span>
                        </div>
                        <div className="mt-2">
                          <strong className="text-slate-300 block font-mono text-[9px] uppercase">Responsibilities</strong>
                          <span className="text-slate-400 leading-normal">{mod.responsibilities}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Synthesizable Verilog Snippets Showcase */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Code className="h-4.5 w-4.5 text-[#a78bfa]" /> Synthesizable Hardware Codebase Snippets
                </span>
                <span className="font-sans text-xs text-[#94a3b8]">
                  Fully compliant synthesizable Verilog modules
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* File selectors */}
                <div className="lg:col-span-3 space-y-1.5">
                  {codeFiles.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedFileIndex(idx)}
                      className={`w-full p-2.5 rounded text-left font-mono text-xs transition-all flex items-center gap-2 border ${
                        selectedFileIndex === idx
                          ? 'bg-[#a78bfa]/10 border-[#a78bfa] text-[#a78bfa] font-bold'
                          : 'bg-[#181818] border-[rgba(255,255,255,0.04)] text-slate-400 hover:bg-[#202020]'
                      }`}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      {file.name}
                    </button>
                  ))}
                </div>

                {/* Code Window */}
                <div className="lg:col-span-9 rounded border border-[rgba(255,255,255,0.06)] bg-[#0c0c0c] overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between bg-[#161616] px-4 py-2 border-b border-[rgba(255,255,255,0.06)]">
                    <span className="font-mono text-xs text-white font-bold">{codeFiles[selectedFileIndex].name}</span>
                    <button
                      onClick={() => handleCopyCode(codeFiles[selectedFileIndex].code)}
                      className="flex items-center gap-1.5 rounded bg-[#242424] px-2.5 py-1 font-mono text-[10px] text-[#94a3b8] hover:bg-[#303030] hover:text-white transition-all active:scale-95"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="h-3 w-3 text-[#10b981]" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy RTL
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 overflow-x-auto font-mono text-xs text-[#a78bfa]/95 leading-relaxed bg-[#0a0a0a] max-h-96">
                    <code>{codeFiles[selectedFileIndex].code}</code>
                  </pre>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 6: VERIFICATION & WAVEFORMS */}
        {activeTab === 'verification' && (
          <div className="space-y-10">
            
            {/* Intro spec */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
              <h3 className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#a78bfa] mb-3">
                // SYSTEM SIMULATION & VERIFICATION
              </h3>
              <h2 className="font-sans text-2xl font-bold text-white tracking-tight mb-2">
                Verification Strategy
              </h2>
              <p className="font-sans text-sm text-[#94a3b8] leading-relaxed">
                The 8-bit computer implementation is verified extensively using **Xilinx Vivado XSim**. A custom testbench drives execution cycles, loading instructions directly into RAM and simulating the entire datapath over nanosecond-accurate clock regimes, tracking bus contents and register transitions.
              </p>
            </div>

            {/* Simulated Waveforms Gallery */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#121212] p-6">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] block mb-4">
                ⚡ SYSTEM TIMING WAVEFORM ARCHIVE [VIVADO SIMULATOR]
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Fetch Sequence Waveforms',
                    desc: 'Waveform traces illustrating T1-T3 Fetch stages. Shows pc_oe driving the Shared Bus and ir_load capturing the instruction on clock edge.',
                    svg: (
                      <svg className="w-full h-40 bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded p-3" viewBox="0 0 300 120">
                        <text x="10" y="20" fill="#a78bfa" fontSize="8" fontFamily="monospace">clk</text>
                        <path d="M 50 20 L 75 20 L 75 10 L 100 10 L 100 20 L 125 20 L 125 10 L 150 10 L 150 20 L 175 20 L 175 10 L 200 10 L 200 20" fill="none" stroke="#64748b" strokeWidth="1" />
                        
                        <text x="10" y="45" fill="#a78bfa" fontSize="8" fontFamily="monospace">pc_oe</text>
                        <path d="M 50 45 L 75 45 L 75 35 L 125 35 L 125 45 L 200 45" fill="none" stroke="#10b981" strokeWidth="1" />

                        <text x="10" y="70" fill="#a78bfa" fontSize="8" fontFamily="monospace">bus_val</text>
                        <rect x="75" y="62" width="50" height="10" fill="#a78bfa]/10" stroke="#a78bfa" strokeWidth="1" />
                        <text x="100" y="70" fill="white" fontSize="6" fontFamily="monospace" textAnchor="middle">0x04</text>

                        <text x="10" y="95" fill="#a78bfa" fontSize="8" fontFamily="monospace">ir_load</text>
                        <path d="M 50 95 L 125 95 L 125 85 L 150 85 L 150 95 L 200 95" fill="none" stroke="#ef4444" strokeWidth="1" />
                      </svg>
                    )
                  },
                  {
                    title: 'ADD Latch & Update Waveforms',
                    desc: 'Details Register B loading from RAM and subsequent ALU output driving accumulator writeback on T6 cycle positive clock trigger.',
                    svg: (
                      <svg className="w-full h-40 bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded p-3" viewBox="0 0 300 120">
                        <text x="10" y="20" fill="#a78bfa" fontSize="8" fontFamily="monospace">clk</text>
                        <path d="M 50 20 L 100 20 L 100 10 L 150 10 L 150 20 L 200 20" fill="none" stroke="#64748b" strokeWidth="1" />
                        
                        <text x="10" y="45" fill="#a78bfa" fontSize="8" fontFamily="monospace">alu_oe</text>
                        <path d="M 50 45 L 100 45 L 100 35 L 150 35 L 150 45 L 200 45" fill="none" stroke="#10b981" strokeWidth="1" />

                        <text x="10" y="70" fill="#a78bfa" fontSize="8" fontFamily="monospace">acc_load</text>
                        <path d="M 50 90 L 100 90 L 100 80 L 150 80 L 150 90 L 200 90" fill="none" stroke="#ef4444" strokeWidth="1" />

                        <text x="10" y="95" fill="#a78bfa" fontSize="8" fontFamily="monospace">bus_data</text>
                        <rect x="100" y="87" width="50" height="10" fill="#10b981]/10" stroke="#10b981" strokeWidth="1" />
                        <text x="125" y="95" fill="white" fontSize="6" fontFamily="monospace" textAnchor="middle">0x37</text>
                      </svg>
                    )
                  },
                  {
                    title: 'Conditional Branch Waveforms',
                    desc: 'Waveform capturing the carry/zero status evaluations, enabling instant program counter overrides during JZ / JC jumps.',
                    svg: (
                      <svg className="w-full h-40 bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded p-3" viewBox="0 0 300 120">
                        <text x="10" y="20" fill="#a78bfa" fontSize="8" fontFamily="monospace">clk</text>
                        <path d="M 50 20 L 100 20 L 100 10 L 150 10 L 150 20" fill="none" stroke="#64748b" strokeWidth="1" />
                        
                        <text x="10" y="45" fill="#a78bfa" fontSize="8" fontFamily="monospace">zero_flag</text>
                        <path d="M 50 45 L 100 45 L 100 35 L 200 35" fill="none" stroke="#10b981" strokeWidth="1" />

                        <text x="10" y="70" fill="#a78bfa" fontSize="8" fontFamily="monospace">pc_load</text>
                        <path d="M 50 90 L 100 90 L 100 80 L 150 80 L 150 90" fill="none" stroke="#ef4444" strokeWidth="1" />

                        <text x="10" y="95" fill="#a78bfa" fontSize="8" fontFamily="monospace">pc_val</text>
                        <rect x="100" y="87" width="50" height="10" fill="#a78bfa]/10" stroke="#a78bfa" strokeWidth="1" />
                        <text x="125" y="95" fill="white" fontSize="6" fontFamily="monospace" textAnchor="middle">0x0A</text>
                      </svg>
                    )
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-[rgba(255,255,255,0.04)] bg-[#161616] flex flex-col justify-between">
                    <div>
                      <div className="mb-3">
                        {item.svg}
                      </div>
                      <h4 className="font-sans text-sm font-bold text-white mb-1.5">{item.title}</h4>
                      <p className="font-sans text-xs text-[#94a3b8] leading-relaxed mb-4">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        setLightboxImage('Timing Diagram');
                        setLightboxCaption(item.desc);
                      }}
                      className="mt-2 w-full py-1.5 rounded bg-[#202020] hover:bg-[#a78bfa] hover:text-black transition-all text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 uppercase"
                    >
                      <ZoomIn className="h-3 w-3" /> Fullscreen Zoom
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* LIGHTBOX POPUP MODAL */}
      <AnimatePresence>
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setLightboxImage(null)}
          >
            <div className="relative max-w-4xl max-h-[80vh] overflow-hidden rounded-lg border border-[rgba(255,255,255,0.15)] bg-[#0d0d0d] p-6 flex items-center justify-center">
              {/* Vector representation inside lightbox */}
              <div className="scale-125 p-8">
                <svg className="w-96 h-48 bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded p-4 mx-auto" viewBox="0 0 300 120">
                  <text x="10" y="20" fill="#a78bfa" fontSize="8" fontFamily="monospace">clk</text>
                  <path d="M 50 20 L 75 20 L 75 10 L 100 10 L 100 20 L 125 20 L 125 10 L 150 10 L 150 20 L 175 20 L 175 10 L 200 10 L 200 20" fill="none" stroke="#64748b" strokeWidth="1" />
                  
                  <text x="10" y="45" fill="#a78bfa" fontSize="8" fontFamily="monospace">pc_oe</text>
                  <path d="M 50 45 L 75 45 L 75 35 L 125 35 L 125 45 L 200 45" fill="none" stroke="#10b981" strokeWidth="1" />

                  <text x="10" y="70" fill="#a78bfa" fontSize="8" fontFamily="monospace">bus_val</text>
                  <rect x="75" y="62" width="50" height="10" fill="#a78bfa]/10" stroke="#a78bfa" strokeWidth="1" />
                  <text x="100" y="70" fill="white" fontSize="6" fontFamily="monospace" textAnchor="middle">0x04</text>

                  <text x="10" y="95" fill="#a78bfa" fontSize="8" fontFamily="monospace">ir_load</text>
                  <path d="M 50 95 L 125 95 L 125 85 L 150 85 L 150 95 L 200 95" fill="none" stroke="#ef4444" strokeWidth="1" />
                </svg>
              </div>

              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                Close (ESC)
              </button>
            </div>
            
            <div className="mt-4 max-w-xl text-center text-xs font-mono text-slate-400 p-4">
              {lightboxCaption}
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
