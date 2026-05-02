import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import type { QuestionSetService } from '../../domain/question-set.service.js';
import type {
  AnswerQuestionInput,
  BulkUpsertQuestionItem,
  BulkUpsertQuestionSetItem,
  CreateQuestionInput,
  CreateQuestionSetInput,
  UpdateAppSettingsInput,
  UpdateQuestionInput,
  UpdateQuestionSetInput,
} from '../../domain/types.js';

export class QuestionSetController {
  constructor(private readonly service: QuestionSetService) {}

  async getLive(req: Request, res: Response): Promise<void> {
    const subCategoryId = req.params.subCategoryId!;
    const set = await this.service.getLiveBySubCategoryId(subCategoryId);
    res.status(HttpStatus.OK).json({ data: set });
  }

  async getArchive(req: Request, res: Response): Promise<void> {
    const subCategoryId = req.params.subCategoryId!;
    const sets = await this.service.getArchiveBySubCategoryId(subCategoryId);
    res.status(HttpStatus.OK).json({ data: sets });
  }

  async getAllBySubCategory(req: Request, res: Response): Promise<void> {
    const subCategoryId = req.params.subCategoryId!;
    const isLive = req.query.isLive !== undefined ? req.query.isLive === 'true' : undefined;
    const sets = await this.service.getAllBySubCategoryId(subCategoryId, isLive);
    res.status(HttpStatus.OK).json({ data: sets });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const set = await this.service.getById(req.params.id!);
    res.status(HttpStatus.OK).json({ data: set });
  }

  async create(req: Request, res: Response): Promise<void> {
    const input: CreateQuestionSetInput = req.body;
    const set = await this.service.create(input);
    res.status(HttpStatus.CREATED).json({ data: set });
  }

  async update(req: Request, res: Response): Promise<void> {
    const input: UpdateQuestionSetInput = req.body;
    const set = await this.service.update(req.params.id!, input);
    res.status(HttpStatus.OK).json({ data: set });
  }

  async toggleStatus(req: Request, res: Response): Promise<void> {
    const set = await this.service.toggleStatus(req.params.id!);
    res.status(HttpStatus.OK).json({ data: set });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.service.delete(req.params.id!);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async getMarksheet(req: Request, res: Response): Promise<void> {
    const marksheet = await this.service.getMarksheet(req.params.attemptId!);
    res.status(HttpStatus.OK).json({ data: marksheet });
  }

  async getUserAttempt(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const attempt = await this.service.getUserAttemptForSet(userId, req.params.questionSetId!);
    res.status(HttpStatus.OK).json({ data: attempt });
  }

  // --- Question CRUD (admin) ---

  async getQuestions(req: Request, res: Response): Promise<void> {
    const questions = await this.service.getQuestionsBySetId(req.params.questionSetId!);
    res.status(HttpStatus.OK).json({ data: questions });
  }

  async getQuestion(req: Request, res: Response): Promise<void> {
    const question = await this.service.getQuestionById(req.params.id!);
    res.status(HttpStatus.OK).json({ data: question });
  }

  async createQuestion(req: Request, res: Response): Promise<void> {
    const input: CreateQuestionInput = req.body;
    const question = await this.service.createQuestion(input);
    res.status(HttpStatus.CREATED).json({ data: question });
  }

  async updateQuestion(req: Request, res: Response): Promise<void> {
    const input: UpdateQuestionInput = req.body;
    const question = await this.service.updateQuestion(req.params.id!, input);
    res.status(HttpStatus.OK).json({ data: question });
  }

  async deleteQuestion(req: Request, res: Response): Promise<void> {
    await this.service.deleteQuestion(req.params.id!);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async bulkUpsertQuestions(req: Request, res: Response): Promise<void> {
    const { questions } = req.body as { questions: BulkUpsertQuestionItem[] };
    const result = await this.service.bulkUpsertQuestions(questions);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async bulkDeleteQuestions(req: Request, res: Response): Promise<void> {
    const { ids } = req.body as { ids: string[] };
    await this.service.bulkDeleteQuestions(ids);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  // --- Public SEO question page ---

  async getPublicQuestion(req: Request, res: Response): Promise<void> {
    const question = await this.service.getPublicQuestionBySlug(req.params.slug!);
    res.status(HttpStatus.OK).json({ data: question });
  }

  // --- Exam flow ---

  async getExamQuestions(req: Request, res: Response): Promise<void> {
    const questions = await this.service.getExamQuestions(req.params.questionSetId!);
    res.status(HttpStatus.OK).json({ data: questions });
  }

  async startExam(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const { questionSetId } = req.body as { questionSetId: string };
    const attempt = await this.service.startExam(userId, questionSetId);
    res.status(HttpStatus.CREATED).json({ data: attempt });
  }

  async answerQuestion(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const attemptId = req.params.attemptId!;
    const input: AnswerQuestionInput = req.body;
    await this.service.answerQuestion(attemptId, userId, input);
    res.status(HttpStatus.OK).json({ data: { success: true } });
  }

  async submitExam(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const attemptId = req.params.attemptId!;
    const attempt = await this.service.submitExam(attemptId, userId);
    res.status(HttpStatus.OK).json({ data: attempt });
  }

  // --- Review & stats ---

  async getReviewQuestions(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const attemptId = req.params.attemptId!;
    const questions = await this.service.getReviewQuestions(attemptId, userId);
    res.status(HttpStatus.OK).json({ data: questions });
  }

  async getQuestionsForReview(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const questionSetId = req.params.questionSetId!;
    const questions = await this.service.getQuestionsForReview(questionSetId, userId);
    res.status(HttpStatus.OK).json({ data: questions });
  }

  async getQuestionStats(req: Request, res: Response): Promise<void> {
    const stats = await this.service.getQuestionStats(req.params.questionId!);
    res.status(HttpStatus.OK).json({ data: stats });
  }

  // --- Favorites ---

  async toggleFavorite(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const questionId = req.params.questionId!;
    const isFavorite = await this.service.toggleFavorite(userId, questionId);
    res.status(HttpStatus.OK).json({ data: { isFavorite } });
  }

  // --- App settings ---

  async getAppSettings(_req: Request, res: Response): Promise<void> {
    const settings = await this.service.getAppSettings();
    res.status(HttpStatus.OK).json({ data: settings });
  }

  async updateAppSettings(req: Request, res: Response): Promise<void> {
    const input: UpdateAppSettingsInput = req.body;
    const settings = await this.service.updateAppSettings(input);
    res.status(HttpStatus.OK).json({ data: settings });
  }

  async toggleFree(req: Request, res: Response): Promise<void> {
    const set = await this.service.getById(req.params.id!);
    const updated = await this.service.update(req.params.id!, { isFree: !set.isFree });
    res.status(HttpStatus.OK).json({ data: updated });
  }

  async bulkUpsertSets(req: Request, res: Response): Promise<void> {
    const items: BulkUpsertQuestionSetItem[] = req.body.items;
    const result = await this.service.bulkUpsertSets(items);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async bulkDeleteSets(req: Request, res: Response): Promise<void> {
    const ids: string[] = req.body.ids;
    await this.service.bulkDeleteSets(ids);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
