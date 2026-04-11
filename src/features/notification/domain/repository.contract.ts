import type { CreateNotificationInput, NotificationDto, UpdateNotificationInput } from './types.js';

export interface NotificationRepository {
  findForUser(userId: string, limit: number): Promise<NotificationDto[]>;
  findAll(): Promise<NotificationDto[]>;
  findById(id: string): Promise<NotificationDto | null>;
  create(input: CreateNotificationInput): Promise<NotificationDto>;
  update(id: string, input: UpdateNotificationInput): Promise<NotificationDto>;
  delete(id: string): Promise<void>;
  markAsRead(userId: string, notificationId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
}
