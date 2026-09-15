import React, { useEffect, useState } from 'react';
import {
  X,
  Star,
  Heart,
  Globe,
  Share2,
  Calendar,
  Layers,
  Cpu,
  Building2,
  ExternalLink,
  Maximize2,
  Loader2,
} from 'lucide-react';
import { RAWGGameDetail, RAWGScreenshot } from '../types';
import { getGameDetails, getGameScreenshots } from '../services/api';
import { formatDateSpanish, getMetacriticColor, getPlatformIcon, sanitizeDescription } from '../utils/formatters';

interface GameDetailModalProps {
  gameId: number | null;
  isInWishlist: boolean;
  onToggleWishlist: (game: { id: number; name: string; background_image: string | null; rating: number; metacritic: number | null }) => void;
  onClose: () => void;
  onNotify: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  gameId,
  isInWishlist,
  onToggleWishlist,
  onClose,
  onNotify,
}) => {
  const [detail, setDetail] = useState<RAWGGameDetail | null>(null);
  const [screenshots, setScreenshots] = useState<RAWGScreenshot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) return;

    let isCurrent = true;
    setLoading(true);
    setError(null);

    async function loadData() {
      try {
        const [gameData, screenData] = await Promise.all([
          getGameDetails(gameId!),
          getGameScreenshots(gameId!).catch(() => ({ count: 0, next: null, previous: null, results: [] })),
        ]);

        if (isCurrent) {
          setDetail(gameData);
          setScreenshots(screenData.results || []);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err instanceof Error ? err.message : 'Error al obtener la ficha del juego');
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadData();

    // Bloquear scroll de fondo
    document.body.style.overflow = 'hidden';

    // Manejar tecla escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImage) {
          setLightboxImage(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isCurrent = false;
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameId, lightboxImage, onClose]);

  if (!gameId) return null;

  const handleShare = () => {
    if (!detail) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onNotify('¡Enlace del juego copiado al portapapeles!', 'success');
    }
  };

  const backdropImage =
    detail?.background_image_additional || detail?.background_image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#131829] border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col">
        
        {/* Loading State */}
        {loading && (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <p className="font-chakra text-slate-300">Cargando detalles de RAWG...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-12 text-center">
            <h3 className="text-rose-400 font-chakra text-xl font-bold mb-2">Error al cargar el juego</h3>
            <p className="text-slate-400 text-sm mb-6">{error}</p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-chakra font-bold text-sm"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Loaded Content */}
        {!loading && detail && (
          <div className="overflow-y-auto custom-scrollbar flex-1">
            {/* Hero Header */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden">
              <img
                src={backdropImage}
                alt={detail.name}
                className="w-full h-full object-cover filter brightness-[0.45]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131829] via-[#131829]/50 to-transparent" />

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer z-20"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Game Hero Info */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {detail.metacritic && (
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${getMetacriticColor(
                        detail.metacritic
                      )}`}
                    >
                      METASCORE {detail.metacritic}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    {(detail.rating || 0).toFixed(1)} / 5 ({detail.ratings_count || 0} votos)
                  </span>
                  {detail.released && (
                    <span className="px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 border border-slate-700 text-xs font-mono">
                      {detail.released.split('-')[0]}
                    </span>
                  )}
                </div>

                <h2 className="font-chakra font-extrabold text-2xl sm:text-4xl md:text-5xl text-white tracking-wide leading-tight">
                  {detail.name}
                </h2>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Action Buttons Bar */}
              <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-purple-500/20">
                <button
                  type="button"
                  onClick={() => onToggleWishlist(detail)}
                  className={`px-5 py-2.5 rounded-xl font-chakra font-bold text-sm flex items-center gap-2 transition cursor-pointer ${
                    isInWishlist
                      ? 'bg-rose-600/20 border border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-neon-purple'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span>{isInWishlist ? 'En tu Wishlist' : 'Añadir a Wishlist'}</span>
                </button>

                {detail.website && (
                  <a
                    href={detail.website}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-4 py-2.5 bg-[#0A0E1A] hover:bg-slate-900 border border-purple-500/30 rounded-xl text-slate-200 text-sm font-chakra flex items-center gap-2 transition"
                  >
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Sitio Oficial</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                )}

                {detail.metacritic_url && (
                  <a
                    href={detail.metacritic_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-4 py-2.5 bg-[#0A0E1A] hover:bg-slate-900 border border-purple-500/30 rounded-xl text-slate-200 text-sm font-chakra flex items-center gap-2 transition"
                  >
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                    <span>Reseñas Metacritic</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleShare}
                  className="px-4 py-2.5 bg-[#0A0E1A] hover:bg-slate-900 border border-purple-500/30 rounded-xl text-slate-300 hover:text-white text-sm font-chakra flex items-center gap-2 transition cursor-pointer ml-auto"
                >
                  <Share2 className="w-4 h-4 text-purple-400" />
                  <span className="hidden sm:inline">Compartir</span>
                </button>
              </div>

              {/* Synopsis / Description */}
              <div>
                <h3 className="font-chakra font-bold text-lg text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Sinopsis & Descripción
                </h3>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal bg-[#0A0E1A]/60 p-5 rounded-xl border border-purple-500/20 max-h-64 overflow-y-auto">
                  {sanitizeDescription(detail.description_raw || detail.description)}
                </div>
              </div>

              {/* Screenshots Gallery */}
              {screenshots.length > 0 && (
                <div>
                  <h3 className="font-chakra font-bold text-lg text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" /> Galería de Capturas 4K
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {screenshots.slice(0, 6).map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setLightboxImage(s.image)}
                        className="group relative aspect-video rounded-lg overflow-hidden border border-purple-500/20 cursor-pointer bg-[#0A0E1A]"
                      >
                        <img
                          src={s.image}
                          alt="Screenshot"
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-cyan-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications Grid */}
              <div>
                <h3 className="font-chakra font-bold text-lg text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Ficha Técnica
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="p-4 bg-[#0A0E1A]/80 border border-purple-500/20 rounded-xl flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-mono text-slate-400">Fecha de Lanzamiento</div>
                      <div className="text-sm font-semibold text-slate-200 mt-0.5">
                        {formatDateSpanish(detail.released)}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#0A0E1A]/80 border border-purple-500/20 rounded-xl flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-mono text-slate-400">Desarrollador / Estudio</div>
                      <div className="text-sm font-semibold text-slate-200 mt-0.5">
                        {detail.developers && detail.developers.length > 0
                          ? detail.developers.map((d) => d.name).join(', ')
                          : 'No especificado'}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#0A0E1A]/80 border border-purple-500/20 rounded-xl flex items-start gap-3">
                    <Layers className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-mono text-slate-400">Géneros</div>
                      <div className="text-sm font-semibold text-slate-200 mt-0.5">
                        {detail.genres && detail.genres.length > 0
                          ? detail.genres.map((g) => g.name).join(', ')
                          : 'No especificado'}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#0A0E1A]/80 border border-purple-500/20 rounded-xl flex items-start gap-3">
                    <Cpu className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-mono text-slate-400">Plataformas Soportadas</div>
                      <div className="text-sm font-semibold text-slate-200 mt-0.5 flex flex-wrap gap-1">
                        {detail.platforms && detail.platforms.length > 0
                          ? detail.platforms.map((p) => (
                              <span
                                key={p.platform.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-slate-300"
                              >
                                {getPlatformIcon(p.platform.slug)} {p.platform.name}
                              </span>
                            ))
                          : 'No disponible'}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Popular Tags */}
              {detail.tags && detail.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Etiquetas Populares
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.tags.slice(0, 12).map((t) => (
                      <span
                        key={t.id}
                        className="px-2.5 py-1 rounded bg-[#0A0E1A] text-slate-400 text-xs font-mono border border-slate-800"
                      >
                        #{t.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* Lightbox for full screenshot */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-900 border border-slate-700 text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Captura de pantalla ampliada"
            className="max-w-full max-h-[90vh] object-contain rounded-lg border border-purple-500/40 shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
