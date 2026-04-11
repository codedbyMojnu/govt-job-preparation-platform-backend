import { ConflictError, NotFoundError } from '../../../shared/errors/http-errors.js';

import type { SyllabusRepository } from './repository.contract.js';
import type { CreateSyllabusInput, SyllabusDto, UpdateSyllabusInput } from './types.js';

export class SyllabusService {
  constructor(private readonly repository: SyllabusRepository) {}

  async getBySubCategoryId(subCategoryId: string, activeOnly = true): Promise<SyllabusDto[]> {
    return this.repository.findBySubCategoryId(subCategoryId, activeOnly);
  }

  async getById(id: string): Promise<SyllabusDto> {
    const syllabus = await this.repository.findById(id);
    if (!syllabus) {
      throw new NotFoundError('Syllabus not found');
    }
    return syllabus;
  }

  async getBySlug(slug: string): Promise<SyllabusDto> {
    const syllabus = await this.repository.findBySlug(slug);
    if (!syllabus) {
      throw new NotFoundError('Syllabus not found');
    }
    return syllabus;
  }

  async create(input: CreateSyllabusInput): Promise<SyllabusDto> {
    const existing = await this.repository.findBySlug(input.slug);
    if (existing) {
      throw new ConflictError('A syllabus with this slug already exists');
    }
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateSyllabusInput): Promise<SyllabusDto> {
    await this.getById(id);
    if (input.slug) {
      const existing = await this.repository.findBySlug(input.slug);
      if (existing && existing.id !== id) {
        throw new ConflictError('A syllabus with this slug already exists');
      }
    }
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.repository.delete(id);
  }
}
