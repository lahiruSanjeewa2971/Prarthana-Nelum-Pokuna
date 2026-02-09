import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';
import { successResponse, errorResponse } from '@/lib/response-builder';
import { logger } from '@/lib/logger';
import { handleApiError } from '@/lib/error-handler';
import * as functionTypeService from '@/services/function-type.service';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/function-types/[id]
 * Get single function type (Admin only)
 */
async function getFunctionType(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    logger.info('Admin fetching function type', {
      adminId: request.admin?.adminId,
      functionTypeId: id,
    });

    const functionType = await functionTypeService.getFunctionTypeById(id);

    return successResponse({ functionType });
  } catch (error) {
    logger.error('Error fetching function type', error);
    return handleApiError(error);
  }
}

/**
 * PATCH /api/admin/function-types/[id]
 * Update function type (Admin only)
 * Checks for active bookings and aborts if found
 */
const updateFunctionTypeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
});

async function updateFunctionType(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const validation = updateFunctionTypeSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Invalid request data',
        400,
        validation.error.issues
      );
    }

    const { name, slug, isActive } = validation.data;

    logger.info('Admin updating function type', {
      adminId: request.admin?.adminId,
      functionTypeId: id,
      updates: { name, slug, isActive },
    });

    const result = await functionTypeService.updateFunctionType(id, {
      name,
      slug,
      isActive,
    });

    return successResponse({
      message: 'Function type updated successfully',
      functionType: result.functionType,
      warning: result.warning,
    });
  } catch (error) {
    logger.error('Error updating function type', error);
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/function-types/[id]
 * Delete function type (Admin only)
 */
async function deleteFunctionType(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    logger.info('Admin deleting function type', {
      adminId: request.admin?.adminId,
      functionTypeId: id,
    });

    await functionTypeService.deleteFunctionType(id);

    return successResponse({
      message: 'Function type deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting function type', error);
    return handleApiError(error);
  }
}

export const GET = requireAuth(getFunctionType);
export const PATCH = requireAuth(updateFunctionType);
export const DELETE = requireAuth(deleteFunctionType);
