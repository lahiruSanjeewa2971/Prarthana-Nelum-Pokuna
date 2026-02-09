import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';
import { successResponse } from '@/lib/response-builder';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Get authenticated admin profile (protected route test)
 */
async function getProfile(request: AuthenticatedRequest) {
  const admin = request.admin!;

  return successResponse({
    admin: {
      id: admin.adminId,
      email: admin.email,
    },
  });
}

export const GET = requireAuth(getProfile);
