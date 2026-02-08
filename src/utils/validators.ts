import { z } from 'zod';
import { VALIDATION_RULES, PAGINATION } from '@/lib/contants';

export const createBookingSchema = z.object({
  customerName: z
    .string()
    .min(VALIDATION_RULES.CUSTOMER_NAME.MIN_LENGTH, 'Name must be at least 2 characters')
    .max(VALIDATION_RULES.CUSTOMER_NAME.MAX_LENGTH, 'Name must not exceed 100 characters')
    .trim(),
  customerEmail: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  customerPhone: z
    .string()
    .min(VALIDATION_RULES.CUSTOMER_PHONE.MIN_LENGTH, 'Phone number must be at least 10 digits')
    .max(VALIDATION_RULES.CUSTOMER_PHONE.MAX_LENGTH, 'Phone number must not exceed 15 digits')
    .regex(/^[0-9+\s()-]+$/, 'Invalid phone number format')
    .trim(),
  functionTypeId: z.string().uuid('Invalid function type ID').optional(),
  functionTypeCustom: z.string().max(100, 'Custom function type must not exceed 100 characters').optional(),
  eventDate: z.string().datetime('Invalid date format'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (use HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (use HH:MM)'),
  additionalNotes: z
    .string()
    .max(VALIDATION_RULES.ADDITIONAL_NOTES.MAX_LENGTH, 'Notes must not exceed 500 characters')
    .optional(),
}).refine(
  (data) => data.functionTypeId || data.functionTypeCustom,
  {
    message: 'Either functionTypeId or functionTypeCustom must be provided',
    path: ['functionTypeId'],
  }
);

export const updateBookingStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED'], {
    message: 'Status must be either ACCEPTED or REJECTED',
  }),
  adminNote: z
    .string()
    .max(VALIDATION_RULES.ADMIN_NOTE.MAX_LENGTH, 'Admin note must not exceed 500 characters')
    .optional(),
});

export const bookingIdSchema = z.string().uuid('Invalid booking ID');

export const listBookingsQuerySchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(PAGINATION.MAX_LIMIT)
    .default(PAGINATION.DEFAULT_LIMIT),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type ListBookingsQuery = z.infer<typeof listBookingsQuerySchema>;