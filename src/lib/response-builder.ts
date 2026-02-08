import { ApiSuccessResponse, ApiErrorResponse } from '@/app/types/api';
import { NextResponse } from 'next/server';

export function successResponse<T>(
  data: T,
  meta?: Record<string, unknown>,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta && { meta }),
    },
    { status }
  );
}

export function errorResponse(
  code: string,
  message: string,
  status: number = 500,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  const error: { code: string; message: string; details?: unknown } = {
    code,
    message,
  };
  if (details) {
    error.details = details;
  }
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

export function createdResponse<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
  return successResponse(data, undefined, 201);
}