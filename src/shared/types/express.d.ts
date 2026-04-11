import type { AwilixContainer } from 'awilix';
import type { Logger } from 'pino';

export type UserRole = 'USER' | 'ADMIN';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
      requestScope?: AwilixContainer;
      logger?: Logger;
      userId?: string;
      userRole?: UserRole;
    }
  }
}
