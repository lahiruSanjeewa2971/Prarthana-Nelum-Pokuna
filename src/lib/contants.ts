import { BookingStatus } from '@prisma/client';

export const BOOKING_STATUS = {
  PENDING: 'PENDING' as BookingStatus,
  ACCEPTED: 'ACCEPTED' as BookingStatus,
  REJECTED: 'REJECTED' as BookingStatus,
} as const;

export const TIME_SLOTS = {
  MIN_DURATION_HOURS: 2,
  MAX_DURATION_HOURS: 12,
  WORKING_HOURS: {
    START: '08:00',
    END: '22:00',
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const VALIDATION_RULES = {
  CUSTOMER_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  CUSTOMER_PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
  ADDITIONAL_NOTES: {
    MAX_LENGTH: 500,
  },
  ADMIN_NOTE: {
    MAX_LENGTH: 500,
  },
  ADVANCE_BOOKING_DAYS: 1, // Must book at least 1 day in advance
} as const;

export const EMAIL_CONFIG = {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@prarthananeelumpokuna.lk',
  FROM_EMAIL: process.env.FROM_EMAIL || 'nelumpokuna@gmail.com',
  FROM_NAME: 'Prarthana Nelum Pokuna',
} as const;

export const ERROR_MESSAGES = {
  BOOKING_NOT_FOUND: 'Booking not found',
  INVALID_DATE: 'Event date must be in the future',
  INVALID_TIME_RANGE: 'End time must be after start time',
  TIME_SLOT_CONFLICT: 'The selected time slot conflicts with an existing booking',
  FUNCTION_TYPE_REQUIRED: 'Either functionTypeId or functionTypeCustom must be provided',
  FUNCTION_TYPE_NOT_FOUND: 'Selected function type not found or inactive',
  INVALID_STATUS_TRANSITION: 'Invalid status transition',
} as const;