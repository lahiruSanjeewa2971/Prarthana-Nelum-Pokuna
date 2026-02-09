import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/response-builder';
import { logger } from '@/lib/logger';
import { handleApiError } from '@/lib/error-handler';
import * as functionTypeService from '@/services/function-type.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/function-types
 * Public endpoint - List all active function types
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    logger.info('Fetching function types', { includeInactive });

    const functionTypes = await functionTypeService.listFunctionTypes(includeInactive);

    return successResponse({
      functionTypes,
      count: functionTypes.length,
    });
  } catch (error) {
    logger.error('Error fetching function types', error);
    return handleApiError(error);
  }
}
