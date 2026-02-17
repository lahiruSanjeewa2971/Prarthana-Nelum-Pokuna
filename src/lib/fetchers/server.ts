/**
 * Server-Side Data Fetchers
 * 
 * These functions run only on the server and directly call the service layer,
 * bypassing HTTP overhead. Use these in Server Components for optimal performance.
 */

import { logger } from '@/lib/logger';
import * as functionTypeService from '@/services/function-type.service';
import type { FunctionType } from '@/app/types/domain';

/**
 * Fetch all active function types
 * 
 * @param includeInactive - Whether to include inactive function types (default: false)
 * @returns Array of function types with serialized data
 * 
 * @example
 * ```tsx
 * // In a Server Component
 * export default async function HomePage() {
 *   const functionTypes = await getFunctionTypes();
 *   return <ServicesList services={functionTypes} />;
 * }
 * ```
 */
export async function getFunctionTypes(includeInactive = false): Promise<FunctionType[]> {
  try {
    logger.info('Fetching function types (server-side)', { includeInactive });
    const functionTypes = await functionTypeService.listFunctionTypes(includeInactive);
    
    // Serialize Decimal to number for Client Components
    return functionTypes.map(ft => ({
      ...ft,
      price: ft.price.toNumber(), // Convert Prisma Decimal to plain number
    }));
  } catch (error) {
    logger.error('Failed to fetch function types', error);
    // Return empty array instead of throwing to prevent page crash
    // You can also throw here if you want error boundaries to catch it
    return [];
  }
}

/**
 * Fetch a single function type by ID
 * 
 * @param id - Function type ID
 * @returns Function type or null if not found (with serialized data)
 */
export async function getFunctionTypeById(id: string): Promise<FunctionType | null> {
  try {
    logger.info('Fetching function type by ID (server-side)', { id });
    const functionType = await functionTypeService.getFunctionTypeById(id);
    
    if (!functionType) return null;
    
    return {
      ...functionType,
      price: functionType.price.toNumber(),
    };
  } catch (error) {
    logger.error('Failed to fetch function type', error);
    return null;
  }
}

/**
 * Fetch hotel information
 * 
 * @returns Hotel information or null if not found
 * 
 * @example
 * ```tsx
 * // In a Server Component
 * export default async function AboutPage() {
 *   const hotel = await getHotelInfo();
 *   return <AboutContent hotel={hotel} />;
 * }
 * ```
 */
export async function getHotelInfo() {
  try {
    logger.info('Fetching hotel info (server-side)');
    const { getHotelInfo } = await import('@/services/hotel.service');
    return await getHotelInfo();
  } catch (error) {
    logger.error('Failed to fetch hotel info', error);
    // Return default data to prevent page crash
    return {
      id: 'default',
      name: 'Prarthana Nelum Pokuna',
      description: 'A serene and elegant venue',
      address: null,
      phone: null,
      email: null,
      map_link: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
