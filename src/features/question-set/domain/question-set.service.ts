import { BadRequestError, NotFoundError } from '../../../shared/errors/http-errors.js';

import type { QuestionSetRepository } from './repository.contract.js';
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

export class QuestionSetService {
  constructor(private readonly repository: QuestionSetRepository) {}

  async getLiveBySubCategoryId(subCategoryId: string): Promise<QuestionSetDto | null> {
    return this.repository.findLiveBySubCategoryId(subCategoryId);
  }

  async getArchiveBySubCategoryId(subCategoryId: string): Promise<QuestionSetDto[]> {
    return this.repository.findArchiveBySubCategoryId(subCategoryId);
  }

  async getAllBySubCategoryId(subCategoryId: string, isLive?: boolean): Promise<QuestionSetDto[]> {
    return this.repository.findAllBySubCategoryId(subCategoryId, isLive);
  }

  async getById(id: string): Promise<QuestionSetDto> {
    const set = await this.repository.findById(id);
    if (!set) {
      throw new NotFoundError('Question set not found');
    }
    return set;
  }

  async create(input: CreateQuestionSetInput): Promise<QuestionSetDto> {
    if (input.isLive) {
      const hasLive = await this.repository.hasLiveSet(input.subExamCategoryId);
      if (hasLive) {
        throw new BadRequestError(
          'A live question set already exists for this sub-category. Archive it first.',
        );
      }
    }
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateQuestionSetInput): Promise<QuestionSetDto> {
    const existing = await this.getById(id);

    if (input.isLive === true && !existing.isLive) {
      const hasLive = await this.repository.hasLiveSet(existing.subExamCategoryId, id);
      if (hasLive) {
        throw new BadRequestError(
          'A live question set already exists for this sub-category. Archive it first.',
        );
      }
    }

    return this.repository.update(id, input);
  }

  async toggleStatus(id: string): Promise<QuestionSetDto> {
    const existing = await this.getById(id);

    if (!existing.isLive) {
      const hasLive = await this.repository.hasLiveSet(existing.subExamCategoryId, id);
      if (hasLive) {
        throw new BadRequestError(
          'A live question set already exists for this sub-category. Archive it first.',
        );
      }
    }

    return this.repository.update(id, { isLive: !existing.isLive });
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.repository.delete(id);
  }

  async getMarksheet(attemptId: string): Promise<MarksheetDto> {
    const marksheet = await this.repository.getMarksheet(attemptId);
    if (!marksheet) {
      throw new NotFoundError('Marksheet not found');
    }
    return marksheet;
  }

  async getUserAttemptForSet(
    userId: string,
    questionSetId: string,
  ): Promise<{ id: string; isCompleted: boolean } | null> {
    return this.repository.getUserAttemptForSet(userId, questionSetId);
  }

  // --- Question CRUD (admin) ---

  async getQuestionsBySetId(questionSetId: string): Promise<QuestionDto[]> {
    await this.getById(questionSetId); // ensure set exists
    return this.repository.getQuestionsBySetId(questionSetId);
  }

  async getQuestionById(id: string): Promise<QuestionDto> {
    const q = await this.repository.getQuestionById(id);
    if (!q) {
      throw new NotFoundError('Question not found');
    }
    return q;
  }

  async createQuestion(input: CreateQuestionInput): Promise<QuestionDto> {
    await this.getById(input.questionSetId);
    return this.repository.createQuestion(input);
  }

  async updateQuestion(id: string, input: UpdateQuestionInput): Promise<QuestionDto> {
    await this.getQuestionById(id);
    return this.repository.updateQuestion(id, input);
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.getQuestionById(id);
    return this.repository.deleteQuestion(id);
  }

  async bulkUpsertQuestions(questions: BulkUpsertQuestionItem[]): Promise<QuestionDto[]> {
    return this.repository.bulkUpsertQuestions(questions);
  }

  async bulkDeleteQuestions(ids: string[]): Promise<void> {
    return this.repository.bulkDeleteQuestions(ids);
  }

  // --- Public SEO question page ---

  async getPublicQuestionBySlug(slug: string): Promise<PublicQuestionDto> {
    const question = await this.repository.getPublicQuestionBySlug(slug);
    if (!question) {
      throw new NotFoundError('Question not found');
    }
    return question;
  }

  // --- Exam flow ---

  async getExamQuestions(questionSetId: string): Promise<ExamQuestionDto[]> {
    await this.getById(questionSetId);
    return this.repository.getExamQuestions(questionSetId);
  }

  async startExam(userId: string, questionSetId: string): Promise<ExamAttemptDto> {
    const set = await this.getById(questionSetId);
    const existing = await this.repository.getUserAttemptForSet(userId, questionSetId);

    // If already attempted and completed, throw error
    if (existing?.isCompleted) {
      throw new BadRequestError('You have already attempted this exam');
    }

    // If already started (not completed), return the existing attempt
    if (existing) {
      return this.repository.getExamAttempt(existing.id) as Promise<ExamAttemptDto>;
    }

    // Free question sets are always accessible
    if (!set.isFree) {
      // Users with active package bypass free tier limits
      const hasPkg = await this.repository.hasActivePackage(userId);
      if (!hasPkg) {
        const settings = await this.repository.getAppSettings();
        const limit = set.isLive ? settings.freeLiveLimit : settings.freeArchiveLimit;
        const count = await this.repository.countUserNonFreeAttempts(userId, set.isLive);
        if (count >= limit) {
          throw new BadRequestError(
            `আপনি সর্বোচ্চ ${limit}টি ${set.isLive ? 'লাইভ' : 'আর্কাইভ'} পরীক্ষায় অংশ নিতে পারবেন। আরো পরীক্ষায় অংশ নিতে সাবস্ক্রিপশন নিন।`,
          );
        }
      }
    }

    return this.repository.startExamAttempt(userId, questionSetId);
  }

  async answerQuestion(
    attemptId: string,
    userId: string,
    input: AnswerQuestionInput,
  ): Promise<void> {
    const attempt = await this.repository.getExamAttempt(attemptId);
    if (!attempt) {
      throw new NotFoundError('Exam attempt not found');
    }
    if (attempt.userId !== userId) {
      throw new BadRequestError('Unauthorized attempt access');
    }
    if (attempt.isCompleted) {
      throw new BadRequestError('Exam already submitted');
    }
    // Get the correct answer for this question
    const question = await this.repository.getQuestionById(input.questionId);
    if (!question) {
      throw new NotFoundError('Question not found');
    }
    await this.repository.answerQuestion(attemptId, input, question.correctAnswer);
  }

  async submitExam(attemptId: string, userId: string): Promise<ExamAttemptDto> {
    const attempt = await this.repository.getExamAttempt(attemptId);
    if (!attempt) {
      throw new NotFoundError('Exam attempt not found');
    }
    if (attempt.userId !== userId) {
      throw new BadRequestError('Unauthorized attempt access');
    }
    if (attempt.isCompleted) {
      throw new BadRequestError('Exam already submitted');
    }
    const set = await this.getById(attempt.questionSetId);
    return this.repository.submitExam(attemptId, set.markPerQuestion, set.negativeMark);
  }

  // --- Review & stats ---

  async getReviewQuestions(attemptId: string, userId: string): Promise<ReviewQuestionDto[]> {
    return this.repository.getReviewQuestions(attemptId, userId);
  }

  async getQuestionsForReview(questionSetId: string, userId: string): Promise<ReviewQuestionDto[]> {
    return this.repository.getQuestionsForReview(questionSetId, userId);
  }

  async getQuestionStats(questionId: string): Promise<QuestionStatsDto> {
    return this.repository.getQuestionStats(questionId);
  }

  // --- Favorites ---

  async getFavoriteQuestions(userId: string): Promise<ReviewQuestionDto[]> {
    return this.repository.getFavoriteQuestions(userId);
  }

  async toggleFavorite(userId: string, questionId: string): Promise<boolean> {
    return this.repository.toggleFavorite(userId, questionId);
  }

  // --- App settings ---

  async getAppSettings(): Promise<AppSettingsDto> {
    return this.repository.getAppSettings();
  }

  async updateAppSettings(input: UpdateAppSettingsInput): Promise<AppSettingsDto> {
    return this.repository.updateAppSettings(input);
  }

  async bulkUpsertSets(items: BulkUpsertQuestionSetItem[]): Promise<QuestionSetDto[]> {
    return this.repository.bulkUpsertSets(items);
  }

  async bulkDeleteSets(ids: string[]): Promise<void> {
    return this.repository.bulkDeleteSets(ids);
  }
}
