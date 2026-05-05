import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import type { SyllabusService } from '../../domain/syllabus.service.js';
import type { CreateSyllabusInput, UpdateSyllabusInput } from '../../domain/types.js';

export class SyllabusController {
  constructor(private readonly service: SyllabusService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const activeOnly = req.query.activeOnly !== 'false';
    const syllabuses = await this.service.getAll(activeOnly);
    res.status(HttpStatus.OK).json({ data: syllabuses });
  }

  async getBySubCategory(req: Request, res: Response): Promise<void> {
    const subCategoryId = req.params.subCategoryId!;
    const activeOnly = req.query.activeOnly !== 'false';
    const syllabuses = await this.service.getBySubCategoryId(subCategoryId, activeOnly);
    res.status(HttpStatus.OK).json({ data: syllabuses });
  }

  async getBySlug(req: Request, res: Response): Promise<void> {
    const syllabus = await this.service.getBySlug(req.params.slug!);
    res.status(HttpStatus.OK).json({ data: syllabus });
  }

  async create(req: Request, res: Response): Promise<void> {
    const input: CreateSyllabusInput = req.body;
    const syllabus = await this.service.create(input);
    res.status(HttpStatus.CREATED).json({ data: syllabus });
  }

  async update(req: Request, res: Response): Promise<void> {
    const input: UpdateSyllabusInput = req.body;
    const syllabus = await this.service.update(req.params.id!, input);
    res.status(HttpStatus.OK).json({ data: syllabus });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.service.delete(req.params.id!);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
