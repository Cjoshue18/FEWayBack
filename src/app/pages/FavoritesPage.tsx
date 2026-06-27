import { Heart } from 'lucide-react';
import { useFavorites } from '@/app/hooks/useFavorites';
import { ProductCard } from '@/app/components/ProductCard';

export function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-[#7c3aed] fill-[#7c3aed]" />

            <h1 className="text-3xl font-bold text-[#7c3aed]">
              Mis Favoritos
            </h1>
          </div>

          <p className="text-gray-500">
            {favorites.length} {favorites.length === 1 ? 'artículo guardado' : 'artículos guardados'}
          </p>
        </div>

        {favorites.length === 0 ? (
          /* Estado vacío */
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-[rgba(124,58,237,0.15)]">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />

            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Tu lista de favoritos está vacía
            </h2>

            <p className="text-gray-500 mb-8">
              Guarda tus productos favoritos para encontrarlos fácilmente más tarde.
            </p>

            <a
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors"
            >
              Explorar productos
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
