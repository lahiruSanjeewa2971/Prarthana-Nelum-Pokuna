import jwt from 'jsonwebtoken';
import { logger } from './logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

if (!process.env.JWT_SECRET) {
  logger.warn('JWT_SECRET not set in environment variables, using default (not secure for production)');
}

export interface JwtPayload {
  adminId: string;
  email: string;
}

export interface DecodedToken extends JwtPayload {
  iat: number;
  exp: number;
}

export function signToken(payload: JwtPayload): string {
  try {
    const token = jwt.sign(
      payload, 
      JWT_SECRET as jwt.Secret,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );
    return token;
  } catch (error) {
    logger.error('Failed to sign JWT', error);
    throw new Error('Failed to generate token');
  }
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as DecodedToken;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('JWT token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid JWT token');
    } else {
      logger.error('JWT verification failed', error);
    }
    return null;
  }
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.decode(token) as DecodedToken;
    return decoded;
  } catch (error) {
    logger.error('Failed to decode JWT', error);
    return null;
  }
}
