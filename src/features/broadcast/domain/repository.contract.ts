import type {
  AutomationRuleDto,
  BroadcastLogDto,
  BroadcastLogFilter,
  CreateAutomationRuleInput,
  CreateBroadcastLogInput,
  CreateIntegrationCredentialInput,
  IntegrationCredentialDto,
  PaginatedBroadcastLogs,
  PublicQuestionForBroadcast,
  UpdateAutomationRuleInput,
  UpdateBroadcastLogInput,
  UpdateIntegrationCredentialInput,
} from './types.js';

export interface IntegrationCredentialRepository {
  findAll(): Promise<IntegrationCredentialDto[]>;
  findById(id: string): Promise<IntegrationCredentialDto | null>;
  create(
    input: CreateIntegrationCredentialInput,
    encryptedConfig: string,
    configPreview: string,
  ): Promise<IntegrationCredentialDto>;
  update(id: string, input: UpdateIntegrationCredentialInput): Promise<IntegrationCredentialDto>;
  delete(id: string): Promise<void>;
  findActiveEncryptedGroupedByPlatform(): Promise<Record<string, string[]>>;
}

export interface BroadcastLogRepository {
  findAll(filter: BroadcastLogFilter): Promise<PaginatedBroadcastLogs>;
  findById(id: string): Promise<BroadcastLogDto | null>;
  create(input: CreateBroadcastLogInput): Promise<BroadcastLogDto>;
  update(id: string, input: UpdateBroadcastLogInput): Promise<BroadcastLogDto>;
}

export interface AutomationRuleRepository {
  findAll(): Promise<AutomationRuleDto[]>;
  findById(id: string): Promise<AutomationRuleDto | null>;
  create(input: CreateAutomationRuleInput): Promise<AutomationRuleDto>;
  update(id: string, input: UpdateAutomationRuleInput): Promise<AutomationRuleDto>;
  updateMeta(
    id: string,
    meta: { repeatJobKey?: string | null; lastRunAt?: Date | null },
  ): Promise<AutomationRuleDto>;
  delete(id: string): Promise<void>;
  findRandomQuestions(count: number): Promise<PublicQuestionForBroadcast[]>;
}
