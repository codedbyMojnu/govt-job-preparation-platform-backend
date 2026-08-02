import { createCanvas, type SKRSContext2D } from '@napi-rs/canvas';

import { decodeHtmlEntities } from './html-decode.js';
import {
  fillMixedText,
  measureMixedTextWidth,
  type FontWeight,
} from './font-runs.js';
import { registerFonts } from './fonts.js';
import { normalizeSceneForRender } from './normalize-scene.js';
import type { BgGradient, Scene, SceneNode } from './types.js';

function applyBackground(ctx: SKRSContext2D, scene: Scene) {
  const { color, gradient } = scene.background;

  if (gradient) {
    ctx.fillStyle = createGradientFill(ctx, scene.width, scene.height, gradient);
  } else {
    ctx.fillStyle = color ?? '#ffffff';
  }
  ctx.fillRect(0, 0, scene.width, scene.height);
}

function createGradientFill(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  gradient: BgGradient,
) {
  const grad =
    gradient.type === 'radial'
      ? ctx.createRadialGradient(
          width / 2,
          height / 2,
          0,
          width / 2,
          height / 2,
          Math.max(width, height) / 2,
        )
      : createLinearGradient(ctx, width, height, gradient.angle ?? 135);

  for (const stop of gradient.stops) {
    grad.addColorStop(stop.offset, stop.color);
  }
  return grad;
}

function createLinearGradient(ctx: SKRSContext2D, width: number, height: number, angleDeg: number) {
  const angle = (angleDeg * Math.PI) / 180;
  const x = (Math.cos(angle) * width) / 2;
  const y = (Math.sin(angle) * height) / 2;
  return ctx.createLinearGradient(width / 2 - x, height / 2 - y, width / 2 + x, height / 2 + y);
}

function drawNode(ctx: SKRSContext2D, node: SceneNode) {
  switch (node.type) {
    case 'rect':
      drawRect(ctx, node);
      break;
    case 'circle':
      drawCircle(ctx, node);
      break;
    case 'line':
      drawLine(ctx, node);
      break;
    case 'text':
      drawText(ctx, node);
      break;
  }
}

function drawRect(ctx: SKRSContext2D, node: SceneNode) {
  const w = node.width ?? 0;
  const h = node.height ?? 0;
  ctx.beginPath();
  if (node.cornerRadius) {
    ctx.roundRect(node.x, node.y, w, h, node.cornerRadius);
  } else {
    ctx.rect(node.x, node.y, w, h);
  }
  if (node.fill) {
    ctx.fillStyle = node.fill;
    ctx.fill();
  }
  if (node.stroke) {
    ctx.strokeStyle = node.stroke;
    ctx.lineWidth = node.strokeWidth ?? 1;
    ctx.stroke();
  }
}

function drawCircle(ctx: SKRSContext2D, node: SceneNode) {
  ctx.beginPath();
  ctx.arc(node.x, node.y, node.radius ?? 0, 0, Math.PI * 2);
  if (node.fill) {
    ctx.fillStyle = node.fill;
    ctx.fill();
  }
  if (node.stroke) {
    ctx.strokeStyle = node.stroke;
    ctx.lineWidth = node.strokeWidth ?? 1;
    ctx.stroke();
  }
}

function drawLine(ctx: SKRSContext2D, node: SceneNode) {
  const points = node.points ?? [];
  if (points.length < 4) return;
  ctx.beginPath();
  ctx.setLineDash(node.dash ?? []);
  const [startX, startY] = points;
  ctx.moveTo(startX ?? 0, startY ?? 0);
  for (let i = 2; i < points.length; i += 2) {
    ctx.lineTo(points[i] ?? 0, points[i + 1] ?? 0);
  }
  ctx.strokeStyle = node.stroke ?? '#000000';
  ctx.lineWidth = node.strokeWidth ?? 1;
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawText(ctx: SKRSContext2D, node: SceneNode) {
  const fontSize = node.fontSize ?? 16;
  const weight: FontWeight = node.fontStyle === 'bold' ? 'bold' : 'normal';
  ctx.fillStyle = node.fill ?? '#000000';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  const lines = decodeHtmlEntities(node.text ?? '').split('\n');
  const lineHeight = node.lineHeight ?? fontSize * 1.4;
  const align = node.align ?? 'left';

  lines.forEach((line, i) => {
    const y = node.y + i * lineHeight;
    const lineWidth = measureMixedTextWidth(ctx, line, weight, fontSize);
    let x = node.x;
    if (align === 'center') x -= lineWidth / 2;
    else if (align === 'right') x -= lineWidth;
    fillMixedText(ctx, line, x, y, weight, fontSize);
  });
}

// The single rendering codepath for both initial generation and post-edit re-render (Phase 7):
// paints whatever scene JSON it's given, whether freshly composed or edited by a member.
// Ensures Bengali glyphs render on every path (initial worker job + API re-render after edits).
export async function renderSceneToPng(scene: Scene): Promise<Buffer> {
  registerFonts();
  const normalized = normalizeSceneForRender(scene);

  const canvas = createCanvas(normalized.width, normalized.height);
  const ctx = canvas.getContext('2d');

  applyBackground(ctx, normalized);
  for (const node of normalized.nodes) {
    drawNode(ctx, node);
  }

  return canvas.encode('png');
}

// Exposed for measurement passes in the scene composers (grouped.ts / single.ts).
export function createMeasurementContext(): SKRSContext2D {
  registerFonts();
  const canvas = createCanvas(10, 10);
  return canvas.getContext('2d');
}
