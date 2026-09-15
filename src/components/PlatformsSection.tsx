import React, { useEffect, useState } from 'react';
import { RAWGPlatformItem } from '../types';
import { getPlatforms } from '../services/api';
import { formatNumberSpanish, getPlatformIcon } from '../utils/formatters';

interface PlatformsSectionProps {
  onSelectPlatform: (platformId: string) => void;
}

export const PlatformsSection: React.FC<PlatformsSectionProps> = ({ onSelectPlatform }) => {
  const [platforms, setPlatforms] = useState<RAWGPlatformItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadPlatformsData() {
      try {
        const data = await getPlatforms(12);
        // Filtramos para mostrar las 6 plataformas más populares (PC, PS5, PS4, Xbox Series, Xbox One, Switch)
        const relevantIds = [4, 187, 18, 1, 186, 7];
        const sorted = (data.results || []).sort((a, b) => {
          const indexA = relevantIds.indexOf(a.id);
          const indexB = relevantIds.indexOf(b.id);
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return (b.games_count || 0) - (a.games_count || 0);
        });
        setPlatforms(sorted.slice(0, 6));
      } catch (err) {
        console.error('Error cargando plataformas:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlatformsData();
  }, []);

  const handlePlatformClick = (id: number) => {
    onSelectPlatform(String(id));
    const exploreEl = document.getElementById('explorar');
    if (exploreEl) {
      exploreEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="plataformas" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-cyan-400 font-mono text-xs tracking-widest uppercase">
          ECOSISTEMAS DE JUEGO
        </span>
        <h2 className="font-chakra text-3xl font-bold text-white mt-1">
          ⚡ EN TU PLATAFORMA FAVORITA
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Hacé clic en cualquier plataforma para filtrar de inmediato el catálogo.
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {platforms.map((p) => (
            <div
              key={p.id}
              onClick={() => handlePlatformClick(p.id)}
              className="p-4 bg-[#131829] hover:bg-[#1A1F35] border border-purple-500/20 hover:border-cyan-400 rounded-xl cursor-pointer text-center group transition transform hover:-translate-y-1"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {getPlatformIcon(p.slug)}
              </div>
              <h4 className="font-chakra font-bold text-sm text-white group-hover:text-cyan-400 transition truncate">
                {p.name}
              </h4>
              <div className="text-[10px] font-mono text-slate-400 mt-1">
                {formatNumberSpanish(p.games_count || 0)} juegos
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
