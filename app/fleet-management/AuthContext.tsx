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
  login: (email: string, password: string, remember?: boolean) => Promise<AuthActionResult>;
  register: (data: User & { password?: string }) => Promise<AuthActionResult>;
  logout: () => void;
  setUser: (u: User | null) => void;
};

type AuthActionResult = {
  success: boolean;
  message: string;
  status?: number;
  code?: string;
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

  const getBackendMessage = (error: unknown): string | null => {
    if (!error || typeof error !== 'object') {
      return null;
    }

    const apiError = error as {
      response?: {
        data?: { message?: unknown; code?: unknown };
        status?: unknown;
      };
      message?: unknown;
    };

    const backendMessage = apiError.response?.data?.message;
    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }

    const directMessage = apiError.message;
    if (typeof directMessage === 'string' && directMessage.trim()) {
      return directMessage;
    }

    return null;
  };

  const getBackendStatus = (error: unknown): number | undefined => {
    if (!error || typeof error !== 'object') {
      return undefined;
    }

    const apiError = error as {
      response?: { status?: unknown };
      status?: unknown;
    };

    if (typeof apiError.response?.status === 'number') {
      return apiError.response.status;
    }

    if (typeof apiError.status === 'number') {
      return apiError.status;
    }

    return undefined;
  };

  const getBackendCode = (error: unknown): string | undefined => {
    if (!error || typeof error !== 'object') {
      return undefined;
    }

    const apiError = error as {
      response?: { data?: { code?: unknown } };
    };

    const code = apiError.response?.data?.code;
    if (typeof code === 'string' && code.trim()) {
      return code;
    }

    return undefined;
  };

  const defaultMessageByStatus = (status?: number): string => {
    if (status === 400) return 'Please check your details and try again.';
    if (status === 401) return 'Invalid credentials';
    if (status === 409) return 'Email already exists';
    if (status === 500) return 'Server error. Please try again later.';
    return 'Something went wrong. Please try again.';
  };

  const extractErrorMessage = (error: unknown): string => {
    const backendMessage = getBackendMessage(error);
    if (backendMessage) {
      return backendMessage;
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return defaultMessageByStatus(getBackendStatus(error));
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
            try {
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
            } catch (profileError) {
              console.warn('Failed to load profile, clearing expired session', profileError);
              setUser(null);
              setToken(null);
              setIsAuthenticated(false);
              AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
            }
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

  const login = async (email: string, password: string): Promise<AuthActionResult> => {
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
      return {
        success: true,
        message: 'Login successful',
        status: 200,
      };
    } catch (error) {
      const message = extractErrorMessage(error);
      const status = getBackendStatus(error);
      const code = getBackendCode(error);
      setAuthError(message);
      return {
        success: false,
        message,
        status,
        code,
      };
    }
  };

  const register = async (data: User & { password?: string }): Promise<AuthActionResult> => {
    try {
      setAuthError(null);

      const registerResult = await registerAuth({
        fullName: data.fullName,
        email: data.email,
        mobile: data.phone || data.mobile || '',
        password: data.password,
        role: data.role || 'fleet_manager',
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
      return {
        success: true,
        message: 'User created successfully',
        status: 200,
      };
    } catch (error) {
      const message = extractErrorMessage(error);
      const status = getBackendStatus(error);
      const code = getBackendCode(error);
      setAuthError(message);
      return {
        success: false,
        message,
        status,
        code,
      };
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
