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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import { Edit, Trash2, Plus } from 'lucide-react';
import {
  FunctionType,
  useDeleteFunctionType,
  useToggleFunctionTypeStatus,
} from '@/hooks/useFunctionTypes';
import { FunctionTypeDialog } from './FunctionTypeDialog';

interface FunctionTypeTableProps {
  functionTypes: FunctionType[];
  isLoading: boolean;
}

export function FunctionTypeTable({ functionTypes, isLoading }: FunctionTypeTableProps) {
  const [selectedFunctionType, setSelectedFunctionType] = useState<FunctionType | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleteFunctionType = useDeleteFunctionType();
  const toggleStatus = useToggleFunctionTypeStatus();

  const handleEdit = (functionType: FunctionType) => {
    setSelectedFunctionType(functionType);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedFunctionType(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteFunctionType.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error) {
      // Error already handled by mutation
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleStatus.mutateAsync({
        id,
        isActive: !currentStatus,
      });
    } catch (error) {
      // Error already handled by mutation onError callback
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="border rounded-lg">
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const deleteFunctionTypeItem = functionTypes.find((ft) => ft.id === deleteId);

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Function Types</h2>
            <p className="text-muted-foreground">
              Manage event types and pricing
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Function Type
          </Button>
        </div>

        {functionTypes.length === 0 ? (
          <div className="border rounded-lg p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No function types yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Get started by creating your first function type. Function types define
                  the different types of events customers can book.
                </p>
              </div>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Function Type
              </Button>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {functionTypes.map((functionType) => (
                  <TableRow key={functionType.id}>
                    <TableCell className="font-medium">
                      {functionType.name}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {functionType.slug}
                      </code>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(functionType.price)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={functionType.isActive}
                          onCheckedChange={() =>
                            handleToggleStatus(functionType.id, functionType.isActive)
                          }
                          disabled={toggleStatus.isPending}
                        />
                        <Badge
                          variant={functionType.isActive ? 'default' : 'secondary'}
                        >
                          {functionType.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(functionType)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(functionType.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <FunctionTypeDialog
        functionType={selectedFunctionType}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Function Type</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Are you sure you want to delete <strong>{deleteFunctionTypeItem?.name}</strong>?
                </p>
                <p className="text-destructive font-medium">
                  This action cannot be undone. This will permanently delete the function type.
                </p>
                <p className="text-sm">
                  Note: Function types with pending or accepted bookings cannot be deleted.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteFunctionType.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteFunctionType.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteFunctionType.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
