import { useState, useEffect, useCallback } from 'react';

export interface CartItem {
  cartKey: string;
  id: number;
  varId?: number; // ID de la variante (talla+color) — lo exige el backend al crear el pedido
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  inStock: boolean;
}

const CART_STORAGE_KEY = 'wayback_cart';
const CART_EVENT = 'wayback-cart-changed';

function readCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Cuota excedida o localStorage no disponible (modo privado): se ignora.
  }
  window.dispatchEvent(new Event(CART_EVENT));
}

// Sin backend de carrito todavía: persistencia 100% cliente, mismo patrón que useFavorites.
export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => readCart());

  useEffect(() => {
    const sync = () => setItems(readCart());
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // Misma variante (id + talla + color) acumula cantidad en vez de duplicar línea.
  const addToCart = useCallback((item: Omit<CartItem, 'cartKey' | 'quantity'>, quantity: number = 1) => {
    const cartKey = `${item.id}-${item.size}-${item.color}`;
    const current = readCart();
    const existente = current.find((i) => i.cartKey === cartKey);
    const next = existente
      ? current.map((i) => (i.cartKey === cartKey ? { ...i, quantity: i.quantity + quantity } : i))
      : [...current, { ...item, cartKey, quantity }];
    writeCart(next);
    setItems(next);
  }, []);

  const updateQuantity = useCallback((cartKey: string, delta: number) => {
    const next = readCart().map((i) =>
      i.cartKey === cartKey ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    );
    writeCart(next);
    setItems(next);
  }, []);

  const removeItem = useCallback((cartKey: string) => {
    const next = readCart().filter((i) => i.cartKey !== cartKey);
    writeCart(next);
    setItems(next);
  }, []);

  const clearCart = useCallback(() => {
    writeCart([]);
    setItems([]);
  }, []);

  return { items, addToCart, updateQuantity, removeItem, clearCart };
}
