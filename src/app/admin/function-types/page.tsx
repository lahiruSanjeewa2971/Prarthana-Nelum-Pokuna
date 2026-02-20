'use client';

import { useFunctionTypes } from '@/hooks/useFunctionTypes';
import { FunctionTypeTable } from '@/components/admin/FunctionTypeTable';

/**
 * Function Types Management Page
 * 
 * Allows admins to:
 * - View all function types
 * - Create new function types
 * - Edit existing function types
 * - Toggle active/inactive status
 * - Delete function types (with booking check)
 */
export default function FunctionTypesPage() {
  const { data, isLoading, error } = useFunctionTypes();

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-destructive">
            Failed to load function types
          </h3>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FunctionTypeTable
        functionTypes={data?.functionTypes || []}
        isLoading={isLoading}
      />
    </div>
  );
}
