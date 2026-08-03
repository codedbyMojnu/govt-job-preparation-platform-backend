import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import type { VideoService } from '../../domain/video.service.js';
import type { CreateCommentInput, CreateVideoInput, UpdateVideoInput, VideoFilter } from '../../domain/types.js';

export class VideoController {
  constructor(private readonly service: VideoService) {}

  async list(req: Request, res: Response): Promise<void> {
    const filter = req.query as unknown as VideoFilter;
    const userId = req.userId;
    const result = await this.service.getAll(filter, userId);
    res.status(HttpStatus.OK).json(result);
  }

  async listFeatured(_req: Request, res: Response): Promise<void> {
    const data = await this.service.getFeatured();
    res.status(HttpStatus.OK).json({ data });
  }

  async adminList(req: Request, res: Response): Promise<void> {
    const filter = req.query as unknown as VideoFilter;
    const result = await this.service.adminGetAll(filter);
    res.status(HttpStatus.OK).json(result);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const video = await this.service.getById(req.params.videoId!, req.userId);
    res.status(HttpStatus.OK).json({ data: video });
  }

  async recordView(req: Request, res: Response): Promise<void> {
    await this.service.recordView(req.params.videoId!);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async parseYoutube(req: Request, res: Response): Promise<void> {
    const { url } = req.body as { url: string };
    const data = this.service.parseYoutubeUrl(url);
    res.status(HttpStatus.OK).json({ data });
  }

  async create(req: Request, res: Response): Promise<void> {
    const video = await this.service.create(req.body as CreateVideoInput, req.userId!);
    res.status(HttpStatus.CREATED).json({ data: video });
  }

  async update(req: Request, res: Response): Promise<void> {
    const video = await this.service.update(req.params.videoId!, req.body as UpdateVideoInput);
    res.status(HttpStatus.OK).json({ data: video });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.service.delete(req.params.videoId!);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async toggleLike(req: Request, res: Response): Promise<void> {
    const data = await this.service.toggleLike(req.params.videoId!, req.userId!);
    res.status(HttpStatus.OK).json({ data });
  }

  async listComments(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const result = await this.service.getComments(req.params.videoId!, page, limit);
    res.status(HttpStatus.OK).json(result);
  }

  async addComment(req: Request, res: Response): Promise<void> {
    const comment = await this.service.addComment(
      req.params.videoId!,
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

  async importChannel(_req: Request, _res: Response): Promise<void> {
    this.service.importFromChannel();
  }

  async stats(_req: Request, res: Response): Promise<void> {
    const data = await this.service.getStats();
    res.status(HttpStatus.OK).json({ data });
  }
}
