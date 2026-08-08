import type { PrismaClient } from '@prisma/client';

import { aiProviderKeyMapper } from '../domain/mapper.js';
import type { AiProviderKeyRepository } from '../domain/repository.contract.js';
import type {
  AiProviderKeyDto,
  AiProviderName,
  CreateAiProviderKeyInput,
  UpdateAiProviderKeyInput,
} from '../domain/types.js';

export class AiProviderKeyPrismaRepository implements AiProviderKeyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<AiProviderKeyDto[]> {
    const rows = await this.prisma.aiProviderKey.findMany({ orderBy: { createdAt: 'desc' } });
    return rows.map(aiProviderKeyMapper.toDto);
  }

  async findById(id: string): Promise<AiProviderKeyDto | null> {
    const row = await this.prisma.aiProviderKey.findUnique({ where: { id } });
    return row ? aiProviderKeyMapper.toDto(row) : null;
  }

  async create(
    input: CreateAiProviderKeyInput,
    encryptedKey: string,
    keyPreview: string,
  ): Promise<AiProviderKeyDto> {
    const row = await this.prisma.aiProviderKey.create({
      data: { provider: input.provider, label: input.label ?? null, encryptedKey, keyPreview },
    });
    return aiProviderKeyMapper.toDto(row);
  }

  async update(id: string, input: UpdateAiProviderKeyInput): Promise<AiProviderKeyDto> {
    const row = await this.prisma.aiProviderKey.update({
      where: { id },
      data: {
        ...(input.label !== undefined && { label: input.label }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
    return aiProviderKeyMapper.toDto(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.aiProviderKey.delete({ where: { id } });
  }

  async findActiveEncryptedGroupedByProvider(): Promise<Record<AiProviderName, string[]>> {
    const rows = await this.prisma.aiProviderKey.findMany({
      where: { isActive: true },
      select: { provider: true, encryptedKey: true },
      orderBy: { createdAt: 'asc' },
    });
    const grouped = {} as Record<AiProviderName, string[]>;
    for (const row of rows) {
      const list = grouped[row.provider as AiProviderName] ?? [];
      list.push(row.encryptedKey);
      grouped[row.provider as AiProviderName] = list;
    }
    return grouped;
  }
}
