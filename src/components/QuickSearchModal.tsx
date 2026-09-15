import React, { useEffect, useRef, useState } from 'react';
import { Search, X, Star, History, Loader2, ArrowRight } from 'lucide-react';
import { RAWGGame } from '../types';
import { searchGamesQuick } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { getMetacriticColor, getPlatformIcon } from '../utils/formatters';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (gameId: number) => void;
  onViewAllResults: (query: string) => void;
}

const RECENT_SEARCHES_KEY = 'nexus_recent_searches';

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectGame,
  onViewAllResults,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RAWGGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : ['Cyberpunk 2077', 'Elden Ring', 'God of War'];
    } catch {
      return ['Cyberpunk 2077', 'Elden Ring'];
    }
  });

  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    let isCurrent = true;
    setLoading(true);

    async function doSearch() {
      try {
        const games = await searchGamesQuick(debouncedQuery, 6);
        if (isCurrent) {
          setResults(games);
        }
      } catch (err) {
        console.error('Error buscando juegos:', err);
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    doSearch();

    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const saveToRecent = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleSelect = (game: RAWGGame) => {
    saveToRecent(game.name);
    onClose();
    onSelectGame(game.id);
  };

  const handleSubmitAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveToRecent(query.trim());
      onClose();
      onViewAllResults(query.trim());
    }
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#131829] border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Search Input Bar */}
        <form
          onSubmit={handleSubmitAll}
          className="relative flex items-center px-4 py-3.5 border-b border-purple-500/20 bg-[#0A0E1A]"
        >
          <Search className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribí el nombre de cualquier videojuego..."
            className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-base font-normal"
          />
          {loading && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin mr-3" />}
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono px-2 py-1 rounded bg-[#131829] text-slate-400 border border-slate-700"
          >
            ESC
          </button>
        </form>

        {/* Content Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Recent searches if empty */}
          {!query.trim() && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5">
                <History className="w-3.5 h-3.5 text-purple-400" /> Búsquedas recientes
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleRecentClick(term)}
                    className="px-3 py-1.5 rounded-lg bg-[#0A0E1A] hover:bg-purple-950/40 text-slate-300 hover:text-white border border-purple-500/20 text-xs font-chakra transition cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results list */}
          {query.trim() && (
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                Resultados en tiempo real
              </div>

              {!loading && results.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No se encontraron juegos para &quot;{query}&quot;
                </div>
              )}

              {results.map((game) => (
                <div
                  key={game.id}
                  onClick={() => handleSelect(game)}
                  className="p-2.5 rounded-xl bg-[#0A0E1A] hover:bg-[#1A1F35] border border-purple-500/20 hover:border-cyan-400/60 flex items-center gap-3 cursor-pointer transition group"
                >
                  <img
                    src={
                      game.background_image ||
                      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={game.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-chakra font-bold text-sm text-white group-hover:text-cyan-400 truncate">
                      {game.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="text-amber-400 flex items-center gap-0.5 font-mono">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {(game.rating || 0).toFixed(1)}
                      </span>
                      <span>•</span>
                      <span className="font-mono">
                        {game.released ? game.released.split('-')[0] : 'TBA'}
                      </span>
                      {game.metacritic && (
                        <>
                          <span>•</span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${getMetacriticColor(
                              game.metacritic
                            )}`}
                          >
                            {game.metacritic}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 group-hover:text-cyan-400 pr-2">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {query.trim() && (
          <div className="p-3 bg-[#0A0E1A] border-t border-purple-500/20 text-center">
            <button
              type="button"
              onClick={handleSubmitAll}
              className="text-xs font-chakra font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <span>Ver todos los resultados para &quot;{query}&quot; en el catálogo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
