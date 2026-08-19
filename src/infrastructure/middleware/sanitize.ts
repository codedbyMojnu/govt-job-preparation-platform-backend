import type { NextFunction, Request, Response } from 'express';

/**
 * Recursively sanitizes string values in an object to prevent XSS attacks.
 * Strips dangerous HTML characters from user input.
 *
 * NOTE: '/' is intentionally NOT escaped. A forward slash has no HTML/XSS
 * significance on its own — escaping it does nothing for security and
 * silently corrupts every URL (https://... -> https:&#x2F;&#x2F;...),
 * file path, and slash-formatted date saved through any endpoint. This
 * previously broke JobCircular.applicationUrl/logoUrl/source,
 * BroadcastLog.mediaUrl, and DocxStyleConfig.siteBaseUrl in production.
 */
function sanitizeValue(req: Request, value: unknown): unknown {
  if (typeof value === 'string') {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(req, item));
  }

  if (value !== null && typeof value === 'object') {
    return sanitizeObject(req, value as Record<string, unknown>);
  }

  return value;
}

// Field names that are structurally URLs. These are exempted from escaping
// entirely (not just for '/'), because a URL can legitimately contain '&'
// in its query string (?a=1&b=2), which must not become '&amp;'. Unlike
// the old allowlist, this is NOT gated by req.path — a field named
// `applicationUrl` is a URL on every route, not just on /videos.
//
// IMPORTANT: any new URL-typed field added to any Zod schema anywhere in
// the codebase (`z.string().url()`) MUST be added here, or it will be
// silently corrupted the same way. This is the one central place that
// currently has to know about every URL field in the system.
const RAW_URL_KEYS = new Set([
  'url',
  'youtubeUrl',
  'logoUrl',
  'applicationUrl',
  'source',
  'mediaUrl',
  'siteBaseUrl',
]);

// Fields that hold trusted rich text / markdown, exempted only on the one
// route that owns them (kept path-gated deliberately, unlike URL fields
// above — this is route-specific editorial content, not a general type).
const RAW_CONTENT_KEYS_BY_PATH: ReadonlyArray<{ prefix: string; keys: ReadonlySet<string> }> = [
  { prefix: '/api/v1/syllabuses', keys: new Set(['content']) },
];

function shouldPreserveRawValue(req: Request, key: string, value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  if (RAW_URL_KEYS.has(key)) {
    return true;
  }

  return RAW_CONTENT_KEYS_BY_PATH.some(
    ({ prefix, keys }) => req.path.startsWith(prefix) && keys.has(key),
  );
}

function sanitizeObject(req: Request, obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    sanitized[key] = shouldPreserveRawValue(req, key, val) ? val : sanitizeValue(req, val);
  }
  return sanitized;
}

/**
 * Middleware that sanitizes request body, query, and params to prevent XSS.
 * Should be applied after body parsing but before route handlers.
 */
export function sanitizeInput(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req, req.body as Record<string, unknown>);
  }

  if (req.query && typeof req.query === 'object') {
    const sanitizedQuery = sanitizeObject(req, req.query as Record<string, unknown>);
    Object.assign(req.query, sanitizedQuery);
  }

  if (req.params && typeof req.params === 'object') {
    const sanitizedParams = sanitizeObject(req, req.params as Record<string, unknown>);
    Object.assign(req.params, sanitizedParams);
  }

  next();
}
