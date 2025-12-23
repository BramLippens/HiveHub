/**
 * AuthContext - Authentication state management
 * Follows the ThemeContext pattern: Provider + custom hook + localStorage persistence
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types/auth.types';
import * as authApi from '../api/auth.api';

const TOKEN_STORAGE_KEY = 'movie-collection-token';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (token) {
        try {
          // Fetch current user from API
          const currentUser = await authApi.getCurrentUser(token);
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to load user from token:', error);
          // Token is invalid, remove it
          localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
      }
      setLoading(false);
    };

    void loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const loginData: LoginRequest = { email, password };
    const response = await authApi.login(loginData);

    // Store token in localStorage
    localStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);

    // Update user state
    setUser(response.user);
  };

  const register = async (
    email: string,
    username: string,
    password: string,
  ): Promise<void> => {
    const registerData: RegisterRequest = { email, username, password };
    const response = await authApi.register(registerData);

    // Store token in localStorage
    localStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);

    // Update user state
    setUser(response.user);
  };

  const logout = (): void => {
    // Remove token from localStorage
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    // Clear user state
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
