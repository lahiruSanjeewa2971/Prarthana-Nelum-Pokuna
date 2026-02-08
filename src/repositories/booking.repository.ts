import { Booking, BookingStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

// Type for Booking with relations
export type BookingWithRelations = Prisma.BookingGetPayload<{
  include: { functionType: true };
}>;

export interface CreateBookingData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  functionTypeId?: string;
  functionTypeCustom?: string;
  functionTypeLabel?: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  additionalNotes?: string;
  status: BookingStatus;
}

export interface UpdateBookingData {
  status?: BookingStatus;
  adminNote?: string;
  updatedAt?: Date;
}

export interface FindBookingsFilters {
  status?: BookingStatus;
  eventDateGte?: Date;
  eventDateLte?: Date;
  customerEmail?: string;
  functionTypeId?: string;
}

// Create a booking
export async function createBooking(data: CreateBookingData): Promise<BookingWithRelations> {
  return prisma.booking.create({
    data,
    include: {
      functionType: true,
    },
  });
}

// Find booking by ID
export async function findBookingById(id: string): Promise<BookingWithRelations | null> {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      functionType: true,
    },
  });
}

// Find many bookings with filters and pagination
export async function findBookings(
  filters: FindBookingsFilters,
  skip: number,
  take: number
): Promise<BookingWithRelations[]> {
  const where: Prisma.BookingWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.eventDateGte || filters.eventDateLte) {
    where.eventDate = {};
    if (filters.eventDateGte) {
      where.eventDate.gte = filters.eventDateGte;
    }
    if (filters.eventDateLte) {
      where.eventDate.lte = filters.eventDateLte;
    }
  }

  if (filters.customerEmail) {
    where.customerEmail = filters.customerEmail;
  }

  if (filters.functionTypeId) {
    where.functionTypeId = filters.functionTypeId;
  }

  return prisma.booking.findMany({
    where,
    include: {
      functionType: true,
    },
    orderBy: {
      eventDate: 'asc',
    },
    skip,
    take,
  });
}

// Count bookings with filters
export async function countBookings(filters: FindBookingsFilters): Promise<number> {
  const where: Prisma.BookingWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.eventDateGte || filters.eventDateLte) {
    where.eventDate = {};
    if (filters.eventDateGte) {
      where.eventDate.gte = filters.eventDateGte;
    }
    if (filters.eventDateLte) {
      where.eventDate.lte = filters.eventDateLte;
    }
  }

  if (filters.customerEmail) {
    where.customerEmail = filters.customerEmail;
  }

  if (filters.functionTypeId) {
    where.functionTypeId = filters.functionTypeId;
  }

  return prisma.booking.count({ where });
}

// Find bookings on a specific date
export async function findBookingsOnDate(
  date: Date,
  status?: BookingStatus
): Promise<Booking[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.booking.findMany({
    where: {
      eventDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      ...(status && { status }),
    },
  });
}

// Find upcoming bookings
export async function findUpcomingBookings(
  limit: number,
  statuses: BookingStatus[]
): Promise<BookingWithRelations[]> {
  const now = new Date();

  return prisma.booking.findMany({
    where: {
      eventDate: {
        gte: now,
      },
      status: {
        in: statuses,
      },
    },
    include: {
      functionType: true,
    },
    orderBy: {
      eventDate: 'asc',
    },
    take: limit,
  });
}

// Update booking by ID
export async function updateBooking(
  id: string,
  data: UpdateBookingData
): Promise<BookingWithRelations> {
  return prisma.booking.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
    include: {
      functionType: true,
    },
  });
}

// Delete booking by ID (soft delete or hard delete)
export async function deleteBooking(id: string): Promise<Booking> {
  return prisma.booking.delete({
    where: { id },
  });
}

// Check if function type exists and is active
export async function findActiveFunctionType(id: string) {
  return prisma.functionType.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  });
}
