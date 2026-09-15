import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { RAWGGenre } from '../types';
import { getGenres } from '../services/api';
import { formatNumberSpanish } from '../utils/formatters';

interface GenresSectionProps {
  onSelectGenre: (genreSlug: string) => void;
}

export const GenresSection: React.FC<GenresSectionProps> = ({ onSelectGenre }) => {
  const [genres, setGenres] = useState<RAWGGenre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    async function loadGenresData() {
      try {
        const data = await getGenres(20);
        setGenres(data.results || []);
      } catch (err) {
        console.error('Error cargando géneros:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGenresData();
  }, []);

  const displayedGenres = showAll ? genres : genres.slice(0, 8);

  const handleGenreClick = (slug: string) => {
    onSelectGenre(slug);
    const exploreEl = document.getElementById('explorar');
    if (exploreEl) {
      exploreEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="generos" className="py-16 bg-[#0E1322] border-y border-purple-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-purple-400 font-mono text-xs tracking-widest uppercase">
              CATEGORÍAS POPULARES
            </span>
            <h2 className="font-chakra text-3xl font-bold text-white mt-1">
              🎮 EXPLORÁ POR GÉNERO
            </h2>
          </div>
          {genres.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-chakra tracking-wider text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>{showAll ? 'VER MENOS GÉNEROS' : 'VER TODOS LOS GÉNEROS'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-36 rounded-xl" />
            ))}
          </div>
        )}

        {/* Genres Grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedGenres.map((g) => (
              <div
                key={g.id}
                onClick={() => handleGenreClick(g.slug)}
                className="group relative h-36 rounded-xl overflow-hidden cursor-pointer border border-purple-500/25 hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-1"
              >
                <img
                  src={
                    g.image_background ||
                    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={g.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter brightness-[0.4] group-hover:brightness-[0.7]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="font-chakra font-bold text-white text-base group-hover:text-cyan-400 transition tracking-wide">
                    {g.name}
                  </h4>
                  <span className="text-[11px] font-mono text-purple-300/90">
                    {formatNumberSpanish(g.games_count)} títulos
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
