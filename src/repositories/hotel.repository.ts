import { prisma } from '@/lib/db';
import { Hotel } from '@prisma/client';

/**
 * Hotel Repository - Database operations for Hotel entity
 */

export interface UpdateHotelData {
  name?: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  map_link?: string | null;
}

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

/**
 * Create or update hotel (upsert)
 * There should only be one hotel record in the system
 */
export async function upsertHotel(data: UpdateHotelData): Promise<Hotel> {
  const existingHotel = await findFirstHotel();

  if (existingHotel) {
    // Update existing hotel
    return prisma.hotel.update({
      where: { id: existingHotel.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  } else {
    // Create new hotel
    return prisma.hotel.create({
      data: {
        name: data.name || 'Hotel Name',
        description: data.description,
        address: data.address,
        phone: data.phone,
        email: data.email,
        map_link: data.map_link,
      },
    });
  }
}
