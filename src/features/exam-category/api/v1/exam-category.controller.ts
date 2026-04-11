import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import type { ExamCategoryService } from '../../domain/exam-category.service.js';
import type { CreateExamCategoryInput, UpdateExamCategoryInput } from '../../domain/types.js';

export class ExamCategoryController {
  constructor(private readonly service: ExamCategoryService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const activeOnly = req.query.activeOnly !== 'false';
    const categories = await this.service.getAll(activeOnly);
    res.status(HttpStatus.OK).json({ data: categories });
  }

  async getBySlug(req: Request, res: Response): Promise<void> {
    const category = await this.service.getBySlug(req.params.slug!);
    res.status(HttpStatus.OK).json({ data: category });
  }

  async create(req: Request, res: Response): Promise<void> {
    const input: CreateExamCategoryInput = req.body;
    const category = await this.service.create(input);
    res.status(HttpStatus.CREATED).json({ data: category });
  }

  async update(req: Request, res: Response): Promise<void> {
    const input: UpdateExamCategoryInput = req.body;
    const category = await this.service.update(req.params.id!, input);
    res.status(HttpStatus.OK).json({ data: category });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.service.delete(req.params.id!);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
