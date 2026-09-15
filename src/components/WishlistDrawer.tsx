import React, { useEffect } from 'react';
import { X, Heart, Trash2, Star, Share2, Sparkles } from 'lucide-react';
import { WishlistItem } from '../types';
import { getMetacriticColor } from '../utils/formatters';

interface WishlistDrawerProps {
  isOpen: boolean;
  items: WishlistItem[];
  onClose: () => void;
  onRemoveItem: (gameId: number) => void;
  onClearAll: () => void;
  onOpenGameDetails: (gameId: number) => void;
  onNotify: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onRemoveItem,
  onClearAll,
  onOpenGameDetails,
  onNotify,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleShareWishlist = () => {
    if (items.length === 0) return;
    const summary = `Mis juegos deseados en Nexus Games:\n${items.map((i) => `• ${i.name}`).join('\n')}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      onNotify('¡Lista de deseados copiada al portapapeles!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#131829] border-l border-purple-500/30 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-rose-400">
                <Heart className="w-4 h-4 fill-rose-400" />
              </div>
              <div>
                <h3 className="font-chakra font-bold text-white text-lg leading-tight">
                  LISTA DE DESEADOS
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  {items.length} {items.length === 1 ? 'juego guardado' : 'juegos guardados'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-[#0A0E1A] hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition"
              aria-label="Cerrar lista"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#0A0E1A] border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                  <Sparkles className="w-8 h-8 opacity-70" />
                </div>
                <h4 className="font-chakra font-bold text-white text-base mb-1">
                  Tu lista está vacía
                </h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
                  Explorá el catálogo o las tendencias y hacé clic en el corazón para guardar tus títulos favoritos.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-chakra font-bold text-xs rounded-lg shadow-neon-purple cursor-pointer"
                >
                  EXPLORAR JUEGOS
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#0A0E1A] border border-purple-500/20 hover:border-purple-500/50 rounded-xl flex items-center gap-3 transition group"
                >
                  <img
                    src={
                      item.background_image ||
                      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      onClose();
                      onOpenGameDetails(item.id);
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h5
                      onClick={() => {
                        onClose();
                        onOpenGameDetails(item.id);
                      }}
                      className="font-chakra font-bold text-sm text-white hover:text-cyan-400 truncate cursor-pointer transition"
                    >
                      {item.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-amber-400 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {(item.rating || 0).toFixed(1)}
                      </span>
                      {item.metacritic && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${getMetacriticColor(
                            item.metacritic
                          )}`}
                        >
                          {item.metacritic}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                    title="Eliminar de deseados"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="p-6 border-t border-purple-500/20 bg-[#0E1322] space-y-3">
              <button
                type="button"
                onClick={handleShareWishlist}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-chakra font-bold text-sm tracking-wide rounded-xl shadow-neon-purple flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>COMPARTIR MI LISTA</span>
              </button>

              <button
                type="button"
                onClick={onClearAll}
                className="w-full py-2 bg-transparent hover:bg-rose-950/20 text-rose-400 hover:text-rose-300 font-mono text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vaciar lista completa</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
