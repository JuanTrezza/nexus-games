import React, { useEffect, useState } from 'react';
import { Filter, Search, RotateCcw, X, SlidersHorizontal, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { FilterState, RAWGGame } from '../types';
import { getGames } from '../services/api';
import { GameCard } from './GameCard';
import { formatNumberSpanish } from '../utils/formatters';

interface ExploreSectionProps {
  filterState: FilterState;
  onUpdateFilters: (updater: (prev: FilterState) => FilterState) => void;
  onResetFilters: () => void;
  isInWishlist: (id: number) => boolean;
  onToggleWishlist: (game: RAWGGame) => void;
  onOpenDetails: (id: number) => void;
}

const POPULAR_PLATFORMS = [
  { id: '4', name: 'PC' },
  { id: '187', name: 'PlayStation 5' },
  { id: '18', name: 'PlayStation 4' },
  { id: '186', name: 'Xbox Series S/X' },
  { id: '1', name: 'Xbox One' },
  { id: '7', name: 'Nintendo Switch' },
];

const POPULAR_GENRES = [
  { slug: 'action', name: 'Action' },
  { slug: 'role-playing-games-rpg', name: 'RPG' },
  { slug: 'shooter', name: 'Shooter' },
  { slug: 'adventure', name: 'Adventure' },
  { slug: 'indie', name: 'Indie' },
  { slug: 'strategy', name: 'Strategy' },
];

export const ExploreSection: React.FC<ExploreSectionProps> = ({
  filterState,
  onUpdateFilters,
  onResetFilters,
  isInWishlist,
  onToggleWishlist,
  onOpenDetails,
}) => {
  const [games, setGames] = useState<RAWGGame[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Cargar juegos al cambiar filtros
  useEffect(() => {
    let isCurrent = true;

    async function fetchFilteredGames() {
      setLoading(true);
      setError(null);
      setPage(1);

      try {
        const datesParam = filterState.minYear > 1990 ? `${filterState.minYear}-01-01,2026-12-31` : undefined;
        const metacriticParam = filterState.minMetacritic > 0 ? `${filterState.minMetacritic},100` : undefined;

        const res = await getGames({
          page: 1,
          page_size: 12,
          search: filterState.search || undefined,
          platforms: filterState.platforms.length > 0 ? filterState.platforms.join(',') : undefined,
          genres: filterState.genres.length > 0 ? filterState.genres.join(',') : undefined,
          ordering: filterState.ordering,
          dates: datesParam,
          metacritic: metacriticParam,
        });

        if (isCurrent) {
          setGames(res.results || []);
          setTotalCount(res.count || 0);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err instanceof Error ? err.message : 'Error al cargar catálogo');
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    fetchFilteredGames();

    return () => {
      isCurrent = false;
    };
  }, [
    filterState.search,
    filterState.ordering,
    filterState.platforms,
    filterState.genres,
    filterState.minYear,
    filterState.minMetacritic,
  ]);

  // Cargar página adicional (Load More)
  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      const datesParam = filterState.minYear > 1990 ? `${filterState.minYear}-01-01,2026-12-31` : undefined;
      const metacriticParam = filterState.minMetacritic > 0 ? `${filterState.minMetacritic},100` : undefined;

      const res = await getGames({
        page: nextPage,
        page_size: 12,
        search: filterState.search || undefined,
        platforms: filterState.platforms.length > 0 ? filterState.platforms.join(',') : undefined,
        genres: filterState.genres.length > 0 ? filterState.genres.join(',') : undefined,
        ordering: filterState.ordering,
        dates: datesParam,
        metacritic: metacriticParam,
      });

      setGames((prev) => [...prev, ...(res.results || [])]);
      setPage(nextPage);
    } catch (err) {
      console.error('Error al cargar más juegos:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const togglePlatform = (id: string) => {
    onUpdateFilters((prev) => {
      const exists = prev.platforms.includes(id);
      return {
        ...prev,
        platforms: exists ? prev.platforms.filter((p) => p !== id) : [...prev.platforms, id],
      };
    });
  };

  const toggleGenre = (slug: string) => {
    onUpdateFilters((prev) => {
      const exists = prev.genres.includes(slug);
      return {
        ...prev,
        genres: exists ? prev.genres.filter((g) => g !== slug) : [...prev.genres, slug],
      };
    });
  };

  const hasActiveFilters =
    Boolean(filterState.search) ||
    filterState.platforms.length > 0 ||
    filterState.genres.length > 0 ||
    filterState.minYear > 1990 ||
    filterState.minMetacritic > 0;

  return (
    <section id="explorar" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-purple-400 font-mono text-xs tracking-widest uppercase">
            CATÁLOGO COMPLETO
          </span>
          <h2 className="font-chakra text-3xl sm:text-4xl font-bold text-white mt-1">
            EXPLORAR & FILTRAR
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {loading ? (
              'Buscando en la base de datos de RAWG...'
            ) : (
              <>
                Juegos encontrados:{' '}
                <span className="text-cyan-400 font-mono font-bold">
                  {formatNumberSpanish(totalCount)}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Mobile Filter Trigger */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-[#131829] border border-purple-500/30 rounded-lg text-sm text-white font-chakra font-bold"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>Filtros {hasActiveFilters && '•'}</span>
            {mobileFiltersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-[#131829]/60 border border-purple-500/20 rounded-xl">
          <span className="text-xs font-mono text-slate-400 mr-2">Filtros activos:</span>
          {filterState.search && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-950/80 border border-purple-500/40 text-xs text-purple-200">
              Texto: &quot;{filterState.search}&quot;
              <button
                type="button"
                onClick={() => onUpdateFilters((p) => ({ ...p, search: '' }))}
                className="hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {filterState.platforms.map((pid) => {
            const pObj = POPULAR_PLATFORMS.find((p) => p.id === pid);
            return (
              <span
                key={pid}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-xs text-cyan-200"
              >
                {pObj ? pObj.name : `Plat. #${pid}`}
                <button
                  type="button"
                  onClick={() => togglePlatform(pid)}
                  className="hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            );
          })}
          {filterState.genres.map((gSlug) => {
            const gObj = POPULAR_GENRES.find((g) => g.slug === gSlug);
            return (
              <span
                key={gSlug}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-950/80 border border-indigo-500/40 text-xs text-indigo-200"
              >
                {gObj ? gObj.name : gSlug}
                <button
                  type="button"
                  onClick={() => toggleGenre(gSlug)}
                  className="hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            );
          })}
          {filterState.minYear > 1990 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300">
              Año: {filterState.minYear}+
              <button
                type="button"
                onClick={() => onUpdateFilters((p) => ({ ...p, minYear: 1990 }))}
                className="hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {filterState.minMetacritic > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300">
              Metacritic: {filterState.minMetacritic}+
              <button
                type="button"
                onClick={() => onUpdateFilters((p) => ({ ...p, minMetacritic: 0 }))}
                className="hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-rose-400 hover:text-rose-300 ml-auto flex items-center gap-1 cursor-pointer font-mono"
          >
            <RotateCcw className="w-3 h-3" /> Limpiar todo
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        
        {/* FILTERS SIDEBAR */}
        <aside
          className={`w-full lg:w-72 bg-[#131829] border border-purple-500/20 rounded-xl p-6 lg:sticky lg:top-28 transition-all ${
            mobileFiltersOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-500/20">
            <h3 className="font-chakra font-bold text-white text-lg flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-400" /> FILTROS
            </h3>
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-mono text-slate-400 hover:text-rose-400 transition"
              title="Restablecer filtros"
            >
              Reiniciar
            </button>
          </div>

          <div className="space-y-6">
            {/* Search Input */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                Buscar por título
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filterState.search}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateFilters((prev) => ({ ...prev, search: val }));
                  }}
                  placeholder="Ej: Witcher, Doom..."
                  className="w-full bg-[#0A0E1A] border border-purple-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                />
                {filterState.search && (
                  <button
                    type="button"
                    onClick={() => onUpdateFilters((prev) => ({ ...prev, search: '' }))}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Ordering Dropdown */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                Ordenar por
              </label>
              <select
                value={filterState.ordering}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateFilters((prev) => ({ ...prev, ordering: val }));
                }}
                className="w-full bg-[#0A0E1A] border border-purple-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition cursor-pointer"
              >
                <option value="-added">Popularidad (Agregados)</option>
                <option value="-rating">Mejor Calificación</option>
                <option value="-released">Fecha de Salida</option>
                <option value="-metacritic">Metacritic Score</option>
                <option value="name">Nombre (A - Z)</option>
              </select>
            </div>

            {/* Platforms Checkboxes */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                Plataformas
              </label>
              <div className="space-y-2">
                {POPULAR_PLATFORMS.map((p) => {
                  const checked = filterState.platforms.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePlatform(p.id)}
                        className="w-4 h-4 rounded border-purple-500/40 bg-[#0A0E1A] text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <span>{p.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Genres Checkboxes */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                Géneros Populares
              </label>
              <div className="space-y-2">
                {POPULAR_GENRES.map((g) => {
                  const checked = filterState.genres.includes(g.slug);
                  return (
                    <label
                      key={g.slug}
                      className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleGenre(g.slug)}
                        className="w-4 h-4 rounded border-purple-500/40 bg-[#0A0E1A] text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <span>{g.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Release Year Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-slate-300 uppercase">Año Mínimo</span>
                <span className="text-cyan-400 font-bold">
                  {filterState.minYear === 1990 ? 'Cualquiera' : `${filterState.minYear}+`}
                </span>
              </div>
              <input
                type="range"
                min="1990"
                max="2026"
                step="1"
                value={filterState.minYear}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdateFilters((prev) => ({ ...prev, minYear: val }));
                }}
                className="w-full cursor-pointer h-1.5 bg-[#0A0E1A] rounded-lg appearance-none"
              />
            </div>

            {/* Metacritic Score Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-slate-300 uppercase">Metacritic Mínimo</span>
                <span className="text-emerald-400 font-bold">
                  {filterState.minMetacritic === 0 ? 'Sin límite' : `${filterState.minMetacritic}+`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={filterState.minMetacritic}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdateFilters((prev) => ({ ...prev, minMetacritic: val }));
                }}
                className="w-full cursor-pointer h-1.5 bg-[#0A0E1A] rounded-lg appearance-none"
              />
            </div>
          </div>
        </aside>

        {/* GAMES RESULTS GRID */}
        <div className="flex-1 w-full">
          {/* Skeleton Loaders */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
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

          {/* Error State */}
          {!loading && error && (
            <div className="bg-[#131829] border border-rose-500/30 rounded-xl p-8 text-center text-rose-300">
              <p className="font-chakra text-lg mb-2">Error al consultar el catálogo de videojuegos</p>
              <p className="text-xs text-slate-400 mb-4">{error}</p>
              <button
                type="button"
                onClick={onResetFilters}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-chakra font-bold cursor-pointer"
              >
                Restablecer Filtros
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && games.length === 0 && (
            <div className="bg-[#131829] border border-purple-500/20 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mx-auto mb-4 text-purple-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-chakra text-xl font-bold text-white mb-2">
                No se encontraron juegos con estos criterios
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Probá ajustando o relajando los filtros de año, género, plataforma o término de búsqueda.
              </p>
              <button
                type="button"
                onClick={onResetFilters}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-chakra font-bold text-sm rounded-lg shadow-neon-purple cursor-pointer"
              >
                Limpiar Filtros
              </button>
            </div>
          )}

          {/* Games Grid */}
          {!loading && !error && games.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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

              {/* Load More Button */}
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-4 bg-[#131829] hover:bg-[#1A1F35] border-2 border-purple-500/40 hover:border-cyan-400 text-white font-chakra font-bold text-sm tracking-widest rounded-xl transition shadow-lg hover:shadow-neon-cyan disabled:opacity-60 inline-flex items-center gap-2 cursor-pointer"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>CARGANDO TÍTULOS...</span>
                    </>
                  ) : (
                    <span>CARGAR MÁS JUEGOS</span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </section>
  );
};
