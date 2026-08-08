import type { NextFunction, Request, Response } from 'express';

import { config } from '../../config/index.js';
import { UnauthorizedError } from '../../shared/errors/http-errors.js';

/**
 * শুধু server-to-server call (frontend-এর নিজের Next.js server) এর জন্য।
 * Browser থেকে কখনো এই route hit করা যাবে না — secret শুধু dono server-এর env-এ।
 */
export function requireInternalService(req: Request, _res: Response, next: NextFunction): void {
  const token = req.headers['x-internal-token'];
  if (!token || token !== config.INTERNAL_API_SECRET) {
    next(new UnauthorizedError('Invalid internal service token'));
    return;
  }
  next();
}
