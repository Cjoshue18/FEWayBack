import { useState } from 'react';
import { useParams } from 'react-router';
import { FilterSidebar } from '../components/FilterSidebar';
import type { ProductFilters, SortOption } from '../types/database';

const CATEGORY_LABELS: Record<string, string> = {
  falda:      'Falda',
  shorts:     'Shorts',
  jogger:     'Jogger',
  camisetas:  'Camisetas',
  sueteres:   'Suéteres',
  chaquetas:  'Chaquetas',
  'sets-baggy': 'Sets Baggy',
  'sets-denim': 'Sets Denim',
  'sets-depor': 'Sets Depor',
};

const DEFAULT_FILTERS: ProductFilters = {
  sexo: [],
  colors: [],
  tallas: [],
  soloDisponibles: false,
  precioMin: 0,
  precioMax: 500,
};

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div style={{ aspectRatio: '3/4', background: '#f3f4f6' }} />
      <div className="mt-3 space-y-2">
        <div style={{ height: 12, background: '#f3f4f6', width: '70%' }} />
        <div style={{ height: 11, background: '#f3f4f6', width: '40%' }} />
      </div>
    </div>
  );
}

export function CategoryPage() {
  const { categoryId } = useParams();
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [sort, setSort]       = useState<SortOption>('recientes');

  const label = categoryId ? (CATEGORY_LABELS[categoryId] ?? categoryId) : 'Categoría';

  const hasActiveFilters =
    filters.sexo.length > 0 ||
    filters.colors.length > 0 ||
    filters.tallas.length > 0 ||
    filters.soloDisponibles ||
    filters.precioMin > 0 ||
    filters.precioMax < 500;

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* ── Category header ── */}
      <div
        className="border-b border-gray-100"
        style={{ paddingTop: 48, paddingBottom: 32 }}
      >
        <div className="container mx-auto px-6">
          <p
            className="uppercase"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#9ca3af', marginBottom: 8 }}
          >
            Wayback · Catálogo
          </p>
          <h1
            style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, color: '#111', letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            {label}
          </h1>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto px-6 py-10">
        <div className="flex gap-10">
          <FilterSidebar filters={filters} setFilters={setFilters} />

          <div className="flex-1 min-w-0">
            {/* toolbar */}
            <div className="flex items-center justify-between mb-8">
              <p style={{ fontSize: 13, color: '#9ca3af' }}>
                {hasActiveFilters ? 'Filtrando resultados' : 'Todos los productos'}
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bg-white border border-gray-200 text-gray-600 px-3 py-2 focus:outline-none focus:border-gray-400 transition-colors"
                style={{ fontSize: 12, letterSpacing: '0.04em' }}
              >
                <option value="recientes">Más recientes</option>
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
              </select>
            </div>

            {/* skeleton grid — products arrive from backend */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>

            {/* coming soon notice */}
            <div
              className="mt-16 text-center py-16 border border-gray-100"
              style={{ background: '#fafafa' }}
            >
              <p
                className="uppercase"
                style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#9ca3af', marginBottom: 12 }}
              >
                Pronto disponible
              </p>
              <p
                style={{ fontSize: 20, fontWeight: 700, color: '#111', letterSpacing: '-0.02em', marginBottom: 8 }}
              >
                Catálogo en preparación
              </p>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>
                Las prendas de {label} estarán disponibles pronto.<br />
                Suscríbete para ser el primero en enterarte.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="mt-6 px-6 py-2.5 border border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                  style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
