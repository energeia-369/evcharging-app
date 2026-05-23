import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getAuthProfile, loginAuth, registerAuth } from '../../services/authApi';

type User = {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  company?: string;
  role?: string;
  profileImage?: string | null;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  authError: string | null;
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
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const STORAGE_KEY = '@energeia_auth_state';

  const extractErrorMessage = (error: unknown): string => {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return 'Something went wrong. Please try again.';
  };

  useEffect(() => {
    // load saved auth state on mount
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { user?: User | null; token?: string | null; isAuthenticated?: boolean };
          if (parsed.user) setUser(parsed.user);
          if (parsed.token) {
            setToken(parsed.token);
            const profile = await getAuthProfile(parsed.token);
            setUser({
              id: profile.data.id,
              fullName: profile.data.fullName,
              name: profile.data.name,
              email: profile.data.email,
              mobile: profile.data.mobile,
              role: profile.data.role,
              profileImage: profile.data.profileImage,
            });
            setIsAuthenticated(true);
          } else if (parsed.isAuthenticated) {
            setIsAuthenticated(true);
          }
        }
      } catch (e) {
        // ignore storage errors
        console.warn('Failed to load auth state', e);
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthError(null);
      const loginResult = await loginAuth({ email, password });
      setToken(loginResult.data.token);
      setUser({
        id: loginResult.data.user.id,
        fullName: loginResult.data.user.fullName,
        name: loginResult.data.user.name,
        email: loginResult.data.user.email,
        mobile: loginResult.data.user.mobile,
        role: loginResult.data.user.role,
        profileImage: loginResult.data.user.profileImage,
      });
      setIsAuthenticated(true);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user: loginResult.data.user,
          token: loginResult.data.token,
          isAuthenticated: true,
        })
      );
      return true;
    } catch (error) {
      setAuthError(extractErrorMessage(error));
      return false;
    }
  };

  const register = async (data: User & { password?: string }) => {
    try {
      setAuthError(null);
      if (!data.fullName || !data.email || !data.password) {
        setAuthError('Full name, email, and password are required.');
        return false;
      }

      const registerResult = await registerAuth({
        fullName: data.fullName,
        email: data.email,
        mobile: data.phone || data.mobile || '',
        password: data.password,
        role: 'fleet_manager',
      });

      setToken(registerResult.data.token);
      setUser({
        id: registerResult.data.user.id,
        fullName: registerResult.data.user.fullName,
        name: registerResult.data.user.name,
        email: registerResult.data.user.email,
        mobile: registerResult.data.user.mobile,
        role: registerResult.data.user.role,
        profileImage: registerResult.data.user.profileImage,
        company: data.company,
      });
      setIsAuthenticated(true);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user: registerResult.data.user,
          token: registerResult.data.token,
          isAuthenticated: true,
        })
      );
      return true;
    } catch (error) {
      setAuthError(extractErrorMessage(error));
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
    setAuthError(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, token, authError, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
