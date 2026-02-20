/**
 * Hotel Service
 * 
 * Business logic for hotel information management
 */

import { logger } from '@/lib/logger';
import { NotFoundError, ValidationError } from '@/domain/errors';
import * as hotelRepository from '@/repositories/hotel.repository';
import { UpdateHotelData } from '@/repositories/hotel.repository';

/**
 * Get hotel information
 * Retrieves the default hotel record from the database
 */
export async function getHotelInfo() {
  try {
    logger.info('Fetching hotel info');
    
    const hotel = await hotelRepository.findFirstHotel();

    if (!hotel) {
      throw new NotFoundError('Hotel information not found');
    }

    return hotel;
  } catch (error) {
    logger.error('Error fetching hotel info', error);
    throw error;
  }
}

/**
 * Update hotel information
 * Creates or updates the hotel record
 */
export async function updateHotelInfo(data: UpdateHotelData) {
  try {
    logger.info('Updating hotel info', { data });

    // Validate required fields
    if (data.name !== undefined && data.name.trim().length < 3) {
      throw new ValidationError('Hotel name must be at least 3 characters');
    }

    if (data.email && !isValidEmail(data.email)) {
      throw new ValidationError('Invalid email format');
    }

    if (data.map_link && !isValidUrl(data.map_link)) {
      throw new ValidationError('Invalid map link URL');
    }

    const hotel = await hotelRepository.upsertHotel(data);

    logger.info('Hotel info updated successfully', { hotelId: hotel.id });

    return hotel;
  } catch (error) {
    logger.error('Error updating hotel info', error);
    throw error;
  }
}

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate URL
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
