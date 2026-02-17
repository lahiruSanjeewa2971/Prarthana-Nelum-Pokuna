'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Send, User, Mail, Phone, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { FunctionType } from '@/app/types/domain';

// Validation schema
const bookingSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  customerEmail: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email is required'),
  customerPhone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),
  functionTypeId: z.string().min(1, 'Please select a function type'),
  eventDate: z.date({
    message: 'Please select an event date',
  }),
  startTime: z
    .string()
    .min(1, 'Start time is required')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)'),
  endTime: z
    .string()
    .min(1, 'End time is required')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)'),
  additionalNotes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
}).refine((data) => {
  // Validate that end time is after start time
  const [startHour, startMin] = data.startTime.split(':').map(Number);
  const [endHour, endMin] = data.endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  return endMinutes > startMinutes;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  functionTypes: FunctionType[];
}

export function BookingForm({ functionTypes }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const selectedDate = watch('eventDate');
  const selectedFunctionTypeId = watch('functionTypeId');

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          functionTypeId: data.functionTypeId,
          eventDate: data.eventDate.toISOString(),
          startTime: data.startTime,
          endTime: data.endTime,
          additionalNotes: data.additionalNotes || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error data:", errorData);
        
        // Handle different error formats
        const errorMessage = 
          typeof errorData === 'string' ? errorData :
          errorData.error || 
          errorData.message || 
          JSON.stringify(errorData) || 
          'Failed to submit booking';
        
        throw new Error(errorMessage);
      }

      toast.success('Booking Request Submitted!', {
        description: 'Our team will review your request and contact you shortly to confirm your booking.',
        duration: 5000,
      });
      
      reset();
      
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.log("Booking failed:", error);
      toast.error('Submission Failed', {
        description: error instanceof Error ? error.message : 'An error occurred while submitting your booking.',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedFunctionType = functionTypes.find(ft => ft.id === selectedFunctionTypeId);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card rounded-xl sm:rounded-2xl border border-border shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 px-4 sm:px-6 md:px-8 py-5 sm:py-6 border-b border-border">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Booking Details
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1 sm:mt-2">
            Complete the form below and we'll get back to you within 24 hours
          </p>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="h-6 sm:h-8 w-1 bg-primary rounded-full"></div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-sm font-medium">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customerName"
                    {...register('customerName')}
                    placeholder="Enter your full name"
                    className={cn(
                      'pl-10 h-11 transition-all',
                      errors.customerName && 'border-red-500 focus-visible:ring-red-500'
                    )}
                  />
                </div>
                {errors.customerName && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.customerName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail" className="text-sm font-medium">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customerEmail"
                    type="email"
                    {...register('customerEmail')}
                    placeholder="you@example.com"
                    className={cn(
                      'pl-10 h-11 transition-all',
                      errors.customerEmail && 'border-red-500 focus-visible:ring-red-500'
                    )}
                  />
                </div>
                {errors.customerEmail && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.customerEmail.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone" className="text-sm font-medium">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="customerPhone"
                  {...register('customerPhone')}
                  placeholder="+94 7X XXX XXXX"
                  className={cn(
                    'pl-10 h-11 transition-all',
                    errors.customerPhone && 'border-red-500 focus-visible:ring-red-500'
                  )}
                />
              </div>
              {errors.customerPhone && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.customerPhone.message}
                </p>
              )}
            </div>
          </div>

          {/* Event Details Section */}
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="h-6 sm:h-8 w-1 bg-accent rounded-full"></div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Event Details</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Function Type *</Label>
              <Select
                value={selectedFunctionTypeId}
                onValueChange={(value) => setValue('functionTypeId', value, { shouldValidate: true })}
              >
                <SelectTrigger className={cn(
                  'w-full h-11 transition-all',
                  errors.functionTypeId && 'border-red-500'
                )}>
                  <SelectValue placeholder="Select your event type" />
                </SelectTrigger>
                <SelectContent>
                  {functionTypes.map((ft) => (
                    <SelectItem key={ft.id} value={ft.id} className="cursor-pointer">
                      <div className="flex items-center justify-between w-full">
                        <span>{ft.name}</span>
                        <span className="text-xs text-muted-foreground ml-3">
                          LKR {ft.price.toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.functionTypeId && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.functionTypeId.message}
                </p>
              )}
              {selectedFunctionType && selectedFunctionType.description && (
                <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedFunctionType.description}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Event Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal h-11 transition-all',
                      !selectedDate && 'text-muted-foreground',
                      errors.eventDate && 'border-red-500'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Select your event date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setValue('eventDate', date, { shouldValidate: true })}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.eventDate && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.eventDate.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm font-medium">Start Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="time"
                    {...register('startTime')}
                    className={cn(
                      'pl-10 h-11 transition-all',
                      errors.startTime && 'border-red-500 focus-visible:ring-red-500'
                    )}
                  />
                </div>
                {errors.startTime && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm font-medium">End Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="time"
                    {...register('endTime')}
                    className={cn(
                      'pl-10 h-11 transition-all',
                      errors.endTime && 'border-red-500 focus-visible:ring-red-500'
                    )}
                  />
                </div>
                {errors.endTime && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Notes Section */}
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="h-6 sm:h-8 w-1 bg-primary/50 rounded-full"></div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Additional Information</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes" className="text-sm font-medium">
                Special Requirements <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="additionalNotes"
                  {...register('additionalNotes')}
                  rows={4}
                  placeholder="Tell us about any special requirements, decorations, catering preferences, or other details we should know..."
                  className={cn(
                    'pl-10 pt-3 resize-none transition-all',
                    errors.additionalNotes && 'border-red-500 focus-visible:ring-red-500'
                  )}
                />
              </div>
              {errors.additionalNotes && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.additionalNotes.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-1 sm:pt-2">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 group" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm sm:text-base">Processing...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:translate-x-1 transition-transform" /> 
                  <span className="text-sm sm:text-base">Submit Booking Request</span>
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              We'll review your request and respond within 24 hours
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
