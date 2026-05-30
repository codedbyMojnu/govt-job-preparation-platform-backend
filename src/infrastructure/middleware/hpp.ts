import type { NextFunction, Request, Response } from 'express';

/**
 * HTTP Parameter Pollution (HPP) protection middleware.
 * When multiple values are provided for a query parameter, only the last value is used.
 * This prevents attackers from injecting unexpected array values into query parameters.
 */
export function hpp(req: Request, _res: Response, next: NextFunction): void {
  if (req.query) {
    for (const [key, value] of Object.entries(req.query)) {
      if (Array.isArray(value)) {
        // Use only the last value to prevent parameter pollution
        const lastValue = value[value.length - 1];
        req.query[key] = typeof lastValue === 'string' ? lastValue : String(lastValue ?? '');
      }
    }
  }
  next();
}
