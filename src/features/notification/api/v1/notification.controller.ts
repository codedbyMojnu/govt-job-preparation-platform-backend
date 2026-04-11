import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import type { NotificationService } from '../../domain/notification.service.js';
import type { CreateNotificationInput, UpdateNotificationInput } from '../../domain/types.js';

export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  // Public (authenticated user) - get notifications for the logged-in user
  async getForUser(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 3;
    const notifications = await this.service.getForUser(userId, limit);
    res.status(HttpStatus.OK).json({ data: notifications });
  }

  async getUnreadCount(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const count = await this.service.getUnreadCount(userId);
    res.status(HttpStatus.OK).json({ data: { count } });
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const notificationId = req.params.id!;
    await this.service.markAsRead(userId, notificationId);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  // Admin
  async getAll(_req: Request, res: Response): Promise<void> {
    const notifications = await this.service.getAll();
    res.status(HttpStatus.OK).json({ data: notifications });
  }

  async create(req: Request, res: Response): Promise<void> {
    const input: CreateNotificationInput = req.body;
    const notification = await this.service.create(input);
    res.status(HttpStatus.CREATED).json({ data: notification });
  }

  async update(req: Request, res: Response): Promise<void> {
    const input: UpdateNotificationInput = req.body;
    const notification = await this.service.update(req.params.id!, input);
    res.status(HttpStatus.OK).json({ data: notification });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.service.delete(req.params.id!);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
