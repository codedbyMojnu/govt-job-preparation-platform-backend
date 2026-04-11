import { NotFoundError } from '../../../shared/errors/http-errors.js';

import type { NotificationRepository } from './repository.contract.js';
import type { CreateNotificationInput, NotificationDto, UpdateNotificationInput } from './types.js';

export class NotificationService {
  constructor(private readonly repository: NotificationRepository) {}

  async getForUser(userId: string, limit = 3): Promise<NotificationDto[]> {
    return this.repository.findForUser(userId, limit);
  }

  async getAll(): Promise<NotificationDto[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<NotificationDto> {
    const notification = await this.repository.findById(id);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }
    return notification;
  }

  async create(input: CreateNotificationInput): Promise<NotificationDto> {
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateNotificationInput): Promise<NotificationDto> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Notification not found');
    }
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Notification not found');
    }
    return this.repository.delete(id);
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    return this.repository.markAsRead(userId, notificationId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.repository.getUnreadCount(userId);
  }
}
