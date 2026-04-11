import type { NextFunction, Request, Response } from 'express';
import type { Logger } from 'pino';

export function createRequestLoggerMiddleware(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const child = logger.child({ correlationId: req.correlationId });
    req.logger = child;

    const start = Date.now();
    child.info({ method: req.method, url: req.originalUrl }, 'request started');

    res.on('finish', () => {
      const duration = Date.now() - start;
      child.info(
        { method: req.method, url: req.originalUrl, statusCode: res.statusCode, duration },
        'request completed',
      );
    });

    next();
  };
}
