import type {
  BulkUpsertSubExamCategoryItem,
  CreateSubExamCategoryInput,
  MeritListEntry,
  SubExamCategoryDto,
  UpdateSubExamCategoryInput,
  UserCategorySummary,
} from './types.js';

export interface SubExamCategoryRepository {
  findAll(activeOnly: boolean): Promise<SubExamCategoryDto[]>;
  findByCategoryId(examCategoryId: string, activeOnly: boolean): Promise<SubExamCategoryDto[]>;
  findById(id: string): Promise<SubExamCategoryDto | null>;
  findBySlug(slug: string): Promise<SubExamCategoryDto | null>;
  create(input: CreateSubExamCategoryInput): Promise<SubExamCategoryDto>;
  update(id: string, input: UpdateSubExamCategoryInput): Promise<SubExamCategoryDto>;
  delete(id: string): Promise<void>;
  getUserCategorySummary(userId: string, examCategoryId: string): Promise<UserCategorySummary>;
  getMeritList(subExamCategoryId: string): Promise<MeritListEntry[]>;
  bulkUpsert(items: BulkUpsertSubExamCategoryItem[]): Promise<SubExamCategoryDto[]>;
  bulkDelete(ids: string[]): Promise<void>;
}
