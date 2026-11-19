import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role, AccountStatus } from '@prisma/client';
import { prisma } from '../config/db';

export interface AuthUserPayload {
  id: string;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be defined in production');
  }
  return secret || 'thedateboss_jwt_secret_dev_key_2026';
};

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication token missing or invalid',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AuthUserPayload;

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isActive: true, accountStatus: true },
    });

    if (!dbUser) {
      res.status(401).json({
        success: false,
        message: 'Account no longer exists',
      });
      return;
    }

    if (!dbUser.isActive || dbUser.accountStatus !== AccountStatus.ACTIVE) {
      res.status(403).json({
        success: false,
        message: `Account is currently ${dbUser.accountStatus.toLowerCase()}. Please contact support.`,
      });
      return;
    }

    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    };
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
