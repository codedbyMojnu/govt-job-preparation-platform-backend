import { BadRequestError } from '../../../shared/errors/http-errors.js';
import type { QuestionSetRepository } from '../../question-set/domain/repository.contract.js';
import type { QuestionSetDto } from '../../question-set/domain/types.js';

import type { RoutineRepository } from './repository.contract.js';

const DATE_ONLY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseDateOnly(value: string): Date {
  const match = DATE_ONLY_REGEX.exec(value);
  if (!match) {
    throw new BadRequestError('Date must be in YYYY-MM-DD format');
  }

  const [, year, month, day] = match;
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export class RoutineQuestionSetService {
  constructor(
    private readonly routineRepository: RoutineRepository,
    private readonly questionSetRepository: QuestionSetRepository,
  ) {}

  async createQuestionSetsForDate(date?: string): Promise<QuestionSetDto[]> {
    const targetDate = date ? parseDateOnly(date) : new Date();
    const targetDateStr = formatDateOnly(targetDate);

    const routines = await this.routineRepository.findByDate(targetDateStr, true);
    if (routines.length === 0) {
      return [];
    }

    const createdSets: QuestionSetDto[] = [];

    for (const routine of routines) {
      const existing = await this.questionSetRepository.findBySubCategoryIdAndDate(
        routine.subExamCategoryId,
        targetDateStr,
        routine.title,
      );

      if (existing) {
        continue;
      }

      const created = await this.questionSetRepository.create({
        subExamCategoryId: routine.subExamCategoryId,
        title: routine.title,
        date: targetDateStr,
        totalMarks: routine.totalMarks,
        duration: routine.duration,
        subject: routine.subject,
        ...(routine.topics ? { topics: routine.topics } : {}),
        ...(routine.sourceMaterial ? { sourceMaterial: routine.sourceMaterial } : {}),
        markPerQuestion: 1,
        negativeMark: 0.25,
        isLive: false,
        isActive: false,
      });

      createdSets.push(created);
    }

    return createdSets;
  }
}
