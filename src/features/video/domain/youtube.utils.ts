import { BadRequestError } from '../../../shared/errors/http-errors.js';

import type { ParsedYoutubeUrl } from './types.js';

const YOUTUBE_ID_RE = /^[\w-]{11}$/;

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00A0',
  '#x2f': '/',
  '#x2F': '/',
  '#47': '/',
};

/** Undo XSS sanitizer encoding so URLs like https://... parse correctly. */
function decodeSanitizedUrl(raw: string): string {
  return raw.replace(/&(#x?[0-9a-fA-F]+|amp|lt|gt|quot|apos|nbsp);/g, (match, entity: string) => {
    const normalized = entity.toLowerCase();
    if (normalized in NAMED_ENTITIES) return NAMED_ENTITIES[normalized]!;
    if (normalized.startsWith('#x')) {
      const cp = Number.parseInt(normalized.slice(2), 16);
      return Number.isNaN(cp) ? match : String.fromCodePoint(cp);
    }
    if (normalized.startsWith('#')) {
      const cp = Number.parseInt(normalized.slice(1), 10);
      return Number.isNaN(cp) ? match : String.fromCodePoint(cp);
    }
    return match;
  });
}

export function extractYoutubeVideoId(url: string): string | null {
  const trimmed = decodeSanitizedUrl(url.trim());
  if (!trimmed) return null;

  if (YOUTUBE_ID_RE.test(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0];
      return id && YOUTUBE_ID_RE.test(id) ? id : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const v = parsed.searchParams.get('v');
      if (v && YOUTUBE_ID_RE.test(v)) return v;

      const parts = parsed.pathname.split('/').filter(Boolean);
      const embedIdx = parts.indexOf('embed');
      if (embedIdx >= 0 && parts[embedIdx + 1] && YOUTUBE_ID_RE.test(parts[embedIdx + 1]!)) {
        return parts[embedIdx + 1]!;
      }

      const shortsIdx = parts.indexOf('shorts');
      if (shortsIdx >= 0 && parts[shortsIdx + 1] && YOUTUBE_ID_RE.test(parts[shortsIdx + 1]!)) {
        return parts[shortsIdx + 1]!;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function buildYoutubeMetadata(videoId: string): ParsedYoutubeUrl {
  if (!YOUTUBE_ID_RE.test(videoId)) {
    throw new BadRequestError('Invalid YouTube video ID');
  }

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  return {
    youtubeVideoId: videoId,
    youtubeUrl,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
  };
}

export function parseYoutubeUrl(url: string): ParsedYoutubeUrl {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) {
    throw new BadRequestError('Could not parse YouTube URL — paste a valid watch or youtu.be link');
  }
  return buildYoutubeMetadata(videoId);
}

export function formatDuration(seconds: number | null | undefined): string | null {
  if (seconds == null || seconds <= 0) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}
