import React, { useState } from 'react';
import { RefreshCw, Search, CheckCircle, XCircle, Info, Database } from 'lucide-react';

interface CacheLine {
  index: number;
  tag: string;
  valid: boolean;
  mesi: 'M' | 'E' | 'S' | 'I';
  data: string;
}

export default function SimCache() {
  const [addressInput, setAddressInput] = useState<string>('0x1F4C');
  const [tag, setTag] = useState<string>('0x0F');
  const [index, setIndex] = useState<number>(10);
  const [offset, setOffset] = useState<number>(12);
  const [status, setStatus] = useState<'IDLE' | 'HIT' | 'MISS'>('IDLE');
  
  // Hit counter
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [totalHits, setTotalHits] = useState<number>(0);
  const [hitRate, setHitRate] = useState<number>(0);

  // Initial Cache Lines index 0 to 15
  const [cacheLines, setCacheLines] = useState<CacheLine[]>([
    { index: 0, tag: '0x0A', valid: true, mesi: 'S', data: '0xFA32_0012_BD88_1100' },
    { index: 1, tag: '0x1F', valid: false, mesi: 'I', data: '0x0000_0000_0000_0000' },
    { index: 2, tag: '0x02', valid: true, mesi: 'M', data: '0x9924_CBAF_0010_1234' },
    { index: 3, tag: '0x0F', valid: true, mesi: 'E', data: '0x1240_8844_FF22_AB33' },
    { index: 4, tag: '0x1C', valid: true, mesi: 'S', data: '0x77C2_29F1_BA98_1122' },
    { index: 5, tag: '0x0B', valid: false, mesi: 'I', data: '0x0000_0000_0000_0000' },
    { index: 6, tag: '0x10', valid: true, mesi: 'E', data: '0x32AB_DE84_0911_88EE' },
    { index: 7, tag: '0x0E', valid: true, mesi: 'S', data: '0xFA39_BE4C_F544_9901' },
    { index: 8, tag: '0x0C', valid: true, mesi: 'M', data: '0x88EE_DD00_1122_3344' },
    { index: 9, tag: '0x15', valid: true, mesi: 'S', data: '0xBCDE_4499_22AA_BBFF' },
    { index: 10, tag: '0x1F', valid: true, mesi: 'E', data: '0x1111_2222_3333_4444' }, // Target address index 10 tag 1F
    { index: 11, tag: '0x08', valid: false, mesi: 'I', data: '0x0000_0000_0000_0000' },
    { index: 12, tag: '0x1C', valid: true, mesi: 'M', data: '0x4422_1199_77EE_88AA' },
    { index: 13, tag: '0x0A', valid: true, mesi: 'S', data: '0x9090_ABAB_DCDC_FEFE' },
    { index: 14, tag: '0x1B', valid: true, mesi: 'E', data: '0x7777_6666_5555_4444' },
    { index: 15, tag: '0x04', valid: true, mesi: 'S', data: '0x2222_1111_0000_9999' }
  ]);

  const [activeMessage, setActiveMessage] = useState<string>('Ready to query cache controller...');

  const presetAddresses = ['0x1F4C', '0x1F40', '0x0210', '0x0F18', '0x1290'];

  const handleQuery = (addr: string) => {
    // Basic decode emulation
    // Standard address input format "0x1F4C" -> decode tag and index
    const cleanAddr = addr.trim().replace('0x', '');
    const num = parseInt(cleanAddr, 16);
    
    if (isNaN(num)) {
      setActiveMessage('Invalid hexadecimal address formatting!');
      return;
    }

    // Mathematical decoding logic mapping
    const decodedTag = `0x${((num >> 8) & 0xFF).toString(16).toUpperCase()}`;
    const decodedIndex = (num >> 4) & 0x0F; // Maps to index 0 - 15
    const decodedOffset = num & 0x0F;

    setTag(decodedTag);
    setIndex(decodedIndex);
    setOffset(decodedOffset);

    // Evaluate matching tag in our cache array at index
    const line = cacheLines[decodedIndex];
    const isHit = line.valid && line.tag === decodedTag && line.mesi !== 'I';

    setTotalRequests(prev => prev + 1);
    
    if (isHit) {
      setStatus('HIT');
      setTotalHits(prev => prev + 1);
      setActiveMessage(`CACHE HIT! Data resolved successfully inside cache line index [${decodedIndex}]. Coherency state: ${line.mesi}.`);
    } else {
      setStatus('MISS');
      setActiveMessage(`CACHE MISS! Tag [${decodedTag}] does not match line tag [${line.tag}]. Allocating line...`);
      
      // Allocating cacheline on miss emulation
      setTimeout(() => {
        const updatedCache = [...cacheLines];
        updatedCache[decodedIndex] = {
          index: decodedIndex,
          tag: decodedTag,
          valid: true,
          mesi: 'E',
          data: `0x77DF_9901_${Math.floor(Math.random() * 9000 + 1000)}_AC8F`
        };
        setCacheLines(updatedCache);
        setActiveMessage(`Cache line [${decodedIndex}] allocated. Memory block uploaded to cache fabric.`);
      }, 1500);
    }
  };

  // Live Hit Rate % calculation
  const calculatedRate = totalRequests > 0 ? Math.round((totalHits / totalRequests) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Simulation Controls Dashboard */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-5">
        <div>
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#a78bfa]">
            SRAM Memory Coherency Visualizer
          </span>
          <h2 className="text-xl font-bold font-sans text-white">
            4-Way MESI Cache Controller Simulator
          </h2>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-slate-500 uppercase">Presets:</span>
          {presetAddresses.map(p => (
            <button
              key={p}
              onClick={() => {
                setAddressInput(p);
                handleQuery(p);
              }}
              className="rounded bg-[#181818] px-2 py-1 font-mono text-[10px] text-white hover:text-[#a78bfa] border border-[rgba(255,255,255,0.06)]"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Address Decoder Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Step 1: Input Hex Block */}
        <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-4 flex flex-col justify-between">
          <div>
            <span className="block font-mono text-[9px] uppercase font-bold text-[#a78bfa] mb-2">
              01 CPU ADDR BUS REQUEST
            </span>
            <div className="relative">
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="e.g. 0x1F4C"
                className="w-full rounded bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#a78bfa]/60"
              />
            </div>
          </div>
          <button
            onClick={() => handleQuery(addressInput)}
            className="w-full mt-4 flex items-center justify-center gap-1.5 rounded bg-[#a78bfa] py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#0a0a0a] hover:bg-[#bca5ff] active:scale-95 transition-all"
          >
            <Search className="h-4 w-4" /> Trace Cache Request
          </button>
        </div>

        {/* Step 2: Decoded Tag */}
        <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-4">
          <span className="block font-mono text-[9px] uppercase font-bold text-[#94a3b8] mb-2">
            02 DECODED TAG (MSB)
          </span>
          <div className="rounded bg-[#0c0c0c] p-3 text-center font-mono text-lg font-bold text-[#a78bfa] border border-[rgba(255,255,255,0.04)]">
            {tag}
          </div>
          <p className="mt-2 text-[10px] font-sans text-[#64748b]">
            Identifies target memory block boundary inside memory tree.
          </p>
        </div>

        {/* Step 3: Decoded Index */}
        <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-4">
          <span className="block font-mono text-[9px] uppercase font-bold text-[#94a3b8] mb-2">
            03 DECODED INDEX
          </span>
          <div className="rounded bg-[#0c0c0c] p-3 text-center font-mono text-lg font-bold text-white border border-[rgba(255,255,255,0.04)]">
            {index}
          </div>
          <p className="mt-2 text-[10px] font-sans text-[#64748b]">
            Selects index row entry in cache SRAM (0 to 15).
          </p>
        </div>

        {/* Step 4: Decoded Offset */}
        <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-4">
          <span className="block font-mono text-[9px] uppercase font-bold text-[#94a3b8] mb-2">
            04 LINE BYTE OFFSET
          </span>
          <div className="rounded bg-[#0c0c0c] p-3 text-center font-mono text-lg font-bold text-white border border-[rgba(255,255,255,0.04)]">
            +{offset} bytes
          </div>
          <p className="mt-2 text-[10px] font-sans text-[#64748b]">
            Identifies word starting alignment inside target cacheline block.
          </p>
        </div>

      </div>

      {/* Visual State & Cache Table */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Side: Cache Table Inspector Grid */}
        <div className="lg:col-span-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-5">
          <span className="block font-mono text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] mb-4">
            📚 CACHE SRAM TAG & LINE DATA REGISTRY
          </span>
          <div className="border border-[rgba(255,255,255,0.06)] rounded overflow-hidden max-h-[300px] overflow-y-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#181818] text-[#94a3b8] border-b border-[rgba(255,255,255,0.06)]">
                <tr>
                  <th className="p-2 text-center w-12">Row</th>
                  <th className="p-2">Tag block</th>
                  <th className="p-2 text-center w-12">MESI</th>
                  <th className="p-2">Line Data Payload</th>
                  <th className="p-2 text-center w-14">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-slate-300">
                {cacheLines.map((line) => {
                  const isCurrentTarget = line.index === index;
                  return (
                    <tr
                      key={line.index}
                      className={`transition-colors duration-200 ${
                        isCurrentTarget ? 'bg-[#a78bfa]/10 font-bold text-white' : 'hover:bg-[#1a1a1a]'
                      }`}
                    >
                      <td className="p-2 text-center border-r border-[rgba(255,255,255,0.04)] text-slate-500">
                        {line.index.toString().padStart(2, '0')}
                      </td>
                      <td className="p-2 font-bold text-[#a78bfa]">
                        {line.tag}
                      </td>
                      <td className="p-2 text-center">
                        <span className={`px-1.5 rounded text-[10px] font-bold ${
                          line.mesi === 'M' ? 'bg-[#ef4444]/10 text-[#ef4444]' :
                          line.mesi === 'E' ? 'bg-[#a78bfa]/10 text-[#a78bfa]' :
                          line.mesi === 'S' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-neutral-800 text-neutral-500'
                        }`}>
                          {line.mesi}
                        </span>
                      </td>
                      <td className="p-2 text-xs text-slate-400 font-mono">
                        {line.data}
                      </td>
                      <td className="p-2 text-center">
                        <span className={`text-[10px] ${line.valid ? 'text-emerald-500' : 'text-neutral-500'}`}>
                          {line.valid ? 'Valid' : 'Invalid'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Visual HIT/MISS Overlay & Diagnostic */}
        <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-5 flex flex-col justify-between items-stretch">
          
          {/* HIT OR MISS Large Indicator Overlay */}
          <div className="rounded border border-[rgba(255,255,255,0.05)] bg-[#0a0a0a] p-6 text-center flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
            
            {status === 'IDLE' && (
              <div>
                <Database className="h-10 w-10 text-slate-500 animate-pulse mb-2" />
                <span className="block font-mono text-xs text-slate-500 uppercase tracking-widest font-bold">
                  Awaiting Address Trace
                </span>
              </div>
            )}

            {status === 'HIT' && (
              <div className="animate-in zoom-in-95 duration-200">
                <CheckCircle className="h-12 w-12 text-[#10b981] mx-auto mb-2" />
                <span className="block font-mono text-2xl font-extrabold text-[#10b981] uppercase tracking-wider">
                  CACHE HIT!
                </span>
                <span className="block font-mono text-[9px] text-[#94a3b8] uppercase tracking-widest mt-1">
                  1-cycle latency bypass resolved
                </span>
              </div>
            )}

            {status === 'MISS' && (
              <div className="animate-in zoom-in-95 duration-200">
                <XCircle className="h-12 w-12 text-[#ef4444] mx-auto mb-2" />
                <span className="block font-mono text-2xl font-extrabold text-[#ef4444] uppercase tracking-wider">
                  CACHE MISS
                </span>
                <span className="block font-mono text-[9px] text-[#94a3b8] uppercase tracking-widest mt-1">
                  Memory fetch delay in progress
                </span>
              </div>
            )}

          </div>

          {/* Hit Ratio Stats Dashboard */}
          <div className="my-4 border-t border-b border-[rgba(255,255,255,0.06)] py-4">
            <span className="block font-mono text-[9px] uppercase font-bold text-[#94a3b8] mb-2">
              📊 CO-SIMULATION STATISTICS
            </span>
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div className="bg-[#181818] p-2 rounded">
                <span className="block text-[8px] text-[#94a3b8]">Total Req</span>
                <span className="font-bold text-white text-sm">{totalRequests}</span>
              </div>
              <div className="bg-[#181818] p-2 rounded">
                <span className="block text-[8px] text-[#94a3b8]">Total Hits</span>
                <span className="font-bold text-white text-sm">{totalHits}</span>
              </div>
              <div className="bg-[#181818] p-2 rounded">
                <span className="block text-[8px] text-[#94a3b8]">Hit Rate</span>
                <span className="font-bold text-[#a78bfa] text-sm">{calculatedRate}%</span>
              </div>
            </div>
          </div>

          <div className="rounded border border-[rgba(255,255,255,0.04)] bg-[#181818] p-3 font-sans text-[11px] text-[#94a3b8] flex gap-2">
            <Info className="h-4.5 w-4.5 text-[#a78bfa] shrink-0" />
            <p className="leading-snug">
              {activeMessage}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
