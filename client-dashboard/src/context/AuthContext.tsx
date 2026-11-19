import React, { createContext, useContext, useState, useEffect } from 'react';
import { dashboardApi, TOKEN_KEY } from '../services/api';

export interface AdminUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'HOST' | 'GUEST';
  nickname?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  isDemoMode: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ADMIN_USER: AdminUser = {
  id: 'demo-admin-1',
  email: 'admin@thedateboss.com',
  role: 'ADMIN',
  nickname: 'Jenny Wilson',
  isVerified: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      if (token.startsWith('demo_admin_token_')) {
        setUser(DEMO_ADMIN_USER);
        setIsDemoMode(true);
        setIsLoading(false);
        return;
      }

      try {
        const res = await dashboardApi.auth.me();
        if (res.success && res.data) {
          setUser(res.data);
          setIsDemoMode(false);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, [token]);

  const login = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      const res = await dashboardApi.auth.login({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (res.success && res.data) {
        if (res.data.user?.role !== 'ADMIN') {
          throw new Error('Access denied. Administrator credentials required.');
        }
        localStorage.setItem(TOKEN_KEY, res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setIsDemoMode(false);
        return;
      }
      throw new Error(res.message || 'Login failed');
    } catch (err: any) {
      // Allow seeded demo admin login even if backend server is offline
      if (
        cleanEmail === 'admin@thedateboss.com' &&
        cleanPassword === 'password123'
      ) {
        const demoToken = `demo_admin_token_${Date.now()}`;
        localStorage.setItem(TOKEN_KEY, demoToken);
        setToken(demoToken);
        setUser(DEMO_ADMIN_USER);
        setIsDemoMode(true);
        return;
      }
      throw new Error(err?.message || 'Invalid email or password');
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setIsDemoMode(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isDemoMode,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
