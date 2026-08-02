import { z } from 'zod';

const bgGradientStopSchema = z.object({
  color: z.string().min(1).max(64),
  offset: z.number().min(0).max(1),
});

const bgGradientSchema = z.object({
  type: z.enum(['linear', 'radial']),
  angle: z.number().min(0).max(360).optional(),
  stops: z.array(bgGradientStopSchema).min(2).max(6),
});

export const styleConfigSchema = z.object({
  mode: z.enum(['GROUPED', 'SINGLE']),
  questionsPerSlide: z.number().int().min(1).max(10),
  slideWidth: z.number().int().min(200).max(4000),
  slideHeight: z.number().int().min(200).max(4000),
  bgColor: z.string().max(64).nullable().default(null),
  bgGradient: bgGradientSchema.nullable().default(null),
  textColor: z.string().min(1).max(64),
  textSize: z.number().int().min(10).max(80),
  showOptions: z.boolean(),
  showAnswer: z.boolean(),
  showExplanation: z.boolean(),
});

export const generateSlidesSchema = z.object({
  questionSetId: z.string().min(1, 'questionSetId is required'),
  styleConfig: styleConfigSchema,
});

const sceneNodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['rect', 'text', 'circle', 'line']),
  x: z.number(),
  y: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  radius: z.number().optional(),
  cornerRadius: z.number().optional(),
  fill: z.string().max(128).optional(),
  stroke: z.string().max(128).optional(),
  strokeWidth: z.number().optional(),
  dash: z.array(z.number()).optional(),
  points: z.array(z.number()).optional(),
  text: z.string().max(4000).optional(),
  fontSize: z.number().optional(),
  fontFamily: z.string().max(200).optional(),
  fontStyle: z.enum(['normal', 'bold']).optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  lineHeight: z.number().optional(),
});

export const sceneSchema = z.object({
  // Composed slide heights are float (line-height math), not integer pixels.
  width: z.number().min(1).max(8000),
  height: z.number().min(1).max(8000),
  background: z.object({
    color: z.string().max(64).nullable().optional(),
    gradient: bgGradientSchema.nullable().optional(),
  }),
  nodes: z.array(sceneNodeSchema).max(500),
});

export const reRenderSchema = z.object({
  sceneJson: sceneSchema.optional(),
});

export const patchSceneSchema = z.object({
  sceneJson: sceneSchema,
});

export const jobIdParamsSchema = z.object({
  jobId: z.string().min(1),
});

export const slideIdParamsSchema = z.object({
  slideId: z.string().min(1),
});

export const questionSetIdParamsSchema = z.object({
  questionSetId: z.string().min(1),
});

export const zipQuerySchema = z.object({
  styleConfigId: z.string().min(1).optional(),
});
