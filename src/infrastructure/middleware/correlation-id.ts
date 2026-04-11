import { randomUUID } from 'node:crypto';

import type { NextFunction, Request, Response } from 'express';

import { CORRELATION_ID_HEADER } from '../../shared/constants/app.constants.js';
import { runWithCorrelationId } from '../../shared/utils/correlation-id.js';

export function correlationIdMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const id = (req.headers[CORRELATION_ID_HEADER] as string) || randomUUID();
  req.correlationId = id;
  runWithCorrelationId(id, () => {
    next();
  });
}
