import { NotFoundError } from '../../../shared/errors/http-errors.js';

import type { RoutineRepository } from './repository.contract.js';
import type {
  BulkUpsertRoutineItem,
  CreateRoutineInput,
  RoutineDto,
  UpdateRoutineInput,
} from './types.js';

export class RoutineService {
  constructor(private readonly repository: RoutineRepository) {}

  async getBySubCategoryId(subCategoryId: string, activeOnly = true): Promise<RoutineDto[]> {
    return this.repository.findBySubCategoryId(subCategoryId, activeOnly);
  }

  async getById(id: string): Promise<RoutineDto> {
    const routine = await this.repository.findById(id);
    if (!routine) {
      throw new NotFoundError('Routine not found');
    }
    return routine;
  }

  async create(input: CreateRoutineInput): Promise<RoutineDto> {
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateRoutineInput): Promise<RoutineDto> {
    await this.getById(id);
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.repository.delete(id);
  }

  async bulkUpsert(items: BulkUpsertRoutineItem[]): Promise<RoutineDto[]> {
    return this.repository.bulkUpsert(items);
  }

  async bulkDelete(ids: string[]): Promise<void> {
    return this.repository.bulkDelete(ids);
  }
}
