import type { NextFunction, Request, Response } from 'express';

/**
 * Recursively sanitizes string values in an object to prevent XSS attacks.
 * Strips dangerous HTML characters from user input.
 */
function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === 'object') {
    return sanitizeObject(value as Record<string, unknown>);
  }

  return value;
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    sanitized[key] = sanitizeValue(val);
  }
  return sanitized;
}

/**
 * Middleware that sanitizes request body, query, and params to prevent XSS.
 * Should be applied after body parsing but before route handlers.
 */
export function sanitizeInput(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body as Record<string, unknown>);
  }

  if (req.query && typeof req.query === 'object') {
    const sanitizedQuery = sanitizeObject(req.query as Record<string, unknown>);
    Object.assign(req.query, sanitizedQuery);
  }

  if (req.params && typeof req.params === 'object') {
    const sanitizedParams = sanitizeObject(req.params as Record<string, unknown>);
    Object.assign(req.params, sanitizedParams);
  }

  next();
}
