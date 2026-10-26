import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    if (!secret || secret.length < 32) {
      throw new Error(
        'SECURITY CRITICAL: JWT_SECRET environment variable is missing or shorter than 32 characters in production.'
      );
    }
    return secret;
  }
  return secret || 'classic-fashions-dev-jwt-secret-do-not-use-in-production-2026';
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

/**
 * Middleware to verify JWT token from Authorization header (Bearer <token>)
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    return;
  }

  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as AuthUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
}

/**
 * Role-based access control guard
 */
export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden. Insufficient permissions.' });
      return;
    }

    next();
  };
}

export function generateToken(payload: AuthUser): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}
