import React, { useState } from 'react';
import { Layers, ZoomIn, X, Cpu, Eye, Aperture, Terminal } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'Photomasks' | 'Lab Assets' | 'Waveforms' | 'Designs';
  image: string;
  desc: string;
  details: { label: string; value: string }[];
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gdsii-photomask',
    title: 'RV32IM SoC GDSII Physical Layout',
    category: 'Photomasks',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    desc: 'Streamed layout database showcasing Clock Tree routing lanes surrounding the systolic MAC multipliers blocks. Dark blue traces trace signal interconnect channels on M5/M6 metals, while white grids outline top level power mesh networks.',
    details: [
      { label: 'Technology Node', value: 'TSMC 7nm FinFET' },
      { label: 'Layer Streamout', value: 'Metal 1 through Metal 9' },
      { label: 'Utilization', value: '65.4% Die Area' }
    ]
  },
  {
    id: 'oscilloscope-trace',
    title: 'High-Frequency Jitter Synchronizer Waveform',
    category: 'Waveforms',
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=800&auto=format&fit=crop',
    desc: 'GTKWave and physical logic analyzer traces captures clock domain crossing synchronization signals. High-speed signal lines remain fully synchronous with clock jitter bounded safely within 15ps across sub-volt rails.',
    details: [
      { label: 'Frequency Target', value: '1.25 GHz Coherent' },
      { label: 'Timing Jitter', value: '< 15ps (Static)' },
      { label: 'CDC Buffers', value: '2-Stage Synchronizers' }
    ]
  },
  {
    id: 'micro-die-photography',
    title: 'Physical Standard Cells row micro-photography',
    category: 'Designs',
    image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=800&auto=format&fit=crop',
    desc: 'Dense rows of logic gates, custom standard cell arrays, and pipelined SRAM memory blocks mapped on-die. Dynamic decoupling capacitor cells sit directly adjacent to register walls to defend against voltage droops.',
    details: [
      { label: 'Magnification', value: '25,000x SEM Render' },
      { label: 'Region mapped', value: 'Integer Multiplier Matrix' },
      { label: 'Active Gates', value: '48.2K Logic Cells' }
    ]
  },
  {
    id: 'lab-validation-bench',
    title: 'Hardware Co-Verification and Lab Setup',
    category: 'Lab Assets',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    desc: 'Physical validation bench showing FPGA development boards, low-noise signal generators, high-speed logic analyzers, and thermal imaging cameras monitoring live SOC runs.',
    details: [
      { label: 'Main Board', value: 'Xilinx Artix-7 VC707' },
      { label: 'Analyzers', value: 'HP 1670G Logic Suite' },
      { label: 'Scope Bandwidth', value: '4.0 GHz Real-Time' }
    ]
  }
];

export default function Gallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <div className="py-20 animate-fade-in text-slate-100" id="gallery-page">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center md:text-left mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#a78bfa]">
            // Silicon Photo Gallery
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-[0.95]">
            Visualizing Hardware:<br />
            <span className="text-slate-400">The Silicon Gallery.</span>
          </h1>
          <p className="mt-6 text-xl text-slate-400 font-sans max-w-3xl leading-relaxed font-light">
            A beautiful, visual perspective of chip layouts, photomask streams, lab setups, and oscilloscope traces. Showing the aesthetic side of engineering.
          </p>
        </div>

        {/* Bento/Masonry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {GALLERY_ITEMS.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#121212] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#a78bfa]/40 hover:-translate-y-1 hover:shadow-xl"
              id={`gallery-item-${item.id}`}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-[#1a1a1a]">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-65 grayscale transition-all duration-500 group-hover:scale-103 group-hover:opacity-85 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                
                {/* Floating label category */}
                <div className="absolute top-4 left-4">
                  <span className="rounded bg-[#a78bfa]/15 border border-[#a78bfa]/20 px-2.5 py-1 font-mono text-[9px] uppercase font-bold tracking-wider text-[#a78bfa]">
                    {item.category}
                  </span>
                </div>

                {/* Hover action overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="rounded-full bg-[#a78bfa] p-3 text-black shadow-lg">
                    <ZoomIn className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="p-6">
                <h3 className="font-display font-bold text-lg text-white group-hover:text-[#a78bfa] transition-colors uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-slate-400 font-sans leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
                <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.04)] flex justify-between items-center text-[10px] font-mono text-[#64748b]">
                  <span className="flex items-center gap-1"><Aperture className="h-3.5 w-3.5 text-[#a78bfa]" /> PHOTO SIGN-OFF</span>
                  <span className="text-[#a78bfa] font-bold uppercase flex items-center gap-0.5">Explore Details <Eye className="h-3 w-3" /></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox / Details Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#121212] overflow-hidden shadow-2xl">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-slate-400 hover:text-white border border-[rgba(255,255,255,0.08)]"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-5">
                {/* Image panel */}
                <div className="md:col-span-3 h-64 md:h-[400px] bg-black">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details panel */}
                <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between bg-[#0a0a0a]">
                  <div>
                    <span className="rounded bg-[#a78bfa]/10 border border-[#a78bfa]/20 px-2 py-0.5 font-mono text-[9px] uppercase font-bold tracking-wider text-[#a78bfa]">
                      {selectedItem.category}
                    </span>
                    <h2 className="mt-3 font-display font-black text-xl text-white uppercase tracking-tight">
                      {selectedItem.title}
                    </h2>
                    <p className="mt-3 text-xs text-slate-400 font-sans leading-relaxed">
                      {selectedItem.desc}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[rgba(255,255,255,0.06)] pt-4 space-y-3 font-mono text-[10px]">
                    {selectedItem.details.map((detail, idx) => (
                      <div key={idx} className="flex justify-between border-b border-[rgba(255,255,255,0.02)] pb-1.5">
                        <span className="text-slate-500 uppercase">{detail.label}:</span>
                        <span className="text-white font-bold">{detail.value}</span>
                      </div>
                    ))}
                    <div className="text-[9px] text-slate-600 flex items-center gap-1.5 pt-2">
                      <Terminal className="h-3 w-3" /> MD5: {selectedItem.id.repeat(2).slice(0, 16)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
