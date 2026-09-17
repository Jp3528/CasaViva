import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (nombre: string, email: string, pass: string, tel?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('casaviva_user');
      const savedToken = localStorage.getItem('casaviva_token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (e) {
      console.error('Error al cargar sesión de usuario:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await authService.login({ email, password: pass });
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('casaviva_user', JSON.stringify(res.user));
    localStorage.setItem('casaviva_token', res.token);
  };

  const register = async (nombre: string, email: string, pass: string, tel?: string) => {
    const res = await authService.register({ nombre, email, password: pass, telefono: tel });
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('casaviva_user', JSON.stringify(res.user));
    localStorage.setItem('casaviva_token', res.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('casaviva_user');
    localStorage.removeItem('casaviva_token');
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('casaviva_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin: user?.rol === 'admin',
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
