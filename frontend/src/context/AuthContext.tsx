import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, TOKEN_KEY } from '../services/api';
import { disconnectSocket } from '../services/socket';

export interface User {
  id: string;
  memberCode?: string;
  email: string;
  role: 'ADMIN' | 'HOST' | 'GUEST';
  accountStatus?: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  nickname?: string;
  locationCity?: string;
  isVerified?: boolean;
  onboardingStep?: number;
  profile?: any;
  subscription?: {
    id: string;
    plan: string;
    priceCents: number;
    status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
  } | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  refreshUser: () => Promise<User | null>;
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

function syncLocalRole(user: User | null) {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem('thedateboss_user');
    return;
  }
  localStorage.setItem('thedateboss_user', JSON.stringify(user));
  if (user.role === 'GUEST') {
    localStorage.setItem('thedateboss_active_role', 'guest');
  } else if (user.role === 'HOST') {
    localStorage.setItem('thedateboss_active_role', 'host');
  }
  window.dispatchEvent(new Event('storage'));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    const activeToken =
      typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : token;
    if (!activeToken) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const res = await api.auth.me();
      if (res.success && res.data) {
        setUser(res.data);
        setToken(activeToken);
        syncLocalRole(res.data);
        return res.data;
      }
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      syncLocalRole(null);
      return null;
    } catch (err) {
      console.error('Failed to restore session:', err);
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      syncLocalRole(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const saveAuthSession = (newToken: string, newUser: User) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
    syncLocalRole(newUser);
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
    disconnectSocket();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('thedateboss_active_role');
    syncLocalRole(null);
    setToken(null);
    setUser(null);
  };

  const hasActiveSubscription = Boolean(
    user &&
      (user.role === 'GUEST' ||
        user.role === 'ADMIN' ||
        user.subscription?.status === 'ACTIVE')
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: Boolean(user),
        hasActiveSubscription,
        refreshUser,
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
