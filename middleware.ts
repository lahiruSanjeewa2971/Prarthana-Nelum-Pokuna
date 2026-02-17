import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

/**
 * Next.js Middleware for Route Protection
 * 
 * Protects /admin routes (except /admin/login) by verifying JWT token from cookies.
 * Redirects unauthenticated users to login page.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to login page
  if (pathname === '/admin/login') {
    const token = request.cookies.get('auth-token')?.value;
    
    // If already authenticated, redirect to dashboard
    if (token && verifyToken(token)) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    
    return NextResponse.next();
  }
  
  // Protect all other /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;
    
    // No token or invalid token - redirect to login
    if (!token || !verifyToken(token)) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname); // Preserve intended destination
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
