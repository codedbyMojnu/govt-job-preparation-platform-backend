import { NotFoundError } from '../../../shared/errors/http-errors.js';

import type { BroadcastAutomationService } from './broadcast-automation.service.js';
import type { AutomationRuleRepository } from './repository.contract.js';
import type {
  AutomationRuleDto,
  CreateAutomationRuleInput,
  UpdateAutomationRuleInput,
} from './types.js';

export class AutomationRuleService {
  constructor(
    private readonly repository: AutomationRuleRepository,
    private readonly automation: BroadcastAutomationService,
  ) {}

  async list(): Promise<AutomationRuleDto[]> {
    return this.repository.findAll();
  }

  async create(input: CreateAutomationRuleInput): Promise<AutomationRuleDto> {
    const rule = await this.repository.create(input);
    if (rule.isActive) {
      await this.automation.syncRepeatableJob(rule);
      return (await this.repository.findById(rule.id))!;
    }
    return rule;
  }

  async update(id: string, input: UpdateAutomationRuleInput): Promise<AutomationRuleDto> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('Automation rule not found');

    const rule = await this.repository.update(id, input);
    await this.automation.syncRepeatableJob(rule);
    return (await this.repository.findById(rule.id))!;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('Automation rule not found');
    await this.automation.removeRepeatableJob(existing);
    await this.repository.delete(id);
  }

  async runNow(id: string): Promise<{ sent: number; failed: number }> {
    return this.automation.runRuleNow(id);
  }
}
