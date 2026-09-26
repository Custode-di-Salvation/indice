import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AccessLevel } from '../types';
import type { UserProfile } from '../utils/permissions';
import { hasClearance } from '../utils/permissions';

interface AuthContextType {
  user: UserProfile | null;
  login: (profile: UserProfile) => void;
  logout: () => void;
  hasAccess: (level: AccessLevel) => boolean;
}

function isStoredProfile(value: unknown): value is UserProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Partial<UserProfile>;
  return typeof profile.id === 'string'
    && typeof profile.identificativo === 'string'
    && profile.role === 'commensale';
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  hasAccess: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Initialize from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('indice_auth_profile');
    if (stored) {
      try {
        const profile: unknown = JSON.parse(stored);
        if (isStoredProfile(profile)) {
          setUser(profile);
        }
      } catch (e) {
        // Clear if invalid
        localStorage.removeItem('indice_auth_profile');
      }
    }
  }, []);

  const login = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('indice_auth_profile', JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('indice_auth_profile');
  };

  const hasAccess = (level: AccessLevel) => {
    if (!user) return false;
    return hasClearance(user.role, level);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
