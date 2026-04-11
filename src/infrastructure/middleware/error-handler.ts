import type { NextFunction, Request, Response } from 'express';

import { HttpStatus } from '../../shared/constants/http-status.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCodes } from '../../shared/errors/error-codes.js';
import type { ErrorResponse } from '../../shared/types/common.types.js';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const correlationId = req.correlationId || 'unknown';

  if (err instanceof AppError) {
    if (err.isOperational) {
      req.logger?.warn({ err, correlationId }, err.message);
    } else {
      req.logger?.error({ err, correlationId }, err.message);
    }

    const response: ErrorResponse = {
      error: {
        code: err.code,
        message: err.message,
        statusCode: err.statusCode,
        correlationId,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method,
        ...(err.details ? { details: err.details } : {}),
      },
    };

    res.status(err.statusCode).json(response);
    return;
  }

  // Unknown / programmer error
  req.logger?.error({ err, correlationId }, 'Unhandled error');

  const response: ErrorResponse = {
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: 'Internal server error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      correlationId,
      timestamp: new Date().toISOString(),
    },
  };

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
}
