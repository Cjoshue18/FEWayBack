import { useNavigate } from 'react-router';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/app/components/ui/sheet';
import { useCart } from '@/app/hooks/useCart';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, updateQuantity } = useCart();
  const navigate = useNavigate();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-[#7c3aed]">
            <ShoppingBag className="w-5 h-5" /> Agregado al carrito
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Tu carrito está vacío.</p>
          ) : (
            items.map((item) => (
              <div key={item.cartKey} className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg flex-shrink-0 bg-gray-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 mb-2">Talla: {item.size} • Color: {item.color}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.cartKey, -1)}
                        className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus className="w-3 h-3 text-[#7c3aed]" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartKey, 1)}
                        className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="w-3 h-3 text-[#7c3aed]" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-[#7c3aed]">S/ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <SheetFooter>
          <div className="flex items-center justify-between px-4 mb-2">
            <span className="text-sm font-semibold text-gray-600">Subtotal</span>
            <span className="text-lg font-black text-[#7c3aed]">S/ {subtotal.toFixed(2)}</span>
          </div>
          <button
            type="button"
            onClick={() => { onOpenChange(false); navigate('/carrito'); }}
            disabled={items.length === 0}
            className="w-full py-3 rounded-full text-white text-xs font-bold uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)' }}
          >
            Proceder al pago
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
