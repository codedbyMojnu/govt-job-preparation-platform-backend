import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import type { SubExamCategoryService } from '../../domain/sub-exam-category.service.js';
import type {
  BulkUpsertSubExamCategoryItem,
  CreateSubExamCategoryInput,
  UpdateSubExamCategoryInput,
} from '../../domain/types.js';

export class SubExamCategoryController {
  constructor(private readonly service: SubExamCategoryService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const activeOnly = req.query.activeOnly !== 'false';
    const subCategories = await this.service.getAll(activeOnly);
    res.status(HttpStatus.OK).json({ data: subCategories });
  }

  async getByCategorySlug(req: Request, res: Response): Promise<void> {
    // categoryId is resolved from the parent category slug in the route handler
    const categoryId = req.params.categoryId!;
    const activeOnly = req.query.activeOnly !== 'false';
    const subCategories = await this.service.getByCategoryId(categoryId, activeOnly);
    res.status(HttpStatus.OK).json({ data: subCategories });
  }

  async getUserSummary(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const categoryId = req.params.categoryId!;
    const summary = await this.service.getUserCategorySummary(userId, categoryId);
    res.status(HttpStatus.OK).json({ data: summary });
  }

  async create(req: Request, res: Response): Promise<void> {
    const input: CreateSubExamCategoryInput = req.body;
    const sub = await this.service.create(input);
    res.status(HttpStatus.CREATED).json({ data: sub });
  }

  async update(req: Request, res: Response): Promise<void> {
    const input: UpdateSubExamCategoryInput = req.body;
    const sub = await this.service.update(req.params.id!, input);
    res.status(HttpStatus.OK).json({ data: sub });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.service.delete(req.params.id!);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async getMeritList(req: Request, res: Response): Promise<void> {
    const subCategoryId = req.params.subCategoryId!;
    const meritList = await this.service.getMeritList(subCategoryId);
    res.status(HttpStatus.OK).json({ data: meritList });
  }

  async bulkUpsert(req: Request, res: Response): Promise<void> {
    const items: BulkUpsertSubExamCategoryItem[] = req.body.items;
    const result = await this.service.bulkUpsert(items);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async bulkDelete(req: Request, res: Response): Promise<void> {
    const ids: string[] = req.body.ids;
    await this.service.bulkDelete(ids);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
