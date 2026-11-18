import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRoleType = 'host' | 'guest';

interface RoleContextType {
  role: UserRoleType;
  setRole: (role: UserRoleType) => void;
  toggleRole: () => void;
  isHost: boolean;
  isGuest: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRoleType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('thedateboss_active_role');
      if (saved === 'host' || saved === 'guest') return saved;
      const userStr = localStorage.getItem('thedateboss_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.role === 'GUEST') return 'guest';
          if (user.role === 'HOST') return 'host';
        } catch (_) {}
      }
    }
    return 'host'; // Default to host
  });

  const setRole = (newRole: UserRoleType) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thedateboss_active_role', newRole);
    }
  };

  const toggleRole = () => {
    setRole(role === 'host' ? 'guest' : 'host');
  };

  // Synchronize on window focus or storage update
  useEffect(() => {
    const syncRoleFromStorage = () => {
      const saved = localStorage.getItem('thedateboss_active_role');
      if (saved === 'host' || saved === 'guest') {
        if (saved !== role) setRoleState(saved);
      }
    };

    window.addEventListener('storage', syncRoleFromStorage);
    window.addEventListener('focus', syncRoleFromStorage);
    return () => {
      window.removeEventListener('storage', syncRoleFromStorage);
      window.removeEventListener('focus', syncRoleFromStorage);
    };
  }, [role]);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        isHost: role === 'host',
        isGuest: role === 'guest',
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
