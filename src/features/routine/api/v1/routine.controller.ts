import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import type { RoutineService } from '../../domain/routine.service.js';
import type {
  BulkUpsertRoutineItem,
  CreateRoutineInput,
  UpdateRoutineInput,
} from '../../domain/types.js';

export class RoutineController {
  constructor(private readonly service: RoutineService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const activeOnly = req.query.activeOnly !== 'false';
    const routines = await this.service.getAll(activeOnly);
    res.status(HttpStatus.OK).json({ data: routines });
  }

  async getBySubCategory(req: Request, res: Response): Promise<void> {
    const subCategoryId = req.params.subCategoryId!;
    const activeOnly = req.query.activeOnly !== 'false';
    const routines = await this.service.getBySubCategoryId(subCategoryId, activeOnly);
    res.status(HttpStatus.OK).json({ data: routines });
  }

  async create(req: Request, res: Response): Promise<void> {
    const input: CreateRoutineInput = req.body;
    const routine = await this.service.create(input);
    res.status(HttpStatus.CREATED).json({ data: routine });
  }

  async update(req: Request, res: Response): Promise<void> {
    const input: UpdateRoutineInput = req.body;
    const routine = await this.service.update(req.params.id!, input);
    res.status(HttpStatus.OK).json({ data: routine });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.service.delete(req.params.id!);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async bulkUpsert(req: Request, res: Response): Promise<void> {
    const items: BulkUpsertRoutineItem[] = req.body.routines;
    const routines = await this.service.bulkUpsert(items);
    res.status(HttpStatus.OK).json({ data: routines });
  }

  async bulkDelete(req: Request, res: Response): Promise<void> {
    const ids: string[] = req.body.ids;
    await this.service.bulkDelete(ids);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
