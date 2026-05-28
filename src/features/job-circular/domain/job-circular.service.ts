import { NotFoundError } from '../../../shared/errors/http-errors.js';

import type { JobCircularRepository } from './repository.contract.js';
import type {
  BulkUpsertJobCircularItem,
  CreateJobCircularInput,
  JobCircularDto,
  JobCircularFilter,
  PaginatedJobCirculars,
  UpdateJobCircularInput,
} from './types.js';

export class JobCircularService {
  constructor(private readonly repository: JobCircularRepository) {}

  async getAll(filter: JobCircularFilter): Promise<PaginatedJobCirculars> {
    return this.repository.findAll(filter);
  }

  async getById(id: string): Promise<JobCircularDto> {
    const circular = await this.repository.findById(id);
    if (!circular) throw new NotFoundError('Job circular not found');
    return circular;
  }

  async recordView(id: string): Promise<void> {
    const circular = await this.repository.findById(id);
    if (!circular) throw new NotFoundError('Job circular not found');
    await this.repository.incrementViewCount(id);
  }

  async getFilterOptions(): Promise<{
    categories: string[];
    ministries: string[];
    organizations: { name: string; slug: string }[];
  }> {
    const [categories, ministries, organizations] = await Promise.all([
      this.repository.getDistinctCategories(),
      this.repository.getDistinctMinistries(),
      this.repository.getDistinctOrganizations(),
    ]);
    return { categories, ministries, organizations };
  }

  async create(input: CreateJobCircularInput): Promise<JobCircularDto> {
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateJobCircularInput): Promise<JobCircularDto> {
    await this.getById(id);
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.repository.delete(id);
  }

  async bulkUpsert(items: BulkUpsertJobCircularItem[]): Promise<JobCircularDto[]> {
    return this.repository.bulkUpsert(items);
  }

  async bulkDelete(ids: string[]): Promise<void> {
    return this.repository.bulkDelete(ids);
  }
}
