import { prisma } from '@/lib/db';
import { Hotel } from '@prisma/client';

/**
 * Hotel Repository - Database operations for Hotel entity
 */

/**
 * Find the first hotel record (default hotel)
 */
export async function findFirstHotel(): Promise<Hotel | null> {
  return prisma.hotel.findFirst({
    orderBy: { createdAt: 'asc' },
  });
}

/**
 * Find hotel by ID
 */
export async function findHotelById(id: string): Promise<Hotel | null> {
  return prisma.hotel.findUnique({
    where: { id },
  });
}
