import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { authConfig } from '../../config/auth.js';
import { UnauthorizedError } from '../../shared/errors/http-errors.js';
import type { UserRole } from '../../shared/types/express.js';

interface JwtPayload {
  userId: string;
  role: UserRole;
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new UnauthorizedError('Missing or invalid authorization header'));
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, authConfig.jwtSecret) as JwtPayload;
    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      next(new UnauthorizedError('Insufficient permissions'));
      return;
    }
    next();
  };
}
