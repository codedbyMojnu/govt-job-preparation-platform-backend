import type { PrismaClient } from '@prisma/client';

import { questionMapper, questionSetMapper } from '../domain/mapper.js';
import type { QuestionSetRepository } from '../domain/repository.contract.js';
import type {
  AnswerQuestionInput,
  AppSettingsDto,
  CreateQuestionInput,
  CreateQuestionSetInput,
  ExamAttemptDto,
  ExamQuestionDto,
  MarksheetDto,
  QuestionDto,
  QuestionSetDto,
  QuestionStatsDto,
  ReviewQuestionDto,
  SubjectWiseMark,
  UpdateAppSettingsInput,
  UpdateQuestionInput,
  UpdateQuestionSetInput,
} from '../domain/types.js';

export class QuestionSetPrismaRepository implements QuestionSetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findLiveBySubCategoryId(subCategoryId: string): Promise<QuestionSetDto | null> {
    const set = await this.prisma.questionSet.findFirst({
      where: { subExamCategoryId: subCategoryId, isLive: true, isActive: true },
    });
    return set ? questionSetMapper.toDto(set) : null;
  }

  async findArchiveBySubCategoryId(subCategoryId: string): Promise<QuestionSetDto[]> {
    const sets = await this.prisma.questionSet.findMany({
      where: { subExamCategoryId: subCategoryId, isLive: false, isActive: true },
      orderBy: { date: 'desc' },
    });
    return sets.map(questionSetMapper.toDto);
  }

  async findById(id: string): Promise<QuestionSetDto | null> {
    const set = await this.prisma.questionSet.findUnique({ where: { id } });
    return set ? questionSetMapper.toDto(set) : null;
  }

  async findAllBySubCategoryId(subCategoryId: string, isLive?: boolean): Promise<QuestionSetDto[]> {
    const sets = await this.prisma.questionSet.findMany({
      where: {
        subExamCategoryId: subCategoryId,
        ...(isLive !== undefined && { isLive }),
      },
      orderBy: { date: 'desc' },
    });
    return sets.map(questionSetMapper.toDto);
  }

  async create(input: CreateQuestionSetInput): Promise<QuestionSetDto> {
    const set = await this.prisma.questionSet.create({
      data: {
        subExamCategoryId: input.subExamCategoryId,
        title: input.title,
        date: new Date(input.date),
        totalMarks: input.totalMarks,
        duration: input.duration,
        subject: input.subject,
        topics: input.topics ?? null,
        sourceMaterial: input.sourceMaterial ?? null,
        markPerQuestion: input.markPerQuestion ?? 1,
        negativeMark: input.negativeMark ?? 0.25,
        isFree: input.isFree ?? false,
        isLive: input.isLive ?? false,
      },
    });
    return questionSetMapper.toDto(set);
  }

  async update(id: string, input: UpdateQuestionSetInput): Promise<QuestionSetDto> {
    const set = await this.prisma.questionSet.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.date !== undefined && { date: new Date(input.date) }),
        ...(input.totalMarks !== undefined && { totalMarks: input.totalMarks }),
        ...(input.duration !== undefined && { duration: input.duration }),
        ...(input.subject !== undefined && { subject: input.subject }),
        ...(input.topics !== undefined && { topics: input.topics ?? null }),
        ...(input.sourceMaterial !== undefined && { sourceMaterial: input.sourceMaterial ?? null }),
        ...(input.markPerQuestion !== undefined && { markPerQuestion: input.markPerQuestion }),
        ...(input.negativeMark !== undefined && { negativeMark: input.negativeMark }),
        ...(input.isFree !== undefined && { isFree: input.isFree }),
        ...(input.isLive !== undefined && { isLive: input.isLive }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
    return questionSetMapper.toDto(set);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.questionSet.delete({ where: { id } });
  }

  async hasLiveSet(subCategoryId: string, excludeId?: string): Promise<boolean> {
    const count = await this.prisma.questionSet.count({
      where: {
        subExamCategoryId: subCategoryId,
        isLive: true,
        isActive: true,
        ...(excludeId !== undefined && { id: { not: excludeId } }),
      },
    });
    return count > 0;
  }

  async getMarksheet(attemptId: string): Promise<MarksheetDto | null> {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        questionSet: true,
        answers: {
          include: {
            question: { select: { subject: true, correctAnswer: true } },
          },
        },
      },
    });

    if (!attempt) return null;

    const subjectMap = new Map<string, { correct: number; wrong: number; unanswered: number }>();

    for (const answer of attempt.answers) {
      const subject = answer.question.subject ?? 'General';
      const entry = subjectMap.get(subject) ?? { correct: 0, wrong: 0, unanswered: 0 };

      if (answer.selectedAnswer === null) {
        entry.unanswered++;
      } else if (answer.isCorrect) {
        entry.correct++;
      } else {
        entry.wrong++;
      }

      subjectMap.set(subject, entry);
    }

    const markPerQuestion = attempt.questionSet.markPerQuestion;
    const negativeMark = attempt.questionSet.negativeMark;

    const subjectWise: SubjectWiseMark[] = Array.from(subjectMap.entries()).map(
      ([subject, stats]) => ({
        subject,
        correct: stats.correct,
        wrong: stats.wrong,
        unanswered: stats.unanswered,
        finalMark: stats.correct * markPerQuestion - stats.wrong * negativeMark,
      }),
    );

    return {
      attemptId: attempt.id,
      questionSetId: attempt.questionSetId,
      questionSetTitle: attempt.questionSet.title,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      totalCorrect: attempt.totalCorrect,
      totalWrong: attempt.totalWrong,
      totalUnanswered: attempt.totalUnanswered,
      totalMarks: attempt.totalMarks,
      obtainedMarks: attempt.obtainedMarks,
      markPerQuestion,
      negativeMark,
      subjectWise,
    };
  }

  async getUserAttemptForSet(
    userId: string,
    questionSetId: string,
  ): Promise<{ id: string; isCompleted: boolean } | null> {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { userId_questionSetId: { userId, questionSetId } },
      select: { id: true, isCompleted: true },
    });
    return attempt;
  }

  // --- Question CRUD (admin) ---

  async getQuestionsBySetId(questionSetId: string): Promise<QuestionDto[]> {
    const questions = await this.prisma.question.findMany({
      where: { questionSetId },
      orderBy: { sortOrder: 'asc' },
    });
    return questions.map(questionMapper.toDto);
  }

  async getQuestionById(id: string): Promise<QuestionDto | null> {
    const question = await this.prisma.question.findUnique({ where: { id } });
    return question ? questionMapper.toDto(question) : null;
  }

  async createQuestion(input: CreateQuestionInput): Promise<QuestionDto> {
    const question = await this.prisma.question.create({
      data: {
        questionSetId: input.questionSetId,
        questionText: input.questionText,
        optionA: input.optionA,
        optionB: input.optionB,
        optionC: input.optionC,
        optionD: input.optionD,
        correctAnswer: input.correctAnswer,
        explanation: input.explanation ?? null,
        subject: input.subject ?? null,
        sortOrder: input.sortOrder ?? 0,
      },
    });
    return questionMapper.toDto(question);
  }

  async updateQuestion(id: string, input: UpdateQuestionInput): Promise<QuestionDto> {
    const question = await this.prisma.question.update({
      where: { id },
      data: {
        ...(input.questionText !== undefined && { questionText: input.questionText }),
        ...(input.optionA !== undefined && { optionA: input.optionA }),
        ...(input.optionB !== undefined && { optionB: input.optionB }),
        ...(input.optionC !== undefined && { optionC: input.optionC }),
        ...(input.optionD !== undefined && { optionD: input.optionD }),
        ...(input.correctAnswer !== undefined && { correctAnswer: input.correctAnswer }),
        ...(input.explanation !== undefined && { explanation: input.explanation ?? null }),
        ...(input.subject !== undefined && { subject: input.subject ?? null }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
      },
    });
    return questionMapper.toDto(question);
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.prisma.question.delete({ where: { id } });
  }

  // --- Exam flow ---

  async getExamQuestions(questionSetId: string): Promise<ExamQuestionDto[]> {
    const questions = await this.prisma.question.findMany({
      where: { questionSetId },
      orderBy: { sortOrder: 'asc' },
    });
    return questions.map(questionMapper.toExamDto);
  }

  async startExamAttempt(userId: string, questionSetId: string): Promise<ExamAttemptDto> {
    try {
      const attempt = await this.prisma.examAttempt.create({
        data: { userId, questionSetId },
      });
      return this.mapAttemptToDto(attempt);
    } catch (error: unknown) {
      // Handle race condition: unique constraint violation on (userId, questionSetId)
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'P2002'
      ) {
        const existing = await this.prisma.examAttempt.findUniqueOrThrow({
          where: { userId_questionSetId: { userId, questionSetId } },
        });
        return this.mapAttemptToDto(existing);
      }
      throw error;
    }
  }

  async answerQuestion(
    attemptId: string,
    input: AnswerQuestionInput,
    correctAnswer: string,
  ): Promise<void> {
    const isCorrect = input.selectedAnswer === correctAnswer;
    await this.prisma.userAnswer.upsert({
      where: {
        examAttemptId_questionId: {
          examAttemptId: attemptId,
          questionId: input.questionId,
        },
      },
      create: {
        examAttemptId: attemptId,
        questionId: input.questionId,
        selectedAnswer: input.selectedAnswer,
        isCorrect,
      },
      update: {
        selectedAnswer: input.selectedAnswer,
        isCorrect,
      },
    });
  }

  async submitExam(
    attemptId: string,
    markPerQuestion: number,
    negativeMark: number,
  ): Promise<ExamAttemptDto> {
    // Count answers
    const answers = await this.prisma.userAnswer.findMany({
      where: { examAttemptId: attemptId },
    });

    // Get total questions in the set
    const attempt = await this.prisma.examAttempt.findUniqueOrThrow({
      where: { id: attemptId },
    });
    const totalQuestions = await this.prisma.question.count({
      where: { questionSetId: attempt.questionSetId },
    });

    const totalCorrect = answers.filter((a) => a.isCorrect).length;
    const totalWrong = answers.filter((a) => a.selectedAnswer !== null && !a.isCorrect).length;
    const totalUnanswered = totalQuestions - answers.length;
    const totalMarks = totalQuestions * markPerQuestion;
    const obtainedMarks = totalCorrect * markPerQuestion - totalWrong * negativeMark;

    const updated = await this.prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        totalCorrect,
        totalWrong,
        totalUnanswered,
        totalMarks,
        obtainedMarks,
        isCompleted: true,
        submittedAt: new Date(),
      },
    });
    return this.mapAttemptToDto(updated);
  }

  async getExamAttempt(attemptId: string): Promise<ExamAttemptDto | null> {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });
    return attempt ? this.mapAttemptToDto(attempt) : null;
  }

  // --- Review & stats ---

  async getReviewQuestions(attemptId: string, userId: string): Promise<ReviewQuestionDto[]> {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: true,
      },
    });
    if (!attempt) return [];

    const questions = await this.prisma.question.findMany({
      where: { questionSetId: attempt.questionSetId },
      orderBy: { sortOrder: 'asc' },
    });

    const favorites = await this.prisma.userFavorite.findMany({
      where: {
        userId,
        questionId: { in: questions.map((q) => q.id) },
      },
    });

    const answerMap = new Map(attempt.answers.map((a) => [a.questionId, a]));
    const favoriteSet = new Set(favorites.map((f) => f.questionId));

    return questions.map((q) => {
      const answer = answerMap.get(q.id);
      return {
        id: q.id,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        subject: q.subject,
        sortOrder: q.sortOrder,
        userAnswer: answer?.selectedAnswer ?? null,
        isCorrect: answer?.isCorrect ?? false,
        isFavorite: favoriteSet.has(q.id),
      };
    });
  }

  async getQuestionsForReview(questionSetId: string, userId: string): Promise<ReviewQuestionDto[]> {
    const questions = await this.prisma.question.findMany({
      where: { questionSetId },
      orderBy: { sortOrder: 'asc' },
    });

    const favorites = await this.prisma.userFavorite.findMany({
      where: {
        userId,
        questionId: { in: questions.map((q) => q.id) },
      },
    });

    const favoriteSet = new Set(favorites.map((f) => f.questionId));

    return questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      subject: q.subject,
      sortOrder: q.sortOrder,
      userAnswer: null,
      isCorrect: false,
      isFavorite: favoriteSet.has(q.id),
    }));
  }

  async getQuestionStats(questionId: string): Promise<QuestionStatsDto> {
    const answers = await this.prisma.userAnswer.findMany({
      where: { questionId },
    });
    const totalAttempts = answers.length;
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const wrongCount = answers.filter((a) => a.selectedAnswer !== null && !a.isCorrect).length;
    const unansweredCount = answers.filter((a) => a.selectedAnswer === null).length;

    return { questionId, totalAttempts, correctCount, wrongCount, unansweredCount };
  }

  // --- Free tier ---

  async countUserNonFreeAttempts(userId: string, isLive: boolean): Promise<number> {
    return this.prisma.examAttempt.count({
      where: {
        userId,
        questionSet: { isLive, isFree: false },
      },
    });
  }

  async hasActivePackage(userId: string): Promise<boolean> {
    const count = await this.prisma.userPackage.count({
      where: {
        userId,
        isActive: true,
        endDate: { gte: new Date() },
      },
    });
    return count > 0;
  }

  // --- App settings ---

  async getAppSettings(): Promise<AppSettingsDto> {
    const settings = await this.prisma.appSettings.upsert({
      where: { id: 'singleton' },
      update: {},
      create: { id: 'singleton', freeLiveLimit: 3, freeArchiveLimit: 3 },
    });
    return { freeLiveLimit: settings.freeLiveLimit, freeArchiveLimit: settings.freeArchiveLimit };
  }

  async updateAppSettings(input: UpdateAppSettingsInput): Promise<AppSettingsDto> {
    const settings = await this.prisma.appSettings.upsert({
      where: { id: 'singleton' },
      update: {
        ...(input.freeLiveLimit !== undefined && { freeLiveLimit: input.freeLiveLimit }),
        ...(input.freeArchiveLimit !== undefined && { freeArchiveLimit: input.freeArchiveLimit }),
      },
      create: {
        id: 'singleton',
        freeLiveLimit: input.freeLiveLimit ?? 3,
        freeArchiveLimit: input.freeArchiveLimit ?? 3,
      },
    });
    return { freeLiveLimit: settings.freeLiveLimit, freeArchiveLimit: settings.freeArchiveLimit };
  }

  // --- Favorites ---

  async toggleFavorite(userId: string, questionId: string): Promise<boolean> {
    const existing = await this.prisma.userFavorite.findUnique({
      where: { userId_questionId: { userId, questionId } },
    });
    if (existing) {
      await this.prisma.userFavorite.delete({
        where: { userId_questionId: { userId, questionId } },
      });
      return false;
    }
    await this.prisma.userFavorite.create({
      data: { userId, questionId },
    });
    return true;
  }

  async isFavorite(userId: string, questionId: string): Promise<boolean> {
    const count = await this.prisma.userFavorite.count({
      where: { userId, questionId },
    });
    return count > 0;
  }

  // --- Private helpers ---

  private mapAttemptToDto(attempt: {
    id: string;
    userId: string;
    questionSetId: string;
    startedAt: Date;
    submittedAt: Date | null;
    totalCorrect: number;
    totalWrong: number;
    totalUnanswered: number;
    totalMarks: number;
    obtainedMarks: number;
    isCompleted: boolean;
  }): ExamAttemptDto {
    return {
      id: attempt.id,
      userId: attempt.userId,
      questionSetId: attempt.questionSetId,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      totalCorrect: attempt.totalCorrect,
      totalWrong: attempt.totalWrong,
      totalUnanswered: attempt.totalUnanswered,
      totalMarks: attempt.totalMarks,
      obtainedMarks: attempt.obtainedMarks,
      isCompleted: attempt.isCompleted,
    };
  }
}
