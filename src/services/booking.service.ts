import { Booking, BookingStatus } from "@prisma/client";
import { logger } from "@/lib/logger";
import { CreateBookingDTO } from "@/app/types/booking";
import {
  checkTimeSlotConflict,
  validateEventDate,
  validateTimeRange,
  validateWorkingHours,
} from "@/utils/business-rules";
import { ERROR_MESSAGES } from "@/lib/contants";
import { ConflictError, ValidationError } from "@/domain/errors";
import * as bookingRepository from "@/repositories/booking.repository";

export async function getConflictingBookings(
  date: Date,
  startTime: string,
  endTime: string,
): Promise<Booking[]> {
  // Get all accepted bookings for the same date using repository
  const bookingsOnDate = await bookingRepository.findBookingsOnDate(date, 'ACCEPTED');

  // Check for time overlaps
  return bookingsOnDate.filter((booking) =>
    checkTimeSlotConflict(startTime, endTime, [
      { startTime: booking.startTime, endTime: booking.endTime },
    ]),
  );
}

export async function createBooking(data: CreateBookingDTO): Promise<Booking> {
  logger.info("Creating new booking", { customerEmail: data.customerEmail });

  // Business rule validation
  validateEventDate(data.eventDate);
  validateTimeRange(data.startTime, data.endTime);
  validateWorkingHours(data.startTime, data.endTime);

  // Check function type exists and is active using repository
  if (data.functionTypeId) {
    const functionType = await bookingRepository.findActiveFunctionType(data.functionTypeId);

    if (!functionType || !functionType.isActive) {
      throw new ValidationError(ERROR_MESSAGES.FUNCTION_TYPE_NOT_FOUND);
    }
  }

  // Check for time slot conflicts
  const conflicts = await getConflictingBookings(
    data.eventDate,
    data.startTime,
    data.endTime,
  );

  if (conflicts.length > 0) {
    throw new ConflictError(ERROR_MESSAGES.TIME_SLOT_CONFLICT, {
      conflicts: conflicts.map((b) => ({
        id: b.id,
        startTime: b.startTime,
        endTime: b.endTime,
      })),
    });
  }

  // Determine function type label
  let functionTypeLabel: string | undefined;
  if (data.functionTypeId) {
    const ft = await bookingRepository.findActiveFunctionType(data.functionTypeId);
    functionTypeLabel = ft?.name;
  } else if (data.functionTypeCustom) {
    functionTypeLabel = data.functionTypeCustom;
  }

  // Create booking using repository
  const booking = await bookingRepository.createBooking({
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    functionTypeId: data.functionTypeId,
    functionTypeCustom: data.functionTypeCustom,
    functionTypeLabel,
    eventDate: data.eventDate,
    startTime: data.startTime,
    endTime: data.endTime,
    additionalNotes: data.additionalNotes,
    status: "PENDING",
  });

  logger.info("Booking created successfully", { bookingId: booking.id });
  return booking;
}
