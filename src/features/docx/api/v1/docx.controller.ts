import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import type { DocxService } from '../../domain/docx.service.js';
import type { GenerateDocxInput } from '../../domain/types.js';

export class DocxController {
  constructor(private readonly service: DocxService) {}

  async generate(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const input = req.body as GenerateDocxInput;
    const result = await this.service.generate(userId, input);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async getJobStatus(req: Request, res: Response): Promise<void> {
    const jobId = req.params.jobId!;
    const result = await this.service.getJobStatus(jobId);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async getExport(req: Request, res: Response): Promise<void> {
    const documentId = req.params.documentId!;
    const result = await this.service.getExport(documentId);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async deleteExport(req: Request, res: Response): Promise<void> {
    const documentId = req.params.documentId!;
    const result = await this.service.deleteExport(documentId);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async download(req: Request, res: Response): Promise<void> {
    const documentId = req.params.documentId!;
    const { document, stream } = await this.service.getDocumentForDownload(documentId);
    const filename =
      document.setCount === 1
        ? `${document.questionSetIds[0]}-questions.docx`
        : `farhan-mcq-${document.setCount}-sets.docx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    stream.pipe(res);
  }
}
