import React from 'react';
import { Heart, Star } from 'lucide-react';
import { RAWGGame } from '../types';
import { formatDateSpanish, getMetacriticColor, getPlatformIcon } from '../utils/formatters';

interface GameCardProps {
  game: RAWGGame;
  isInWishlist: boolean;
  onToggleWishlist: (game: RAWGGame) => void;
  onOpenDetails: (gameId: number) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isInWishlist,
  onToggleWishlist,
  onOpenDetails,
}) => {
  const fallbackImg = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';
  const coverImage = game.background_image || fallbackImg;

  // Extraer iconos de plataformas únicas
  const platformIcons = Array.from(
    new Set(
      (game.parent_platforms || game.platforms || []).map((p) => {
        const slug = 'platform' in p ? p.platform.slug : '';
        return getPlatformIcon(slug);
      })
    )
  ).slice(0, 4);

  const genres = (game.genres || []).slice(0, 2);
  const releasedText = formatDateSpanish(game.released);

  return (
    <article className="game-card bg-[#131829] rounded-xl border border-purple-500/20 overflow-hidden flex flex-col group relative">
      {/* Thumbnail Container */}
      <div
        className="relative aspect-video w-full overflow-hidden bg-[#1A1F35] cursor-pointer"
        onClick={() => onOpenDetails(game.id)}
      >
        <img
          src={coverImage}
          alt={game.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImg;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131829] via-transparent to-transparent opacity-80" />

        {/* Metascore Top Right */}
        <div className="absolute top-2.5 right-2.5">
          {game.metacritic ? (
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getMetacriticColor(
                game.metacritic
              )}`}
              title="Metacritic Score"
            >
              {game.metacritic}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800/80 text-slate-400 border border-slate-700">
              N/A
            </span>
          )}
        </div>

        {/* Platforms Top Left */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-[#0A0E1A]/80 px-2 py-0.5 rounded text-xs backdrop-blur-sm border border-slate-700">
          <span>{platformIcons.length > 0 ? platformIcons.join(' ') : '🎮'}</span>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Genre pills */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {genres.map((g) => (
              <span
                key={g.id}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/20"
              >
                {g.name}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetails(game.id)}
            className="font-chakra font-bold text-base text-white hover:text-cyan-400 transition cursor-pointer line-clamp-2 leading-snug"
            title={game.name}
          >
            {game.name}
          </h3>
        </div>

        {/* Footer Meta & Actions */}
        <div className="pt-4 mt-3 border-t border-purple-500/15 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400">Lanzamiento</div>
            <div className="text-xs font-mono font-semibold text-slate-200">{releasedText}</div>
          </div>

          <div className="flex items-center gap-2">
            {/* Rating */}
            <div className="text-right mr-1">
              <div className="text-[10px] text-slate-400">Rating</div>
              <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{(game.rating || 0).toFixed(1)}</span>
              </div>
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(game);
              }}
              className={`p-2.5 rounded-lg bg-[#0A0E1A] hover:bg-purple-900/40 border border-purple-500/30 transition cursor-pointer ${
                isInWishlist
                  ? 'text-rose-400 border-rose-500/60 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
              title={isInWishlist ? 'Eliminar de deseados' : 'Añadir a deseados'}
              aria-label={isInWishlist ? 'Eliminar de deseados' : 'Añadir a deseados'}
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-rose-400 text-rose-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
