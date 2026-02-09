import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { login } from '@/services/auth.service';
import { successResponse } from '@/lib/response-builder';
import { handleApiError } from '@/lib/error-handler';
import { ValidationError } from '@/domain/errors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

// POST /api/admin/login - Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      throw new ValidationError('Invalid credentials', validationResult.error.issues);
    }

    const credentials = validationResult.data;

    // Authenticate admin
    const result = await login(credentials);

    // Create response with JWT in httpOnly cookie
    const response = successResponse({
      message: 'Login successful',
      admin: result.admin,
    });

    // Set JWT token in httpOnly cookie
    response.cookies.set('auth-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
