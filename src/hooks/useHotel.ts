/**
 * useHotel Hook
 * 
 * React Query hooks for hotel settings management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Hotel } from '@prisma/client';

/**
 * Fetch hotel information
 */
async function fetchHotel(): Promise<Hotel> {
  const response = await fetch('/api/hotel', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    const err: any = new Error(error.error?.message || 'Failed to fetch hotel info');
    err.status = response.status;
    throw err;
  }

  const result = await response.json();
  return result.data.hotel;
}

/**
 * Update hotel information
 */
async function updateHotel(data: Partial<Hotel>): Promise<Hotel> {
  const response = await fetch('/api/hotel', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    const err: any = new Error(error.error?.message || 'Failed to update hotel info');
    err.status = response.status;
    throw err;
  }

  const result = await response.json();
  return result.data.hotel;
}

/**
 * Hook to fetch hotel information
 */
export function useHotel() {
  return useQuery<Hotel, Error>({
    queryKey: ['hotel'],
    queryFn: fetchHotel,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to update hotel information
 */
export function useUpdateHotel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Hotel>) => {
      return updateHotel(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hotel'] });
      toast.success('Hotel information updated successfully');
    },
    onError: (error: any) => {
      if (error.status !== 401) {
        toast.error(error.message || 'Failed to update hotel information');
      }
    },
  });
}
