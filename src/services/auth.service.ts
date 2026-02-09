import bcrypt from 'bcrypt';
import { logger } from '@/lib/logger';
import { signToken } from '@/lib/jwt';
import { AuthorizationError } from '@/domain/errors';
import * as adminRepository from '@/repositories/admin.repository';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
  };
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { email, password } = credentials;

  logger.info('Admin login attempt', { email });

  // Find admin by email
  const admin = await adminRepository.findAdminByEmail(email, { includePasswordHash: true });

  if (!admin) {
    logger.warn('Login failed: Admin not found', { email });
    throw new AuthorizationError('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, admin.passwordHash);

  if (!isPasswordValid) {
    logger.warn('Login failed: Invalid password', { email });
    throw new AuthorizationError('Invalid email or password');
  }

  // Generate JWT token
  const token = signToken({
    adminId: admin.id,
    email: admin.email,
  });

  logger.info('Admin login successful', { adminId: admin.id, email: admin.email });

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
    },
  };
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error('Password verification failed', error);
    return false;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}
