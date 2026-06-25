import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Estado unificado mapeado de forma idéntica al backend DTO
  const [form, setForm] = useState({
    Email: '',
    NombreUsuario: '',
    Contrasena: '',
    Nombres: '',
    Apellidos: '',
    TipoDocumento: 'DNI',
    Documento: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(false);

    const res = await register(form);
    if (res.success) {
      navigate('/'); // Te redirige a la tienda ya logeado con tu cuenta nueva
    } else {
      setError(res.error || 'Ocurrió un error al procesar el registro.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white border border-gray-100 shadow-sm">
      <h2 className="text-xl font-black mb-6 uppercase tracking-tight">Crear Cuenta</h2>
      
      {error && <div className="p-3 mb-4 text-xs text-red-600 bg-red-50 font-semibold">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Nombre de Usuario</label>
          <input required type="text" name="NombreUsuario" value={form.NombreUsuario} onChange={handleChange} className="w-full p-2 border bg-gray-50 text-sm" placeholder="user123" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Nombres</label>
            <input required type="text" name="Nombres" value={form.Nombres} onChange={handleChange} className="w-full p-2 border bg-gray-50 text-sm" placeholder="John" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Apellidos</label>
            <input required type="text" name="Apellidos" value={form.Apellidos} onChange={handleChange} className="w-full p-2 border bg-gray-50 text-sm" placeholder="Doe" />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Email</label>
          <input required type="email" name="Email" value={form.Email} onChange={handleChange} className="w-full p-2 border bg-gray-50 text-sm" placeholder="correo@ejemplo.com" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Contraseña</label>
          <input required type="password" name="Contrasena" value={form.Contrasena} onChange={handleChange} className="w-full p-2 border bg-gray-50 text-sm" placeholder="••••••••" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Tipo Doc.</label>
            <select name="TipoDocumento" value={form.TipoDocumento} onChange={handleChange} className="w-full p-2 border bg-gray-50 text-sm h-[38px]">
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Documento</label>
            <input required type="text" name="Documento" value={form.Documento} onChange={handleChange} className="w-full p-2 border bg-gray-50 text-sm" placeholder="12345678" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full py-2.5 mt-2 text-xs font-bold text-white uppercase tracking-widest bg-black hover:bg-neutral-800 disabled:bg-gray-400">
          {loading ? 'Procesando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}