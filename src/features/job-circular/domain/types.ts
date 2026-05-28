export type { CircularStatus, OrgType } from '@prisma/client';

export interface JobCircularDto {
  id: string;
  gjobId: string | null;
  organizationName: string;
  organizationSlug: string;
  orgType: string;
  logoUrl: string | null;
  title: string;
  totalPosts: number;
  applicationUrl: string | null;
  publishDate: Date | null;
  deadline: Date | null;
  examDate: Date | null;
  description: string | null;
  eligibility: string | null;
  salary: string | null;
  experience: string | null;
  location: string | null;
  source: string | null;
  category: string | null;
  ministry: string | null;
  status: string;
  isActive: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobCircularInput {
  gjobId?: string;
  organizationName: string;
  organizationSlug: string;
  orgType?: 'GOVERNMENT' | 'PRIVATE' | 'AUTONOMOUS' | 'NGO';
  logoUrl?: string;
  title: string;
  totalPosts?: number;
  applicationUrl?: string;
  publishDate?: string;
  deadline?: string;
  examDate?: string;
  description?: string;
  eligibility?: string;
  salary?: string;
  experience?: string;
  location?: string;
  source?: string;
  category?: string;
  ministry?: string;
  status?: 'LIVE' | 'UPCOMING' | 'EXPIRED';
}

export interface UpdateJobCircularInput extends Partial<CreateJobCircularInput> {
  isActive?: boolean;
}

export interface BulkUpsertJobCircularItem extends CreateJobCircularInput {
  id?: string;
  isActive?: boolean;
}

export interface BulkDeleteJobCircularInput {
  ids: string[];
}

export interface JobCircularFilter {
  orgType?: string;
  status?: string;
  category?: string;
  ministry?: string;
  search?: string;
  deadlineFrom?: string;
  deadlineTo?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedJobCirculars {
  data: JobCircularDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
