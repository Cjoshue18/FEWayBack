import { useState, useEffect } from 'react';
import { Heart, Plus } from 'lucide-react';
import { useFavorites } from '@/app/hooks/useFavorites';
import { ProductQuickViewModal } from '@/app/components/ProductQuickViewModal';
import { CartDrawer } from '@/app/components/CartDrawer';

export interface ProductVariante {
  varId: number;
  varTalla: string;
  colorNombre: string;
  colorHex: string;
  varStock: number;
  varImgUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  badge?: string;
  inStock?: boolean;
  proDescuento?: number;
  proDescuentoInicio?: string;
  proDescuentoFin?: string;
  colors?: string[];
  colorDots?: { hex: string, imgUrl?: string }[];
  tallas?: string[];
  variantes?: ProductVariante[];
}

interface ProductCardProps {
  product: Product;
}

// Descuento vigente según rango de fechas del backend (proDescuentoInicio/Fin son ISO datetime).
export function calcularDescuento(product: Product): { activo: boolean; precioFinal: number } {
  const { price, proDescuento, proDescuentoInicio, proDescuentoFin } = product;
  if (!proDescuento || !proDescuentoInicio || !proDescuentoFin) {
    return { activo: false, precioFinal: price };
  }

  const ahora = Date.now();
  const inicio = new Date(proDescuentoInicio).getTime();
  const fin = new Date(proDescuentoFin).getTime();
  const activo = ahora >= inicio && ahora <= fin;

  return {
    activo,
    precioFinal: activo ? price - price * (proDescuento / 100) : price,
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const wishlisted = isFavorite(product.id);
  const { activo: descuentoActivo, precioFinal } = calcularDescuento(product);
  const [selectedColorImg, setSelectedColorImg] = useState<string | null>(null);

  // Preload de imágenes para que el hover sea instantáneo
  useEffect(() => {
    if (product.colorDots) {
      product.colorDots.forEach(dot => {
        if (dot.imgUrl) {
          const img = new Image();
          img.src = dot.imgUrl;
        }
      });
    }
  }, [product.colorDots]);

  const displayedImage = selectedColorImg || product.image;

  return (
    <>
      <div
        className="group cursor-pointer bg-white overflow-hidden transition-all duration-300"
        style={{
          boxShadow: isHovered
            ? '0 16px 40px rgba(124,58,237,0.13), 0 4px 16px rgba(0,0,0,0.06)'
            : '0 2px 12px rgba(124,58,237,0.07), 0 1px 4px rgba(0,0,0,0.04)',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ── Image — clic abre la vista previa, como en Ripley ── */}
        <div
          className="relative aspect-[3/4] overflow-hidden bg-gray-50"
          onClick={() => setModalOpen(true)}
        >

          {/* badges */}
          {product.badge && product.inStock !== false && (
            <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-white text-xs uppercase tracking-wide bg-[#7c3aed]">
              {product.badge}
            </span>
          )}
          {product.inStock === false && (
            <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-white text-xs uppercase tracking-wide bg-gray-400">
              Agotado
            </span>
          )}

          {/* main image */}
          <img
            src={displayedImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
            style={{ opacity: isHovered && product.hoverImage && !selectedColorImg ? 0 : 1 }}
          />

          {/* hover / alternate image — smooth fade */}
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
              style={{ opacity: isHovered ? 1 : 0 }}
            />
          )}

          {/* wishlist — visible on hover */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              opacity: isHovered ? 1 : 0,
              boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Heart
              className="w-4 h-4"
              style={{ color: wishlisted ? '#7c3aed' : '#9ca3af', fill: wishlisted ? '#7c3aed' : 'none' }}
            />
          </button>
        </div>

        {/* ── Info row: title + price + "+" ── */}
        <div className="px-3.5 pt-3 pb-3.5 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-gray-800 mb-0.5 transition-colors duration-200"
              style={{ fontSize: 13, fontWeight: 500, color: isHovered ? '#7c3aed' : '' }}
            >
              {product.name}
            </p>
            <div className="flex items-baseline gap-1.5">
              {descuentoActivo ? (
                <>
                  <span className="line-through text-gray-400" style={{ fontSize: 12 }}>
                    S/ {product.price.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 17, fontWeight: 800, color: '#7c3aed' }}>
                    S/ {precioFinal.toFixed(2)}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: 17, fontWeight: 800, color: '#7c3aed' }}>
                  S/ {product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* quick-view "+" button */}
          <button
            onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
            disabled={product.inStock === false}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Ver producto"
            style={{
              background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
              boxShadow: '2px 2px 8px rgba(124,58,237,0.3)',
            }}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={3} />
          </button>
        </div>

        {/* ── Color Dots (Ripley Style) ── */}
        {product.colorDots && product.colorDots.length > 0 && (
          <div className="px-3.5 pb-3.5 flex items-center gap-1.5 flex-wrap">
            {product.colorDots.slice(0, 4).map((dot, index) => {
              const isMulti = index === 3 && product.colorDots!.length > 4;
              if (isMulti) {
                return (
                  <button
                    key="multi"
                    onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
                    className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center transition-transform hover:scale-110"
                    style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
                    title="Ver más colores"
                  >
                    <span className="text-[11px] font-bold text-white shadow-sm mix-blend-difference">+</span>
                  </button>
                );
              }

              return (
                <button
                  key={dot.hex}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dot.imgUrl) setSelectedColorImg(dot.imgUrl);
                  }}
                  onMouseEnter={() => {
                    if (dot.imgUrl) setSelectedColorImg(dot.imgUrl);
                  }}
                  className={`w-5 h-5 rounded-full border transition-transform hover:scale-110 ${selectedColorImg === dot.imgUrl || (!selectedColorImg && index === 0) ? 'border-gray-800 scale-110' : 'border-gray-300'}`}
                  style={{ backgroundColor: dot.hex }}
                  title={dot.hex}
                />
              );
            })}
          </div>
        )}
      </div>

      {modalOpen && (
        <ProductQuickViewModal
          product={product}
          onClose={() => setModalOpen(false)}
          onAdded={() => { setModalOpen(false); setCartDrawerOpen(true); }}
        />
      )}

      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} />
    </>
  );
}
