import { ValidationError } from '@/domain/errors';
import {
  isDateInFuture,
  isValidTimeFormat,
  getTimeDifferenceInHours,
  isTimeInRange,
  hasTimeOverlap,
  timeToMinutes,
} from '@/lib/date-utils';
import { TIME_SLOTS, ERROR_MESSAGES } from '@/lib/contants';

export function validateEventDate(date: Date): void {
  if (!isDateInFuture(date)) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_DATE);
  }
}

export function validateTimeRange(startTime: string, endTime: string): void {
  if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
    throw new ValidationError('Invalid time format');
  }

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  if (endMinutes <= startMinutes) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_TIME_RANGE);
  }

  const duration = getTimeDifferenceInHours(startTime, endTime);
  if (duration < TIME_SLOTS.MIN_DURATION_HOURS) {
    throw new ValidationError(
      `Booking duration must be at least ${TIME_SLOTS.MIN_DURATION_HOURS} hours`
    );
  }

  if (duration > TIME_SLOTS.MAX_DURATION_HOURS) {
    throw new ValidationError(
      `Booking duration must not exceed ${TIME_SLOTS.MAX_DURATION_HOURS} hours`
    );
  }
}

export function validateWorkingHours(startTime: string, endTime: string): void {
  const { START, END } = TIME_SLOTS.WORKING_HOURS;

  if (!isTimeInRange(startTime, START, END) || !isTimeInRange(endTime, START, END)) {
    throw new ValidationError(
      `Bookings must be within working hours (${START} - ${END})`
    );
  }
}

export function checkTimeSlotConflict(
  proposedStart: string,
  proposedEnd: string,
  existingBookings: Array<{ startTime: string; endTime: string }>
): boolean {
  return existingBookings.some((booking) =>
    hasTimeOverlap(proposedStart, proposedEnd, booking.startTime, booking.endTime)
  );
}