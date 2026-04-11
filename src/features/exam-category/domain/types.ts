export interface ExamCategoryDto {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
}

export interface CreateExamCategoryInput {
  name: string;
  slug: string;
  icon?: string;
  sortOrder?: number;
}

export interface UpdateExamCategoryInput {
  name?: string;
  slug?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}
