import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';
import { successResponse, errorResponse } from '@/lib/response-builder';
import { logger } from '@/lib/logger';
import { handleApiError } from '@/lib/error-handler';
import * as functionTypeService from '@/services/function-type.service';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/function-types
 * List all function types including inactive ones (Admin only)
 */
async function listFunctionTypes(request: AuthenticatedRequest) {
  try {
    logger.info('Admin fetching all function types', {
      adminId: request.admin?.adminId,
    });

    const functionTypes = await functionTypeService.listFunctionTypes(true);

    return successResponse({
      functionTypes,
      count: functionTypes.length,
    });
  } catch (error) {
    logger.error('Error listing function types', error);
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/function-types
 * Create new function type (Admin only)
 */
const createFunctionTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  price: z.number().min(0, 'Price must be positive'),
  slug: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
});

async function createFunctionType(request: AuthenticatedRequest) {
  try {
    const body = await request.json();
    const validation = createFunctionTypeSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Invalid request data',
        400,
        validation.error.issues
      );
    }

    const { name, price, slug, isActive } = validation.data;

    logger.info('Admin creating function type', {
      adminId: request.admin?.adminId,
      name,
      price,
    });

    const functionType = await functionTypeService.createFunctionType({
      name,
      price,
      slug,
      isActive,
    });

    return successResponse(
      {
        message: 'Function type created successfully',
        functionType,
      },
      undefined,
      201
    );
  } catch (error) {
    logger.error('Error creating function type', error);
    return handleApiError(error);
  }
}

export const GET = requireAuth(listFunctionTypes);
export const POST = requireAuth(createFunctionType);
