import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type User = {
  fullName?: string;
  email?: string;
  phone?: string;
  company?: string;
};

type Credentials = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  register: (data: User & { password?: string }) => Promise<boolean>;
  logout: () => void;
  setUser: (u: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const STORAGE_KEY = '@energeia_auth_state';

  useEffect(() => {
    // load saved auth state on mount
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { user?: User | null; credentials?: Credentials | null; isAuthenticated?: boolean };
          if (parsed.user) setUser(parsed.user);
          if (parsed.credentials) setCredentials(parsed.credentials);
          if (parsed.isAuthenticated) setIsAuthenticated(true);
        }
      } catch (e) {
        // ignore storage errors
        console.warn('Failed to load auth state', e);
      }
    })();
  }, []);

  const login = (email: string, password: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const matchesRegistered = credentials ? credentials.email === email && credentials.password === password : false;
        if (matchesRegistered) {
          setUser({ email });
          setIsAuthenticated(true);
          // persist
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user: { email }, credentials, isAuthenticated: true })).catch(() => {});
          resolve(true);
        } else {
          resolve(false);
        }
      }, 700);
    });
  };

  const register = (data: User & { password?: string }) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        setUser({ fullName: data.fullName, email: data.email, phone: data.phone, company: data.company });
        if (data.email && data.password) {
          const creds = { email: data.email, password: data.password } as Credentials;
          setCredentials(creds);
          // persist registration + login state
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user: { fullName: data.fullName, email: data.email, phone: data.phone, company: data.company }, credentials: creds, isAuthenticated: true })).catch(() => {});
        }
        setIsAuthenticated(true);
        resolve(true);
      }, 900);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCredentials(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
