import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/index.js';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';

/**
 * Role-Based Access Control Middleware
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('User authentication context not established');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Access denied. Required role(s): [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`
      );
    }

    next();
  };
};
