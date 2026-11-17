import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'HOST' | 'GUEST';
  nickname?: string;
  locationCity?: string;
  isVerified?: boolean;
  onboardingStep?: number;
  profile?: any;
  subscription?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<User>;
  register: (payload: {
    email: string;
    password?: string;
    role?: 'HOST' | 'GUEST';
    gender?: 'MAN' | 'WOMAN' | 'OTHER';
    targetGender?: 'MEN' | 'WOMEN' | 'EVERYONE';
    nickname?: string;
  }) => Promise<User>;
  socialAuth: (payload: {
    provider: 'google' | 'apple';
    email: string;
    name?: string;
    avatar?: string;
    role?: 'HOST' | 'GUEST';
    gender?: 'MAN' | 'WOMAN' | 'OTHER';
    targetGender?: 'MEN' | 'WOMEN' | 'EVERYONE';
  }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('thedateboss_token') : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user if token exists on boot
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.auth.me();
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          localStorage.removeItem('thedateboss_token');
          setToken(null);
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem('thedateboss_token');
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const saveAuthSession = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('thedateboss_token', newToken);
  };

  const login = async (email: string, password?: string): Promise<User> => {
    const res = await api.auth.login({ email, password });
    if (res.success && res.data) {
      saveAuthSession(res.data.token, res.data.user);
      return res.data.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (payload: any): Promise<User> => {
    const res = await api.auth.register(payload);
    if (res.success && res.data) {
      saveAuthSession(res.data.token, res.data.user);
      return res.data.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const socialAuth = async (payload: any): Promise<User> => {
    const res = await api.auth.social(payload);
    if (res.success && res.data) {
      saveAuthSession(res.data.token, res.data.user);
      return res.data.user;
    }
    throw new Error(res.message || 'Social auth failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('thedateboss_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        socialAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
