import { prisma } from '@/lib/db';
import { Admin } from '@prisma/client';

/**
 * Admin Repository - Database operations for Admin entity
 */

export interface AdminSelectOptions {
  includePasswordHash?: boolean;
}

export type AdminWithPassword = Admin;
export type AdminWithoutPassword = Omit<Admin, 'passwordHash'>;

/**
 * Find admin by email
 */
export async function findAdminByEmail(
  email: string,
  options: AdminSelectOptions = {}
): Promise<AdminWithPassword | null> {
  const { includePasswordHash = true } = options;

  return prisma.admin.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      passwordHash: includePasswordHash,
      createdAt: true,
    },
  }) as Promise<AdminWithPassword | null>;
}

/**
 * Find admin by ID
 */
export async function findAdminById(
  adminId: string,
  options: AdminSelectOptions = {}
): Promise<AdminWithPassword | AdminWithoutPassword | null> {
  const { includePasswordHash = false } = options;

  return prisma.admin.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      email: true,
      passwordHash: includePasswordHash,
      createdAt: true,
    },
  }) as Promise<AdminWithPassword | AdminWithoutPassword | null>;
}

/**
 * Create new admin
 */
export async function createAdmin(data: {
  email: string;
  passwordHash: string;
}): Promise<AdminWithoutPassword> {
  const admin = await prisma.admin.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
    },
    select: {
      id: true,
      email: true,
      passwordHash: false,
      createdAt: true,
    },
  });

  return admin as AdminWithoutPassword;
}

/**
 * Update admin password
 */
export async function updateAdminPassword(
  adminId: string,
  newPasswordHash: string
): Promise<AdminWithoutPassword> {
  const admin = await prisma.admin.update({
    where: { id: adminId },
    data: { passwordHash: newPasswordHash },
    select: {
      id: true,
      email: true,
      passwordHash: false,
      createdAt: true,
    },
  });

  return admin as AdminWithoutPassword;
}

/**
 * Delete admin
 */
export async function deleteAdmin(adminId: string): Promise<void> {
  await prisma.admin.delete({
    where: { id: adminId },
  });
}

/**
 * List all admins
 */
export async function listAdmins(): Promise<AdminWithoutPassword[]> {
  return prisma.admin.findMany({
    select: {
      id: true,
      email: true,
      passwordHash: false,
      createdAt: true,
    },
  }) as Promise<AdminWithoutPassword[]>;
}
