import { NotFoundError } from '../../../shared/errors/http-errors.js';
import { decryptSecret, encryptSecret, previewSecret } from '../../../shared/utils/crypto.js';

import type { AiProviderKeyRepository } from './repository.contract.js';
import type {
  AiProviderKeyDto,
  AiProviderName,
  CreateAiProviderKeyInput,
  ResolvedProviderKeys,
  UpdateAiProviderKeyInput,
} from './types.js';

export class AiProviderKeyService {
  constructor(private readonly repository: AiProviderKeyRepository) {}

  async list(): Promise<AiProviderKeyDto[]> {
    return this.repository.findAll();
  }

  async create(input: CreateAiProviderKeyInput): Promise<AiProviderKeyDto> {
    const trimmedKey = input.key.trim();
    const encryptedKey = encryptSecret(trimmedKey);
    const keyPreview = previewSecret(trimmedKey);
    return this.repository.create(input, encryptedKey, keyPreview);
  }

  async update(id: string, input: UpdateAiProviderKeyInput): Promise<AiProviderKeyDto> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('AI provider key not found');
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('AI provider key not found');
    await this.repository.delete(id);
  }

  /**
   * সব active key decrypt করে provider অনুযায়ী group করে দেয়।
   * শুধু internal-service-guarded /resolve route থেকে call হয়।
   */
  async resolveActiveKeysGrouped(): Promise<ResolvedProviderKeys> {
    const encryptedGrouped = await this.repository.findActiveEncryptedGroupedByProvider();
    const result: ResolvedProviderKeys = {};
    for (const provider of Object.keys(encryptedGrouped) as AiProviderName[]) {
      result[provider] = encryptedGrouped[provider]!.map((ciphertext) => {
        try {
          return decryptSecret(ciphertext);
        } catch {
          return null; // corrupted/rotated-secret row হলে skip, পুরা request fail করবে না
        }
      }).filter((k): k is string => Boolean(k));
    }
    return result;
  }
}
