import { FunctionType as PrismaFunctionType, Booking as PrismaBooking } from '@prisma/client';

/**
 * Domain Types - Extended Prisma types with additional fields
 */

// Serialized FunctionType (for use in Client Components)
// Converts Prisma Decimal to number for serialization
export type FunctionType = Omit<PrismaFunctionType, 'price'> & {
  price: number;
};

export type FunctionTypeWithStats = FunctionType & {
  bookingCount: number;
  lastBookedAt?: Date;
};

export type Booking = PrismaBooking;

/**
 * Re-export common types from Prisma
 */
export { BookingStatus } from '@prisma/client';
