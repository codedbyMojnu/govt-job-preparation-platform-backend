/**
 * AI Explanation Backfill — Farhan MCQ
 * ─────────────────────────────────────────────────────────────────────────────
 * Fills NULL explanation fields using Mistral AI (free tier).
 *
 * FIXES applied vs previous version:
 *   1. Progress numerator was double-counting (processed + done.size).
 *      Now correctly shows done.size as the running total.
 *   2. offset-based pagination broke when rows shift out of the
 *      WHERE explanation IS NULL result-set as they get filled.
 *      Replaced with skip:0 always + checkpoint guard (no offset needed).
 *   3. Checkpoint log message was a confusing no-op arithmetic expression.
 *      Now simply logs done.size.
 *   4. totalPending was fetched once and became stale mid-run.
 *      Now re-fetched each outer loop iteration so the denominator stays accurate.
 *
 * Run:
 *   MISTRAL_API_KEYS="key1,key2,key3" npx tsx --env-file=.env prisma/backfill-explanation-mistral-ai.ts
 *
 * Resume: delete prisma/explanation-progress.json to start fresh.
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ─── ES Module __dirname shim ─────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Configuration ────────────────────────────────────────────────────────────
const MISTRAL_MODEL = 'mistral-small-latest';
const MIN_GAP_MS = 1200;
const CHECKPOINT_EVERY = 50;
const MAX_TOKENS = 900;
const DB_BATCH_SIZE = 500;

const PROGRESS_FILE = path.join(__dirname, 'explanation-progress.json');
const ERROR_LOG_FILE = path.join(__dirname, 'explanation-errors.jsonl');

// ─── Utilities ────────────────────────────────────────────────────────────────

const prisma = new PrismaClient();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function logError(entry: Record<string, unknown>) {
  const line = JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n';
  fs.appendFileSync(ERROR_LOG_FILE, line, 'utf8');
}

function loadProgress(): Set<string> {
  if (!fs.existsSync(PROGRESS_FILE)) return new Set();
  try {
    const raw = fs.readFileSync(PROGRESS_FILE, 'utf8');
    const arr: string[] = JSON.parse(raw);
    console.log(`[RESUME] Loaded ${arr.length} already-processed IDs from checkpoint.`);
    return new Set(arr);
  } catch (e) {
    console.warn('[WARN] Could not parse progress file, starting fresh:', e);
    return new Set();
  }
}

function saveProgress(done: Set<string>) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify([...done]), 'utf8');
}

// ─── API Key Pool ─────────────────────────────────────────────────────────────

interface KeySlot {
  key: string;
  lastUsedAt: number;
  rateLimited: boolean;
  rateLimitedUntil: number;
  callCount: number;
}

function buildKeyPool(): KeySlot[] {
  const raw = process.env.MISTRAL_API_KEYS ?? process.env.MISTRAL_API_KEY ?? '';
  const keys = raw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  if (keys.length === 0) {
    console.error(
      '[FATAL] No API keys found.\nSet MISTRAL_API_KEYS="key1,key2,..." in your .env file.',
    );
    process.exit(1);
  }

  console.log(`[INFO] Loaded ${keys.length} API key(s).`);
  return keys.map((key) => ({
    key,
    lastUsedAt: 0,
    rateLimited: false,
    rateLimitedUntil: 0,
    callCount: 0,
  }));
}

async function acquireKey(pool: KeySlot[]): Promise<KeySlot> {
  while (true) {
    const now = Date.now();
    const available = pool.filter((s) => !s.rateLimited || s.rateLimitedUntil <= now);

    if (available.length === 0) {
      const soonest = Math.min(...pool.map((s) => s.rateLimitedUntil));
      const wait = Math.max(0, soonest - Date.now()) + 200;
      console.log(`[WAIT] All keys rate-limited. Sleeping ${(wait / 1000).toFixed(1)} s…`);
      await sleep(wait);
      for (const s of pool) {
        if (s.rateLimited && s.rateLimitedUntil <= Date.now()) {
          s.rateLimited = false;
          console.log(`[RECOVER] Key …${s.key.slice(-6)} back in pool.`);
        }
      }
      continue;
    }

    available.sort((a, b) => a.lastUsedAt - b.lastUsedAt);
    const slot = available[0];

    const elapsed = Date.now() - slot.lastUsedAt;
    if (elapsed < MIN_GAP_MS) await sleep(MIN_GAP_MS - elapsed);

    slot.lastUsedAt = Date.now();
    return slot;
  }
}

// ─── Mistral API Call ─────────────────────────────────────────────────────────

interface MistralMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

async function callMistral(
  slot: KeySlot,
  messages: MistralMessage[],
  retries = 3,
): Promise<string> {
  let backoff = 2000;

  for (let attempt = 1; attempt <= retries; attempt++) {
    let res: Response;
    try {
      res = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${slot.key}`,
        },
        body: JSON.stringify({
          model: MISTRAL_MODEL,
          max_tokens: MAX_TOKENS,
          temperature: 0.3,
          messages,
        }),
      });
    } catch (networkErr) {
      logError({
        type: 'NETWORK_ERROR',
        keyTail: slot.key.slice(-6),
        attempt,
        error: String(networkErr),
      });
      if (attempt < retries) {
        console.warn(`[RETRY] Network error attempt ${attempt}. Retrying in ${backoff / 1000}s…`);
        await sleep(backoff);
        backoff = Math.min(backoff * 2, 30000);
        continue;
      }
      throw new Error(`Network failure after ${retries} attempts: ${networkErr}`);
    }

    if (res.status === 429) {
      const retryAfter = parseInt(res.headers.get('Retry-After') ?? '0', 10);
      const banMs = retryAfter > 0 ? retryAfter * 1000 : backoff;
      slot.rateLimited = true;
      slot.rateLimitedUntil = Date.now() + banMs;
      logError({ type: 'RATE_LIMIT_429', keyTail: slot.key.slice(-6), banMs, attempt });
      console.warn(
        `[RATE_LIMIT] Key …${slot.key.slice(-6)} limited for ${(banMs / 1000).toFixed(0)}s.`,
      );
      throw Object.assign(new Error('RATE_LIMIT_429'), { isRateLimit: true });
    }

    if (res.status === 401 || res.status === 403) {
      logError({ type: 'AUTH_ERROR', keyTail: slot.key.slice(-6), status: res.status });
      slot.rateLimited = true;
      slot.rateLimitedUntil = Date.now() + 30 * 24 * 60 * 60 * 1000;
      throw new Error(`AUTH_ERROR_${res.status}: Key …${slot.key.slice(-6)} rejected.`);
    }

    if (res.status >= 500) {
      logError({ type: 'SERVER_ERROR', keyTail: slot.key.slice(-6), status: res.status, attempt });
      if (attempt < retries) {
        console.warn(
          `[RETRY] Server ${res.status} attempt ${attempt}. Retrying in ${backoff / 1000}s…`,
        );
        await sleep(backoff);
        backoff = Math.min(backoff * 2, 30000);
        continue;
      }
      throw new Error(`Server error ${res.status} after ${retries} attempts.`);
    }

    if (!res.ok) {
      const body2 = await res.text().catch(() => '');
      logError({ type: 'UNEXPECTED_HTTP', status: res.status, body: body2.slice(0, 300) });
      throw new Error(`Unexpected HTTP ${res.status}: ${body2.slice(0, 200)}`);
    }

    slot.callCount++;
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '';
    if (!content.trim()) {
      logError({ type: 'EMPTY_RESPONSE', keyTail: slot.key.slice(-6) });
      throw new Error('Empty response from Mistral.');
    }
    return content.trim();
  }

  throw new Error('callMistral: exhausted retries unexpectedly.');
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

const LETTER_TO_BENGALI: Record<string, string> = {
  A: 'ক',
  B: 'খ',
  C: 'গ',
  D: 'ঘ',
};

function buildPrompt(q: {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  subject?: string | null;
  topic?: string | null;
  subTopic?: string | null;
  examName?: string | null;
}): MistralMessage[] {
  const optionMap: Record<string, string> = {
    A: q.optionA,
    B: q.optionB,
    C: q.optionC,
    D: q.optionD,
  };
  const answerLetter = q.correctAnswer.toUpperCase();
  const correctText = optionMap[answerLetter] ?? q.correctAnswer;
  const bengaliLetter = LETTER_TO_BENGALI[answerLetter] ?? answerLetter;
  const wrongOptions = (['A', 'B', 'C', 'D'] as const).filter((l) => l !== answerLetter);
  const subjectContext = [q.subject, q.topic, q.subTopic].filter(Boolean).join(' > ');
  const examHint = q.examName
    ? `পরীক্ষা: ${q.examName}`
    : 'BCS, NTRCA, Bank, Primary পরীক্ষায় প্রাসঙ্গিক';

  return [
    {
      role: 'system',
      content: `তুমি বাংলাদেশের সরকারি চাকরির পরীক্ষার (BCS, Bank, Primary, NTRCA) একজন বিশেষজ্ঞ শিক্ষক ও কন্টেন্ট রাইটার।
তোমার কাজ প্রতিটি MCQ প্রশ্নের জন্য নিচের নির্দিষ্ট ফরম্যাটে বাংলায় বিস্তারিত ও সঠিক ব্যাখ্যা লেখা।

**আবশ্যিক ফরম্যাট (হুবহু অনুসরণ করতে হবে):**

সঠিক উত্তর: (বাংলা অপশন লেবেল) সঠিক উত্তরের টেক্সট

<বিষয়/টপিক সম্পর্কিত ১টি পরীক্ষা-প্রাসঙ্গিক ভূমিকা বাক্য>

<বিষয় বা ব্যক্তি বা ঘটনার নাম> সম্পর্কে বিস্তারিত তথ্য:
— <তথ্য ১>
— <তথ্য ২>
— <তথ্য ৩>
— <তথ্য ৪> (প্রয়োজনে আরও)

বিভ্রান্তিকর বিকল্প বিশ্লেষণ:
✗ <ভুল অপশন ১ টেক্সট>: <কেন ভুল, সংক্ষিপ্ত>
✗ <ভুল অপশন ২ টেক্সট>: <কেন ভুল, সংক্ষিপ্ত>
✗ <ভুল অপশন ৩ টেক্সট>: <কেন ভুল, সংক্ষিপ্ত>

উৎস: <প্রাসঙ্গিক বই, পরীক্ষার প্রশ্নব্যাংক উল্লেখ>

**নিয়ম:**
- সম্পূর্ণ বাংলায় লিখবে।
- তথ্য নির্ভুল হওয়া জরুরি — তোমার জ্ঞান থেকে সর্বোচ্চ সঠিক তথ্য দেবে।
- প্রতিটি তথ্যের ড্যাশ (—) ব্যবহার করবে, bullet নয়।
- "বিভ্রান্তিকর বিকল্প বিশ্লেষণ" সেকশনে শুধু ভুল অপশনগুলো থাকবে।
- উৎস সেকশনে ২-৩টি প্রাসঙ্গিক রেফারেন্স দেবে।
- অতিরিক্ত কোনো মন্তব্য বা ভূমিকা যোগ করবে না — শুধু ফরম্যাট অনুযায়ী ব্যাখ্যা দেবে।`,
    },
    {
      role: 'user',
      content:
        `বিষয়: ${subjectContext || 'সাধারণ জ্ঞান'}\n` +
        `${examHint}\n\n` +
        `প্রশ্ন: ${q.questionText}\n\n` +
        `ক) ${q.optionA}\n` +
        `খ) ${q.optionB}\n` +
        `গ) ${q.optionC}\n` +
        `ঘ) ${q.optionD}\n\n` +
        `সঠিক উত্তর: (${bengaliLetter}) ${correctText}\n\n` +
        `ভুল অপশনগুলো:\n` +
        wrongOptions.map((l) => `✗ ${LETTER_TO_BENGALI[l]}) ${optionMap[l]}`).join('\n') +
        `\n\nউপরের ফরম্যাট অনুযায়ী বিস্তারিত ব্যাখ্যা লিখুন। তথ্য নির্ভুল ও বিস্তারিত দিন।`,
    },
  ];
}

// ─── Per-question processor ───────────────────────────────────────────────────

async function processQuestion(
  q: {
    id: string;
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
    subject?: string | null;
    topic?: string | null;
    subTopic?: string | null;
    examName?: string | null;
  },
  pool: KeySlot[],
  maxAttempts = 5,
): Promise<string | null> {
  const messages = buildPrompt(q);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const slot = await acquireKey(pool);
    try {
      const explanation = await callMistral(slot, messages);

      if (!/[\u0980-\u09FF]/.test(explanation)) {
        logError({
          type: 'SEMANTIC_NOT_BENGALI',
          id: q.id,
          explanation: explanation.slice(0, 100),
        });
        throw new Error('Explanation contains no Bengali text.');
      }
      if (explanation.length < 150) {
        logError({ type: 'SEMANTIC_TOO_SHORT', id: q.id, length: explanation.length });
        throw new Error(`Explanation too short (${explanation.length} chars).`);
      }
      if (!explanation.includes('সঠিক উত্তর')) {
        logError({ type: 'SEMANTIC_MISSING_HEADER', id: q.id, preview: explanation.slice(0, 120) });
        throw new Error('Explanation missing "সঠিক উত্তর" header — format not followed.');
      }

      return explanation;
    } catch (err: unknown) {
      const isRateLimit =
        err instanceof Error &&
        (err as NodeJS.ErrnoException & { isRateLimit?: boolean }).isRateLimit;
      if (isRateLimit && attempt < maxAttempts) {
        console.log(
          `[SKIP_KEY] Rate-limited, trying another key (attempt ${attempt}/${maxAttempts})…`,
        );
        continue;
      }
      logError({ type: 'FINAL_FAILURE', id: q.id, attempt, error: String(err) });
      console.error(`[ERROR] Question ${q.id} failed after ${attempt} attempt(s): ${err}`);
      return null;
    }
  }

  logError({ type: 'MAX_ATTEMPTS_EXCEEDED', id: q.id });
  return null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═'.repeat(60));
  console.log('  Farhan MCQ — AI Explanation Backfill');
  console.log('  Model:', MISTRAL_MODEL);
  console.log('  Started:', new Date().toLocaleString('bn-BD'));
  console.log('═'.repeat(60));

  const pool = buildKeyPool();
  const done = loadProgress();

  // ── FIX 4: Re-fetch totalPending each outer loop so denominator stays accurate ──
  let totalPending = await prisma.question.count({ where: { explanation: null } });
  console.log(`[INFO] Questions with null explanation: ${totalPending}`);
  console.log(`[INFO] Already processed (from checkpoint): ${done.size}`);

  let processed = 0; // processed THIS run only
  let succeeded = 0;
  let failed = 0;

  while (true) {
    // ── FIX 2: No offset — always fetch from top of null rows.
    //    The done.has() guard below skips already-processed IDs instantly.
    //    When every remaining null row is in `done`, batch comes back empty → break.
    const batch = await prisma.question.findMany({
      select: {
        id: true,
        questionText: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        correctAnswer: true,
        subject: true,
        topic: true,
        subTopic: true,
        examName: true,
      },
      where: { explanation: null },
      orderBy: { createdAt: 'asc' },
      take: DB_BATCH_SIZE,
      // no skip — see FIX 2
    });

    if (batch.length === 0) break;

    // Check if all rows in this batch are already done (means we're truly finished)
    const newInBatch = batch.filter((q) => !done.has(q.id));
    if (newInBatch.length === 0) break;

    for (const q of batch) {
      if (done.has(q.id)) continue;

      // ── FIX 1: Progress numerator is now just done.size (not processed + done.size) ──
      process.stdout.write(
        `\r[PROGRESS] ${done.size}/${totalPending} | ✓ ${succeeded} | ✗ ${failed} | Key calls: ${pool.reduce((s, k) => s + k.callCount, 0)}   `,
      );

      const explanation = await processQuestion(q, pool);

      if (explanation) {
        await prisma.question.update({
          where: { id: q.id },
          data: { explanation },
        });
        succeeded++;
      } else {
        failed++;
      }

      done.add(q.id);
      processed++;

      if (processed % CHECKPOINT_EVERY === 0) {
        saveProgress(done);
        // ── FIX 3: Clean, accurate checkpoint log ──
        // ── FIX 4: Refresh totalPending so denominator tracks reality ──
        totalPending = await prisma.question.count({ where: { explanation: null } });
        console.log(
          `\n[CHECKPOINT] ${done.size} total processed | ${totalPending} still pending | ` +
            `Keys: ${pool.map((k) => `…${k.key.slice(-6)}:${k.callCount}`).join(', ')}`,
        );
      }
    }
  }

  saveProgress(done);
  console.log('\n' + '═'.repeat(60));
  console.log(`  Done! Processed this run: ${processed}`);
  console.log(`  Succeeded: ${succeeded}`);
  console.log(`  Failed:    ${failed}`);
  console.log(`  Error log: ${ERROR_LOG_FILE}`);
  console.log(
    `  Key usage: ${pool.map((k) => `Key…${k.key.slice(-6)}: ${k.callCount} calls`).join(', ')}`,
  );
  console.log('═'.repeat(60));
}

main()
  .catch((err) => {
    console.error('[FATAL] Backfill crashed:', err);
    logError({ type: 'FATAL_CRASH', error: String(err) });
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
