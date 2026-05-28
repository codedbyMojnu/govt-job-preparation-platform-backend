import type { PrismaClient } from '@prisma/client';

import { jobCircularMapper } from '../domain/mapper.js';
import type { JobCircularRepository } from '../domain/repository.contract.js';
import type {
  BulkUpsertJobCircularItem,
  CreateJobCircularInput,
  JobCircularDto,
  JobCircularFilter,
  PaginatedJobCirculars,
  UpdateJobCircularInput,
} from '../domain/types.js';

export class JobCircularPrismaRepository implements JobCircularRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(filter: JobCircularFilter): Promise<PaginatedJobCirculars> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.min(50, Math.max(1, filter.limit ?? 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { isActive: true };

    if (filter.orgType) where['orgType'] = filter.orgType;
    if (filter.status) where['status'] = filter.status;
    if (filter.category) where['category'] = filter.category;
    if (filter.ministry) where['ministry'] = filter.ministry;

    if (filter.deadlineFrom || filter.deadlineTo) {
      const deadlineFilter: Record<string, Date> = {};
      if (filter.deadlineFrom) deadlineFilter['gte'] = new Date(filter.deadlineFrom);
      if (filter.deadlineTo) deadlineFilter['lte'] = new Date(filter.deadlineTo);
      where['deadline'] = deadlineFilter;
    }

    if (filter.search) {
      const q = filter.search.trim();
      where['OR'] = [
        { organizationName: { contains: q, mode: 'insensitive' } },
        { title: { contains: q, mode: 'insensitive' } },
        { ministry: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
        { gjobId: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [total, rows] = await Promise.all([
      this.prisma.jobCircular.count({ where }),
      this.prisma.jobCircular.findMany({
        where,
        orderBy: [{ publishDate: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    return {
      data: rows.map(jobCircularMapper.toDto),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<JobCircularDto | null> {
    const row = await this.prisma.jobCircular.findUnique({ where: { id } });
    return row ? jobCircularMapper.toDto(row) : null;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.prisma.jobCircular.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  async getDistinctCategories(): Promise<string[]> {
    const rows = await this.prisma.jobCircular.findMany({
      where: { isActive: true, category: { not: null } },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return rows.map((r) => r.category!).filter(Boolean);
  }

  async getDistinctMinistries(): Promise<string[]> {
    const rows = await this.prisma.jobCircular.findMany({
      where: { isActive: true, ministry: { not: null } },
      select: { ministry: true },
      distinct: ['ministry'],
      orderBy: { ministry: 'asc' },
    });
    return rows.map((r) => r.ministry!).filter(Boolean);
  }

  async getDistinctOrganizations(): Promise<{ name: string; slug: string }[]> {
    const rows = await this.prisma.jobCircular.findMany({
      where: { isActive: true },
      select: { organizationName: true, organizationSlug: true },
      distinct: ['organizationSlug'],
      orderBy: { organizationName: 'asc' },
    });
    return rows.map((r) => ({ name: r.organizationName, slug: r.organizationSlug }));
  }

  async create(input: CreateJobCircularInput): Promise<JobCircularDto> {
    const row = await this.prisma.jobCircular.create({
      data: {
        gjobId: input.gjobId,
        organizationName: input.organizationName,
        organizationSlug: input.organizationSlug,
        orgType: (input.orgType as 'GOVERNMENT' | 'PRIVATE' | 'AUTONOMOUS' | 'NGO') ?? 'GOVERNMENT',
        logoUrl: input.logoUrl,
        title: input.title,
        totalPosts: input.totalPosts ?? 0,
        applicationUrl: input.applicationUrl,
        publishDate: input.publishDate ? new Date(input.publishDate) : null,
        deadline: input.deadline ? new Date(input.deadline) : null,
        examDate: input.examDate ? new Date(input.examDate) : null,
        description: input.description,
        eligibility: input.eligibility,
        salary: input.salary,
        experience: input.experience,
        location: input.location,
        source: input.source,
        category: input.category,
        ministry: input.ministry,
        status: (input.status as 'LIVE' | 'UPCOMING' | 'EXPIRED') ?? 'LIVE',
      },
    });
    return jobCircularMapper.toDto(row);
  }

  async update(id: string, input: UpdateJobCircularInput): Promise<JobCircularDto> {
    const data: Record<string, unknown> = { ...input };
    if (input.publishDate !== undefined)
      data['publishDate'] = input.publishDate ? new Date(input.publishDate) : null;
    if (input.deadline !== undefined)
      data['deadline'] = input.deadline ? new Date(input.deadline) : null;
    if (input.examDate !== undefined)
      data['examDate'] = input.examDate ? new Date(input.examDate) : null;
    delete data['publishDate_str'];

    const row = await this.prisma.jobCircular.update({ where: { id }, data });
    return jobCircularMapper.toDto(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.jobCircular.delete({ where: { id } });
  }

  async bulkUpsert(items: BulkUpsertJobCircularItem[]): Promise<JobCircularDto[]> {
    const results: JobCircularDto[] = [];
    for (const item of items) {
      const data = {
        gjobId: item.gjobId,
        organizationName: item.organizationName,
        organizationSlug: item.organizationSlug,
        orgType: (item.orgType as 'GOVERNMENT' | 'PRIVATE' | 'AUTONOMOUS' | 'NGO') ?? 'GOVERNMENT',
        logoUrl: item.logoUrl,
        title: item.title,
        totalPosts: item.totalPosts ?? 0,
        applicationUrl: item.applicationUrl,
        publishDate: item.publishDate ? new Date(item.publishDate) : null,
        deadline: item.deadline ? new Date(item.deadline) : null,
        examDate: item.examDate ? new Date(item.examDate) : null,
        description: item.description,
        eligibility: item.eligibility,
        salary: item.salary,
        experience: item.experience,
        location: item.location,
        source: item.source,
        category: item.category,
        ministry: item.ministry,
        status: (item.status as 'LIVE' | 'UPCOMING' | 'EXPIRED') ?? 'LIVE',
        isActive: item.isActive ?? true,
      };
      if (item.id) {
        const row = await this.prisma.jobCircular.update({ where: { id: item.id }, data });
        results.push(jobCircularMapper.toDto(row));
      } else {
        const row = await this.prisma.jobCircular.create({ data });
        results.push(jobCircularMapper.toDto(row));
      }
    }
    return results;
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await this.prisma.jobCircular.deleteMany({ where: { id: { in: ids } } });
  }
}
