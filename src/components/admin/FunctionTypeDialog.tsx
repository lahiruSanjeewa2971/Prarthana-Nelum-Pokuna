'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  FunctionType,
  useCreateFunctionType,
  useUpdateFunctionType,
} from '@/hooks/useFunctionTypes';

interface FunctionTypeDialogProps {
  functionType: FunctionType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
}

export function FunctionTypeDialog({
  functionType,
  open,
  onOpenChange,
  mode,
}: FunctionTypeDialogProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createFunctionType = useCreateFunctionType();
  const updateFunctionType = useUpdateFunctionType();

  // Initialize form with function type data in edit mode
  useEffect(() => {
    if (mode === 'edit' && functionType) {
      setName(functionType.name);
      setSlug(functionType.slug);
      setPrice(functionType.price.toString());
      setIsActive(functionType.isActive);
    } else {
      // Reset form in create mode
      setName('');
      setSlug('');
      setPrice('');
      setIsActive(true);
    }
    setErrors({});
  }, [functionType, mode, open]);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    // Only auto-generate slug in create mode or if slug is empty
    if (mode === 'create' || !slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum)) {
        newErrors.price = 'Price must be a valid number';
      } else if (priceNum < 0) {
        newErrors.price = 'Price must be positive';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      price: parseFloat(price),
      isActive,
    };

    try {
      if (mode === 'create') {
        await createFunctionType.mutateAsync(data);
      } else if (functionType) {
        await updateFunctionType.mutateAsync({
          id: functionType.id,
          data,
        });
      }
      onOpenChange(false);
    } catch (error) {
      // Error already handled by mutation onError
    }
  };

  const isLoading = createFunctionType.isPending || updateFunctionType.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Function Type' : 'Edit Function Type'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new function type for event bookings.'
              : 'Update function type information.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Wedding Package"
              disabled={isLoading}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Slug Field */}
          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g., wedding-package"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated from name if left empty
            </p>
          </div>

          {/* Price Field */}
          <div className="space-y-2">
            <Label htmlFor="price">
              Price (LKR) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 50000"
              disabled={isLoading}
              className={errors.price ? 'border-red-500' : ''}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active Status</Label>
              <p className="text-xs text-muted-foreground">
                Inactive types won't be shown to customers
              </p>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : mode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
