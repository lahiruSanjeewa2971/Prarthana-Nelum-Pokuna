'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Edit2 } from 'lucide-react';
import { Booking, useUpdateBookingStatus } from '@/hooks/useBookings';

interface BookingDialogProps {
  booking: Booking | null;
  mode: 'view' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDialog({ booking, mode, open, onOpenChange }: BookingDialogProps) {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [status, setStatus] = useState<'PENDING' | 'ACCEPTED' | 'REJECTED'>(
    booking?.status || 'PENDING'
  );
  const [adminNote, setAdminNote] = useState(booking?.adminNote || '');
  
  const updateBookingStatus = useUpdateBookingStatus();

  if (!booking) return null;

  const handleSave = async () => {
    await updateBookingStatus.mutateAsync({
      id: booking.id,
      status,
      adminNote: adminNote || undefined,
    });
    onOpenChange(false);
  };

  const handleQuickAction = async (newStatus: 'ACCEPTED' | 'REJECTED') => {
    await updateBookingStatus.mutateAsync({
      id: booking.id,
      status: newStatus,
      adminNote: adminNote || undefined,
    });
    onOpenChange(false);
  };

  const getStatusBadge = (bookingStatus: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      ACCEPTED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return (
      <Badge className={colors[bookingStatus as keyof typeof colors]}>
        {bookingStatus}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Booking Details</span>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            View and manage booking information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{booking.customerName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{booking.customerEmail}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="font-medium">{booking.customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Event Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Function Type</Label>
                <p className="font-medium">{booking.functionType.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Event Date</Label>
                <p className="font-medium">
                  {format(new Date(booking.eventDate), 'MMMM dd, yyyy')}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Start Time</Label>
                <p className="font-medium">{booking.startTime}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">End Time</Label>
                <p className="font-medium">{booking.endTime}</p>
              </div>
            </div>

            {booking.additionalNotes && (
              <div>
                <Label className="text-muted-foreground">Customer Notes</Label>
                <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                  {booking.additionalNotes}
                </p>
              </div>
            )}
          </div>

          {/* Status Management */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Booking Status</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="ACCEPTED">Accepted</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="adminNote">Admin Note</Label>
                  <Textarea
                    id="adminNote"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Add notes for internal reference..."
                    rows={4}
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {adminNote.length}/1000 characters
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Current Status</Label>
                  <div className="mt-1">{getStatusBadge(booking.status)}</div>
                </div>
                {booking.adminNote && (
                  <div>
                    <Label className="text-muted-foreground">Admin Note</Label>
                    <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                      {booking.adminNote}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Created:</span>
              <span>{format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Last Updated:</span>
              <span>{format(new Date(booking.updatedAt), 'MMM dd, yyyy HH:mm')}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setStatus(booking.status);
                  setAdminNote(booking.adminNote || '');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateBookingStatus.isPending}
              >
                {updateBookingStatus.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              <div className="flex gap-2">
                {booking.status !== 'ACCEPTED' && (
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('ACCEPTED')}
                    disabled={updateBookingStatus.isPending}
                    className="text-green-600 hover:text-green-700 dark:text-green-400"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                )}
                {booking.status !== 'REJECTED' && (
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('REJECTED')}
                    disabled={updateBookingStatus.isPending}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                )}
              </div>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
