import type { NextFunction, Request, Response } from 'express';

/**
 * Additional security headers middleware.
 * Supplements Helmet with extra headers for defense-in-depth.
 */
export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  // Prevent browsers from caching sensitive API responses
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  // Prevent MIME type sniffing (reinforces Helmet's noSniff)
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Restrict information sent in the Referrer header
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Restrict permissions/features that the browser can use
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  );

  // Remove server identification
  res.removeHeader('X-Powered-By');

  next();
}
