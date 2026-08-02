import { ZipArchive } from 'archiver';
import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import { BadRequestError } from '../../../../shared/errors/http-errors.js';
import type { SlideService } from '../../domain/slide.service.js';
import type { GenerateSlidesInput } from '../../domain/types.js';
import type { Scene } from '../../domain/render/types.js';

export class SlideController {
  constructor(private readonly service: SlideService) {}

  async generate(req: Request, res: Response): Promise<void> {
    const userId = req.userId!;
    const input = req.body as GenerateSlidesInput;
    const result = await this.service.generate(userId, input);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async getJobStatus(req: Request, res: Response): Promise<void> {
    const jobId = req.params.jobId!;
    const result = await this.service.getJobStatus(jobId);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async listByQuestionSet(req: Request, res: Response): Promise<void> {
    const questionSetId = req.params.questionSetId!;
    const result = await this.service.listSlidesForQuestionSet(questionSetId);
    res.status(HttpStatus.OK).json({ data: result });
  }

  async patchScene(req: Request, res: Response): Promise<void> {
    const slideId = req.params.slideId!;
    const { sceneJson } = req.body;
    const slide = await this.service.patchSlideScene(slideId, sceneJson);
    res.status(HttpStatus.OK).json({ data: slide });
  }

  async reRender(req: Request, res: Response): Promise<void> {
    const slideId = req.params.slideId!;
    const body = req.body as { sceneJson?: Scene };
    const slide = body.sceneJson
      ? await this.service.saveEditsAndReRender(slideId, body.sceneJson)
      : await this.service.reRenderSlide(slideId);
    res.status(HttpStatus.OK).json({ data: slide });
  }

  async uploadImage(req: Request, res: Response): Promise<void> {
    const slideId = req.params.slideId!;
    const file = req.file;
    if (!file) {
      throw new BadRequestError('No image file uploaded');
    }
    const result = await this.service.uploadSlideImage(slideId, {
      buffer: file.buffer,
      mimetype: file.mimetype,
    });
    res.status(HttpStatus.OK).json({ data: result });
  }

  async download(req: Request, res: Response): Promise<void> {
    const slideId = req.params.slideId!;
    const { slide, stream } = await this.service.getSlideForDownload(slideId);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${String(slide.order).padStart(4, '0')}.png"`,
    );
    stream.pipe(res);
  }

  async zip(req: Request, res: Response): Promise<void> {
    const questionSetId = req.params.questionSetId!;
    const styleConfigId = req.query.styleConfigId as string | undefined;
    const slides = await this.service.getSlidesForZip(questionSetId, styleConfigId);

    if (slides.length === 0) {
      res.status(HttpStatus.OK).json({ data: [] });
      return;
    }

    const storage = this.service.getStorage();
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${questionSetId}-slides.zip"`);

    const archive = new ZipArchive({ zlib: { level: 9 } });
    // Headers/bytes may already be flowing by the time this fires — can't send a JSON error at
    // that point, so just abort the connection rather than throwing into the event loop.
    archive.on('error', (err: Error) => {
      res.destroy(err);
    });
    archive.pipe(res);

    for (const slide of slides) {
      const stream = await storage.getObjectStream(slide.imageUrl);
      archive.append(stream, { name: `${String(slide.order).padStart(4, '0')}.png` });
    }

    await archive.finalize();
  }
}
