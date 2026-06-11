import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Role = 'client' | 'admin';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; role?: Role; error?: string };
  logout: () => void;
}

const MOCK_ADMIN = { email: 'admin@wayback.com', password: 'admin123' };

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'wayback_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = (email: string, password: string): { success: boolean; role?: Role; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass  = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      return { success: false, error: 'Ingresa tu email y contraseña.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return { success: false, error: 'Ingresa un email válido.' };
    }
    if (trimmedPass.length < 6) {
      return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    const isAdmin = trimmedEmail === MOCK_ADMIN.email && trimmedPass === MOCK_ADMIN.password;
    const role: Role = isAdmin ? 'admin' : 'client';

    const newUser: AuthUser = {
      id: isAdmin ? 0 : Math.floor(Math.random() * 10000) + 1,
      name: isAdmin ? 'Admin Wayback' : trimmedEmail.split('@')[0],
      email: trimmedEmail,
      role,
    };

    setUser(newUser);
    return { success: true, role };
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
