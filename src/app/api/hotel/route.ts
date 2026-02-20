/**
 * Hotel Info API Endpoint
 * 
 * GET /api/hotel - Retrieve hotel information (public)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHotelInfo } from '@/services/hotel.service';
import { handleApiError } from '@/lib/error-handler';
import { successResponse } from '@/lib/response-builder';

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
