/**
 * Hotel Info API Endpoint
 * 
 * GET /api/hotel - Retrieve hotel information (public)
 * PUT /api/hotel - Update hotel information (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getHotelInfo, updateHotelInfo } from '@/services/hotel.service';
import { handleApiError } from '@/lib/error-handler';
import { successResponse } from '@/lib/response-builder';
import { requireAuth } from '@/middleware/auth';

/**
 * GET /api/hotel
 * Public endpoint to retrieve hotel information
 */
export async function GET(request: NextRequest) {
  try {
    const hotel = await getHotelInfo();
    
    return successResponse({ hotel });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/hotel
 * Admin-only endpoint to update hotel information
 */
export const PUT = requireAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validation schema
    const schema = z.object({
      name: z.string().min(3, 'Name must be at least 3 characters').max(100).optional(),
      description: z.string().max(1000).optional().nullable(),
      address: z.string().max(200).optional().nullable(),
      phone: z.string().max(20).optional().nullable(),
      email: z.string().email('Invalid email format').optional().nullable(),
      map_link: z.string().url('Invalid URL format').optional().nullable(),
    });

    const validatedData = schema.parse(body);

    const hotel = await updateHotelInfo(validatedData);

    return successResponse({ 
      hotel,
      message: 'Hotel information updated successfully'
    });
  } catch (error) {
    return handleApiError(error);
  }
});
