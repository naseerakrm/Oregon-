import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check for stored auth token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('orecoin-token');
      const userData = localStorage.getItem('orecoin-user');
      
      if (token && userData) {
        try {
          // In a real app, validate token with server
          const user = JSON.parse(userData);
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Invalid stored data, clear it
          localStorage.removeItem('orecoin-token');
          localStorage.removeItem('orecoin-user');
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const user: User = {
        id: '1',
        email: credentials.email,
        username: 'orecoin_user',
        firstName: 'أحمد',
        lastName: 'محمد',
        avatar: undefined,
        walletAddress: '0x1234567890123456789012345678901234567890',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const token = 'mock-jwt-token';
      
      // Store in localStorage
      localStorage.setItem('orecoin-token', token);
      localStorage.setItem('orecoin-user', JSON.stringify(user));
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'فشل في تسجيل الدخول. يرجى التحقق من البيانات.',
      }));
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user creation
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: undefined,
        walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const token = 'mock-jwt-token';
      
      // Store in localStorage
      localStorage.setItem('orecoin-token', token);
      localStorage.setItem('orecoin-user', JSON.stringify(user));
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'فشل في إنشاء الحساب. يرجى المحاولة مرة أخرى.',
      }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('orecoin-token');
    localStorage.removeItem('orecoin-user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const updateUser = (userData: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }));
    
    // Update localStorage
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('orecoin-user', JSON.stringify(updatedUser));
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};