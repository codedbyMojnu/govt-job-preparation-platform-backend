export interface SyllabusDto {
  id: string;
  subExamCategoryId: string;
  title: string;
  slug: string;
  content: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
}

export interface SyllabusWithCategoryDto extends SyllabusDto {
  subExamCategoryName: string;
  subExamCategorySlug: string;
  examCategorySlug: string;
}

export interface CreateSyllabusInput {
  subExamCategoryId: string;
  title: string;
  slug: string;
  content: string;
  sortOrder?: number;
}

export interface UpdateSyllabusInput {
  title?: string;
  slug?: string;
  content?: string;
  sortOrder?: number;
  isActive?: boolean;
}
