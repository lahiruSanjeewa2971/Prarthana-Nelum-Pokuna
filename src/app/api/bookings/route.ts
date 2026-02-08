import { NextRequest } from 'next/server';
import { createBooking } from '@/services/booking.service';
import { createBookingSchema } from '@/utils/validators';
import { createdResponse } from '@/lib/response-builder';
import { handleApiError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';
import { ValidationError } from '@/domain/errors';
import { CreateBookingDTO } from '@/app/types/booking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body with Zod
    const validationResult = createBookingSchema.safeParse(body);
    if (!validationResult.success) {
      throw new ValidationError('Invalid request data', validationResult.error.issues);
    }

    const validatedData = validationResult.data;

    // Convert API types (string) to DTO types (Date)
    const bookingData: CreateBookingDTO = {
      customerName: validatedData.customerName,
      customerEmail: validatedData.customerEmail,
      customerPhone: validatedData.customerPhone,
      functionTypeId: validatedData.functionTypeId,
      functionTypeCustom: validatedData.functionTypeCustom,
      eventDate: new Date(validatedData.eventDate),
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      additionalNotes: validatedData.additionalNotes,
    };

    // Create booking via service
    const booking = await createBooking(bookingData);

    // Return success response
    return createdResponse({
      id: booking.id,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      functionTypeLabel: booking.functionTypeLabel,
      eventDate: booking.eventDate.toISOString(),
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
