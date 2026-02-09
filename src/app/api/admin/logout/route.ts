import { NextRequest, NextResponse } from 'next/server';
import { successResponse } from '@/lib/response-builder';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/admin/logout - Admin logout
export async function POST(request: NextRequest) {
  logger.info('Admin logout');

  // Create response
  const response = successResponse({
    message: 'Logout successful',
  });

  // Clear the auth token cookie
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // Expire immediately
    path: '/',
  });

  return response;
}
