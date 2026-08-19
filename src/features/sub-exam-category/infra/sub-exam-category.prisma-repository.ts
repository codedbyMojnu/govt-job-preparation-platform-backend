import type { PrismaClient } from '@prisma/client';

import { subExamCategoryMapper } from '../domain/mapper.js';
import type { SubExamCategoryRepository } from '../domain/repository.contract.js';
import type {
  BulkUpsertSubExamCategoryItem,
  CreateSubExamCategoryInput,
  MeritListEntry,
  SubExamCategoryDto,
  UpdateSubExamCategoryInput,
  UserCategorySummary,
} from '../domain/types.js';

export class SubExamCategoryPrismaRepository implements SubExamCategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(activeOnly: boolean): Promise<SubExamCategoryDto[]> {
    const subs = await this.prisma.subExamCategory.findMany({
      ...(activeOnly && { where: { isActive: true } }),
      orderBy: { sortOrder: 'asc' },
    });
    return subs.map(subExamCategoryMapper.toDto);
  }

  async findByCategoryId(
    examCategoryId: string,
    activeOnly: boolean,
  ): Promise<SubExamCategoryDto[]> {
    const subs = await this.prisma.subExamCategory.findMany({
      where: {
        examCategoryId,
        ...(activeOnly && { isActive: true }),
      },
      orderBy: { sortOrder: 'asc' },
    });
    return subs.map(subExamCategoryMapper.toDto);
  }

  async findById(id: string): Promise<SubExamCategoryDto | null> {
    const sub = await this.prisma.subExamCategory.findUnique({ where: { id } });
    return sub ? subExamCategoryMapper.toDto(sub) : null;
  }

  async findBySlug(slug: string): Promise<SubExamCategoryDto | null> {
    const sub = await this.prisma.subExamCategory.findUnique({ where: { slug } });
    return sub ? subExamCategoryMapper.toDto(sub) : null;
  }

  async create(input: CreateSubExamCategoryInput): Promise<SubExamCategoryDto> {
    const sub = await this.prisma.subExamCategory.create({
      data: {
        examCategoryId: input.examCategoryId,
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        sortOrder: input.sortOrder ?? 0,
      },
    });
    return subExamCategoryMapper.toDto(sub);
  }

  async update(id: string, input: UpdateSubExamCategoryInput): Promise<SubExamCategoryDto> {
    const sub = await this.prisma.subExamCategory.update({
      where: { id },
      data: input,
    });
    return subExamCategoryMapper.toDto(sub);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subExamCategory.delete({ where: { id } });
  }

  async getUserCategorySummary(
    userId: string,
    examCategoryId: string,
  ): Promise<UserCategorySummary> {
    // Aggregate exam attempts for all question sets under sub-categories of this category
    const result = await this.prisma.examAttempt.aggregate({
      where: {
        userId,
        isCompleted: true,
        questionSet: {
          subExamCategory: {
            examCategoryId,
          },
        },
      },
      _sum: {
        totalCorrect: true,
        totalWrong: true,
        totalUnanswered: true,
      },
    });

    const totalCorrect = result._sum.totalCorrect ?? 0;
    const totalWrong = result._sum.totalWrong ?? 0;
    const totalUnanswered = result._sum.totalUnanswered ?? 0;

    return {
      totalQuestionsFaced: totalCorrect + totalWrong + totalUnanswered,
      totalCorrect,
    };
  }

  async getMeritList(subExamCategoryId: string): Promise<MeritListEntry[]> {
    // Get all question set IDs for this sub-exam category
    const questionSets = await this.prisma.questionSet.findMany({
      where: { subExamCategoryId },
      select: { id: true },
    });
    const qsIds = questionSets.map((qs) => qs.id);

    if (qsIds.length === 0) {
      return [];
    }

    // Aggregate exam attempts grouped by userId
    const results = await this.prisma.examAttempt.groupBy({
      by: ['userId'],
      where: {
        isCompleted: true,
        questionSetId: { in: qsIds },
      },
      _sum: {
        obtainedMarks: true,
        totalCorrect: true,
        totalWrong: true,
      },
      _count: true,
      orderBy: {
        _sum: {
          obtainedMarks: 'desc',
        },
      },
    });

    // Fetch user names
    const userIds = results.map((r) => r.userId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u.name ?? 'Unknown']));

    return results.map((r, index) => ({
      rank: index + 1,
      userId: r.userId,
      userName: userMap.get(r.userId) ?? 'Unknown',
      totalMarks: r._sum.obtainedMarks ?? 0,
      totalCorrect: r._sum.totalCorrect ?? 0,
      totalWrong: r._sum.totalWrong ?? 0,
      examsTaken: r._count,
    }));
  }

  async bulkUpsert(items: BulkUpsertSubExamCategoryItem[]): Promise<SubExamCategoryDto[]> {
    return this.prisma.$transaction(async (tx) => {
      const results: SubExamCategoryDto[] = [];
      for (const item of items) {
        if (item.id) {
          const updated = await tx.subExamCategory.update({
            where: { id: item.id },
            data: {
              examCategoryId: item.examCategoryId,
              name: item.name,
              slug: item.slug,
              description: item.description ?? null,
              sortOrder: item.sortOrder ?? 0,
              isActive: item.isActive ?? true,
            },
          });
          results.push(subExamCategoryMapper.toDto(updated));
        } else {
          const created = await tx.subExamCategory.create({
            data: {
              examCategoryId: item.examCategoryId,
              name: item.name,
              slug: item.slug,
              description: item.description ?? null,
              sortOrder: item.sortOrder ?? 0,
              isActive: item.isActive ?? true,
            },
          });
          results.push(subExamCategoryMapper.toDto(created));
        }
      }
      return results;
    });
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await this.prisma.subExamCategory.deleteMany({ where: { id: { in: ids } } });
  }
}
