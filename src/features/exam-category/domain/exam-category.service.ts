import { ConflictError, NotFoundError } from '../../../shared/errors/http-errors.js';

import type { ExamCategoryRepository } from './repository.contract.js';
import type {
  BulkUpsertExamCategoryItem,
  CreateExamCategoryInput,
  ExamCategoryDto,
  UpdateExamCategoryInput,
} from './types.js';

export class ExamCategoryService {
  constructor(private readonly repository: ExamCategoryRepository) {}

  async getAll(activeOnly = true): Promise<ExamCategoryDto[]> {
    return this.repository.findAll(activeOnly);
  }

  async getById(id: string): Promise<ExamCategoryDto> {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new NotFoundError('Exam category not found');
    }
    return category;
  }

  async getBySlug(slug: string): Promise<ExamCategoryDto> {
    const category = await this.repository.findBySlug(slug);
    if (!category) {
      throw new NotFoundError('Exam category not found');
    }
    return category;
  }

  async create(input: CreateExamCategoryInput): Promise<ExamCategoryDto> {
    const existing = await this.repository.findBySlug(input.slug);
    if (existing) {
      throw new ConflictError('Exam category with this slug already exists');
    }
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateExamCategoryInput): Promise<ExamCategoryDto> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Exam category not found');
    }
    if (input.slug) {
      const bySlug = await this.repository.findBySlug(input.slug);
      if (bySlug && bySlug.id !== id) {
        throw new ConflictError('Exam category with this slug already exists');
      }
    }
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Exam category not found');
    }
    return this.repository.delete(id);
  }

  async bulkUpsert(items: BulkUpsertExamCategoryItem[]): Promise<ExamCategoryDto[]> {
    return this.repository.bulkUpsert(items);
  }

  async bulkDelete(ids: string[]): Promise<void> {
    return this.repository.bulkDelete(ids);
  }
}
