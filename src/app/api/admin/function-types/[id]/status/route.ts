import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';
import { successResponse, errorResponse } from '@/lib/response-builder';
import { logger } from '@/lib/logger';
import { handleApiError } from '@/lib/error-handler';
import * as functionTypeService from '@/services/function-type.service';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/function-types/[id]/status
 * Change function type status (activate/deactivate) (Admin only)
 * Checks for active bookings and aborts if found when deactivating
 */
const changeStatusSchema = z.object({
  isActive: z.boolean({
    message: 'isActive must be a boolean',
  }),
});

async function changeFunctionTypeStatus(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const validation = changeStatusSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Invalid request data',
        400,
        validation.error.issues
      );
    }

    const { isActive } = validation.data;

    logger.info('Admin changing function type status', {
      adminId: request.admin?.adminId,
      functionTypeId: id,
      isActive,
    });

    const result = await functionTypeService.changeFunctionTypeStatus(id, isActive);

    return successResponse({
      message: `Function type ${isActive ? 'activated' : 'deactivated'} successfully`,
      functionType: result.functionType,
      warning: result.warning,
    });
  } catch (error) {
    logger.error('Error changing function type status', error);
    return handleApiError(error);
  }
}

export const PATCH = requireAuth(changeFunctionTypeStatus);
