export type BroadcastPlatformName =
  | 'TELEGRAM_GROUP'
  | 'TELEGRAM_CHANNEL'
  | 'FACEBOOK_PAGE'
  | 'WHATSAPP';

export type BroadcastContentTypeName =
  | 'QUESTION'
  | 'QUESTION_SET'
  | 'PDF'
  | 'JOB_CIRCULAR'
  | 'SLIDE_IMAGE'
  | 'MOTIVATIONAL'
  | 'STUDY_TIP'
  | 'NOTICE'
  | 'OFFER'
  | 'CUSTOM';

export type BroadcastStatusName = 'DRAFT' | 'SENDING' | 'SENT' | 'FAILED';

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export interface FacebookConfig {
  pageId: string;
  pageAccessToken: string;
  appId?: string;
  appSecret?: string;
}

export type IntegrationConfig = TelegramConfig | FacebookConfig;

export interface IntegrationCredentialDto {
  id: string;
  platform: BroadcastPlatformName;
  label: string | null;
  configPreview: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIntegrationCredentialInput {
  platform: BroadcastPlatformName;
  config: IntegrationConfig;
  label?: string;
}

export interface UpdateIntegrationCredentialInput {
  label?: string;
  isActive?: boolean;
}

/** Decrypted configs grouped by platform — only returned from /resolve. */
export type ResolvedIntegrationConfigs = Partial<
  Record<BroadcastPlatformName, IntegrationConfig[]>
>;

export interface BroadcastLogDto {
  id: string;
  contentType: BroadcastContentTypeName;
  platforms: BroadcastPlatformName[];
  questionIds: string[];
  questionSetId: string | null;
  pdfId: string | null;
  jobCircularIds: string[];
  aiProvider: string | null;
  aiModel: string | null;
  contentText: string | null;
  mediaUrl: string | null;
  status: BroadcastStatusName;
  errorMessage: string | null;
  createdBy: string;
  createdAt: Date;
  sentAt: Date | null;
}

export interface CreateBroadcastLogInput {
  contentType: BroadcastContentTypeName;
  platforms: BroadcastPlatformName[];
  questionIds?: string[];
  questionSetId?: string;
  pdfId?: string;
  jobCircularIds?: string[];
  aiProvider?: string;
  aiModel?: string;
  contentText?: string;
  mediaUrl?: string;
  status?: BroadcastStatusName;
  errorMessage?: string;
  createdBy: string;
  sentAt?: Date;
}

export interface UpdateBroadcastLogInput {
  status?: BroadcastStatusName;
  errorMessage?: string | null;
  sentAt?: Date | null;
}

export interface BroadcastLogFilter {
  contentType?: BroadcastContentTypeName;
  status?: BroadcastStatusName;
  platform?: BroadcastPlatformName;
  createdBy?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedBroadcastLogs {
  data: BroadcastLogDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AutomationRuleKindName = 'RANDOM_QUESTIONS';

export interface AutomationRuleDto {
  id: string;
  name: string;
  kind: AutomationRuleKindName;
  platforms: BroadcastPlatformName[];
  questionCount: number;
  intervalMinutes: number;
  isActive: boolean;
  repeatJobKey: string | null;
  lastRunAt: Date | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAutomationRuleInput {
  name: string;
  platforms: BroadcastPlatformName[];
  questionCount?: number;
  intervalMinutes?: number;
  isActive?: boolean;
  createdBy: string;
}

export interface UpdateAutomationRuleInput {
  name?: string;
  platforms?: BroadcastPlatformName[];
  questionCount?: number;
  intervalMinutes?: number;
  isActive?: boolean;
}

export interface PublicQuestionForBroadcast {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  examCategoryName: string;
  subExamCategoryName: string;
}
