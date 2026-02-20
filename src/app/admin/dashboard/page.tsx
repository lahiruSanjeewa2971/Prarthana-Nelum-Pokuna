'use client';

import { useState } from 'react';
import { StatsCards } from '@/components/admin/StatsCards';
import { BookingFilters } from '@/components/admin/BookingFilters';
import { BookingTable } from '@/components/admin/BookingTable';
import { useBookings } from '@/hooks/useBookings';

/**
 * Admin Dashboard Page
 * 
 * Protected route - users must be authenticated to access.
 * Displays bookings with filters and statistics.
 */
export default function AdminDashboard() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  // Fetch bookings with filters
  const { data, isLoading, error } = useBookings({
    status: statusFilter === 'all' ? undefined : statusFilter,
    page: currentPage,
    limit,
  });

  const bookings = data?.bookings || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your bookings and view statistics
        </p>
      </div>

      {/* Statistics Cards */}
      <StatsCards />

      {/* Filters */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Bookings</h2>
        <BookingFilters
          activeStatus={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
          Failed to load bookings: {error.message}
        </div>
      )}

      {/* Bookings Table */}
      <BookingTable bookings={bookings} isLoading={isLoading} />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
