import { NextRequest } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';
import { successResponse, errorResponse } from '@/lib/response-builder';
import { logger } from '@/lib/logger';
import { handleApiError } from '@/lib/error-handler';
import * as bookingService from '@/services/booking.service';
import { BookingStatus } from '@prisma/client';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/bookings/[id]
 * Get single booking details (Admin only)
 */
async function getBooking(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params;

    logger.info('Admin fetching booking', {
      adminId: request.admin?.adminId,
      bookingId,
    });

    const booking = await bookingService.getBookingById(bookingId);

    return successResponse({ booking });
  } catch (error) {
    logger.error('Error fetching booking', error);
    return handleApiError(error);
  }
}

/**
 * PATCH /api/admin/bookings/[id]
 * Update booking status (Admin only)
 */
const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED'], {
    message: 'Status must be PENDING, ACCEPTED, or REJECTED',
  }),
  adminNote: z.string().max(1000).optional(),
});

async function updateBooking(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params;

    // Parse and validate request body
    const body = await request.json();
    const validation = updateBookingSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Invalid request data',
        400,
        validation.error.issues
      );
    }

    const { status, adminNote } = validation.data;

    logger.info('Admin updating booking status', {
      adminId: request.admin?.adminId,
      bookingId,
      status,
    });

    const updatedBooking = await bookingService.updateBookingStatus(
      bookingId,
      status as BookingStatus,
      adminNote
    );

    return successResponse({
      message: 'Booking status updated successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    logger.error('Error updating booking', error);
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/bookings/[id]
 * Delete booking (Admin only)
 */
async function deleteBooking(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params;

    logger.info('Admin deleting booking', {
      adminId: request.admin?.adminId,
      bookingId,
    });

    await bookingService.deleteBooking(bookingId);

    return successResponse({
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting booking', error);
    return handleApiError(error);
  }
}

export const GET = requireAuth(getBooking);
export const PATCH = requireAuth(updateBooking);
export const DELETE = requireAuth(deleteBooking);
