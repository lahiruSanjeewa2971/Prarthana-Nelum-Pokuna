import { NextRequest } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';
import { successResponse, errorResponse } from '@/lib/response-builder';
import { logger } from '@/lib/logger';
import { handleApiError } from '@/lib/error-handler';
import * as bookingService from '@/services/booking.service';
import { BookingStatus } from '@prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/bookings
 * List all bookings with optional filters (Admin only)
 */
async function listBookings(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const status = searchParams.get('status') as BookingStatus | null;
    const eventDateGte = searchParams.get('eventDateGte');
    const eventDateLte = searchParams.get('eventDateLte');
    const customerEmail = searchParams.get('customerEmail');
    const functionTypeId = searchParams.get('functionTypeId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      return errorResponse('VALIDATION_ERROR', 'Invalid pagination parameters', 400);
    }

    // Parse dates if provided
    const filters: {
      status?: BookingStatus;
      eventDateGte?: Date;
      eventDateLte?: Date;
      customerEmail?: string;
      functionTypeId?: string;
      page: number;
      limit: number;
    } = {
      page,
      limit,
    };

    if (status && ['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
      filters.status = status;
    }

    if (eventDateGte) {
      filters.eventDateGte = new Date(eventDateGte);
    }

    if (eventDateLte) {
      filters.eventDateLte = new Date(eventDateLte);
    }

    if (customerEmail) {
      filters.customerEmail = customerEmail;
    }

    if (functionTypeId) {
      filters.functionTypeId = functionTypeId;
    }

    logger.info('Admin fetching bookings', {
      adminId: request.admin?.adminId,
      filters,
    });

    const result = await bookingService.listBookings(filters);

    return successResponse({
      bookings: result.bookings,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    logger.error('Error listing bookings', error);
    return handleApiError(error);
  }
}

export const GET = requireAuth(listBookings);
