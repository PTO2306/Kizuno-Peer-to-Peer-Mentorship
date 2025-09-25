/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext, createContext, useEffect } from 'react';
import httpClient, { setAuthRefreshFunction, setLogoutFunction } from './httpClient';
import type { LoginModel } from '../models/userModels';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  notification: {
    message: string;
    type: 'success' | 'error' | 'info';
    show: boolean;
  } | null;
  checkAuthStatus: () => Promise<void>;
  login: (credentials: LoginModel) => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
  register: (credentials: LoginModel) => Promise<{ success: boolean }>;
  refreshToken: () => Promise<boolean>;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  hideNotification: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    show: boolean;
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type, show: true });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const checkAuthStatus = async () => {
    setLoading(true);

    if (!localStorage.getItem('hadSession')) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await httpClient.get('/user/status');
      if (response.status === 200) {
        console.log('is authenticated true');
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpClient.post('/user/login', {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        setError(null);
        showNotification('Welcome back!', 'success');
        localStorage.setItem('hadSession', 'true');
        return { success: true };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login Failed';
      setError(errorMessage);
      setIsAuthenticated(false);
      showNotification(
        error.response?.data?.message || 'Login failed. Please check your credentials.',
        'error'
      );
      return { success: false };
    } finally {
      setLoading(false);
    }

    return { success: false };
  };

  const logout = async () => {
    try {
      await httpClient.get('/user/logout');
    } catch (error: any) {
      console.error('Logout request failed, but continuing with local logout', error.message);
    } finally {
      setIsAuthenticated(false);
      setError(null);
      localStorage.removeItem('hadSession');
      setLoading(false);
      showNotification('Successfully logged out!', 'success');
    }
  };

  const forceLogout = async () => {
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem('hadSession');
    showNotification('Session expired. Please log in again.', 'info');
    setLoading(false);
  };

  const register = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpClient.post('/user/register', {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.status === 200) {
        showNotification('Account created! Check your email to verify.', 'success');
        return { success: true };
      }
    } catch (error: any) {
      const errorMessage = 'Error Creating Account Please try again';
      setError(errorMessage);
      showNotification('Registration failed. Please try again.', 'error');
      return { success: false };
    } finally {
      setLoading(false);
    }

    return { success: false };
  };

  const refreshToken = async () => {
    try {
      const response = await httpClient.post('/user/refresh');
      if (response.status === 200) {
        setIsAuthenticated(true);
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

  useEffect(() => {
    setAuthRefreshFunction(refreshToken);
    setLogoutFunction(forceLogout);
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    loading,
    error,
    notification,
    checkAuthStatus,
    login,
    logout,
    register,
    refreshToken,
    showNotification,
    hideNotification,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
