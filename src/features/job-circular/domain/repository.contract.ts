import type {
  CreateJobCircularInput,
  JobCircularDto,
  JobCircularFilter,
  PaginatedJobCirculars,
  UpdateJobCircularInput,
} from './types.js';

export interface JobCircularRepository {
  findAll(filter: JobCircularFilter): Promise<PaginatedJobCirculars>;
  findById(id: string): Promise<JobCircularDto | null>;
  incrementViewCount(id: string): Promise<void>;
  getDistinctCategories(): Promise<string[]>;
  getDistinctMinistries(): Promise<string[]>;
  getDistinctOrganizations(): Promise<{ name: string; slug: string }[]>;
  create(input: CreateJobCircularInput): Promise<JobCircularDto>;
  update(id: string, input: UpdateJobCircularInput): Promise<JobCircularDto>;
  delete(id: string): Promise<void>;
}
