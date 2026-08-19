import { ConflictError, NotFoundError } from '../../../shared/errors/http-errors.js';

import type { SubExamCategoryRepository } from './repository.contract.js';
import type {
  BulkUpsertSubExamCategoryItem,
  CreateSubExamCategoryInput,
  MeritListEntry,
  SubExamCategoryDto,
  UpdateSubExamCategoryInput,
  UserCategorySummary,
} from './types.js';

export class SubExamCategoryService {
  constructor(private readonly repository: SubExamCategoryRepository) {}

  async getAll(activeOnly = true): Promise<SubExamCategoryDto[]> {
    return this.repository.findAll(activeOnly);
  }

  async getByCategoryId(examCategoryId: string, activeOnly = true): Promise<SubExamCategoryDto[]> {
    return this.repository.findByCategoryId(examCategoryId, activeOnly);
  }

  async getById(id: string): Promise<SubExamCategoryDto> {
    const sub = await this.repository.findById(id);
    if (!sub) {
      throw new NotFoundError('Sub exam category not found');
    }
    return sub;
  }

  async getBySlug(slug: string): Promise<SubExamCategoryDto> {
    const sub = await this.repository.findBySlug(slug);
    if (!sub) {
      throw new NotFoundError('Sub exam category not found');
    }
    return sub;
  }

  async create(input: CreateSubExamCategoryInput): Promise<SubExamCategoryDto> {
    const existing = await this.repository.findBySlug(input.slug);
    if (existing) {
      throw new ConflictError('A sub exam category with this slug already exists');
    }
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateSubExamCategoryInput): Promise<SubExamCategoryDto> {
    await this.getById(id);
    if (input.slug) {
      const existing = await this.repository.findBySlug(input.slug);
      if (existing && existing.id !== id) {
        throw new ConflictError('A sub exam category with this slug already exists');
      }
    }
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.repository.delete(id);
  }

  async getUserCategorySummary(
    userId: string,
    examCategoryId: string,
  ): Promise<UserCategorySummary> {
    return this.repository.getUserCategorySummary(userId, examCategoryId);
  }

  async getMeritList(subExamCategoryId: string): Promise<MeritListEntry[]> {
    return this.repository.getMeritList(subExamCategoryId);
  }

  async bulkUpsert(items: BulkUpsertSubExamCategoryItem[]): Promise<SubExamCategoryDto[]> {
    return this.repository.bulkUpsert(items);
  }

  async bulkDelete(ids: string[]): Promise<void> {
    return this.repository.bulkDelete(ids);
  }
}
