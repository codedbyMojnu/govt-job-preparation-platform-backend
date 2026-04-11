export interface QuestionSetDto {
  id: string;
  subExamCategoryId: string;
  title: string;
  date: Date;
  totalMarks: number;
  duration: number;
  subject: string;
  topics: string | null;
  sourceMaterial: string | null;
  markPerQuestion: number;
  negativeMark: number;
  isFree: boolean;
  isLive: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface CreateQuestionSetInput {
  subExamCategoryId: string;
  title: string;
  date: string;
  totalMarks: number;
  duration: number;
  subject: string;
  topics?: string;
  sourceMaterial?: string;
  markPerQuestion?: number;
  negativeMark?: number;
  isFree?: boolean;
  isLive?: boolean;
}

export interface UpdateQuestionSetInput {
  title?: string;
  date?: string;
  totalMarks?: number;
  duration?: number;
  subject?: string;
  topics?: string;
  sourceMaterial?: string;
  markPerQuestion?: number;
  negativeMark?: number;
  isFree?: boolean;
  isLive?: boolean;
  isActive?: boolean;
}

export interface MarksheetDto {
  attemptId: string;
  questionSetId: string;
  questionSetTitle: string;
  startedAt: Date;
  submittedAt: Date | null;
  totalCorrect: number;
  totalWrong: number;
  totalUnanswered: number;
  totalMarks: number;
  obtainedMarks: number;
  markPerQuestion: number;
  negativeMark: number;
  subjectWise: SubjectWiseMark[];
}

export interface SubjectWiseMark {
  subject: string;
  correct: number;
  wrong: number;
  unanswered: number;
  finalMark: number;
}

// --- Question types ---

export interface QuestionDto {
  id: string;
  questionSetId: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string | null;
  subject: string | null;
  sortOrder: number;
}

/** Question returned during exam (hides correctAnswer & explanation) */
export interface ExamQuestionDto {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  subject: string | null;
  sortOrder: number;
}

export interface CreateQuestionInput {
  questionSetId: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation?: string;
  subject?: string;
  sortOrder?: number;
}

export interface UpdateQuestionInput {
  questionText?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer?: string;
  explanation?: string;
  subject?: string;
  sortOrder?: number;
}

// --- Exam attempt types ---

export interface ExamAttemptDto {
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
}

export interface AnswerQuestionInput {
  questionId: string;
  selectedAnswer: string; // A, B, C, D
}

// --- Review types ---

export interface ReviewQuestionDto {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string | null;
  subject: string | null;
  sortOrder: number;
  userAnswer: string | null;
  isCorrect: boolean;
  isFavorite: boolean;
}

export interface QuestionStatsDto {
  questionId: string;
  totalAttempts: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
}

// --- App settings ---

export interface AppSettingsDto {
  freeLiveLimit: number;
  freeArchiveLimit: number;
}

export interface UpdateAppSettingsInput {
  freeLiveLimit?: number;
  freeArchiveLimit?: number;
}
