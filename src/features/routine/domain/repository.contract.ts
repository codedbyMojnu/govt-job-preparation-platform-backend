import type { CreateRoutineInput, RoutineDto, UpdateRoutineInput } from './types.js';

export interface RoutineRepository {
  findBySubCategoryId(subCategoryId: string, activeOnly: boolean): Promise<RoutineDto[]>;
  findById(id: string): Promise<RoutineDto | null>;
  create(input: CreateRoutineInput): Promise<RoutineDto>;
  update(id: string, input: UpdateRoutineInput): Promise<RoutineDto>;
  delete(id: string): Promise<void>;
}
