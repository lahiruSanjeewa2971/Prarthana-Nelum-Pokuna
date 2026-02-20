'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { Booking } from '@/hooks/useBookings';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface BookingDeleteDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function BookingDeleteDialog({
  booking,
  open,
  onOpenChange,
  onDeleted,
}: BookingDeleteDialogProps) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!booking) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to delete booking');
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking-stats'] });

      toast.success('Booking deleted successfully');
      onDeleted();
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete booking');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Delete Booking
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>Are you sure you want to delete this booking?</p>
            
            <div className="bg-muted p-3 rounded-md space-y-1 text-sm">
              <div>
                <span className="font-semibold">Customer:</span>{' '}
                {booking.customerName}
              </div>
              <div>
                <span className="font-semibold">Event:</span>{' '}
                {booking.functionType.name}
              </div>
              <div>
                <span className="font-semibold">Date:</span>{' '}
                {format(new Date(booking.eventDate), 'MMMM dd, yyyy')}
              </div>
            </div>

            <p className="text-destructive font-semibold">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete Booking'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
