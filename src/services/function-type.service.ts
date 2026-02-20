import { FunctionType } from '@prisma/client';
import { logger } from '@/lib/logger';
import { ValidationError, NotFoundError, ConflictError } from '@/domain/errors';
import * as functionTypeRepository from '@/repositories/function-type.repository';

/**
 * List all function types
 */
export async function listFunctionTypes(includeInactive = false): Promise<FunctionType[]> {
  logger.info('Listing function types', { includeInactive });
  return functionTypeRepository.findAllFunctionTypes(includeInactive);
}

/**
 * Get function type by ID
 */
export async function getFunctionTypeById(id: string): Promise<FunctionType> {
  logger.info('Getting function type', { functionTypeId: id });

  const functionType = await functionTypeRepository.findFunctionTypeById(id);

  if (!functionType) {
    throw new NotFoundError(`Function type with ID ${id} not found`);
  }

  return functionType;
}

/**
 * Create new function type
 */
export async function createFunctionType(data: {
  name: string;
  price: number;
  slug?: string;
  isActive?: boolean;
}): Promise<FunctionType> {
  logger.info('Creating function type', { name: data.name });

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    throw new ValidationError('Function type name is required');
  }

  if (data.name.length > 100) {
    throw new ValidationError('Function type name must be less than 100 characters');
  }

  // Check if name already exists
  const existingByName = await functionTypeRepository.findFunctionTypeByName(data.name);
  if (existingByName) {
    throw new ConflictError(`Function type with name "${data.name}" already exists`);
  }

  // Check if slug already exists
  const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');
  const existingBySlug = await functionTypeRepository.findFunctionTypeBySlug(slug);
  if (existingBySlug) {
    throw new ConflictError(`Function type with slug "${slug}" already exists`);
  }

  const functionType = await functionTypeRepository.createFunctionType({
    name: data.name,
    price: data.price,
    slug,
    isActive: data.isActive,
  });

  logger.info('Function type created', { functionTypeId: functionType.id });
  return functionType;
}

/**
 * Update function type
 * Returns warning if there are active bookings
 */
export async function updateFunctionType(
  id: string,
  data: {
    name?: string;
    slug?: string;
    isActive?: boolean;
  }
): Promise<{ functionType: FunctionType; warning?: string }> {
  logger.info('Updating function type', { functionTypeId: id, data });

  // Check if function type exists
  const existingFunctionType = await functionTypeRepository.findFunctionTypeById(id);
  if (!existingFunctionType) {
    throw new NotFoundError(`Function type with ID ${id} not found`);
  }

  // Validate name if provided
  if (data.name !== undefined) {
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError('Function type name cannot be empty');
    }

    if (data.name.length > 100) {
      throw new ValidationError('Function type name must be less than 100 characters');
    }

    // Check if new name already exists (excluding current function type)
    const existingByName = await functionTypeRepository.findFunctionTypeByName(data.name);
    if (existingByName && existingByName.id !== id) {
      throw new ConflictError(`Function type with name "${data.name}" already exists`);
    }
  }

  // Validate slug if provided
  if (data.slug !== undefined) {
    const existingBySlug = await functionTypeRepository.findFunctionTypeBySlug(data.slug);
    if (existingBySlug && existingBySlug.id !== id) {
      throw new ConflictError(`Function type with slug "${data.slug}" already exists`);
    }
  }

  // Check for active bookings (PENDING or ACCEPTED)
  const hasActive = await functionTypeRepository.hasActiveBookings(id);
  if (hasActive) {
    const bookingCounts = await functionTypeRepository.getBookingCountsByStatus(id);
    throw new ConflictError(
      `Cannot update function type. It has ${bookingCounts.pending} pending and ${bookingCounts.accepted} accepted bookings. Please handle these bookings first.`,
      { bookingCounts }
    );
  }

  // Delete rejected bookings if any
  const deletedCount = await functionTypeRepository.deleteRejectedBookingsForFunctionType(id);
  if (deletedCount > 0) {
    logger.info('Deleted rejected bookings', { functionTypeId: id, count: deletedCount });
  }

  // Update function type
  const functionType = await functionTypeRepository.updateFunctionType(id, data);

  logger.info('Function type updated', { functionTypeId: id });

  return {
    functionType,
    warning: deletedCount > 0 ? `${deletedCount} rejected booking(s) were deleted` : undefined,
  };
}

/**
 * Change function type status (activate/deactivate)
 */
export async function changeFunctionTypeStatus(
  id: string,
  isActive: boolean
): Promise<{ functionType: FunctionType; warning?: string }> {
  logger.info('Changing function type status', { functionTypeId: id, isActive });

  // Check if function type exists
  const existingFunctionType = await functionTypeRepository.findFunctionTypeById(id);
  if (!existingFunctionType) {
    throw new NotFoundError(`Function type with ID ${id} not found`);
  }

  // If deactivating, check for active bookings
  if (!isActive) {
    const hasActive = await functionTypeRepository.hasActiveBookings(id);
    if (hasActive) {
      const bookingCounts = await functionTypeRepository.getBookingCountsByStatus(id);
      throw new ConflictError(
        `Cannot deactivate function type. It has ${bookingCounts.pending} pending and ${bookingCounts.accepted} accepted bookings. Please handle these bookings first.`,
        { bookingCounts }
      );
    }

    // Delete rejected bookings if any
    const deletedCount = await functionTypeRepository.deleteRejectedBookingsForFunctionType(id);
    if (deletedCount > 0) {
      logger.info('Deleted rejected bookings', { functionTypeId: id, count: deletedCount });
    }

    // Update status
    const functionType = await functionTypeRepository.updateFunctionType(id, { isActive });

    logger.info('Function type status changed', { functionTypeId: id, isActive });

    return {
      functionType,
      warning: deletedCount > 0 ? `${deletedCount} rejected booking(s) were deleted` : undefined,
    };
  }

  // Activating - no checks needed
  const functionType = await functionTypeRepository.updateFunctionType(id, { isActive });

  logger.info('Function type status changed', { functionTypeId: id, isActive });

  return { functionType };
}

/**
 * Delete function type (if no pending/accepted bookings)
 */
export async function deleteFunctionType(id: string): Promise<void> {
  logger.info('Deleting function type', { functionTypeId: id });

  // Check if function type exists
  const existingFunctionType = await functionTypeRepository.findFunctionTypeById(id);
  if (!existingFunctionType) {
    throw new NotFoundError(`Function type with ID ${id} not found`);
  }

  // Check for pending or accepted bookings
  const bookingCounts = await functionTypeRepository.getBookingCountsByStatus(id);
  const activeBookings = bookingCounts.pending + bookingCounts.accepted;
  
  if (activeBookings > 0) {
    throw new ConflictError(
      `Cannot delete function type. It has ${activeBookings} active booking(s) (pending or accepted).`,
      { 
        pending: bookingCounts.pending,
        accepted: bookingCounts.accepted,
      }
    );
  }

  await functionTypeRepository.deleteFunctionType(id);

  logger.info('Function type deleted', { functionTypeId: id });
}
