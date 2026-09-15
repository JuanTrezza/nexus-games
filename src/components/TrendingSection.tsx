import React, { useEffect, useState } from 'react';
import { Zap, RefreshCw } from 'lucide-react';
import { RAWGGame, TrendingTabKey } from '../types';
import { getGames } from '../services/api';
import { GameCard } from './GameCard';

interface TrendingSectionProps {
  isInWishlist: (id: number) => boolean;
  onToggleWishlist: (game: RAWGGame) => void;
  onOpenDetails: (id: number) => void;
}

const TABS: { key: TrendingTabKey; label: string }[] = [
  { key: '-added', label: 'TENDENCIA' },
  { key: '-rating', label: 'MEJOR PUNTUADOS' },
  { key: '-released', label: 'MÁS RECIENTES' },
  { key: '-metacritic', label: 'METACRITIC TOP' },
];

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  isInWishlist,
  onToggleWishlist,
  onOpenDetails,
}) => {
  const [activeTab, setActiveTab] = useState<TrendingTabKey>('-added');
  const [games, setGames] = useState<RAWGGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = async (ordering: TrendingTabKey) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGames({
        ordering,
        page_size: 6,
      });
      setGames(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar juegos en tendencia');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending(activeTab);
  }, [activeTab]);

  return (
    <section id="tendencias" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-4 border-b border-purple-500/20">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1">
            <Zap className="w-3.5 h-3.5" /> SELECCIÓN DESTACADA
          </div>
          <h2 className="font-chakra text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
            🔥 EN TENDENCIA
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 font-chakra text-xs sm:text-sm">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-bold transition cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-neon-purple'
                  : 'bg-[#131829] hover:bg-[#1A1F35] text-slate-300 border border-purple-500/20 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skeletons Loader */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#131829] rounded-xl border border-purple-500/20 overflow-hidden flex flex-col h-[340px]"
            >
              <div className="skeleton aspect-video w-full" />
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="skeleton h-3 w-1/3 rounded" />
                  <div className="skeleton h-5 w-4/5 rounded" />
                </div>
                <div className="pt-3 border-t border-purple-500/10 flex justify-between items-center">
                  <div className="skeleton h-4 w-20 rounded" />
                  <div className="skeleton h-8 w-8 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-12 bg-[#131829] rounded-xl border border-rose-500/30 text-rose-300">
          <p className="font-chakra text-base mb-2">No se pudieron cargar los juegos en tendencia.</p>
          <p className="text-xs text-slate-400 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => fetchTrending(activeTab)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-xs text-white font-chakra font-bold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reintentar
          </button>
        </div>
      )}

      {/* Games Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isInWishlist={isInWishlist(game.id)}
              onToggleWishlist={onToggleWishlist}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}
    </section>
  );
};
