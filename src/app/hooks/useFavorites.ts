import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/app/components/ProductCard';

const FAVORITES_STORAGE_KEY = 'wayback_favorites';
const FAVORITES_EVENT = 'wayback-favorites-changed';

function readFavorites(): Product[] {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function writeFavorites(favorites: Product[]) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // Cuota excedida o localStorage no disponible (modo privado): se ignora.
  }
  window.dispatchEvent(new Event(FAVORITES_EVENT));
}

// Sin endpoint de backend para favoritos (a la fecha): persistencia 100% cliente.
// El evento custom sincroniza todas las instancias de useFavorites en la misma pestaña;
// el evento "storage" las sincroniza entre pestañas.
export function useFavorites() {
  const [favorites, setFavorites] = useState<Product[]>(() => readFavorites());

  useEffect(() => {
    const sync = () => setFavorites(readFavorites());
    window.addEventListener(FAVORITES_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.some((p) => p.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((product: Product) => {
    const current = readFavorites();
    const exists = current.some((p) => p.id === product.id);
    const next = exists
      ? current.filter((p) => p.id !== product.id)
      : [...current, product];
    writeFavorites(next);
    setFavorites(next);
  }, []);

  const removeFavorite = useCallback((id: number) => {
    const next = readFavorites().filter((p) => p.id !== id);
    writeFavorites(next);
    setFavorites(next);
  }, []);

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}
