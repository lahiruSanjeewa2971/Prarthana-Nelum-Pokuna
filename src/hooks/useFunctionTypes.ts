'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface FunctionType {
  id: string;
  name: string;
  slug: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FunctionTypesResponse {
  functionTypes: FunctionType[];
  count: number;
}

/**
 * Fetch all function types
 */
export function useFunctionTypes() {
  return useQuery({
    queryKey: ['function-types'],
    queryFn: async (): Promise<FunctionTypesResponse> => {
      const response = await fetch('/api/admin/function-types', {
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        const err: any = new Error(error.error?.message || 'Failed to fetch function types');
        err.status = response.status;
        throw err;
      }

      const result = await response.json();
      return result.data;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Fetch single function type by ID
 */
export function useFunctionType(id: string) {
  return useQuery({
    queryKey: ['function-type', id],
    queryFn: async (): Promise<FunctionType> => {
      const response = await fetch(`/api/admin/function-types/${id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        const err: any = new Error(error.error?.message || 'Failed to fetch function type');
        err.status = response.status;
        throw err;
      }

      const result = await response.json();
      return result.data.functionType;
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

/**
 * Create new function type
 */
export function useCreateFunctionType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      slug?: string;
      price: number;
      isActive?: boolean;
    }) => {
      const response = await fetch('/api/admin/function-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        const err: any = new Error(error.error?.message || 'Failed to create function type');
        err.status = response.status;
        throw err;
      }

      const result = await response.json();
      return result.data.functionType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['function-types'] });
      toast.success('Function type created successfully');
    },
    onError: (error: any) => {
      if (error.status !== 401) {
        toast.error(error.message || 'Failed to create function type');
      }
    },
  });
}

/**
 * Update function type
 */
export function useUpdateFunctionType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        slug?: string;
        price?: number;
        isActive?: boolean;
      };
    }) => {
      const response = await fetch(`/api/admin/function-types/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        const err: any = new Error(error.error?.message || 'Failed to update function type');
        err.status = response.status;
        throw err;
      }

      const result = await response.json();
      return result.data.functionType;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['function-types'] });
      queryClient.invalidateQueries({ queryKey: ['function-type', data.id] });
      toast.success('Function type updated successfully');
    },
    onError: (error: any) => {
      if (error.status !== 401) {
        toast.error(error.message || 'Failed to update function type');
      }
    },
  });
}

/**
 * Delete function type
 */
export function useDeleteFunctionType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/function-types/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        const err: any = new Error(error.error?.message || 'Failed to delete function type');
        err.status = response.status;
        err.code = error.error?.code;
        throw err;
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['function-types'] });
      toast.success('Function type deleted successfully');
    },
    onError: (error: any) => {
      if (error.status !== 401) {
        // Show specific error for booking conflict
        toast.error(error.message || 'Failed to delete function type');
      }
    },
  });
}

/**
 * Toggle function type active status
 */
export function useToggleFunctionTypeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      isActive,
    }: {
      id: string;
      isActive: boolean;
    }) => {
      const response = await fetch(`/api/admin/function-types/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        const error = await response.json();
        const err: any = new Error(error.error?.message || 'Failed to toggle status');
        err.status = response.status;
        throw err;
      }

      const result = await response.json();
      return result.data.functionType;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['function-types'] });
      queryClient.invalidateQueries({ queryKey: ['function-type', data.id] });
      toast.success(`Function type ${data.isActive ? 'activated' : 'deactivated'}`);
    },
    onError: (error: any) => {
      if (error.status !== 401) {
        toast.error(error.message || 'Failed to toggle status');
      }
    },
  });
}
