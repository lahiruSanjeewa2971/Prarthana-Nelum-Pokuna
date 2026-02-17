/**
 * Hotel Service
 * 
 * Business logic for hotel information management
 */

import { logger } from '@/lib/logger';
import { NotFoundError } from '@/domain/errors';
import * as hotelRepository from '@/repositories/hotel.repository';

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
