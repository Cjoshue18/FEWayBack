import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { X, ChevronRight } from 'lucide-react';
import { getCategorias } from '@/lib/api';
import type { Categoria } from '@/lib/api';

interface CategoryMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryMenu({
  isOpen,
  onClose,
}: CategoryMenuProps) {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    getCategorias().then(setCategorias).catch(console.error);
  }, []);

  const go = (id: number) => {
    navigate(`/catalogo?categoria=${id}`);
    onClose();
  };


  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.45)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className="fixed top-0 left-0 h-full z-50 bg-white flex flex-col"
        style={{
          width: 300,
          transform: isOpen
            ? 'translateX(0)'
            : 'translateX(-100%)',
          transition:
            'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isOpen
            ? '4px 0 32px rgba(0,0,0,0.12)'
            : 'none',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{
            borderBottom: '1px solid #f3f4f6',
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: '#7c3aed',
              textTransform: 'uppercase',
            }}
          >
            WAYBACK
          </span>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-700"
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-5">
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: '#9ca3af',
                textTransform: 'uppercase',
                paddingLeft: 12,
                marginBottom: 8,
              }}
            >
              Categorías
            </p>

            {categorias.map((cat) => (
              <button
                key={cat.cat_id}
                onClick={() => go(cat.cat_id)}
                className="flex items-center justify-between w-full px-3 py-3.5 group hover:bg-[rgba(124,58,237,0.05)] transition-colors"
                style={{ borderRadius: 6 }}
              >
                <span
                  className="group-hover:text-[#7c3aed] transition-colors"
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#374151',
                  }}
                >
                  {cat.cat_nombre}
                </span>

                <ChevronRight
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[#7c3aed]"
                  style={{
                    width: 15,
                    height: 15,
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex-shrink-0 px-6 py-4"
          style={{
            borderTop: '1px solid #f3f4f6',
            background: '#fafafa',
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: '#9ca3af',
              letterSpacing: '0.06em',
            }}
          >
            Moda Y2K · Archivo vintage · SS25
          </p>
        </div>
      </div>
    </>
  );
}