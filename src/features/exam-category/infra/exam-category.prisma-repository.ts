import type { PrismaClient } from '@prisma/client';

import { examCategoryMapper } from '../domain/mapper.js';
import type { ExamCategoryRepository } from '../domain/repository.contract.js';
import type {
  BulkUpsertExamCategoryItem,
  CreateExamCategoryInput,
  ExamCategoryDto,
  UpdateExamCategoryInput,
} from '../domain/types.js';

export class ExamCategoryPrismaRepository implements ExamCategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(activeOnly: boolean): Promise<ExamCategoryDto[]> {
    const categories = await this.prisma.examCategory.findMany({
      ...(activeOnly && { where: { isActive: true } }),
      orderBy: { sortOrder: 'asc' },
    });
    return categories.map(examCategoryMapper.toDto);
  }

  async findById(id: string): Promise<ExamCategoryDto | null> {
    const category = await this.prisma.examCategory.findUnique({ where: { id } });
    return category ? examCategoryMapper.toDto(category) : null;
  }

  async findBySlug(slug: string): Promise<ExamCategoryDto | null> {
    const category = await this.prisma.examCategory.findUnique({ where: { slug } });
    return category ? examCategoryMapper.toDto(category) : null;
  }

  async create(input: CreateExamCategoryInput): Promise<ExamCategoryDto> {
    const category = await this.prisma.examCategory.create({
      data: {
        name: input.name,
        slug: input.slug,
        icon: input.icon ?? null,
        sortOrder: input.sortOrder ?? 0,
      },
    });
    return examCategoryMapper.toDto(category);
  }

  async update(id: string, input: UpdateExamCategoryInput): Promise<ExamCategoryDto> {
    const category = await this.prisma.examCategory.update({
      where: { id },
      data: input,
    });
    return examCategoryMapper.toDto(category);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.examCategory.delete({ where: { id } });
  }

  async bulkUpsert(items: BulkUpsertExamCategoryItem[]): Promise<ExamCategoryDto[]> {
    const results: ExamCategoryDto[] = [];
    await this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        if (item.id) {
          const updated = await tx.examCategory.update({
            where: { id: item.id },
            data: {
              name: item.name,
              slug: item.slug,
              icon: item.icon ?? null,
              sortOrder: item.sortOrder ?? 0,
              ...(item.isActive !== undefined && { isActive: item.isActive }),
            },
          });
          results.push(examCategoryMapper.toDto(updated));
        } else {
          const created = await tx.examCategory.create({
            data: {
              name: item.name,
              slug: item.slug,
              icon: item.icon ?? null,
              sortOrder: item.sortOrder ?? 0,
            },
          });
          results.push(examCategoryMapper.toDto(created));
        }
      }
    });
    return results;
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await this.prisma.examCategory.deleteMany({ where: { id: { in: ids } } });
  }
}
