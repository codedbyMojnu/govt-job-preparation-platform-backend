import { ZipArchive } from 'archiver';
import type { Request, Response } from 'express';

import { HttpStatus } from '../../../../shared/constants/http-status.js';
import { BadRequestError, NotFoundError } from '../../../../shared/errors/http-errors.js';
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

  async deleteByQuestionSet(req: Request, res: Response): Promise<void> {
    const questionSetId = req.params.questionSetId!;
    const result = await this.service.deleteAllSlidesForQuestionSet(questionSetId);
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
      throw new NotFoundError('No slides found to download');
    }

    const storage = this.service.getStorage();
    const entries: Array<{ name: string; stream: Awaited<ReturnType<typeof storage.getObjectStream>> }> =
      [];

    for (const slide of slides) {
      try {
        const stream = await storage.getObjectStream(slide.imageUrl);
        entries.push({
          name: `${String(slide.order).padStart(4, '0')}.png`,
          stream,
        });
      } catch {
        throw new NotFoundError(`Slide image missing for order ${slide.order}`);
      }
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${questionSetId}-slides.zip"`);

    const archive = new ZipArchive({ zlib: { level: 9 } });
    archive.on('error', (err: Error) => {
      res.destroy(err);
    });
    archive.pipe(res);

    for (const entry of entries) {
      archive.append(entry.stream, { name: entry.name });
    }

    await archive.finalize();
  }
}
