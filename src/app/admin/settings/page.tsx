/**
 * Settings Page
 * 
 * Hotel settings management page for admin
 */

'use client';

import { useHotel, useUpdateHotel } from '@/hooks/useHotel';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { Hotel } from '@prisma/client';

export default function SettingsPage() {
  const { data: hotel, isLoading, error } = useHotel();
  const updateHotel = useUpdateHotel();

  const handleSubmit = (data: Partial<Hotel>) => {
    updateHotel.mutate(data);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your hotel information and preferences
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            Failed to load hotel information. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your hotel information and preferences
        </p>
      </div>

      <SettingsForm
        hotel={hotel}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        isPending={updateHotel.isPending}
      />
    </div>
  );
}
