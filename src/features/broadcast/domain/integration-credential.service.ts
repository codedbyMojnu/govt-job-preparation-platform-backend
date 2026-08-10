import { NotFoundError } from '../../../shared/errors/http-errors.js';
import { decryptSecret, encryptSecret, previewSecret } from '../../../shared/utils/crypto.js';

import type {
  BroadcastLogRepository,
  IntegrationCredentialRepository,
} from './repository.contract.js';
import type {
  BroadcastLogDto,
  BroadcastLogFilter,
  BroadcastPlatformName,
  CreateBroadcastLogInput,
  CreateIntegrationCredentialInput,
  IntegrationConfig,
  IntegrationCredentialDto,
  PaginatedBroadcastLogs,
  ResolvedIntegrationConfigs,
  TelegramConfig,
  UpdateBroadcastLogInput,
  UpdateIntegrationCredentialInput,
} from './types.js';

function buildConfigPreview(platform: BroadcastPlatformName, config: IntegrationConfig): string {
  if (platform === 'TELEGRAM_GROUP' || platform === 'TELEGRAM_CHANNEL') {
    const tg = config as TelegramConfig;
    return `bot:${previewSecret(tg.botToken)} | chat:${tg.chatId}`;
  }
  if (platform === 'FACEBOOK_PAGE') {
    const fb = config as { pageId: string; pageAccessToken: string };
    return `page:${fb.pageId} | token:${previewSecret(fb.pageAccessToken)}`;
  }
  return previewSecret(JSON.stringify(config));
}

export class IntegrationCredentialService {
  constructor(private readonly repository: IntegrationCredentialRepository) {}

  async list(): Promise<IntegrationCredentialDto[]> {
    return this.repository.findAll();
  }

  async create(input: CreateIntegrationCredentialInput): Promise<IntegrationCredentialDto> {
    const configJson = JSON.stringify(input.config);
    const encryptedConfig = encryptSecret(configJson);
    const configPreview = buildConfigPreview(input.platform, input.config);
    return this.repository.create(input, encryptedConfig, configPreview);
  }

  async update(
    id: string,
    input: UpdateIntegrationCredentialInput,
  ): Promise<IntegrationCredentialDto> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('Integration credential not found');
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('Integration credential not found');
    await this.repository.delete(id);
  }

  async resolveActiveConfigsGrouped(): Promise<ResolvedIntegrationConfigs> {
    const encryptedGrouped = await this.repository.findActiveEncryptedGroupedByPlatform();
    const result: ResolvedIntegrationConfigs = {};

    for (const [platform, ciphertexts] of Object.entries(encryptedGrouped)) {
      const configs: IntegrationConfig[] = [];
      for (const ciphertext of ciphertexts) {
        try {
          configs.push(JSON.parse(decryptSecret(ciphertext)) as IntegrationConfig);
        } catch {
          // skip corrupted rows
        }
      }
      if (configs.length > 0) {
        result[platform as BroadcastPlatformName] = configs;
      }
    }

    return result;
  }
}

export class BroadcastLogService {
  constructor(private readonly repository: BroadcastLogRepository) {}

  async list(filter: BroadcastLogFilter): Promise<PaginatedBroadcastLogs> {
    return this.repository.findAll(filter);
  }

  async create(input: CreateBroadcastLogInput): Promise<BroadcastLogDto> {
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateBroadcastLogInput): Promise<BroadcastLogDto> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('Broadcast log not found');
    return this.repository.update(id, input);
  }
}
