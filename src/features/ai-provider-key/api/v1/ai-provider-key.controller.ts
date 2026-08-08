import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import type { AiProviderKeyService } from '../../domain/ai-provider-key.service.js';
import type { CreateAiProviderKeyInput, UpdateAiProviderKeyInput } from '../../domain/types.js';

export class AiProviderKeyController {
  constructor(private readonly service: AiProviderKeyService) {}

  async list(_req: Request, res: Response): Promise<void> {
    res.status(HttpStatus.OK).json({ data: await this.service.list() });
  }

  async create(req: Request, res: Response): Promise<void> {
    const input: CreateAiProviderKeyInput = req.body;
    res.status(HttpStatus.CREATED).json({ data: await this.service.create(input) });
  }

  async update(req: Request, res: Response): Promise<void> {
    const input: UpdateAiProviderKeyInput = req.body;
    res.status(HttpStatus.OK).json({ data: await this.service.update(req.params.id!, input) });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.service.delete(req.params.id!);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async resolve(_req: Request, res: Response): Promise<void> {
    res.status(HttpStatus.OK).json({ data: await this.service.resolveActiveKeysGrouped() });
  }
}
