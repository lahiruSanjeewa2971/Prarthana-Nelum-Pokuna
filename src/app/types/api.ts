export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface CreateBookingRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  functionTypeId?: string;
  functionTypeCustom?: string;
  eventDate: string; // ISO 8601 date
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  additionalNotes?: string;
}

export interface UpdateBookingRequest {
  status: 'ACCEPTED' | 'REJECTED';
  adminNote?: string;
}

export interface ListBookingsQuery {
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
}