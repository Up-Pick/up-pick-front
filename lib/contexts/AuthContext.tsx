'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import { LoginRequest, SignupRequest } from '../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 로드 시 토큰 확인
    const token = authApi.getToken();
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authApi.login(data);
    authApi.setToken(response.accessToken);
    setIsAuthenticated(true);
  };

  const signup = async (data: SignupRequest) => {
    await authApi.signup(data);
  };

  const logout = () => {
    authApi.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
