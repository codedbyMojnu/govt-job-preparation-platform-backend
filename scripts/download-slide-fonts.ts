import { existsSync, mkdirSync } from 'node:fs';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const FONTS_DIR = path.join(process.cwd(), 'assets', 'fonts');

const FONT_URLS: Record<string, string> = {
  'NotoSansBengali-Regular.ttf':
    'https://github.com/notofonts/noto-fonts/raw/main/hinted/ttf/NotoSansBengali/NotoSansBengali-Regular.ttf',
  'NotoSansBengali-Bold.ttf':
    'https://github.com/notofonts/noto-fonts/raw/main/hinted/ttf/NotoSansBengali/NotoSansBengali-Bold.ttf',
  'NotoSans-Regular.ttf':
    'https://github.com/notofonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf',
  'NotoSans-Bold.ttf':
    'https://github.com/notofonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Bold.ttf',
};

async function download(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok || !res.body) {
    throw new Error(`Failed to download ${url}: ${res.status}`);
  }
  await pipeline(Readable.fromWeb(res.body as import('node:stream/web').ReadableStream), createWriteStream(dest));
}

async function main() {
  mkdirSync(FONTS_DIR, { recursive: true });
  for (const [file, url] of Object.entries(FONT_URLS)) {
    const dest = path.join(FONTS_DIR, file);
    if (existsSync(dest)) {
      console.log(`skip ${file} (exists)`);
      continue;
    }
    console.log(`download ${file}...`);
    await download(url, dest);
  }
  console.log('Fonts ready in', FONTS_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
