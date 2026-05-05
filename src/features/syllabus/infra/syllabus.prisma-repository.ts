import type { PrismaClient } from '@prisma/client';

import { syllabusMapper } from '../domain/mapper.js';
import type { SyllabusRepository } from '../domain/repository.contract.js';
import type { CreateSyllabusInput, SyllabusDto, SyllabusWithCategoryDto, UpdateSyllabusInput } from '../domain/types.js';

export class SyllabusPrismaRepository implements SyllabusRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(activeOnly: boolean): Promise<SyllabusWithCategoryDto[]> {
    const syllabuses = await this.prisma.syllabus.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: [{ subExamCategoryId: 'asc' }, { sortOrder: 'asc' }],
      include: {
        subExamCategory: {
          include: { examCategory: { select: { slug: true } } },
        },
      },
    });
    return syllabuses.map((s) => ({
      ...syllabusMapper.toDto(s),
      subExamCategoryName: s.subExamCategory.name,
      subExamCategorySlug: s.subExamCategory.slug,
      examCategorySlug: s.subExamCategory.examCategory.slug,
    }));
  }

  async findBySubCategoryId(subCategoryId: string, activeOnly: boolean): Promise<SyllabusDto[]> {
    const syllabuses = await this.prisma.syllabus.findMany({
      where: {
        subExamCategoryId: subCategoryId,
        ...(activeOnly && { isActive: true }),
      },
      orderBy: { sortOrder: 'asc' },
    });
    return syllabuses.map(syllabusMapper.toDto);
  }

  async findById(id: string): Promise<SyllabusDto | null> {
    const syllabus = await this.prisma.syllabus.findUnique({ where: { id } });
    return syllabus ? syllabusMapper.toDto(syllabus) : null;
  }

  async findBySlug(slug: string): Promise<SyllabusDto | null> {
    const syllabus = await this.prisma.syllabus.findUnique({ where: { slug } });
    return syllabus ? syllabusMapper.toDto(syllabus) : null;
  }

  async create(input: CreateSyllabusInput): Promise<SyllabusDto> {
    const syllabus = await this.prisma.syllabus.create({
      data: {
        subExamCategoryId: input.subExamCategoryId,
        title: input.title,
        slug: input.slug,
        content: input.content,
        sortOrder: input.sortOrder ?? 0,
      },
    });
    return syllabusMapper.toDto(syllabus);
  }

  async update(id: string, input: UpdateSyllabusInput): Promise<SyllabusDto> {
    const syllabus = await this.prisma.syllabus.update({
      where: { id },
      data: input,
    });
    return syllabusMapper.toDto(syllabus);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.syllabus.delete({ where: { id } });
  }
}
