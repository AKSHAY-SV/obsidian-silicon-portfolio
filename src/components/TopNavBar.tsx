import React from 'react';
import { Search, Settings, FileDown, Cpu, Menu, X, Terminal } from 'lucide-react';
import { NavTab } from '../types';

interface TopNavBarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onSearchOpen: () => void;
  onSettingsOpen: () => void;
  onSystemStatusOpen: () => void;
}

export default function TopNavBar({
  activeTab,
  setActiveTab,
  onSearchOpen,
  onSettingsOpen,
  onSystemStatusOpen
}: TopNavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'research', label: 'Research' },
    { id: 'blog', label: 'Blog' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'downloads', label: 'Downloads' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-[rgba(255,255,255,0.1)] bg-[#0a0a0af2] backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo Left */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 text-left group"
          id="nav-brand-logo"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.15)] bg-[#1a1a1a] transition-all group-hover:border-[#a78bfa]/50">
            <Cpu className="h-5 w-5 text-[#a78bfa] transition-transform duration-500 group-hover:rotate-180" />
            <div className="absolute inset-0 rounded-lg bg-[#a78bfa]/5 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
          </div>
          <div>
            <span className="block font-sans font-black text-lg tracking-tighter uppercase text-white">
              Obsidian Architecture
            </span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-[#a78bfa] -mt-1 font-semibold">
              Silicon Design Hub
            </span>
          </div>
        </button>

        {/* Nav Links Center (Desktop) */}
        <nav className="hidden md:flex h-full items-center gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`relative flex h-full items-center px-3 font-sans text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-200 ${
                  isActive ? 'text-[#a78bfa]' : 'text-slate-400 hover:text-white'
                }`}
                id={`nav-link-${item.id}`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#a78bfa]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions Right */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onSearchOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-[#94a3b8] hover:border-[rgba(255,255,255,0.1)] hover:bg-[#1a1a1a] hover:text-white transition-all"
            title="Search Projects (Cmd+K)"
            id="nav-action-search"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            onClick={onSettingsOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-[#94a3b8] hover:border-[rgba(255,255,255,0.1)] hover:bg-[#1a1a1a] hover:text-white transition-all"
            title="System Settings"
            id="nav-action-settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className="flex items-center gap-1.5 rounded-lg bg-[#a78bfa] px-5 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-[#0a0a0a] hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#a78bfa]/10"
            id="nav-action-contact"
          >
            Get in Touch
          </button>
        </div>

        {/* Mobile Burger Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onSearchOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#1a1a1a]"
          >
            <Search className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.1)] text-[#94a3b8] bg-[#121212] hover:text-white"
            id="nav-burger-btn"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 border-b border-[rgba(255,255,255,0.1)] bg-[#0a0a0af9] p-4 backdrop-blur-lg md:hidden animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center rounded-md px-4 py-3 font-sans text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#1a1a1a] text-[#a78bfa] font-bold border-l-2 border-[#a78bfa]'
                      : 'text-[#94a3b8] hover:bg-[#121212] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
          
          <div className="mt-4 flex gap-2 border-t border-[rgba(255,255,255,0.08)] pt-4">
            <button
              onClick={() => {
                onSettingsOpen();
                setMobileMenuOpen(false);
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#121212] border border-[rgba(255,255,255,0.1)] py-2 text-sm text-[#94a3b8]"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={() => {
                setActiveTab('contact');
                setMobileMenuOpen(false);
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#a78bfa] py-2 text-sm font-bold text-[#0a0a0a]"
            >
              Get in Touch
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
