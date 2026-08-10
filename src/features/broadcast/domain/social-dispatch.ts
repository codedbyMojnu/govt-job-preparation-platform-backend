const FB_API_VERSION = 'v19.0';
const FB_BASE = `https://graph.facebook.com/${FB_API_VERSION}`;

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export interface FacebookConfig {
  pageId: string;
  pageAccessToken: string;
}

export type BroadcastPlatformName =
  | 'TELEGRAM_GROUP'
  | 'TELEGRAM_CHANNEL'
  | 'FACEBOOK_PAGE'
  | 'WHATSAPP';

export interface PublicQuestionPayload {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  examCategoryName: string;
  subExamCategoryName: string;
}

function escHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function buildTelegramQuestionCaption(q: PublicQuestionPayload): string {
  const tag = `#${q.subExamCategoryName.replace(/\s+/g, '_')}`;
  const examTag = `#${q.examCategoryName.replace(/\s+/g, '_')}`;
  const correctLetter =
    q.correctAnswer === 'A'
      ? 'ক'
      : q.correctAnswer === 'B'
        ? 'খ'
        : q.correctAnswer === 'C'
          ? 'গ'
          : 'ঘ';
  const correctKey = `option${q.correctAnswer}` as keyof PublicQuestionPayload;
  const correctText = q[correctKey] as string;

  const options = [
    `(ক) ${escHtml(q.optionA)}`,
    `(খ) ${escHtml(q.optionB)}`,
    `(গ) ${escHtml(q.optionC)}`,
    `(ঘ) ${escHtml(q.optionD)}`,
  ].join('\n');

  return [
    `আজকের প্রশ্ন — <b>${escHtml(q.examCategoryName)}</b>`,
    `${tag} ${examTag}`,
    '',
    `<b>${escHtml(q.questionText)}</b>`,
    '',
    options,
    '',
    `সঠিক উত্তর: <b>(${correctLetter}) ${escHtml(correctText)}</b>`,
    '',
    'প্র্যাকটিস করতে থাকো!',
    '',
    '#FarhanMCQ',
  ].join('\n');
}

export function buildFacebookQuestionCaption(q: PublicQuestionPayload): string {
  const tag = `#${q.subExamCategoryName.replace(/\s+/g, '_')}`;
  const examTag = `#${q.examCategoryName.replace(/\s+/g, '_')}`;
  const correctLetter =
    q.correctAnswer === 'A'
      ? 'ক'
      : q.correctAnswer === 'B'
        ? 'খ'
        : q.correctAnswer === 'C'
          ? 'গ'
          : 'ঘ';
  const correctKey = `option${q.correctAnswer}` as keyof PublicQuestionPayload;
  const correctText = q[correctKey] as string;

  return [
    `আজকের প্রশ্ন — ${q.examCategoryName} পরীক্ষার জন্য!`,
    '',
    q.questionText,
    '',
    `(ক) ${q.optionA}`,
    `(খ) ${q.optionB}`,
    `(গ) ${q.optionC}`,
    `(ঘ) ${q.optionD}`,
    '',
    `সঠিক উত্তর: (${correctLetter}) ${correctText}`,
    '',
    'প্র্যাকটিস করতে থাকো, সাফল্য আসবেই!',
    '',
    `${tag} ${examTag} #FarhanMCQ #MCQ #BCS_প্রস্তুতি`,
  ].join('\n');
}

async function telegramApi<T>(
  botToken: string,
  method: string,
  body: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok: boolean; description?: string; result?: T };
  if (!json.ok) {
    throw new Error(json.description || `Telegram ${method} failed`);
  }
  return json.result as T;
}

export async function sendTelegramHtmlMessage(
  config: TelegramConfig,
  html: string,
): Promise<string> {
  const result = await telegramApi<{ message_id: number }>(config.botToken, 'sendMessage', {
    chat_id: config.chatId,
    text: html,
    parse_mode: 'HTML',
  });
  return String(result.message_id);
}

export async function sendFacebookTextMessage(
  config: FacebookConfig,
  message: string,
): Promise<string> {
  const url = new URL(`${FB_BASE}/${config.pageId}/feed`);
  url.searchParams.set('access_token', config.pageAccessToken);
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  const json = (await res.json()) as { id?: string; error?: { message: string } };
  if (!res.ok || json.error) {
    throw new Error(json.error?.message || `Facebook post failed (${res.status})`);
  }
  return json.id ?? '';
}

export async function sendQuestionToPlatform(
  platform: BroadcastPlatformName,
  config: TelegramConfig | FacebookConfig,
  question: PublicQuestionPayload,
): Promise<string> {
  if (platform === 'FACEBOOK_PAGE') {
    return sendFacebookTextMessage(
      config as FacebookConfig,
      buildFacebookQuestionCaption(question),
    );
  }
  return sendTelegramHtmlMessage(
    config as TelegramConfig,
    buildTelegramQuestionCaption(question),
  );
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
