import { existsSync } from 'node:fs';
import path from 'node:path';

import { GlobalFonts } from '@napi-rs/canvas';

/** Search order: backend/assets/fonts, backend/fonts, repo-root/fonts */
const FONT_DIRS = [
  path.join(process.cwd(), 'assets', 'fonts'),
  path.join(process.cwd(), 'fonts'),
  path.join(process.cwd(), '..', 'fonts'),
];

/** Registered family for Bengali script glyphs. */
export const FONT_FAMILY_BENGALI = 'NotoSansBengali';

/** Registered family for Latin, digits, and symbols (✓ ✗ etc.). */
export const FONT_FAMILY_LATIN = 'NotoSans';

/** @deprecated Use font-runs helpers — kept for scene node metadata. */
export const FONT_FAMILY = FONT_FAMILY_BENGALI;

const FONT_FILES: Array<{ file: string; family: string; weight?: 'normal' | 'bold' }> = [
  { file: 'NotoSansBengali-Regular.ttf', family: FONT_FAMILY_BENGALI, weight: 'normal' },
  { file: 'NotoSansBengali-Bold.ttf', family: FONT_FAMILY_BENGALI, weight: 'bold' },
  { file: 'NotoSans-Regular.ttf', family: FONT_FAMILY_LATIN, weight: 'normal' },
  { file: 'NotoSans-Bold.ttf', family: FONT_FAMILY_LATIN, weight: 'bold' },
];

let fontsRegistered = false;

function resolveFontPath(file: string): string | null {
  for (const dir of FONT_DIRS) {
    const filePath = path.join(dir, file);
    if (existsSync(filePath)) return filePath;
  }
  return null;
}

/** Canvas cannot parse CSS font stacks — scene nodes store the Bengali family tag only. */
export function sanitizeFontFamily(_fontFamily?: string | null): string {
  return FONT_FAMILY_BENGALI;
}

export function registerFonts(): void {
  if (fontsRegistered) return;

  let registered = 0;
  for (const { file, family } of FONT_FILES) {
    const filePath = resolveFontPath(file);
    if (filePath) {
      GlobalFonts.registerFromPath(filePath, family);
      registered++;
    }
  }

  if (registered === 0) {
    process.stderr.write(
      JSON.stringify({
        level: 'warn',
        msg: 'No slide fonts found — add TTF files to backend/assets/fonts (npm run fonts:slides)',
        dirs: FONT_DIRS,
      }) + '\n',
    );
  }

  fontsRegistered = true;
}
