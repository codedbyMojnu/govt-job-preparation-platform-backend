import type { PrismaClient } from '@prisma/client';

import { routineMapper } from '../domain/mapper.js';
import type { RoutineRepository } from '../domain/repository.contract.js';
import type {
  BulkUpsertRoutineItem,
  CreateRoutineInput,
  RoutineDto,
  RoutineWithCategoryDto,
  UpdateRoutineInput,
} from '../domain/types.js';

export class RoutinePrismaRepository implements RoutineRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(activeOnly: boolean): Promise<RoutineWithCategoryDto[]> {
    const where = activeOnly ? { isActive: true } : undefined;
    const routines = await this.prisma.routine.findMany({
      ...(where ? { where } : {}),
      orderBy: { date: 'asc' },
      include: {
        subExamCategory: {
          include: { examCategory: { select: { slug: true } } },
        },
      },
    });
    return routines.map((r) => ({
      ...routineMapper.toDto(r),
      subExamCategoryName: r.subExamCategory.name,
      subExamCategorySlug: r.subExamCategory.slug,
      examCategorySlug: r.subExamCategory.examCategory.slug,
    }));
  }

  async findBySubCategoryId(subCategoryId: string, activeOnly: boolean): Promise<RoutineDto[]> {
    const routines = await this.prisma.routine.findMany({
      where: {
        subExamCategoryId: subCategoryId,
        ...(activeOnly ? { isActive: true } : {}),
      },
      orderBy: { date: 'asc' },
    });
    return routines.map(routineMapper.toDto);
  }

  async findByDate(date: string, activeOnly: boolean): Promise<RoutineDto[]> {
    const routines = await this.prisma.routine.findMany({
      where: {
        date: new Date(date),
        ...(activeOnly ? { isActive: true } : {}),
      },
      orderBy: { date: 'asc' },
    });
    return routines.map(routineMapper.toDto);
  }

  async findById(id: string): Promise<RoutineDto | null> {
    const routine = await this.prisma.routine.findUnique({ where: { id } });
    return routine ? routineMapper.toDto(routine) : null;
  }

  async create(input: CreateRoutineInput): Promise<RoutineDto> {
    const routine = await this.prisma.routine.create({
      data: {
        subExamCategoryId: input.subExamCategoryId,
        date: new Date(input.date),
        title: input.title,
        totalMarks: input.totalMarks,
        duration: input.duration,
        subject: input.subject,
        topics: input.topics ?? null,
        sourceMaterial: input.sourceMaterial ?? null,
        description: input.description ?? null,
      },
    });
    return routineMapper.toDto(routine);
  }

  async update(id: string, input: UpdateRoutineInput): Promise<RoutineDto> {
    const routine = await this.prisma.routine.update({
      where: { id },
      data: {
        ...(input.date !== undefined && { date: new Date(input.date) }),
        ...(input.title !== undefined && { title: input.title }),
        ...(input.totalMarks !== undefined && { totalMarks: input.totalMarks }),
        ...(input.duration !== undefined && { duration: input.duration }),
        ...(input.subject !== undefined && { subject: input.subject }),
        ...(input.topics !== undefined && { topics: input.topics ?? null }),
        ...(input.sourceMaterial !== undefined && { sourceMaterial: input.sourceMaterial ?? null }),
        ...(input.description !== undefined && { description: input.description ?? null }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
    return routineMapper.toDto(routine);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.routine.delete({ where: { id } });
  }

  async bulkUpsert(items: BulkUpsertRoutineItem[]): Promise<RoutineDto[]> {
    const results: RoutineDto[] = [];
    await this.prisma.$transaction(
      async (tx) => {
        for (const item of items) {
          if (item.id) {
            const updated = await tx.routine.update({
              where: { id: item.id },
              data: {
                date: new Date(item.date),
                title: item.title,
                totalMarks: item.totalMarks,
                duration: item.duration,
                subject: item.subject,
                topics: item.topics ?? null,
                sourceMaterial: item.sourceMaterial ?? null,
                description: item.description ?? null,
                ...(item.isActive !== undefined && { isActive: item.isActive }),
              },
            });
            results.push(routineMapper.toDto(updated));
          } else {
            const created = await tx.routine.create({
              data: {
                subExamCategoryId: item.subExamCategoryId,
                date: new Date(item.date),
                title: item.title,
                totalMarks: item.totalMarks,
                duration: item.duration,
                subject: item.subject,
                topics: item.topics ?? null,
                sourceMaterial: item.sourceMaterial ?? null,
                description: item.description ?? null,
                isActive: item.isActive ?? true,
              },
            });
            results.push(routineMapper.toDto(created));
          }
        }
      },
      { timeout: 20000, maxWait: 5000 }, // <-- second argument to $transaction, not inside the callback
    );
    return results;
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await this.prisma.routine.deleteMany({ where: { id: { in: ids } } });
  }
}
