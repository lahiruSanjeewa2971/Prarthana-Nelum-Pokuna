'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';

interface Admin {
  id: string;
  email: string;
}

interface AuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    admin: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const router = useRouter();

  /**
   * Verify authentication by checking if token is valid
   */
  const refreshAuth = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/admin/profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.data?.admin) {
          setState({
            admin: data.data.admin,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // Invalid response structure
          setState({
            admin: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } else if (response.status === 401) {
        // 401 Unauthorized - clear cookie and state
        document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Strict';
        setState({
          admin: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      } else {
        // Other errors
        setState({
          admin: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      logger.error('Auth verification failed', error);
      setState({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to verify authentication',
      });
    }
  }, []);

  /**
   * Login with email and password
   */
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const admin = data.data.admin;
          const redirectUrl = data.data.redirectUrl || '/admin/dashboard';

          setState({
            admin,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          logger.info('Admin login successful', { adminId: admin.id });
          
          // Redirect to admin dashboard
          router.push(redirectUrl);
        } else {
          // Login failed - extract message from error object
          const errorMessage = 
            typeof data.error === 'string' 
              ? data.error 
              : data.error?.message || 'Invalid credentials';
          
          setState({
            admin: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        logger.error('Login error', error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [router]
  );

  /**
   * Logout and clear authentication
   */
  const logout = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setState({
          admin: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        logger.info('Admin logout successful');
        
        // Redirect to landing page
        router.push('/');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      logger.error('Logout error', error);
      
      // Clear state anyway
      setState({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Logout failed',
      });
      
      // Redirect to landing page anyway
      router.push('/');
    }
  }, [router]);

  /**
   * Verify authentication on mount
   */
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const value: AuthContextType = {
    admin: state.admin,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
}
