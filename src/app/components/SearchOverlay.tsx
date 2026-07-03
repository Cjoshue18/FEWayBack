import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { getCategorias, getEstilos } from '@/lib/api';
import type { Categoria, Estilo } from '@/lib/api';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [estilos, setEstilos] = useState<Estilo[]>([]);

  useEffect(() => {
    getCategorias().then(setCategorias).catch(console.error);
    getEstilos().then(setEstilos).catch(console.error);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const goToCategory = (id: number) => {
    navigate(`/catalogo?categoria=${id}`);
    onClose();
  };

  const goToEstilo = (id: number) => {
    navigate(`/catalogo?estilo=${id}`);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const qLower = query.trim().toLowerCase();
  const filteredCats = qLower.length > 0
    ? categorias.filter((c) => c.cat_nombre.toLowerCase().includes(qLower))
    : categorias;
    
  const filteredEstilos = qLower.length > 0
    ? estilos.filter((e) => e.est_nombre.toLowerCase().includes(qLower))
    : estilos;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      {/* backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* panel */}
      <div
        className="relative z-10 bg-white w-full"
        style={{ borderBottom: '2px solid #7c3aed', boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}
      >
        {/* search bar */}
        <div className="container mx-auto px-6" style={{ paddingTop: 24, paddingBottom: 0 }}>
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <Search style={{ width: 18, height: 18, flexShrink: 0, color: '#7c3aed' }} />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar prendas, categorías..."
              className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-300"
              style={{ fontSize: 19 }}
            />

            {query && (
              <button type="button" onClick={() => setQuery('')} className="p-1.5 text-gray-300 hover:text-gray-500 transition-colors">
                <X style={{ width: 15, height: 15 }} />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors uppercase"
              style={{ fontSize: 11, letterSpacing: '0.08em', fontWeight: 600 }}
            >
              <X style={{ width: 14, height: 14 }} /> Cerrar
            </button>
          </form>

          <div className="mt-5" style={{ height: 1, background: '#f3f4f6' }} />
        </div>

        {/* categories and styles */}
        <div className="container mx-auto px-6 py-6">
          {filteredCats.length > 0 && (
            <div className="mb-6">
              <p className="mb-4 uppercase" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: '#7c3aed' }}>
                {query.trim() ? 'Categorías (Resultados)' : 'Categorías Populares'}
              </p>
              <div className="flex flex-wrap" style={{ gap: 8 }}>
                {filteredCats.map((cat) => (
                  <button
                    key={`cat-${cat.cat_id}`}
                    onClick={() => goToCategory(cat.cat_id)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 uppercase transition-all hover:border-[#7c3aed] hover:text-[#7c3aed] hover:bg-[rgba(124,58,237,0.05)]"
                    style={{ fontSize: 11, letterSpacing: '0.08em', fontWeight: 600 }}
                  >
                    {cat.cat_nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredEstilos.length > 0 && (
            <div className="mb-6">
              <p className="mb-4 uppercase" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: '#7c3aed' }}>
                {query.trim() ? 'Estilos (Resultados)' : 'Estilos'}
              </p>
              <div className="flex flex-wrap" style={{ gap: 8 }}>
                {filteredEstilos.map((est) => (
                  <button
                    key={`est-${est.est_id}`}
                    onClick={() => goToEstilo(est.est_id)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 uppercase transition-all hover:border-[#7c3aed] hover:text-[#7c3aed] hover:bg-[rgba(124,58,237,0.05)]"
                    style={{ fontSize: 11, letterSpacing: '0.08em', fontWeight: 600 }}
                  >
                    {est.est_nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredCats.length === 0 && filteredEstilos.length === 0 && (
            <p style={{ fontSize: 14, color: '#6b7280' }}>
              Sin resultados para <strong>"{query}"</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}