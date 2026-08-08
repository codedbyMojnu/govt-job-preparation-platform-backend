export type AiProviderName = 'MISTRAL' | 'ANTHROPIC' | 'GEMINI' | 'OPENAI' | 'OMNIROUTE';

export interface AiProviderKeyDto {
  id: string;
  provider: AiProviderName;
  label: string | null;
  keyPreview: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAiProviderKeyInput {
  provider: AiProviderName;
  key: string;
  label?: string;
}

export interface UpdateAiProviderKeyInput {
  label?: string;
  isActive?: boolean;
}

/** Decrypted keys grouped by provider — শুধু /resolve endpoint এই টাইপ return করে। */
export type ResolvedProviderKeys = Partial<Record<AiProviderName, string[]>>;
