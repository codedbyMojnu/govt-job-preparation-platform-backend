import type {
  AiProviderKeyDto,
  AiProviderName,
  CreateAiProviderKeyInput,
  UpdateAiProviderKeyInput,
} from './types.js';

export interface AiProviderKeyRepository {
  findAll(): Promise<AiProviderKeyDto[]>;
  findById(id: string): Promise<AiProviderKeyDto | null>;
  create(
    input: CreateAiProviderKeyInput,
    encryptedKey: string,
    keyPreview: string,
  ): Promise<AiProviderKeyDto>;
  update(id: string, input: UpdateAiProviderKeyInput): Promise<AiProviderKeyDto>;
  delete(id: string): Promise<void>;
  /** Encrypted ciphertext-ই ফেরত দেয় — decrypt হয় service layer-এ। */
  findActiveEncryptedGroupedByProvider(): Promise<Record<AiProviderName, string[]>>;
}
