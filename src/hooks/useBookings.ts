'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface BookingFilters {
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  eventDateGte?: string;
  eventDateLte?: string;
  customerEmail?: string;
  functionTypeId?: string;
  page?: number;
  limit?: number;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  additionalNotes?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  adminNote?: string;
  functionTypeId: string;
  functionType: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BookingStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}

interface PaginatedBookingsResponse {
  bookings: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Fetch bookings with filters
 */
export function useBookings(filters: BookingFilters = {}) {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: async (): Promise<PaginatedBookingsResponse> => {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.eventDateGte) params.append('eventDateGte', filters.eventDateGte);
      if (filters.eventDateLte) params.append('eventDateLte', filters.eventDateLte);
      if (filters.customerEmail) params.append('customerEmail', filters.customerEmail);
      if (filters.functionTypeId) params.append('functionTypeId', filters.functionTypeId);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/admin/bookings?${params.toString()}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        const err: any = new Error(error.error?.message || 'Failed to fetch bookings');
        err.status = response.status;
        throw err;
      }

      const result = await response.json();
      return result.data;
    },
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
}

/**
 * Fetch single booking by ID
 */
export function useBooking(id: string) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: async (): Promise<Booking> => {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        const err: any = new Error(error.error?.message || 'Failed to fetch booking');
        err.status = response.status;
        throw err;
      }

      const result = await response.json();
      return result.data.booking;
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

/**
 * Update booking status
 */
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      adminNote,
    }: {
      id: string;
      status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
      adminNote?: string;
    }) => {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status, adminNote }),
      });

      if (!response.ok) {
        const error = await response.json();
        const err: any = new Error(error.error?.message || 'Failed to update booking');
        err.status = response.status;
        throw err;
      }

      const result = await response.json();
      return result.data.booking;
    },
    onSuccess: (data) => {
      // Invalidate bookings list and single booking queries
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', data.id] });
      queryClient.invalidateQueries({ queryKey: ['booking-stats'] });
      toast.success('Booking updated successfully');
    },
    onError: (error: any) => {
      // Don't show toast for 401 errors (handled by QueryProvider)
      if (error.status !== 401) {
        toast.error(error.message || 'Failed to update booking');
      }
    },
  });
}

/**
 * Fetch booking statistics
 */
export function useBookingStats() {
  return useQuery({
    queryKey: ['booking-stats'],
    queryFn: async (): Promise<BookingStats> => {
      // Fetch each status separately to get accurate counts
      const [allResponse, pendingResponse, acceptedResponse, rejectedResponse] = await Promise.all([
        fetch('/api/admin/bookings?limit=1&page=1', { credentials: 'include' }),
        fetch('/api/admin/bookings?status=PENDING&limit=1&page=1', { credentials: 'include' }),
        fetch('/api/admin/bookings?status=ACCEPTED&limit=1&page=1', { credentials: 'include' }),
        fetch('/api/admin/bookings?status=REJECTED&limit=1&page=1', { credentials: 'include' }),
      ]);

      if (!allResponse.ok) {
        const error = await allResponse.json();
        const err: any = new Error(error.error?.message || 'Failed to fetch booking stats');
        err.status = allResponse.status;
        throw err;
      }

      const [all, pending, accepted, rejected] = await Promise.all([
        allResponse.json(),
        pendingResponse.json(),
        acceptedResponse.json(),
        rejectedResponse.json(),
      ]);

      // Use pagination.total from API responses
      const stats: BookingStats = {
        total: all.data.pagination?.total || 0,
        pending: pending.data.pagination?.total || 0,
        accepted: accepted.data.pagination?.total || 0,
        rejected: rejected.data.pagination?.total || 0,
      };

      return stats;
    },
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
}
