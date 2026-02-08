import {BookingStatus} from '@prisma/client';

export type BookingId = string & {readonly brand: unique symbol};
export type FunctionTypeId = string & {readonly brand: unique symbol};

// DTO (Data Transfer Object) for creating a booking
export interface CreateBookingDTO{
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    functionTypeId?: string;
    functionTypeCustom?: string;
    eventDate: Date; 
    startTime: string;
    endTime: string;
    additionalNotes?: string;
}

export interface UpdateBookingStatusDTO {
    status: BookingStatus;
    adminNotes?: string;
}

export interface BookingFilters{
    status?: BookingStatus;
    startDate?: Date;
    endDate?: Date;
    functionTypeId?: string;
    customerEmail?: string;
}

export interface Pagination{
    page: number;
    limit: number;
}

export interface BookingResponse{
    id: string;
    customerName: string;
    customerEmail: string;
    functionType?:{
        id: string;
        name: string;
    };
    functionTypeCustom?: string;
    functionTypeLabel: string;
    eventDate: Date;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    additionalNotes?: string;
    adminNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginatedBookings {
  data: BookingResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AvailabilityCheck {
  isAvailable: boolean;
  conflicts?: BookingResponse[];
}