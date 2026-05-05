import type {
    AnswerQuestionInput,
    AppSettingsDto,
    BulkUpsertQuestionItem,
    BulkUpsertQuestionSetItem,
    CreateQuestionInput,
    CreateQuestionSetInput,
    ExamAttemptDto,
    ExamQuestionDto,
    MarksheetDto,
    PublicQuestionDto,
    QuestionDto,
    QuestionSetDto,
    QuestionStatsDto,
    ReviewQuestionDto,
    UpdateAppSettingsInput,
    UpdateQuestionInput,
    UpdateQuestionSetInput,
} from './types.js';

export interface QuestionSetRepository {
  findLiveBySubCategoryId(subCategoryId: string): Promise<QuestionSetDto | null>;
  findArchiveBySubCategoryId(subCategoryId: string): Promise<QuestionSetDto[]>;
  findById(id: string): Promise<QuestionSetDto | null>;
  findAllBySubCategoryId(subCategoryId: string, isLive?: boolean): Promise<QuestionSetDto[]>;
  create(input: CreateQuestionSetInput): Promise<QuestionSetDto>;
  update(id: string, input: UpdateQuestionSetInput): Promise<QuestionSetDto>;
  delete(id: string): Promise<void>;
  hasLiveSet(subCategoryId: string, excludeId?: string): Promise<boolean>;
  getMarksheet(attemptId: string): Promise<MarksheetDto | null>;
  getUserAttemptForSet(
    userId: string,
    questionSetId: string,
  ): Promise<{ id: string; isCompleted: boolean } | null>;

  // Question CRUD (admin)
  getQuestionsBySetId(questionSetId: string): Promise<QuestionDto[]>;
  getQuestionById(id: string): Promise<QuestionDto | null>;
  createQuestion(input: CreateQuestionInput): Promise<QuestionDto>;
  updateQuestion(id: string, input: UpdateQuestionInput): Promise<QuestionDto>;
  deleteQuestion(id: string): Promise<void>;
  bulkUpsertQuestions(questions: BulkUpsertQuestionItem[]): Promise<QuestionDto[]>;
  bulkDeleteQuestions(ids: string[]): Promise<void>;

  // Public SEO question page
  getPublicQuestionBySlug(slug: string): Promise<PublicQuestionDto | null>;

  // Exam flow
  getExamQuestions(questionSetId: string): Promise<ExamQuestionDto[]>;
  startExamAttempt(userId: string, questionSetId: string): Promise<ExamAttemptDto>;
  answerQuestion(
    attemptId: string,
    input: AnswerQuestionInput,
    correctAnswer: string,
  ): Promise<void>;
  submitExam(
    attemptId: string,
    markPerQuestion: number,
    negativeMark: number,
  ): Promise<ExamAttemptDto>;
  getExamAttempt(attemptId: string): Promise<ExamAttemptDto | null>;

  // Review & stats
  getReviewQuestions(attemptId: string, userId: string): Promise<ReviewQuestionDto[]>;
  getQuestionsForReview(questionSetId: string, userId: string): Promise<ReviewQuestionDto[]>;
  getQuestionStats(questionId: string): Promise<QuestionStatsDto>;

  // Free tier
  countUserNonFreeAttempts(userId: string, isLive: boolean): Promise<number>;
  hasActivePackage(userId: string): Promise<boolean>;

  // App settings
  getAppSettings(): Promise<AppSettingsDto>;
  updateAppSettings(input: UpdateAppSettingsInput): Promise<AppSettingsDto>;

  // Favorites
  getFavoriteQuestions(userId: string): Promise<ReviewQuestionDto[]>;
  toggleFavorite(userId: string, questionId: string): Promise<boolean>;
  isFavorite(userId: string, questionId: string): Promise<boolean>;

  // Bulk operations (question-set level)
  bulkUpsertSets(items: BulkUpsertQuestionSetItem[]): Promise<QuestionSetDto[]>;
  bulkDeleteSets(ids: string[]): Promise<void>;
}
