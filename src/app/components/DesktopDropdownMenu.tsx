import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { Menu as MenuIcon, ChevronRight } from 'lucide-react';
import { getCategorias, getEstilos } from '@/lib/api';
import type { Categoria, Estilo } from '@/lib/api';

export function DesktopDropdownMenu() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [estilos, setEstilos] = useState<Estilo[]>([]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<'categorias' | 'estilos' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCategorias().then(setCategorias).catch(console.error);
    getEstilos().then(setEstilos).catch(console.error);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveSubMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div 
      className="relative flex items-center h-full group"
      ref={menuRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => { setIsOpen(false); setActiveSubMenu(null); }}
    >
      <button 
        className="flex items-center text-gray-500 hover:text-gray-900 transition-colors h-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MenuIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-100 shadow-xl z-50 rounded-b-md"
          onMouseLeave={() => setActiveSubMenu(null)}
        >
          <div className="py-2">
            {/* Categorias item */}
            <div 
              className="relative px-4 py-3 hover:bg-gray-50 flex items-center justify-between cursor-pointer group/cat"
              onMouseEnter={() => setActiveSubMenu('categorias')}
              onClick={() => navigate('/catalogo')}
            >
              <span className="text-xs uppercase tracking-widest text-gray-700">Categorías</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              
              {/* Categorias Submenu */}
              {activeSubMenu === 'categorias' && (
                <div className="absolute top-0 left-full ml-0 w-48 bg-white border border-gray-100 shadow-xl rounded-md py-2 min-h-[100%] max-h-64 overflow-y-auto">
                  {categorias.map(cat => (
                    <div 
                      key={cat.cat_id}
                      onClick={(e) => { e.stopPropagation(); navigate(`/catalogo?categoria=${cat.cat_id}`); setIsOpen(false); }}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-xs uppercase tracking-widest text-gray-600 hover:text-[#7c3aed]"
                    >
                      {cat.cat_nombre}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Estilos item */}
            <div 
              className="relative px-4 py-3 hover:bg-gray-50 flex items-center justify-between cursor-pointer group/est"
              onMouseEnter={() => setActiveSubMenu('estilos')}
              onClick={() => navigate('/catalogo')}
            >
              <span className="text-xs uppercase tracking-widest text-gray-700">Estilos</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              
              {/* Estilos Submenu */}
              {activeSubMenu === 'estilos' && (
                <div className="absolute top-0 left-full ml-0 w-48 bg-white border border-gray-100 shadow-xl rounded-md py-2 min-h-[100%] max-h-64 overflow-y-auto">
                  {estilos.map(est => (
                    <div 
                      key={est.est_id}
                      onClick={(e) => { e.stopPropagation(); navigate(`/catalogo?estilo=${est.est_id}`); setIsOpen(false); }}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-xs uppercase tracking-widest text-gray-600 hover:text-[#7c3aed]"
                    >
                      {est.est_nombre}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
