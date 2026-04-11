import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

import { ValidationError } from '../../shared/errors/http-errors.js';
import type { FieldError } from '../../shared/types/common.types.js';

interface ValidateOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validate(schemas: ValidateOptions) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: FieldError[] = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push({ field: issue.path.join('.'), message: issue.message });
        }
      } else {
        req.body = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push({ field: issue.path.join('.'), message: issue.message });
        }
      } else {
        (req as Request).query = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push({ field: issue.path.join('.'), message: issue.message });
        }
      } else {
        req.params = result.data;
      }
    }

    if (errors.length > 0) {
      next(new ValidationError('Validation failed', errors));
      return;
    }

    next();
  };
}
