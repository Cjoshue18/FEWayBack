import { useState } from 'react';
import {
  User, Mail, Phone, FileText, Lock,
  Edit2, ShoppingBag, MapPin, CreditCard,
  AlertCircle, RefreshCw, CheckCircle,
} from 'lucide-react';
import { useProfile, type UpdateProfilePayload } from '../hooks/useProfile';

// ── Skeleton ──
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

// ── Error ──
function ProfileError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-10 shadow-sm border border-red-100 max-w-md w-full text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-base font-bold uppercase tracking-wider text-gray-900 mb-2">No se pudo cargar el perfil</h2>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <button onClick={onRetry} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7c3aed] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#6d28d9] transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Reintentar
        </button>
      </div>
    </div>
  );
}

// ── Modal de edición de perfil ──
function EditProfileModal({
  initialData, saving, onSave, onClose,
}: {
  initialData: { nombres: string; apellidos: string; usuUsername: string; usuEmail: string; telefono: string };
  saving: boolean;
  onSave: (p: UpdateProfilePayload) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState(initialData);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const set = (field: keyof typeof form, val: string) =>
    setForm((p) => ({ ...p, [field]: val }));

  const handleSubmit = async () => {
    setSaveError(null);
    try {
      await onSave({
        cliNombre:   form.nombres.trim(),
        cliApellido: form.apellidos.trim(),
        usuUsername: form.usuUsername.trim(),
        usuEmail:    form.usuEmail.trim(),
        cliTelefono: form.telefono.trim() || null,
      });
      setSaved(true);
      setTimeout(onClose, 700);
    } catch {
      setSaveError('No se pudieron guardar los cambios.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-900">Editar información</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {([
            { label: 'Nombres',          field: 'nombres'     as const },
            { label: 'Apellidos',         field: 'apellidos'   as const },
            { label: 'Nombre de usuario', field: 'usuUsername' as const },
            { label: 'Correo electrónico',field: 'usuEmail'    as const },
            { label: 'Teléfono',          field: 'telefono'    as const },
          ]).map(({ label, field }) => (
            <div key={field} className={field === 'usuEmail' || field === 'telefono' ? 'sm:col-span-2' : ''}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</label>
              <input
                type="text"
                value={form[field]}
                onChange={(e) => set(field, e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]"
              />
            </div>
          ))}
        </div>
        {saveError && <p className="text-xs text-red-500 font-medium mb-4">{saveError}</p>}
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-800 transition-colors">Cancelar</button>
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

// ── InfoField helper ──
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

// ── COMPONENTE PRINCIPAL ──
export function UserProfilePage() {
  const { profile, loading, error, saving, refetch, updateProfile } = useProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (loading) return <ProfileSkeleton />;
  if (error || !profile) return <ProfileError message={error ?? 'Error desconocido'} onRetry={refetch} />;

  const fullName = [profile.nombre, profile.apellido].filter(Boolean).join(' ') || 'Usuario Wayback';
  const initial  = fullName.charAt(0).toUpperCase();

  const quickActions = [
    { icon: ShoppingBag, label: 'Mis pedidos',     description: 'Historial de compras',    href: '/perfil/pedidos',      disabled: false },
    { icon: MapPin,      label: 'Mis direcciones',  description: 'Direcciones de envío',    href: '/perfil/direcciones',  disabled: false },
    { icon: CreditCard,  label: 'Métodos de pago',  description: 'Próximamente disponible', href: '#',                    disabled: true  },
  ];

  return (
    <>
      {isEditOpen && (
        <EditProfileModal
          initialData={{
            nombres:     profile.nombre,
            apellidos:   profile.apellido,
            usuUsername: profile.username,
            usuEmail:    profile.email,
            telefono:    profile.telefono ?? '',
          }}
          saving={saving}
          onSave={async (payload) => { await updateProfile(payload); }}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl mb-8 font-black uppercase tracking-tight text-[#7c3aed]">Mi Perfil</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(124,58,237,0.15)]">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-5xl font-black mb-4 shadow-inner select-none">
                    {initial}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">{fullName}</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">@{profile.username}</p>
                  <p className="text-[#7c3aed] text-xs font-bold uppercase tracking-wider mb-3">
                    {profile.role === 'admin' ? 'Administrador del Sistema' : 'Cliente Registrado'}
                  </p>
                  {profile.fechaRegistro && (
                    <p className="text-gray-300 text-[10px] font-medium">
                      Miembro desde{' '}
                      {new Date(profile.fechaRegistro).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(124,58,237,0.15)]">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-4">Accesos rápidos</h3>
                <div className="space-y-2">
                  {quickActions.map(({ icon: Icon, label, description, href, disabled }) => (
                    <a
                      key={label}
                      href={disabled ? undefined : href}
                      aria-disabled={disabled}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                        disabled
                          ? 'border-gray-100 opacity-40 cursor-not-allowed'
                          : 'border-[rgba(124,58,237,0.08)] hover:border-[rgba(124,58,237,0.25)] hover:bg-[rgba(124,58,237,0.02)] cursor-pointer'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-[rgba(124,58,237,0.06)] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#7c3aed]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{label}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="lg:col-span-2 space-y-6">
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
                  <InfoField icon={Mail}     label="Correo electrónico"                value={profile.email} />
                  <InfoField icon={User}     label="Nombre de usuario"                 value={`@${profile.username}`} />
                  <InfoField icon={FileText} label={`Documento (${profile.tipoDocumento})`} value={profile.documento || 'No registrado'} empty={!profile.documento} />
                  <InfoField icon={Phone}    label="Teléfono"                          value={profile.telefono || 'No especificado'} empty={!profile.telefono} />
                </div>
              </div>

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