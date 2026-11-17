import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const requireRole = (allowedRole: Role) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required',
      });
      return;
    }

    if (req.user.role !== allowedRole) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Requires ${allowedRole} role`,
      });
      return;
    }

    next();
  };
};

export const requireAnyRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Allowed roles: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
};
