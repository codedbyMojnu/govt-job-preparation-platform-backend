import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import type { IntegrationCredentialService } from '../../domain/integration-credential.service.js';
import type {
  CreateIntegrationCredentialInput,
  UpdateIntegrationCredentialInput,
} from '../../domain/types.js';

export class IntegrationCredentialController {
  constructor(private readonly service: IntegrationCredentialService) {}

  async list(_req: Request, res: Response): Promise<void> {
    res.status(HttpStatus.OK).json({ data: await this.service.list() });
  }

  async create(req: Request, res: Response): Promise<void> {
    const input: CreateIntegrationCredentialInput = req.body;
    res.status(HttpStatus.CREATED).json({ data: await this.service.create(input) });
  }

  async update(req: Request, res: Response): Promise<void> {
    const input: UpdateIntegrationCredentialInput = req.body;
    res.status(HttpStatus.OK).json({ data: await this.service.update(req.params.id!, input) });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.service.delete(req.params.id!);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async resolve(_req: Request, res: Response): Promise<void> {
    res.status(HttpStatus.OK).json({ data: await this.service.resolveActiveConfigsGrouped() });
  }
}
