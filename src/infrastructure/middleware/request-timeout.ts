import type { NextFunction, Request, Response } from 'express';

const DEFAULT_TIMEOUT_MS = 30_000; // 30 seconds

/**
 * Request timeout middleware to prevent Slowloris and slow-read DoS attacks.
 * Aborts requests that take longer than the configured timeout.
 */
export function requestTimeout(timeoutMs: number = DEFAULT_TIMEOUT_MS) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          error: {
            code: 'REQUEST_TIMEOUT',
            message: 'Request timeout',
            statusCode: 408,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
            method: req.method,
          },
        });
      }
    }, timeoutMs);

    // Clear the timeout when the response finishes
    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));

    next();
  };
}
