import type { Request, Response } from 'express';

import { HttpStatus } from '../../shared/constants/http-status.js';
import { ErrorCodes } from '../../shared/errors/error-codes.js';
import type { ErrorResponse } from '../../shared/types/common.types.js';

export function notFoundHandler(req: Request, res: Response): void {
  const response: ErrorResponse = {
    error: {
      code: ErrorCodes.RESOURCE_NOT_FOUND,
      message: `Route ${req.method} ${req.originalUrl} not found`,
      statusCode: HttpStatus.NOT_FOUND,
      correlationId: req.correlationId || 'unknown',
      timestamp: new Date().toISOString(),
    },
  };

  res.status(HttpStatus.NOT_FOUND).json(response);
}
