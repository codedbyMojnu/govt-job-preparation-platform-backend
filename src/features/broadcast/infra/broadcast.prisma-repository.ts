import type { PrismaClient } from '@prisma/client';

import { integrationCredentialMapper, broadcastLogMapper, automationRuleMapper } from '../domain/mapper.js';
import type {
  AutomationRuleRepository,
  BroadcastLogRepository,
  IntegrationCredentialRepository,
} from '../domain/repository.contract.js';
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
} from '../domain/types.js';

export class IntegrationCredentialPrismaRepository implements IntegrationCredentialRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<IntegrationCredentialDto[]> {
    const rows = await this.prisma.integrationCredential.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(integrationCredentialMapper.toDto);
  }

  async findById(id: string): Promise<IntegrationCredentialDto | null> {
    const row = await this.prisma.integrationCredential.findUnique({ where: { id } });
    return row ? integrationCredentialMapper.toDto(row) : null;
  }

  async create(
    input: CreateIntegrationCredentialInput,
    encryptedConfig: string,
    configPreview: string,
  ): Promise<IntegrationCredentialDto> {
    const row = await this.prisma.integrationCredential.create({
      data: {
        platform: input.platform,
        label: input.label ?? null,
        encryptedConfig,
        configPreview,
      },
    });
    return integrationCredentialMapper.toDto(row);
  }

  async update(
    id: string,
    input: UpdateIntegrationCredentialInput,
  ): Promise<IntegrationCredentialDto> {
    const row = await this.prisma.integrationCredential.update({
      where: { id },
      data: {
        ...(input.label !== undefined && { label: input.label }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
    return integrationCredentialMapper.toDto(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.integrationCredential.delete({ where: { id } });
  }

  async findActiveEncryptedGroupedByPlatform(): Promise<Record<string, string[]>> {
    const rows = await this.prisma.integrationCredential.findMany({
      where: { isActive: true },
      select: { platform: true, encryptedConfig: true },
      orderBy: { createdAt: 'asc' },
    });
    const grouped: Record<string, string[]> = {};
    for (const row of rows) {
      const list = grouped[row.platform] ?? [];
      list.push(row.encryptedConfig);
      grouped[row.platform] = list;
    }
    return grouped;
  }
}

export class BroadcastLogPrismaRepository implements BroadcastLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(filter: BroadcastLogFilter): Promise<PaginatedBroadcastLogs> {
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.min(50, Math.max(1, filter.limit ?? 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (filter.contentType) where['contentType'] = filter.contentType;
    if (filter.status) where['status'] = filter.status;
    if (filter.createdBy) where['createdBy'] = filter.createdBy;
    if (filter.platform) where['platforms'] = { has: filter.platform };

    const [total, rows] = await Promise.all([
      this.prisma.broadcastLog.count({ where }),
      this.prisma.broadcastLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: rows.map(broadcastLogMapper.toDto),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<BroadcastLogDto | null> {
    const row = await this.prisma.broadcastLog.findUnique({ where: { id } });
    return row ? broadcastLogMapper.toDto(row) : null;
  }

  async create(input: CreateBroadcastLogInput): Promise<BroadcastLogDto> {
    const row = await this.prisma.broadcastLog.create({
      data: {
        contentType: input.contentType,
        platforms: input.platforms,
        questionIds: input.questionIds ?? [],
        questionSetId: input.questionSetId ?? null,
        pdfId: input.pdfId ?? null,
        jobCircularIds: input.jobCircularIds ?? [],
        aiProvider: input.aiProvider ?? null,
        aiModel: input.aiModel ?? null,
        contentText: input.contentText ?? null,
        mediaUrl: input.mediaUrl ?? null,
        status: input.status ?? 'DRAFT',
        errorMessage: input.errorMessage ?? null,
        createdBy: input.createdBy,
        sentAt: input.sentAt ?? null,
      },
    });
    return broadcastLogMapper.toDto(row);
  }

  async update(id: string, input: UpdateBroadcastLogInput): Promise<BroadcastLogDto> {
    const row = await this.prisma.broadcastLog.update({
      where: { id },
      data: {
        ...(input.status !== undefined && { status: input.status }),
        ...(input.errorMessage !== undefined && { errorMessage: input.errorMessage }),
        ...(input.sentAt !== undefined && { sentAt: input.sentAt }),
      },
    });
    return broadcastLogMapper.toDto(row);
  }
}

export class AutomationRulePrismaRepository implements AutomationRuleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<AutomationRuleDto[]> {
    const rows = await this.prisma.broadcastAutomationRule.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(automationRuleMapper.toDto);
  }

  async findById(id: string): Promise<AutomationRuleDto | null> {
    const row = await this.prisma.broadcastAutomationRule.findUnique({ where: { id } });
    return row ? automationRuleMapper.toDto(row) : null;
  }

  async create(input: CreateAutomationRuleInput): Promise<AutomationRuleDto> {
    const row = await this.prisma.broadcastAutomationRule.create({
      data: {
        name: input.name,
        platforms: input.platforms,
        questionCount: Math.min(4, Math.max(1, input.questionCount ?? 3)),
        intervalMinutes: Math.max(2, input.intervalMinutes ?? 120),
        isActive: input.isActive ?? false,
        createdBy: input.createdBy,
      },
    });
    return automationRuleMapper.toDto(row);
  }

  async update(id: string, input: UpdateAutomationRuleInput): Promise<AutomationRuleDto> {
    const row = await this.prisma.broadcastAutomationRule.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.platforms !== undefined && { platforms: input.platforms }),
        ...(input.questionCount !== undefined && {
          questionCount: Math.min(4, Math.max(1, input.questionCount)),
        }),
        ...(input.intervalMinutes !== undefined && {
          intervalMinutes: Math.max(2, input.intervalMinutes),
        }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
    return automationRuleMapper.toDto(row);
  }

  async updateMeta(
    id: string,
    meta: { repeatJobKey?: string | null; lastRunAt?: Date | null },
  ): Promise<AutomationRuleDto> {
    const row = await this.prisma.broadcastAutomationRule.update({
      where: { id },
      data: {
        ...(meta.repeatJobKey !== undefined && { repeatJobKey: meta.repeatJobKey }),
        ...(meta.lastRunAt !== undefined && { lastRunAt: meta.lastRunAt }),
      },
    });
    return automationRuleMapper.toDto(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.broadcastAutomationRule.delete({ where: { id } });
  }

  async findRandomQuestions(count: number): Promise<PublicQuestionForBroadcast[]> {
    const total = await this.prisma.question.count({ where: { slug: { not: null } } });
    if (total === 0) return [];

    const picked: PublicQuestionForBroadcast[] = [];
    const usedSkips = new Set<number>();
    const limit = Math.min(count, total, 4);

    while (picked.length < limit && usedSkips.size < total) {
      const skip = Math.floor(Math.random() * total);
      if (usedSkips.has(skip)) continue;
      usedSkips.add(skip);

      const question = await this.prisma.question.findFirst({
        where: { slug: { not: null } },
        skip,
        include: {
          questionSet: {
            include: {
              subExamCategory: { include: { examCategory: true } },
            },
          },
        },
      });

      if (!question) continue;
      if (picked.some((p) => p.id === question.id)) continue;

      picked.push({
        id: question.id,
        questionText: question.questionText,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
        correctAnswer: question.correctAnswer,
        examCategoryName: question.questionSet.subExamCategory.examCategory.name,
        subExamCategoryName: question.questionSet.subExamCategory.name,
      });
    }

    return picked;
  }
}
