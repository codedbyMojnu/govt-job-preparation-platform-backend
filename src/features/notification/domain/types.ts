export interface NotificationDto {
  id: string;
  title: string;
  content: string;
  type: 'PUBLIC' | 'SPECIFIC';
  targetUserId: string | null;
  isActive: boolean;
  createdAt: Date;
  isRead?: boolean;
}

export interface CreateNotificationInput {
  title: string;
  content: string;
  type: 'PUBLIC' | 'SPECIFIC';
  targetUserId?: string;
}

export interface UpdateNotificationInput {
  title?: string;
  content?: string;
  type?: 'PUBLIC' | 'SPECIFIC';
  targetUserId?: string | null;
  isActive?: boolean;
}

export interface BulkUpsertNotificationItem {
  id?: string;
  title: string;
  content: string;
  type: 'PUBLIC' | 'SPECIFIC';
  targetUserId?: string;
  isActive?: boolean;
}
