import type {
  BulkUpsertRoutineItem,
  CreateRoutineInput,
  RoutineDto,
  RoutineWithCategoryDto,
  UpdateRoutineInput,
} from './types.js';

export interface RoutineRepository {
  findAll(activeOnly: boolean): Promise<RoutineWithCategoryDto[]>;
  findBySubCategoryId(subCategoryId: string, activeOnly: boolean): Promise<RoutineDto[]>;
  findById(id: string): Promise<RoutineDto | null>;
  create(input: CreateRoutineInput): Promise<RoutineDto>;
  update(id: string, input: UpdateRoutineInput): Promise<RoutineDto>;
  delete(id: string): Promise<void>;
  bulkUpsert(items: BulkUpsertRoutineItem[]): Promise<RoutineDto[]>;
  bulkDelete(ids: string[]): Promise<void>;
}
