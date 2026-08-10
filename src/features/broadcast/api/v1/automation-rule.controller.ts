import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import type { AutomationRuleService } from '../../domain/automation-rule.service.js';
import type { CreateAutomationRuleInput, UpdateAutomationRuleInput } from '../../domain/types.js';

export class AutomationRuleController {
  constructor(private readonly service: AutomationRuleService) {}

  async list(_req: Request, res: Response): Promise<void> {
    res.status(HttpStatus.OK).json({ data: await this.service.list() });
  }

  async create(req: Request, res: Response): Promise<void> {
    const input: CreateAutomationRuleInput = {
      ...req.body,
      createdBy: req.userId!,
    };
    res.status(HttpStatus.CREATED).json({ data: await this.service.create(input) });
  }

  async update(req: Request, res: Response): Promise<void> {
    const input: UpdateAutomationRuleInput = req.body;
    res.status(HttpStatus.OK).json({ data: await this.service.update(req.params.id!, input) });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.service.delete(req.params.id!);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async runNow(req: Request, res: Response): Promise<void> {
    const result = await this.service.runNow(req.params.id!);
    res.status(HttpStatus.OK).json({ data: result });
  }
}
