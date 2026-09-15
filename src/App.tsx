import React, { useEffect, useState } from 'react';
import { FilterState, RAWGGame } from './types';
import { getGames } from './services/api';
import { useWishlist } from './hooks/useWishlist';
import { useToast } from './hooks/useToast';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StatsBanner } from './components/StatsBanner';
import { TrendingSection } from './components/TrendingSection';
import { GenresSection } from './components/GenresSection';
import { PlatformsSection } from './components/PlatformsSection';
import { ExploreSection } from './components/ExploreSection';
import { GameDetailModal } from './components/GameDetailModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickSearchModal } from './components/QuickSearchModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const INITIAL_FILTERS: FilterState = {
  search: '',
  platforms: [],
  genres: [],
  ordering: '-added',
  minYear: 1990,
  minMetacritic: 0,
};

export default function App() {
  const { toasts, addToast, removeToast } = useToast();
  const {
    items: wishlistItems,
    count: wishlistCount,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist((msg, type) => addToast(msg, type));

  const [heroGames, setHeroGames] = useState<RAWGGame[]>([]);
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [wishlistOpen, setWishlistOpen] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  // Cargar juegos destacados para el fondo del Hero
  useEffect(() => {
    async function loadHeroGames() {
      try {
        const res = await getGames({ ordering: '-metacritic', page_size: 6 });
        setHeroGames(res.results || []);
      } catch (e) {
        console.error('Error cargando juegos para el Hero:', e);
      }
    }
    loadHeroGames();
  }, []);

  // Atajo de teclado global: tecla '/' abre la búsqueda rápida
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Solo si no está escribiendo en un input o textarea
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Búsqueda desde el Hero
  const handleHeroSearch = (term: string) => {
    setFilterState((prev) => ({
      ...prev,
      search: term,
    }));
    const el = document.getElementById('explorar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Selección de género desde la sección de categorías
  const handleSelectGenre = (slug: string) => {
    setFilterState((prev) => ({
      ...prev,
      genres: [slug],
    }));
  };

  // Selección de plataforma desde la sección de ecosistemas
  const handleSelectPlatform = (platformId: string) => {
    setFilterState((prev) => ({
      ...prev,
      platforms: [platformId],
    }));
  };

  // Restablecer todos los filtros
  const handleResetFilters = () => {
    setFilterState(INITIAL_FILTERS);
    addToast('Filtros restablecidos', 'info');
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white cyber-grid">
      {/* Fixed Header */}
      <Header
        wishlistCount={wishlistCount}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero heroGames={heroGames} onSearch={handleHeroSearch} />

        {/* 2. Stats Banner */}
        <StatsBanner />

        {/* 3. Trending Section */}
        <TrendingSection
          isInWishlist={isInWishlist}
          onToggleWishlist={toggleWishlist}
          onOpenDetails={(id) => setSelectedGameId(id)}
        />

        {/* 4. Genres Section */}
        <GenresSection onSelectGenre={handleSelectGenre} />

        {/* 5. Platforms Section */}
        <PlatformsSection onSelectPlatform={handleSelectPlatform} />

        {/* 6. Full Catalog & Explore Section */}
        <ExploreSection
          filterState={filterState}
          onUpdateFilters={setFilterState}
          onResetFilters={handleResetFilters}
          isInWishlist={isInWishlist}
          onToggleWishlist={toggleWishlist}
          onOpenDetails={(id) => setSelectedGameId(id)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <GameDetailModal
        gameId={selectedGameId}
        isInWishlist={selectedGameId ? isInWishlist(selectedGameId) : false}
        onToggleWishlist={toggleWishlist}
        onClose={() => setSelectedGameId(null)}
        onNotify={addToast}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        items={wishlistItems}
        onClose={() => setWishlistOpen(false)}
        onRemoveItem={removeFromWishlist}
        onClearAll={clearWishlist}
        onOpenGameDetails={(id) => setSelectedGameId(id)}
        onNotify={addToast}
      />

      <QuickSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectGame={(id) => setSelectedGameId(id)}
        onViewAllResults={(query) => {
          handleHeroSearch(query);
        }}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
