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
import { ConflictError, ValidationError, NotFoundError } from "@/domain/errors";
import * as bookingRepository from "@/repositories/booking.repository";
import * as emailService from "@/services/email.service";
import { BookingWithRelations } from "@/repositories/booking.repository";

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

/**
 * List bookings with filters and pagination
 */
export async function listBookings(params: {
  status?: BookingStatus;
  eventDateGte?: Date;
  eventDateLte?: Date;
  customerEmail?: string;
  functionTypeId?: string;
  page?: number;
  limit?: number;
}): Promise<{ bookings: BookingWithRelations[]; total: number; page: number; limit: number }> {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const skip = (page - 1) * limit;

  const filters = {
    status: params.status,
    eventDateGte: params.eventDateGte,
    eventDateLte: params.eventDateLte,
    customerEmail: params.customerEmail,
    functionTypeId: params.functionTypeId,
  };

  logger.info("Listing bookings", { filters, page, limit });

  const [bookings, total] = await Promise.all([
    bookingRepository.findBookings(filters, skip, limit),
    bookingRepository.countBookings(filters),
  ]);

  return { bookings, total, page, limit };
}

/**
 * Get single booking by ID
 */
export async function getBookingById(id: string): Promise<BookingWithRelations> {
  logger.info("Getting booking", { bookingId: id });

  const booking = await bookingRepository.findBookingById(id);

  if (!booking) {
    throw new NotFoundError(`Booking with ID ${id} not found`);
  }

  return booking;
}

/**
 * Update booking status (admin only)
 */
export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  adminNote?: string
): Promise<BookingWithRelations> {
  logger.info("Updating booking status", { bookingId: id, status, adminNote });

  // Validate status
  if (!["ACCEPTED", "REJECTED", "PENDING"].includes(status)) {
    throw new ValidationError("Invalid booking status");
  }

  // Get existing booking
  const existingBooking = await bookingRepository.findBookingById(id);

  if (!existingBooking) {
    throw new NotFoundError(`Booking with ID ${id} not found`);
  }

  // Update booking
  const updatedBooking = await bookingRepository.updateBooking(id, {
    status,
    adminNote,
  });

  logger.info("Booking status updated", { bookingId: id, newStatus: status });

  // Send email notification to customer (async, don't block response)
  if (status === "ACCEPTED") {
    emailService
      .sendCustomerAcceptanceEmail(updatedBooking)
      .catch((error) => {
        logger.error("Failed to send acceptance email", { bookingId: id, error });
      });
  } else if (status === "REJECTED") {
    emailService
      .sendCustomerRejectionEmail(updatedBooking)
      .catch((error) => {
        logger.error("Failed to send rejection email", { bookingId: id, error });
      });
  }

  return updatedBooking;
}
