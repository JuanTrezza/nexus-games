import React, { useEffect, useState } from 'react';
import { Search, ArrowRight, Flame } from 'lucide-react';
import { RAWGGame } from '../types';

interface HeroProps {
  heroGames: RAWGGame[];
  onSearch: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ heroGames, onSearch }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');

  // Rotación automática de imágenes de fondo cada 6 segundos
  useEffect(() => {
    if (!heroGames.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroGames.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroGames.length]);

  const currentGame = heroGames[currentIndex];
  const fallbackBg = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80';
  const backgroundUrl = currentGame?.background_image || fallbackBg;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleQuickTagClick = (tag: string) => {
    setInputValue(tag);
    onSearch(tag);
  };

  const scrollToExplore = () => {
    const el = document.getElementById('tendencias');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen pt-24 pb-16 flex items-center justify-center overflow-hidden">
      {/* Dynamic Rotating Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 transform scale-105 filter brightness-[0.36] saturate-150"
        style={{ backgroundImage: `url('${backgroundUrl}')` }}
      />
      {/* Dark Gradients Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/70 to-[#0A0E1A]/80" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0A0E1A] via-transparent to-[#0A0E1A]" />

      {/* Center Neon Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-6">
        {/* Tag Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131829]/90 border border-purple-500/40 backdrop-blur-md mb-6 shadow-neon-purple animate-pulse">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono tracking-wider font-semibold text-cyan-300">
            500.000+ JUEGOS · TU PRÓXIMA AVENTURA TE ESPERA
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-chakra text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white mb-6 leading-tight">
          DESCUBRÍ TU{' '}
          <span className="gradient-text drop-shadow-[0_0_35px_rgba(168,85,247,0.4)]">
            PRÓXIMO JUEGO
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed font-normal">
          La plataforma más completa para explorar videojuegos. Calificaciones de la crítica, capturas en 4K, reseñas de la comunidad y filtros de precisión AAA.
        </p>

        {/* Hero Search Bar */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative mb-8">
          <div className="relative flex items-center rounded-xl bg-[#131829]/90 border-2 border-purple-500/40 hover:border-cyan-400/80 focus-within:border-cyan-400 focus-within:shadow-neon-cyan transition-all shadow-2xl backdrop-blur-md p-1.5">
            <Search className="text-purple-400 ml-4 mr-3 w-5 h-5 flex-shrink-0" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Buscá tu juego favorito (ej: Cyberpunk, The Witcher, Elden Ring)..."
              className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-base py-3 font-normal"
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-chakra font-bold text-sm tracking-wide rounded-lg transition-all shadow-md flex items-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <span>EXPLORAR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Trending Quick Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 font-mono">
          <span className="text-purple-400 font-semibold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Tendencias rápidas:
          </span>
          {['Cyberpunk 2077', 'Elden Ring', 'The Last of Us', 'Grand Theft Auto', "Baldur's Gate 3"].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickTagClick(tag)}
              className="px-3 py-1 bg-[#131829]/80 hover:bg-purple-900/40 border border-purple-500/20 rounded-md transition text-slate-300 hover:text-white cursor-pointer"
            >
              {tag === 'Grand Theft Auto' ? 'GTA V' : tag}
            </button>
          ))}
        </div>

        {/* Active Hero Game Badge */}
        {currentGame && (
          <div className="mt-12 inline-flex items-center gap-3 px-4 py-2 bg-[#0A0E1A]/80 border border-purple-500/30 rounded-lg text-xs font-mono backdrop-blur-md">
            <span className="text-slate-400">Captura en fondo:</span>
            <span className="text-cyan-400 font-bold">{currentGame.name}</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
              ★ {(currentGame.rating || 4.8).toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Animated Scroll Indicator */}
      <button
        type="button"
        onClick={scrollToExplore}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 hover:text-purple-400 transition cursor-pointer"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">DESLIZÁ PARA EXPLORAR</span>
        <div className="w-5 h-8 rounded-full border-2 border-purple-500/40 flex justify-center p-1">
          <div className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce" />
        </div>
      </button>
    </section>
  );
};
