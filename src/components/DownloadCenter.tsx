import React, { useState } from 'react';
import { DOWNLOAD_ASSETS } from '../data';
import { DownloadAsset } from '../types';
import { FileCode, Layers, FileText, Cpu, CheckCircle } from 'lucide-react';
import DownloadButton from './DownloadButton';

export default function DownloadCenter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const categories = ['All', 'RTL', 'Netlists', 'Layouts', 'Waveforms', 'Specs'];

  const filteredAssets = selectedCategory === 'All'
    ? DOWNLOAD_ASSETS
    : DOWNLOAD_ASSETS.filter(a => a.category === selectedCategory);

  const getAssetIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <FileCode className="h-5 w-5 text-[#a78bfa]" />;
      case 'layers':
        return <Layers className="h-5 w-5 text-[#a78bfa]" />;
      case 'file-text':
        return <FileText className="h-5 w-5 text-[#a78bfa]" />;
      case 'cpu':
        return <Cpu className="h-5 w-5 text-[#a78bfa]" />;
      default:
        return <FileCode className="h-5 w-5 text-[#a78bfa]" />;
    }
  };

  return (
    <section className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8 text-center md:text-left">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#a78bfa]">
            Engineering Download Center
          </span>
          <h1 className="mt-2 font-sans text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            HARDWARE RESOURCES & NETLISTS
          </h1>
          <p className="mt-3 font-sans text-base text-[#94a3b8]">
            Acquire fully-synthesizable digital cores, floorplan database exchange formats (DEF), simulated VCD waveforms, and hardware reference manuals.
          </p>
        </div>

        {/* Global Download Notification banner */}
        {downloadSuccessMessage && (
          <div className="mb-6 rounded-lg border border-[#10b981]/20 bg-[#10b981]/5 p-4 flex items-center gap-3 font-mono text-xs text-[#10b981] animate-in slide-in-from-top-2">
            <CheckCircle className="h-5 w-5 animate-bounce" />
            <span>{downloadSuccessMessage}</span>
          </div>
        )}

        {/* Sidebar + Grid 2-Column Split */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 items-stretch">
          
          {/* Column 1: Sidebar Category list */}
          <div className="lg:col-span-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-5 h-fit">
            <span className="block font-mono text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] mb-4">
              📂 CATEGORY SELECTORS
            </span>

            <div className="flex flex-col gap-1.5 font-mono text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left rounded-lg px-4 py-2.5 transition-all ${
                    (selectedCategory === cat)
                      ? 'bg-[#a78bfa] text-[#0a0a0a] font-bold shadow-md shadow-[#a78bfa]/10'
                      : 'text-[#94a3b8] hover:bg-[#1a1a1a] hover:text-white'
                  }`}
                >
                  {cat === 'All' ? 'View All Mappings' : `${cat} Artifacts`}
                </button>
              ))}
            </div>

            <div className="mt-8 border-t border-[rgba(255,255,255,0.06)] pt-4 font-sans text-[11px] text-[#94a3b8] leading-relaxed">
              Restricted physical layout files require GPG signature authentication. Verified netlists carry compiled synthesis stamps.
            </div>
          </div>

          {/* Column 2, 3, 4: Assets Grid */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#121212] p-5 flex flex-col justify-between hover:border-[#a78bfa]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#a78bfa]/3"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1a1a]">
                      {getAssetIcon(asset.icon)}
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">
                        VER_{asset.version}
                      </span>
                      <span className={`mt-1 inline-block rounded px-1.5 py-0.5 font-mono text-[8px] font-bold ${
                        asset.status === 'Verified' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {asset.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Title & metadata */}
                  <h3 className="font-mono text-sm font-bold text-white tracking-tight break-all">
                    {asset.name}
                  </h3>
                  
                  <div className="mt-1.5 flex gap-3 text-[10px] font-mono text-[#94a3b8]">
                    <span>Size: <strong className="text-white">{asset.size}</strong></span>
                    <span>Type: <strong className="text-white">{asset.fileType}</strong></span>
                  </div>
                </div>

                {/* Footer Action button */}
                <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#10b981]">
                    <CheckCircle className="h-3.5 w-3.5" /> Compiled SHA256 matches
                  </div>

                  <DownloadButton
                    downloadPath={asset.downloadPath}
                    assetName={asset.name}
                    onDownloadStarted={() => {
                      setDownloadSuccessMessage(`Starting secure download for ${asset.name}...`);
                      setTimeout(() => {
                        setDownloadSuccessMessage(null);
                      }, 2500);
                    }}
                  />
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
