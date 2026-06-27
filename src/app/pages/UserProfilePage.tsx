import { useState } from 'react';
import {
  User, Mail, FileText, Lock,
  Edit2, ShoppingBag, MapPin, CreditCard,
  AlertCircle, RefreshCw, CheckCircle, Calendar,
  Plus, Trash2, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // 🔑 Volvemos al origen confiable de datos
import {
  useProfile, useDirecciones,
  type UpdateProfilePayload, type Direccion, type DireccionPayload
} from '../hooks/useProfile';

// ── SKELETON DE CARGA ELEGANTE ──
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="h-9 w-48 bg-gray-200 rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
            <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse mx-auto" />
            <div className="h-5 w-36 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="space-y-2">
                      <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MODAL DE EDICIÓN (Mantenemos la UX de la rama perfil) ──
function EditProfileModal({
  initialData,
  saving,
  onSave,
  onClose,
}: {
  initialData: { name: string; username: string; email: string };
  saving: boolean;
  onSave: (payload: UpdateProfilePayload) => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
}) {
  const [form, setForm] = useState(initialData);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof form, val: string) =>
    setForm((p) => ({ ...p, [field]: val }));

  const handleSubmit = async () => {
    setSaveError(null);

    // El backend espera nombre y apellido por separado (cliNombre / cliApellido).
    const [cliNombre, ...resto] = form.name.trim().split(/\s+/);

    const result = await onSave({
      cliNombre: cliNombre || '',
      cliApellido: resto.join(' '),
      usuUsername: form.username.trim(),
      usuEmail: form.email.trim(),
    });

    if (result.success) {
      setSaved(true);
      setTimeout(onClose, 800);
    } else {
      setSaveError(result.error ?? 'No se pudieron guardar los cambios en el servidor.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-900">Editar información</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Nombre Completo', field: 'name' as const },
            { label: 'Nombre de usuario', field: 'username' as const },
            { label: 'Correo electrónico', field: 'email' as const },
          ].map(({ label, field }) => (
            <div key={field} className={field === 'email' ? 'sm:col-span-2' : ''}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</label>
              <input
                type="text"
                value={form[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]"
              />
            </div>
          ))}
        </div>

        {saveError && <p className="text-xs text-red-500 font-medium mb-4">{saveError}</p>}

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-800">Cancelar</button>
          <button
            onClick={handleSubmit}
            disabled={saving || saved}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#7c3aed] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#6d28d9] transition-colors"
          >
            {saved ? <><CheckCircle className="w-3.5 h-3.5" /> Guardado</>
              : saving ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Guardando…</>
              : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MODAL DE DIRECCIÓN (crear / editar) ──
function DireccionFormModal({
  initialData,
  saving,
  onSave,
  onClose,
}: {
  initialData: DireccionPayload;
  saving: boolean;
  onSave: (payload: DireccionPayload) => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
}) {
  const [form, setForm] = useState(initialData);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleChange = (field: keyof DireccionPayload, val: string | boolean) =>
    setForm((p) => ({ ...p, [field]: val }));

  const handleSubmit = async () => {
    setSaveError(null);
    const result = await onSave(form);
    if (result.success) onClose();
    else setSaveError(result.error ?? 'No se pudo guardar la dirección.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-900">Dirección de envío</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Calle / Dirección</label>
            <input
              type="text"
              value={form.DirCalle}
              onChange={(e) => handleChange('DirCalle', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Distrito</label>
            <input
              type="text"
              value={form.DirDistrito}
              onChange={(e) => handleChange('DirDistrito', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Provincia</label>
            <input
              type="text"
              value={form.DirProvincia}
              onChange={(e) => handleChange('DirProvincia', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Departamento</label>
            <input
              type="text"
              value={form.DirDepartamento}
              onChange={(e) => handleChange('DirDepartamento', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Referencia</label>
            <input
              type="text"
              value={form.DirReferencia}
              onChange={(e) => handleChange('DirReferencia', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={form.DirPreferido}
            onChange={(e) => handleChange('DirPreferido', e.target.checked)}
            className="accent-[#7c3aed]"
          />
          <span className="text-xs text-gray-600">Usar como dirección preferida</span>
        </label>

        {saveError && <p className="text-xs text-red-500 font-medium mb-4">{saveError}</p>}

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-800">Cancelar</button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#7c3aed] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#6d28d9] transition-colors"
          >
            {saving ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Guardando…</> : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── COMPONENTE AUXILIAR PARA CAMPOS DE INFORMACIÓN ──
function InfoField({ icon: Icon, label, value, empty = false }: { icon: React.ElementType; label: string; value: string; empty?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-[rgba(124,58,237,0.04)] flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[#7c3aed]" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
        <p className={`text-sm font-medium ${empty ? 'text-gray-400 italic' : 'text-gray-800'}`}>{value}</p>
      </div>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL UNIFICADO ──
export function UserProfilePage() {
  const { user, updateUser } = useAuth(); // Usamos las propiedades seguras que sí pintaban datos en main
  const { profile, loading: profileLoading, error: profileError, saving, updateProfile, refetch } = useProfile();
  const {
    direcciones, loading: direccionesLoading, saving: direccionSaving,
    crearDireccion, editarDireccion, eliminarDireccion,
  } = useDirecciones();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [direccionModal, setDireccionModal] = useState<{ mode: 'create' | 'edit'; direccion?: Direccion } | null>(null);

  // Si los datos globales de autenticación se están recuperando
  if (!user) return <ProfileSkeleton />;

  // GET /api/profile/mi-perfil ya resolvió: usamos esos datos como fuente de verdad.
  // Mientras carga (o si falla), mantenemos lo que ya teníamos en AuthContext para no parpadear.
  const nombreCompleto = profile ? `${profile.nombre} ${profile.apellido}`.trim() : '';
  const fullName = nombreCompleto || user.name || 'Usuario Wayback';
  const cleanUsernameRaw = profile?.username || user.username;
  const cleanUsername = cleanUsernameRaw ? cleanUsernameRaw.replace(/^@/, '') : 'sin_username';
  const email = profile?.email || user.email || '';
  const documento = profile?.documento || user.documento;
  const tipoDocumento = profile?.tipoDocumento || user.tipoDocumento;
  const initial = fullName.charAt(0).toUpperCase();

  const handleSaveProfile = async (payload: UpdateProfilePayload) => {
    const result = await updateProfile(payload);
    if (result.success) {
      updateUser({
        name: `${payload.cliNombre ?? ''} ${payload.cliApellido ?? ''}`.trim(),
        username: payload.usuUsername,
        email: payload.usuEmail,
      });
    }
    return result;
  };

  const handleSaveDireccion = (payload: DireccionPayload) =>
    direccionModal?.mode === 'edit' && direccionModal.direccion
      ? editarDireccion(direccionModal.direccion.dirId, payload)
      : crearDireccion(payload);

  const handleDeleteDireccion = (dirId: number) => {
    if (window.confirm('¿Eliminar esta dirección?')) eliminarDireccion(dirId);
  };

  return (
    <>
      {isEditOpen && (
        <EditProfileModal
          initialData={{
            name: fullName,
            username: cleanUsername,
            email,
          }}
          saving={saving}
          onSave={handleSaveProfile}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      {direccionModal && (
        <DireccionFormModal
          initialData={
            direccionModal.direccion
              ? {
                  DirCalle: direccionModal.direccion.dirCalle,
                  DirDistrito: direccionModal.direccion.dirDistrito,
                  DirProvincia: direccionModal.direccion.dirProvincia,
                  DirDepartamento: direccionModal.direccion.dirDepartamento,
                  DirReferencia: direccionModal.direccion.dirReferencia,
                  DirPreferido: direccionModal.direccion.dirPreferido,
                }
              : { DirCalle: '', DirDistrito: '', DirProvincia: '', DirDepartamento: '', DirReferencia: '', DirPreferido: false }
          }
          saving={direccionSaving}
          onSave={handleSaveDireccion}
          onClose={() => setDireccionModal(null)}
        />
      )}

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl mb-8 font-black uppercase tracking-tight text-[#7c3aed]">Mi Perfil</h1>

          {profileError && (
            <div className="mb-6 flex items-center justify-between gap-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{profileError}</span>
              </div>
              <button
                onClick={refetch}
                disabled={profileLoading}
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider hover:underline disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${profileLoading ? 'animate-spin' : ''}`} /> Reintentar
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLUMNA IZQUIERDA (Avatar + Tarjeta rápida) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(124,58,237,0.15)]">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-5xl font-black mb-4 shadow-inner select-none">
                    {initial}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">{fullName}</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">@{cleanUsername}</p>
                  <p className="text-[#7c3aed] text-xs font-bold uppercase tracking-wider">
                    {user.role === 'admin' ? 'Administrador del Sistema' : 'Cliente Registrado'}
                  </p>
                </div>
              </div>

              {/* Estadísticas Rápidas (Recuperadas de Main) */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(124,58,237,0.15)]">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-4">Estadísticas</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Órdenes totales</span>
                    <span className="font-bold text-[#7c3aed]">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Favoritos</span>
                    <span className="font-bold text-[#7c3aed]">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Club Wayback Puntos</span>
                    <span className="font-bold text-black">150 pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA (Información detallada + Historial) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Bloque de Información del Perfil */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(124,58,237,0.15)]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold uppercase tracking-wider text-gray-900">Información de la cuenta</h3>
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="text-[#7c3aed] hover:underline text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Modificar
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField icon={Mail} label="Correo electrónico" value={email || 'No registrado'} />
                  <InfoField icon={User} label="Nombre de usuario" value={`@${cleanUsername}`} />
                  <InfoField
                    icon={FileText}
                    label={`Documento (${tipoDocumento || 'DNI'})`}
                    value={documento || 'No registrado'}
                    empty={!documento}
                  />
                </div>
              </div>

              {/* Mis Direcciones */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(124,58,237,0.15)]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#7c3aed]" /> Mis Direcciones
                  </h3>
                  <button
                    onClick={() => setDireccionModal({ mode: 'create' })}
                    className="text-[#7c3aed] hover:underline text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar
                  </button>
                </div>

                {direccionesLoading ? (
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Cargando direcciones…
                  </p>
                ) : direcciones.length === 0 ? (
                  <p className="text-xs text-gray-400">
                    Aún no tienes direcciones guardadas. Agrega una para poder completar tus pedidos.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {direcciones.map((dir) => (
                      <div
                        key={dir.dirId}
                        className="flex items-start justify-between gap-3 p-3 rounded-xl border border-[rgba(124,58,237,0.1)]"
                      >
                        <div className="text-sm text-gray-700">
                          <p className="font-medium text-gray-900">
                            {dir.dirCalle}, {dir.dirDistrito}
                            {dir.dirPreferido && (
                              <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#7c3aed]">
                                <Star className="w-3 h-3 fill-[#7c3aed]" /> Preferida
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400">
                            {dir.dirProvincia}, {dir.dirDepartamento}
                            {dir.dirReferencia ? ` • ${dir.dirReferencia}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => setDireccionModal({ mode: 'edit', direccion: dir })}
                            className="text-gray-400 hover:text-[#7c3aed] transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDireccion(dir.dirId)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Órdenes Recientes (Rescatado el diseño limpio de Main) */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(124,58,237,0.15)]">
                <h3 className="text-base font-bold uppercase tracking-wider text-gray-900 mb-6">Órdenes Recientes</h3>
                <div className="space-y-4">
                  {[
                    { id: '#WAY-2026-003', date: '12 Jun 2026', status: 'En preparación', amount: 'S/ 189.00', items: 1 },
                    { id: '#WAY-2026-002', date: '28 May 2026', status: 'Entregado', amount: 'S/ 320.00', items: 2 },
                    { id: '#WAY-2026-001', date: '10 May 2026', status: 'Entregado', amount: 'S/ 95.00', items: 1 },
                  ].map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-[rgba(124,58,237,0.08)] hover:border-[rgba(124,58,237,0.2)] transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-900 mb-0.5">{order.id}</p>
                        <p className="text-xs text-gray-400 font-medium">{order.date} • {order.items} {order.items === 1 ? 'artículo' : 'artículos'}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-bold text-sm text-gray-900">{order.amount}</p>
                          <p className={`text-xs font-bold uppercase tracking-wider ${order.status === 'Entregado' ? 'text-green-600' : 'text-[#7c3aed]'}`}>
                            {order.status}
                          </p>
                        </div>
                        <button className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors">
                          Detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seguridad */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(124,58,237,0.15)]">
                <h3 className="text-base font-bold uppercase tracking-wider text-gray-900 mb-6">Seguridad</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[rgba(124,58,237,0.04)] flex items-center justify-center">
                      <Lock className="w-5 h-5 text-[#7c3aed]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Credenciales</p>
                      <p className="text-xs text-gray-400">Contraseña encriptada en el servidor</p>
                    </div>
                  </div>
                  <button className="text-[#7c3aed] hover:underline text-xs font-bold uppercase tracking-wider">
                    Cambiar contraseña
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}