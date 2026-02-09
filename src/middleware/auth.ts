import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, DecodedToken } from '@/lib/jwt';
import { errorResponse } from '@/lib/response-builder';
import { logger } from '@/lib/logger';

export interface AuthenticatedRequest extends NextRequest {
  admin?: DecodedToken;
}

export function requireAuth(
  handler: (req: AuthenticatedRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      // Get token from cookie
      const token = request.cookies.get('auth-token')?.value;

      if (!token) {
        logger.warn('Authentication failed: No token provided');
        return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
      }

      // Verify token
      const decoded = verifyToken(token);

      if (!decoded) {
        logger.warn('Authentication failed: Invalid or expired token');
        return errorResponse('UNAUTHORIZED', 'Invalid or expired token', 401);
      }

      // Attach admin info to request
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.admin = decoded;

      // Call the actual handler with context (for dynamic routes)
      return handler(authenticatedRequest, context);
    } catch (error) {
      logger.error('Auth middleware error', error);
      return errorResponse('INTERNAL_ERROR', 'Authentication error', 500);
    }
  };
}

export function getAdminFromRequest(request: NextRequest): DecodedToken | null {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}
