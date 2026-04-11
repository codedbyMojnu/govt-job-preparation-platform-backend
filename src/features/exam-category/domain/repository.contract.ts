import type { CreateExamCategoryInput, ExamCategoryDto, UpdateExamCategoryInput } from './types.js';

export interface ExamCategoryRepository {
  findAll(activeOnly: boolean): Promise<ExamCategoryDto[]>;
  findById(id: string): Promise<ExamCategoryDto | null>;
  findBySlug(slug: string): Promise<ExamCategoryDto | null>;
  create(input: CreateExamCategoryInput): Promise<ExamCategoryDto>;
  update(id: string, input: UpdateExamCategoryInput): Promise<ExamCategoryDto>;
  delete(id: string): Promise<void>;
}
