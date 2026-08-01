import { existsSync } from 'node:fs';
import path from 'node:path';

import { GlobalFonts } from '@napi-rs/canvas';

// Resolved from process.cwd() (backend/ root, both in `tsx` dev and the Docker worker's
// WORKDIR) rather than __dirname — tsup bundles src/ into a single flat dist file, so a
// source-relative "../../.." path would break once compiled.
const FONTS_DIR = path.join(process.cwd(), 'assets', 'fonts');

export const FONT_FAMILY = '"NotoSansBengali", "NotoSans", sans-serif';

let fontsRegistered = false;

// Idempotent + safe to call from both the worker boot and re-render code paths.
export function registerFonts(): void {
  if (fontsRegistered) return;

  const register = (file: string, family: string) => {
    const filePath = path.join(FONTS_DIR, file);
    if (existsSync(filePath)) GlobalFonts.registerFromPath(filePath, family);
  };

  register('NotoSansBengali-Regular.ttf', 'NotoSansBengali');
  register('NotoSansBengali-Bold.ttf', 'NotoSansBengali');
  register('NotoSans-Regular.ttf', 'NotoSans');
  register('NotoSans-Bold.ttf', 'NotoSans');

  fontsRegistered = true;
}
