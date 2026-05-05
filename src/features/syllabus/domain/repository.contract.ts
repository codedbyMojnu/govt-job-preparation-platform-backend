import type { CreateSyllabusInput, SyllabusDto, SyllabusWithCategoryDto, UpdateSyllabusInput } from './types.js';

export interface SyllabusRepository {
  findAll(activeOnly: boolean): Promise<SyllabusWithCategoryDto[]>;
  findBySubCategoryId(subCategoryId: string, activeOnly: boolean): Promise<SyllabusDto[]>;
  findById(id: string): Promise<SyllabusDto | null>;
  findBySlug(slug: string): Promise<SyllabusDto | null>;
  create(input: CreateSyllabusInput): Promise<SyllabusDto>;
  update(id: string, input: UpdateSyllabusInput): Promise<SyllabusDto>;
  delete(id: string): Promise<void>;
}
