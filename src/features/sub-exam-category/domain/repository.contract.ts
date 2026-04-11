import type {
  CreateSubExamCategoryInput,
  MeritListEntry,
  SubExamCategoryDto,
  UpdateSubExamCategoryInput,
  UserCategorySummary,
} from './types.js';

export interface SubExamCategoryRepository {
  findByCategoryId(examCategoryId: string, activeOnly: boolean): Promise<SubExamCategoryDto[]>;
  findById(id: string): Promise<SubExamCategoryDto | null>;
  findBySlug(slug: string): Promise<SubExamCategoryDto | null>;
  create(input: CreateSubExamCategoryInput): Promise<SubExamCategoryDto>;
  update(id: string, input: UpdateSubExamCategoryInput): Promise<SubExamCategoryDto>;
  delete(id: string): Promise<void>;
  getUserCategorySummary(userId: string, examCategoryId: string): Promise<UserCategorySummary>;
  getMeritList(subExamCategoryId: string): Promise<MeritListEntry[]>;
}
