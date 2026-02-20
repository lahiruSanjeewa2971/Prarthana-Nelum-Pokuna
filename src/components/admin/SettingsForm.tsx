/**
 * SettingsForm Component
 * 
 * Form for managing hotel settings
 */

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Hotel } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

// Validation schema
const settingsSchema = z.object({
  name: z.string().min(3, 'Hotel name must be at least 3 characters').max(100),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional().nullable(),
  address: z.string().max(200, 'Address must be less than 200 characters').optional().nullable(),
  phone: z.string().max(20, 'Phone must be less than 20 characters').optional().nullable(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')).nullable(),
  map_link: z.string().url('Invalid URL format').optional().or(z.literal('')).nullable(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  hotel: Hotel | undefined;
  isLoading: boolean;
  onSubmit: (data: Partial<Hotel>) => void;
  isPending: boolean;
}

export function SettingsForm({ hotel, isLoading, onSubmit, isPending }: SettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      map_link: '',
    },
  });

  // Reset form when hotel data loads
  useEffect(() => {
    if (hotel) {
      reset({
        name: hotel.name || '',
        description: hotel.description || '',
        address: hotel.address || '',
        phone: hotel.phone || '',
        email: hotel.email || '',
        map_link: hotel.map_link || '',
      });
    }
  }, [hotel, reset]);

  const handleFormSubmit = (data: SettingsFormData) => {
    // Convert empty strings to null
    const cleanedData = {
      name: data.name,
      description: data.description || null,
      address: data.address || null,
      phone: data.phone || null,
      email: data.email || null,
      map_link: data.map_link || null,
    };
    onSubmit(cleanedData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Hotel Information</CardTitle>
          <CardDescription>
            Manage your hotel's basic information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hotel Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Hotel Name *
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter hotel name"
              className={cn(
                'h-11 transition-all',
                errors.name && 'border-red-500 focus-visible:ring-red-500'
              )}
            />
            {errors.name && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter hotel description"
              rows={4}
              className={cn(
                'transition-all resize-none',
                errors.description && 'border-red-500 focus-visible:ring-red-500'
              )}
            />
            {errors.description && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address
            </Label>
            <Input
              id="address"
              {...register('address')}
              placeholder="Enter hotel address"
              className={cn(
                'h-11 transition-all',
                errors.address && 'border-red-500 focus-visible:ring-red-500'
              )}
            />
            {errors.address && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="+94 XX XXX XXXX"
                className={cn(
                  'h-11 transition-all',
                  errors.phone && 'border-red-500 focus-visible:ring-red-500'
                )}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="info@hotel.com"
                className={cn(
                  'h-11 transition-all',
                  errors.email && 'border-red-500 focus-visible:ring-red-500'
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Map Link */}
          <div className="space-y-2">
            <Label htmlFor="map_link" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Google Maps Link
            </Label>
            <Input
              id="map_link"
              type="url"
              {...register('map_link')}
              placeholder="https://maps.google.com/..."
              className={cn(
                'h-11 transition-all',
                errors.map_link && 'border-red-500 focus-visible:ring-red-500'
              )}
            />
            {errors.map_link && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.map_link.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Enter the full Google Maps URL for your hotel location
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={!isDirty || isPending}
              className="min-w-[140px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!isDirty || isPending}
              onClick={() => reset()}
            >
              Discard Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
