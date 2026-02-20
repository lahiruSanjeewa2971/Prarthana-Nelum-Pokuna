'use client';

import { useAuthContext } from '@/contexts/AuthContext';

/**
 * Convenient hook to access authentication state and actions
 * 
 * @returns Authentication context with admin data, loading state, and auth functions
 * 
 * @example
 * ```tsx
 * function AdminDashboard() {
 *   const { admin, isAuthenticated, isLoading, login, logout } = useAuth();
 * 
 *   if (isLoading) return <LoadingSpinner />;
 *   if (!isAuthenticated) return <LoginPage />;
 * 
 *   return <div>Welcome {admin.email}</div>;
 * }
 * ```
 */
export function useAuth() {
  return useAuthContext();
}
