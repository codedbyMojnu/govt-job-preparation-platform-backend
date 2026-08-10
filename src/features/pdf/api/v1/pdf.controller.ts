import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import { BadRequestError } from '../../../../shared/errors/http-errors.js';
import type { PdfService } from '../../domain/pdf.service.js';
import type {
  CreateCommentInput,
  CreatePdfInput,
  PdfFilter,
  UpdatePdfInput,
} from '../../domain/types.js';

function parseFormBody(body: Record<string, unknown>): CreatePdfInput | UpdatePdfInput {
  const tags =
    typeof body.tags === 'string'
      ? body.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined;
  return { ...body, tags } as CreatePdfInput;
}

export class PdfController {
  constructor(private readonly service: PdfService) {}

  async list(req: Request, res: Response): Promise<void> {
    const filter = req.query as unknown as PdfFilter;
    const result = await this.service.getAll(filter, req.userId);
    res.status(HttpStatus.OK).json(result);
  }

  async listFeatured(req: Request, res: Response): Promise<void> {
    const data = await this.service.getFeatured(req.userId);
    res.status(HttpStatus.OK).json({ data });
  }

  async adminList(req: Request, res: Response): Promise<void> {
    const filter = req.query as unknown as PdfFilter;
    const result = await this.service.adminGetAll(filter);
    res.status(HttpStatus.OK).json(result);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const pdf = await this.service.getById(req.params.pdfId!, req.userId);
    res.status(HttpStatus.OK).json({ data: pdf });
  }

  async recordView(req: Request, res: Response): Promise<void> {
    await this.service.recordView(req.params.pdfId!);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async create(req: Request, res: Response): Promise<void> {
    const file = req.file;
    if (!file) throw new BadRequestError('PDF ফাইল আপলোড করুন');
    const input = parseFormBody(req.body) as CreatePdfInput;
    const pdf = await this.service.create(
      input,
      { buffer: file.buffer, originalName: file.originalname, sizeBytes: file.size },
      req.userId!,
    );
    res.status(HttpStatus.CREATED).json({ data: pdf });
  }

  async update(req: Request, res: Response): Promise<void> {
    const input = parseFormBody(req.body) as UpdatePdfInput;
    const file = req.file;
    const pdf = await this.service.update(
      req.params.pdfId!,
      input,
      file
        ? { buffer: file.buffer, originalName: file.originalname, sizeBytes: file.size }
        : undefined,
    );
    res.status(HttpStatus.OK).json({ data: pdf });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.service.delete(req.params.pdfId!);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async download(req: Request, res: Response): Promise<void> {
    const isAdmin = req.userRole === 'ADMIN';
    const { stream, fileName } = await this.service.getDownloadStream(
      req.params.pdfId!,
      req.userId,
      isAdmin,
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    stream.pipe(res);
  }

  async toggleLike(req: Request, res: Response): Promise<void> {
    const data = await this.service.toggleLike(req.params.pdfId!, req.userId!);
    res.status(HttpStatus.OK).json({ data });
  }

  async listComments(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const result = await this.service.getComments(req.params.pdfId!, page, limit);
    res.status(HttpStatus.OK).json(result);
  }

  async addComment(req: Request, res: Response): Promise<void> {
    const comment = await this.service.addComment(
      req.params.pdfId!,
      req.userId!,
      req.body as CreateCommentInput,
    );
    res.status(HttpStatus.CREATED).json({ data: comment });
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    const isAdmin = req.userRole === 'ADMIN';
    await this.service.deleteComment(req.params.commentId!, req.userId!, isAdmin);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async stats(_req: Request, res: Response): Promise<void> {
    const data = await this.service.getStats();
    res.status(HttpStatus.OK).json({ data });
  }
}
