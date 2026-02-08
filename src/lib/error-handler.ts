import { NextResponse } from 'next/server';
import { AppError } from '@/domain/errors';
import { errorResponse } from './response-builder';
import { logger } from './logger';

export function handleApiError(error: unknown): NextResponse {
  // Log the error
  logger.error('API Error:', error);

  // Handle known AppError instances
  if (error instanceof AppError) {
    return errorResponse(error.code, error.message, error.statusCode, error.details);
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: unknown };
    
    if (prismaError.code === 'P2002') {
      return errorResponse('DUPLICATE_ENTRY', 'A record with this value already exists', 409);
    }
    
    if (prismaError.code === 'P2025') {
      return errorResponse('NOT_FOUND', 'Record not found', 404);
    }
  }

  // Handle unknown errors
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  return errorResponse('INTERNAL_ERROR', message, 500);
}