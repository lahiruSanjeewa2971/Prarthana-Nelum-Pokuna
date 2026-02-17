import { cookies } from 'next/headers';
import { verifyToken, type DecodedToken } from '@/lib/jwt';

/**
 * Server-side authentication helpers for Server Components
 */

/**
 * Get authenticated admin from server component
 * 
 * @returns DecodedToken if authenticated, null otherwise
 * 
 * @example
 * ```tsx
 * // In a Server Component
 * export default async function AdminPage() {
 *   const admin = await getServerSideAuth();
 *   
 *   if (!admin) {
 *     redirect('/admin/login');
 *   }
 *   
 *   return <div>Welcome {admin.email}</div>;
 * }
 * ```
 */
export async function getServerSideAuth(): Promise<DecodedToken | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  console.log("Token from cookies:", token); // Debug log
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

/**
 * Require authentication in Server Component
 * Throws error if not authenticated (to be caught by error boundary)
 * 
 * @returns DecodedToken
 * @throws Error if not authenticated
 * 
 * @example
 * ```tsx
 * export default async function ProtectedPage() {
 *   const admin = await requireServerAuth();
 *   return <div>Welcome {admin.email}</div>;
 * }
 * ```
 */
export async function requireServerAuth(): Promise<DecodedToken> {
  const admin = await getServerSideAuth();
  
  if (!admin) {
    throw new Error('Authentication required');
  }
  
  return admin;
}

/**
 * Check if user is authenticated
 * 
 * @returns boolean
 */
export async function isAuthenticated(): Promise<boolean> {
  const admin = await getServerSideAuth();
  return admin !== null;
}
