import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import type { BroadcastLogService } from '../../domain/integration-credential.service.js';
import type {
  BroadcastLogFilter,
  CreateBroadcastLogInput,
  UpdateBroadcastLogInput,
} from '../../domain/types.js';

export class BroadcastLogController {
  constructor(private readonly service: BroadcastLogService) {}

  async list(req: Request, res: Response): Promise<void> {
    const filter = req.query as unknown as BroadcastLogFilter;
    res.status(HttpStatus.OK).json(await this.service.list(filter));
  }

  async create(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateBroadcastLogInput & { sentAt?: string };
    const createdBy = req.userId ?? body.createdBy;
    if (!createdBy) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'createdBy is required' });
      return;
    }

    const input: CreateBroadcastLogInput = {
      contentType: body.contentType,
      platforms: body.platforms,
      createdBy,
      ...(body.questionIds !== undefined && { questionIds: body.questionIds }),
      ...(body.questionSetId !== undefined && { questionSetId: body.questionSetId }),
      ...(body.pdfId !== undefined && { pdfId: body.pdfId }),
      ...(body.jobCircularIds !== undefined && { jobCircularIds: body.jobCircularIds }),
      ...(body.aiProvider !== undefined && { aiProvider: body.aiProvider }),
      ...(body.aiModel !== undefined && { aiModel: body.aiModel }),
      ...(body.contentText !== undefined && { contentText: body.contentText }),
      ...(body.mediaUrl !== undefined && { mediaUrl: body.mediaUrl }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.errorMessage !== undefined && { errorMessage: body.errorMessage }),
      ...(body.sentAt ? { sentAt: new Date(body.sentAt) } : {}),
    };

    res.status(HttpStatus.CREATED).json({ data: await this.service.create(input) });
  }

  async update(req: Request, res: Response): Promise<void> {
    const body = req.body as UpdateBroadcastLogInput & { sentAt?: string | null };
    const input: UpdateBroadcastLogInput = {
      ...(body.status !== undefined && { status: body.status }),
      ...(body.errorMessage !== undefined && { errorMessage: body.errorMessage }),
      ...(body.sentAt === null
        ? { sentAt: null }
        : body.sentAt
          ? { sentAt: new Date(body.sentAt) }
          : {}),
    };
    res.status(HttpStatus.OK).json({ data: await this.service.update(req.params.id!, input) });
  }
}
