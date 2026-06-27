import { useState } from 'react';
import { toast } from 'sonner';
import { ShoppingBag, Minus, Plus, Trash2, Tag, Truck, ShieldCheck, MapPin, RefreshCw, QrCode } from 'lucide-react';
import { useCart } from '@/app/hooks/useCart';
import { useDirecciones } from '@/app/hooks/useProfile';
import { crearPedido } from '@/lib/api';
import { Toaster } from '@/app/components/ui/sonner';

export function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const { direcciones, loading: direccionesLoading } = useDirecciones();
  const [couponCode, setCouponCode] = useState('');

  const [selectedDirId, setSelectedDirId] = useState<number | null>(null);
  const [numeroYape, setNumeroYape] = useState('');
  const [codigoAprobacion, setCodigoAprobacion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1500 ? 0 : 150;
  const discount = 0;
  const total = subtotal + shipping - discount;

  // El backend exige VarId por ítem: si algo en el carrito no tiene variante asociada, no se puede facturar.
  const itemsSinVariante = cartItems.some((item) => !item.varId);
  const puedeConfirmar =
    !submitting &&
    cartItems.length > 0 &&
    !itemsSinVariante &&
    selectedDirId !== null &&
    /^\d{1,9}$/.test(numeroYape) &&
    /^\d{1,6}$/.test(codigoAprobacion);

  const handleConfirmarPedido = async () => {
    if (!puedeConfirmar || selectedDirId === null) return;
    setSubmitting(true);

    const result = await crearPedido({
      dirId: selectedDirId,
      NumeroYape: numeroYape,
      CodigoAprobacion: codigoAprobacion,
      Items: cartItems.map((item) => ({ VarId: item.varId as number, Cantidad: item.quantity })),
    });

    setSubmitting(false);

    if (result.success) {
      toast.success('¡Pedido confirmado! Te llegará la confirmación pronto.');
      clearCart();
      setNumeroYape('');
      setCodigoAprobacion('');
      setSelectedDirId(null);
    } else {
      toast.error(result.error ?? 'No se pudo confirmar el pedido.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="w-8 h-8 text-[#7c3aed]" />
            <h1 className="text-3xl font-bold text-[#7c3aed]">
              Mi Carrito
            </h1>
          </div>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'artículo' : 'artículos'} en tu carrito
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[rgba(124,58,237,0.15)]">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-gray-500 mb-6">
              Agrega algunos productos para comenzar tu compra
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-[#7c3aed] text-white rounded-full hover:bg-[#6d28d9] transition-colors"
            >
              Explorar productos
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.cartKey}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(124,58,237,0.15)] hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Talla: {item.size} • Color: {item.color}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.cartKey)}
                          className="p-2 hover:bg-red-50 rounded-full transition-colors text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.cartKey, -1)}
                            className="w-8 h-8 rounded-full border border-[rgba(124,58,237,0.2)] flex items-center justify-center hover:bg-[rgba(124,58,237,0.05)] transition-colors"
                          >
                            <Minus className="w-4 h-4 text-[#7c3aed]" />
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartKey, 1)}
                            className="w-8 h-8 rounded-full border border-[rgba(124,58,237,0.2)] flex items-center justify-center hover:bg-[rgba(124,58,237,0.05)] transition-colors"
                          >
                            <Plus className="w-4 h-4 text-[#7c3aed]" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-800">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500">
                              ${item.price} c/u
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Benefits */}
              <div className="bg-[rgba(124,58,237,0.04)] rounded-2xl p-6 border border-[rgba(124,58,237,0.15)]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-[#7c3aed] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm mb-1">
                        Envío gratis
                      </p>
                      <p className="text-xs text-gray-600">
                        En compras mayores a $1,500
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#7c3aed] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm mb-1">
                        Compra segura
                      </p>
                      <p className="text-xs text-gray-600">
                        Protección al comprador
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-[#7c3aed] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm mb-1">
                        Mejor precio
                      </p>
                      <p className="text-xs text-gray-600">
                        Garantía de devolución
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary + Checkout */}
            <div className="lg:col-span-1 space-y-6">
              {/* Dirección de envío */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(124,58,237,0.15)]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#7c3aed]" /> Dirección de envío
                </h3>

                {direccionesLoading ? (
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Cargando direcciones…
                  </p>
                ) : direcciones.length === 0 ? (
                  <p className="text-xs text-gray-400">
                    No tienes direcciones guardadas. Agrega una desde tu perfil antes de continuar.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {direcciones.map((dir) => (
                      <label
                        key={dir.dirId}
                        className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                        style={{ borderColor: selectedDirId === dir.dirId ? '#7c3aed' : '#e5e7eb' }}
                      >
                        <input
                          type="radio"
                          name="direccionEnvio"
                          checked={selectedDirId === dir.dirId}
                          onChange={() => setSelectedDirId(dir.dirId)}
                          className="mt-1 accent-[#7c3aed]"
                        />
                        <span className="text-sm text-gray-700">
                          {dir.dirCalle}, {dir.dirDistrito} — {dir.dirProvincia}
                          {dir.dirPreferido && (
                            <span className="ml-2 text-[10px] font-bold uppercase text-[#7c3aed]">Preferida</span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Pago con Yape */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(124,58,237,0.15)]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-4">Pago con Yape</h3>

                {/* Datos de la tienda + QR (validación manual, no es pasarela automática) */}
                <div className="rounded-2xl p-5 mb-5 bg-[rgba(124,58,237,0.04)] border border-[rgba(124,58,237,0.15)] flex flex-col sm:flex-row gap-5 items-center">
                  <div className="w-28 h-28 flex-shrink-0 rounded-xl border-2 border-dashed border-[#7c3aed]/40 bg-white flex flex-col items-center justify-center gap-1">
                    <QrCode className="w-12 h-12 text-[#7c3aed]" strokeWidth={1.5} />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">QR Yape</span>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Yapea a Wayback</p>
                    <p className="text-2xl font-black text-[#7c3aed] tracking-tight mb-3">987,654,321</p>
                    <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside text-left">
                      <li>Escanea el QR o yapea al número de la tienda.</li>
                      <li>Realiza la transferencia por el monto total.</li>
                      <li>Ingresa tu número de celular y el código de aprobación de 6 dígitos emitido por Yape abajo para confirmar tu pedido.</li>
                    </ol>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Número Yape</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={9}
                      value={numeroYape}
                      onChange={(e) => setNumeroYape(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      placeholder="987654321"
                      className="w-full px-4 py-2 border border-[rgba(124,58,237,0.2)] rounded-full focus:outline-none focus:border-[#7c3aed] text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Código de aprobación</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={codigoAprobacion}
                      onChange={(e) => setCodigoAprobacion(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      className="w-full px-4 py-2 border border-[rgba(124,58,237,0.2)] rounded-full focus:outline-none focus:border-[#7c3aed] text-sm"
                    />
                  </div>
                </div>
                {itemsSinVariante && (
                  <p className="text-xs text-red-500 mt-4">
                    Algunos productos del carrito no tienen una variante válida (talla/color). Quítalos y agrégalos de nuevo desde el catálogo.
                  </p>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(124,58,237,0.15)] sticky top-24">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Resumen de compra
                </h3>

                {/* Coupon */}
                <div className="mb-6">
                  <label className="text-sm text-gray-600 mb-2 block">
                    Código de descuento
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Ingresa tu código"
                      className="flex-1 px-4 py-2 border border-[rgba(124,58,237,0.2)] rounded-full focus:outline-none focus:border-[#7c3aed] text-sm"
                    />
                    <button className="px-6 py-2 bg-[#7c3aed] text-white rounded-full hover:bg-[#6d28d9] transition-colors text-sm">
                      Aplicar
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-[rgba(124,58,237,0.15)]">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-semibold">Gratis</span>
                      ) : (
                        `$${shipping}`
                      )}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento</span>
                      <span>-${discount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-semibold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-[#7c3aed]">
                    ${total.toLocaleString()}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleConfirmarPedido}
                  disabled={!puedeConfirmar}
                  className="w-full py-4 bg-[#7c3aed] text-white rounded-full hover:bg-[#6d28d9] transition-colors font-semibold mb-3 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? <><RefreshCw className="w-4 h-4 animate-spin" /> Confirmando…</> : 'Confirmar Pedido'}
                </button>
                {!selectedDirId && cartItems.length > 0 && (
                  <p className="text-xs text-gray-400 text-center mb-3">Selecciona una dirección de envío para continuar.</p>
                )}

                {/* Continue Shopping */}
                <a
                  href="/"
                  className="block text-center text-[#7c3aed] hover:text-[#7c3aed] text-sm"
                >
                  Continuar comprando
                </a>

                {/* Free Shipping Info */}
                {shipping > 0 && (
                  <div className="mt-6 p-4 bg-[rgba(124,58,237,0.04)] rounded-xl">
                    <p className="text-sm text-gray-600">
                      Agrega{' '}
                      <span className="font-semibold text-[#7c3aed]">
                        ${(1500 - subtotal).toLocaleString()}
                      </span>{' '}
                      más para obtener envío gratis
                    </p>
                    <div className="mt-2 w-full bg-[rgba(124,58,237,0.2)] rounded-full h-2">
                      <div
                        className="bg-[#7c3aed] h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((subtotal / 1500) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
