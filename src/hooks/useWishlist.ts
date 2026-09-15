import { useCallback, useEffect, useState } from 'react';
import { WishlistItem } from '../types';

const STORAGE_KEY = 'nexus_wishlist';

export function useWishlist(onNotify?: (msg: string, type?: 'info' | 'success' | 'error') => void) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Guardar en localStorage cuando cambian los elementos
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error al guardar lista de deseados:', e);
    }
  }, [items]);

  const isInWishlist = useCallback(
    (gameId: number) => {
      return items.some((item) => item.id === gameId);
    },
    [items]
  );

  const toggleWishlist = useCallback(
    (game: { id: number; name: string; background_image: string | null; rating: number; metacritic: number | null }) => {
      setItems((prev) => {
        const exists = prev.some((item) => item.id === game.id);
        if (exists) {
          onNotify?.(`Eliminado de tu lista: ${game.name}`, 'info');
          return prev.filter((item) => item.id !== game.id);
        } else {
          onNotify?.(`¡Añadido a tu lista de deseados!`, 'success');
          return [
            ...prev,
            {
              id: game.id,
              name: game.name,
              background_image: game.background_image,
              rating: game.rating,
              metacritic: game.metacritic,
              added_at: Date.now(),
            },
          ];
        }
      });
    },
    [onNotify]
  );

  const removeFromWishlist = useCallback(
    (gameId: number) => {
      setItems((prev) => {
        const found = prev.find((item) => item.id === gameId);
        if (found) {
          onNotify?.(`Eliminado de deseados: ${found.name}`, 'info');
        }
        return prev.filter((item) => item.id !== gameId);
      });
    },
    [onNotify]
  );

  const clearWishlist = useCallback(() => {
    if (items.length === 0) return;
    setItems([]);
    onNotify?.('Lista de deseados vaciada', 'info');
  }, [items.length, onNotify]);

  return {
    items,
    count: items.length,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
  };
}
