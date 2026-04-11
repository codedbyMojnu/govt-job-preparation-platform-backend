import type { AwilixContainer } from 'awilix';
import { asValue } from 'awilix';
import type { NextFunction, Request, Response } from 'express';

export function createRequestContextMiddleware(container: AwilixContainer) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const scope = container.createScope();
    scope.register({
      correlationId: asValue(req.correlationId),
    });
    req.requestScope = scope;
    next();
  };
}
