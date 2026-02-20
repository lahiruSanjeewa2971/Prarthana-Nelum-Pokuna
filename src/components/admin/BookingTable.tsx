'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Booking } from '@/hooks/useBookings';
import { BookingDialog } from './BookingDialog';
import { BookingDeleteDialog } from './BookingDeleteDialog';

interface BookingTableProps {
  bookings: Booking[];
  isLoading?: boolean;
}

export function BookingTable({ bookings, isLoading }: BookingTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setDialogMode('view');
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setDialogMode('edit');
  };

  const handleDelete = (booking: Booking) => {
    setBookingToDelete(booking);
    setDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'default',
      ACCEPTED: 'default',
      REJECTED: 'destructive',
    } as const;

    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      ACCEPTED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return (
      <Badge 
        variant={variants[status as keyof typeof variants] || 'default'}
        className={colors[status as keyof typeof colors]}
      >
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Function Type</TableHead>
              <TableHead>Event Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-8 w-24 bg-muted animate-pulse rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
          <p className="text-sm text-muted-foreground">
            Bookings will appear here once customers submit them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Function Type</TableHead>
              <TableHead>Event Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  {booking.customerName}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {booking.customerEmail}
                </TableCell>
                <TableCell className="text-sm">
                  {booking.customerPhone}
                </TableCell>
                <TableCell>{booking.functionType.name}</TableCell>
                <TableCell>
                  {format(new Date(booking.eventDate), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="text-sm">
                  {booking.startTime} - {booking.endTime}
                </TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(booking)}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(booking)}
                      title="Edit booking"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(booking)}
                      title="Delete booking"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedBooking && (
        <BookingDialog
          booking={selectedBooking}
          mode={dialogMode}
          open={!!selectedBooking}
          onOpenChange={(open: boolean) => !open && setSelectedBooking(null)}
        />
      )}

      <BookingDeleteDialog
        booking={bookingToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDeleted={() => setBookingToDelete(null)}
      />
    </>
  );
}
