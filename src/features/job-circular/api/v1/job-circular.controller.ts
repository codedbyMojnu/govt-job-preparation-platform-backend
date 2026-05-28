import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import type { JobCircularService } from '../../domain/job-circular.service.js';
import type {
  BulkUpsertJobCircularItem,
  CreateJobCircularInput,
  JobCircularFilter,
  UpdateJobCircularInput,
} from '../../domain/types.js';

export class JobCircularController {
  constructor(private readonly service: JobCircularService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const filter: JobCircularFilter = {
      orgType: req.query.orgType as string | undefined,
      status: req.query.status as string | undefined,
      category: req.query.category as string | undefined,
      ministry: req.query.ministry as string | undefined,
      search: req.query.search as string | undefined,
      deadlineFrom: req.query.deadlineFrom as string | undefined,
      deadlineTo: req.query.deadlineTo as string | undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    };
    const result = await this.service.getAll(filter);
    res.status(HttpStatus.OK).json(result);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const circular = await this.service.getById(req.params.id!);
    res.status(HttpStatus.OK).json({ data: circular });
  }

  async recordView(req: Request, res: Response): Promise<void> {
    await this.service.recordView(req.params.id!);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async getFilterOptions(req: Request, res: Response): Promise<void> {
    const options = await this.service.getFilterOptions();
    res.status(HttpStatus.OK).json({ data: options });
  }

  async create(req: Request, res: Response): Promise<void> {
    const input: CreateJobCircularInput = req.body;
    const circular = await this.service.create(input);
    res.status(HttpStatus.CREATED).json({ data: circular });
  }

  async update(req: Request, res: Response): Promise<void> {
    const input: UpdateJobCircularInput = req.body;
    const circular = await this.service.update(req.params.id!, input);
    res.status(HttpStatus.OK).json({ data: circular });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.service.delete(req.params.id!);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async bulkUpsert(req: Request, res: Response): Promise<void> {
    const items: BulkUpsertJobCircularItem[] = req.body.items;
    const result = await this.service.bulkUpsert(items);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async bulkDelete(req: Request, res: Response): Promise<void> {
    const { ids }: { ids: string[] } = req.body;
    await this.service.bulkDelete(ids);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
