import React, { createContext, ReactNode, useContext, useState } from 'react';

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

  const login = (email: string, password: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const matchesRegistered = credentials ? credentials.email === email && credentials.password === password : false;
        if (matchesRegistered) {
          setUser({ email });
          setIsAuthenticated(true);
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
          setCredentials({ email: data.email, password: data.password });
        }
        setIsAuthenticated(true);
        resolve(true);
      }, 900);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
