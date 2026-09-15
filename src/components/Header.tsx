import React, { useState } from 'react';
import { Gamepad2, Heart, Search, Menu, X, Home, Compass, Layers, Cpu, Flame } from 'lucide-react';

interface HeaderProps {
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  wishlistCount,
  onOpenWishlist,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0E1A]/85 backdrop-blur-xl border-b border-purple-500/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }}
          className="flex items-center gap-3 group"
        >
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-neon-purple transition group-hover:scale-105">
            <div className="w-full h-full bg-[#0A0E1A] rounded-[7px] flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-purple-400 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-chakra text-2xl font-bold tracking-wider text-white">
              <span>NEXUS</span>
              <span className="text-cyan-400 text-xs px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 font-mono">
                GAMES
              </span>
            </div>
            <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5">
              Discovery Engine
            </p>
          </div>
        </a>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium font-chakra tracking-wide">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
            className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5 opacity-70" /> INICIO
          </a>
          <a
            href="#explorar"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('explorar');
            }}
            className="text-slate-300 hover:text-purple-400 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 opacity-70" /> EXPLORAR
          </a>
          <a
            href="#generos"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('generos');
            }}
            className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 opacity-70" /> GÉNEROS
          </a>
          <a
            href="#plataformas"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('plataformas');
            }}
            className="text-slate-300 hover:text-purple-400 transition-colors flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5 opacity-70" /> PLATAFORMAS
          </a>
          <a
            href="#tendencias"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('tendencias');
            }}
            className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <Flame className="w-3.5 h-3.5" /> TRENDING
          </a>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#131829] hover:bg-[#1A1F35] border border-purple-500/30 rounded-lg text-slate-300 hover:text-white transition group text-sm"
            title="Buscar juegos (Tecla /)"
            aria-label="Buscar juegos"
          >
            <Search className="w-4 h-4 text-purple-400 group-hover:text-cyan-400" />
            <span className="hidden sm:inline text-xs text-slate-400">Buscar...</span>
            <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0A0E1A] text-slate-400 border border-slate-700">
              /
            </kbd>
          </button>

          {/* Wishlist Button with Badge */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2.5 bg-[#131829] hover:bg-[#1A1F35] border border-purple-500/30 rounded-lg text-slate-300 hover:text-purple-300 transition"
            title="Ver lista de deseados"
            aria-label="Ver lista de deseados"
          >
            <Heart className="w-5 h-5 text-purple-400" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full text-[10px] font-mono font-bold flex items-center justify-center shadow-lg border border-[#0A0E1A]">
              {wishlistCount}
            </span>
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 bg-[#131829] border border-purple-500/30 rounded-lg text-slate-300"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0E1A]/95 border-b border-purple-500/30 px-6 py-5 flex flex-col gap-4 font-chakra backdrop-blur-xl">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-left text-slate-200 py-2 border-b border-slate-800 flex items-center gap-2"
          >
            <Home className="w-4 h-4 text-purple-400" /> INICIO
          </button>
          <button
            onClick={() => scrollToSection('explorar')}
            className="text-left text-slate-200 py-2 border-b border-slate-800 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-purple-400" /> EXPLORAR
          </button>
          <button
            onClick={() => scrollToSection('generos')}
            className="text-left text-slate-200 py-2 border-b border-slate-800 flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-cyan-400" /> GÉNEROS
          </button>
          <button
            onClick={() => scrollToSection('plataformas')}
            className="text-left text-slate-200 py-2 border-b border-slate-800 flex items-center gap-2"
          >
            <Cpu className="w-4 h-4 text-cyan-400" /> PLATAFORMAS
          </button>
          <button
            onClick={() => scrollToSection('tendencias')}
            className="text-left text-amber-400 py-2 flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-amber-400" /> TRENDING
          </button>
        </div>
      )}
    </header>
  );
};
