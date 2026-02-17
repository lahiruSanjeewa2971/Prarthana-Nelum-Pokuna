import { prisma } from '@/lib/db';
import { FunctionType, BookingStatus } from '@prisma/client';

/**
 * Function Type Repository - Database operations for FunctionType entity
 */

export interface CreateFunctionTypeData {
  name: string;
  price: number;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateFunctionTypeData {
  name?: string;
  price?: number;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

/**
 * Find all function types
 */
export async function findAllFunctionTypes(includeInactive = false): Promise<FunctionType[]> {
  return prisma.functionType.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { name: 'asc' },
  });
}

/**
 * Find function type by ID
 */
export async function findFunctionTypeById(id: string): Promise<FunctionType | null> {
  return prisma.functionType.findUnique({
    where: { id },
  });
}

/**
 * Find function type by name
 */
export async function findFunctionTypeByName(name: string): Promise<FunctionType | null> {
  return prisma.functionType.findUnique({
    where: { name },
  });
}

/**
 * Find function type by slug
 */
export async function findFunctionTypeBySlug(slug: string): Promise<FunctionType | null> {
  return prisma.functionType.findUnique({
    where: { slug },
  });
}

/**
 * Create new function type
 */
export async function createFunctionType(data: CreateFunctionTypeData): Promise<FunctionType> {
  return prisma.functionType.create({
    data: {
      name: data.name,
      price: data.price,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      description: data.description,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
}

/**
 * Update function type
 */
export async function updateFunctionType(
  id: string,
  data: UpdateFunctionTypeData
): Promise<FunctionType> {
  return prisma.functionType.update({
    where: { id },
    data,
  });
}

/**
 * Delete function type
 */
export async function deleteFunctionType(id: string): Promise<FunctionType> {
  return prisma.functionType.delete({
    where: { id },
  });
}

/**
 * Count bookings linked to function type by status
 */
export async function countBookingsByFunctionTypeAndStatus(
  functionTypeId: string,
  statuses: BookingStatus[]
): Promise<number> {
  return prisma.booking.count({
    where: {
      functionTypeId,
      status: { in: statuses },
    },
  });
}

/**
 * Delete all rejected bookings for a function type
 */
export async function deleteRejectedBookingsForFunctionType(
  functionTypeId: string
): Promise<number> {
  const result = await prisma.booking.deleteMany({
    where: {
      functionTypeId,
      status: 'REJECTED',
    },
  });
  return result.count;
}

/**
 * Check if function type has active bookings (PENDING or ACCEPTED)
 */
export async function hasActiveBookings(functionTypeId: string): Promise<boolean> {
  const count = await prisma.booking.count({
    where: {
      functionTypeId,
      status: { in: ['PENDING', 'ACCEPTED'] },
    },
  });
  return count > 0;
}

/**
 * Get bookings count for function type grouped by status
 */
export async function getBookingCountsByStatus(functionTypeId: string): Promise<{
  pending: number;
  accepted: number;
  rejected: number;
  total: number;
}> {
  const [pending, accepted, rejected] = await Promise.all([
    prisma.booking.count({ where: { functionTypeId, status: 'PENDING' } }),
    prisma.booking.count({ where: { functionTypeId, status: 'ACCEPTED' } }),
    prisma.booking.count({ where: { functionTypeId, status: 'REJECTED' } }),
  ]);

  return {
    pending,
    accepted,
    rejected,
    total: pending + accepted + rejected,
  };
}
