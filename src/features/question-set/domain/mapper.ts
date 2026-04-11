import type { Question, QuestionSet } from '@prisma/client';

import type { ExamQuestionDto, QuestionDto, QuestionSetDto } from './types.js';

export const questionSetMapper = {
  toDto(entity: QuestionSet): QuestionSetDto {
    return {
      id: entity.id,
      subExamCategoryId: entity.subExamCategoryId,
      title: entity.title,
      date: entity.date,
      totalMarks: entity.totalMarks,
      duration: entity.duration,
      subject: entity.subject,
      topics: entity.topics,
      sourceMaterial: entity.sourceMaterial,
      markPerQuestion: entity.markPerQuestion,
      negativeMark: entity.negativeMark,
      isFree: entity.isFree,
      isLive: entity.isLive,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
    };
  },
};

export const questionMapper = {
  toDto(entity: Question): QuestionDto {
    return {
      id: entity.id,
      questionSetId: entity.questionSetId,
      questionText: entity.questionText,
      optionA: entity.optionA,
      optionB: entity.optionB,
      optionC: entity.optionC,
      optionD: entity.optionD,
      correctAnswer: entity.correctAnswer,
      explanation: entity.explanation,
      subject: entity.subject,
      sortOrder: entity.sortOrder,
    };
  },

  toExamDto(entity: Question): ExamQuestionDto {
    return {
      id: entity.id,
      questionText: entity.questionText,
      optionA: entity.optionA,
      optionB: entity.optionB,
      optionC: entity.optionC,
      optionD: entity.optionD,
      subject: entity.subject,
      sortOrder: entity.sortOrder,
    };
  },
};
