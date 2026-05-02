import type { PrismaClient } from '@prisma/client';

import type { NotificationRepository } from '../domain/repository.contract.js';
import type {
  BulkUpsertNotificationItem,
  CreateNotificationInput,
  NotificationDto,
  UpdateNotificationInput,
} from '../domain/types.js';

export class NotificationPrismaRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findForUser(userId: string, limit: number): Promise<NotificationDto[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        isActive: true,
        OR: [{ type: 'PUBLIC' }, { type: 'SPECIFIC', targetUserId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        reads: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    return notifications.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      type: n.type,
      targetUserId: n.targetUserId,
      isActive: n.isActive,
      createdAt: n.createdAt,
      isRead: n.reads.length > 0,
    }));
  }

  async findAll(): Promise<NotificationDto[]> {
    const notifications = await this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return notifications.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      type: n.type,
      targetUserId: n.targetUserId,
      isActive: n.isActive,
      createdAt: n.createdAt,
    }));
  }

  async findById(id: string): Promise<NotificationDto | null> {
    const n = await this.prisma.notification.findUnique({ where: { id } });
    if (!n) return null;
    return {
      id: n.id,
      title: n.title,
      content: n.content,
      type: n.type,
      targetUserId: n.targetUserId,
      isActive: n.isActive,
      createdAt: n.createdAt,
    };
  }

  async create(input: CreateNotificationInput): Promise<NotificationDto> {
    const n = await this.prisma.notification.create({
      data: {
        title: input.title,
        content: input.content,
        type: input.type,
        targetUserId: input.targetUserId ?? null,
      },
    });
    return {
      id: n.id,
      title: n.title,
      content: n.content,
      type: n.type,
      targetUserId: n.targetUserId,
      isActive: n.isActive,
      createdAt: n.createdAt,
    };
  }

  async update(id: string, input: UpdateNotificationInput): Promise<NotificationDto> {
    const n = await this.prisma.notification.update({
      where: { id },
      data: input,
    });
    return {
      id: n.id,
      title: n.title,
      content: n.content,
      type: n.type,
      targetUserId: n.targetUserId,
      isActive: n.isActive,
      createdAt: n.createdAt,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.notification.delete({ where: { id } });
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    await this.prisma.userNotificationRead.upsert({
      where: {
        userId_notificationId: { userId, notificationId },
      },
      create: { userId, notificationId },
      update: {},
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    const count = await this.prisma.notification.count({
      where: {
        isActive: true,
        OR: [{ type: 'PUBLIC' }, { type: 'SPECIFIC', targetUserId: userId }],
        reads: {
          none: { userId },
        },
      },
    });
    return count;
  }

  async bulkUpsert(items: BulkUpsertNotificationItem[]): Promise<NotificationDto[]> {
    const results: NotificationDto[] = [];
    await this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        if (item.id) {
          const updated = await tx.notification.update({
            where: { id: item.id },
            data: {
              title: item.title,
              content: item.content,
              type: item.type,
              targetUserId: item.targetUserId ?? null,
              ...(item.isActive !== undefined && { isActive: item.isActive }),
            },
          });
          results.push({
            id: updated.id,
            title: updated.title,
            content: updated.content,
            type: updated.type,
            targetUserId: updated.targetUserId,
            isActive: updated.isActive,
            createdAt: updated.createdAt,
          });
        } else {
          const created = await tx.notification.create({
            data: {
              title: item.title,
              content: item.content,
              type: item.type,
              targetUserId: item.targetUserId ?? null,
            },
          });
          results.push({
            id: created.id,
            title: created.title,
            content: created.content,
            type: created.type,
            targetUserId: created.targetUserId,
            isActive: created.isActive,
            createdAt: created.createdAt,
          });
        }
      }
    });
    return results;
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await this.prisma.notification.deleteMany({ where: { id: { in: ids } } });
  }
}
