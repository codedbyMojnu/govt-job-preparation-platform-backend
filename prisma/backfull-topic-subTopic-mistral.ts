/**
 * AI Subject / Topic Backfill — Farhan MCQ
 * ─────────────────────────────────────────────────────────────────────────────
 * Fills `subject` + `topic` ONLY (no sub_topic — dropped per updated requirement).
 *
 * Key design change vs the previous topic/sub_topic script:
 *   - Classification is now CLOSED-VOCABULARY, not free-form. Exam type
 *     (BCS / NTRCA) is detected from the related QuestionSet's name, and the
 *     AI must pick both `subject` and `topic` from the fixed official syllabus
 *     list for that exam type — it cannot invent new subject/topic strings.
 *   - This directly fixes the earlier bug where `topic` sometimes duplicated
 *     `subject` (free-form generation had no guardrail against that).
 *   - Exam types with no defined taxonomy yet (Bank, Primary, সমাজসেবা, etc.)
 *     are SKIPPED and logged, rather than guessed — safer than inventing a
 *     taxonomy for something we haven't been given a syllabus for.
 *
 * PRE-REQ: run prisma/reset-topic-subtopic.ts first so `topic` is NULL for
 * every row you want re-classified.
 *
 *
 * Run:
 *   MISTRAL_API_KEYS="key1,key2,key3" npx tsx --env-file=.env prisma/backfill-subject-topic-mistral-ai.ts
 *
 * Resume: delete prisma/subject-topic-progress.json to start fresh.
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Configuration ────────────────────────────────────────────────────────────
const MISTRAL_MODEL = 'mistral-small-latest';
const MIN_GAP_MS = 1200;
const CHECKPOINT_EVERY = 50;
const MAX_TOKENS = 150;
const DB_BATCH_SIZE = 500;

const PROGRESS_FILE = path.join(__dirname, 'subject-topic-progress.json');
const ERROR_LOG_FILE = path.join(__dirname, 'subject-topic-errors.jsonl');

const prisma = new PrismaClient();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function logError(entry: Record<string, unknown>) {
  fs.appendFileSync(
    ERROR_LOG_FILE,
    JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n',
    'utf8',
  );
}

function loadProgress(): Set<string> {
  if (!fs.existsSync(PROGRESS_FILE)) return new Set();
  try {
    const arr: string[] = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Fixed taxonomy — subject → allowed topics (closed vocabulary)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type Taxonomy = Record<string, string[]>;

// Official BCS Preliminary syllabus (১০ subject, মোট ২০০ marks)
const BCS_TAXONOMY: Taxonomy = {
  'বাংলা ভাষা ও সাহিত্য': [
    'প্রয়োগ-অপপ্রয়োগ',
    'বানান ও বাক্যশুদ্ধি',
    'পরিভাষা',
    'সমার্থক শব্দ',
    'বিপরীত শব্দ',
    'ধ্বনি ও বর্ণ',
    'শব্দ',
    'পদ',
    'বাক্য',
    'প্রত্যয়',
    'সন্ধি',
    'সমাস',
    'সাহিত্য: প্রাচীন যুগ',
    'সাহিত্য: মধ্যযুগ',
    'সাহিত্য: আধুনিক যুগ',
  ],
  'English Language and Literature': [
    'Parts of Speech',
    'Idioms & Phrases',
    'Clauses',
    'Corrections',
    'Sentences & Transformations',
    'Words',
    'Composition',
    'English Literature',
  ],
  'বাংলাদেশ বিষয়াবলি': [
    'বাংলাদেশের জাতীয় বিষয়াবলি (ইতিহাস ও মুক্তিযুদ্ধ)',
    'বাংলাদেশের কৃষিজ সম্পদ',
    'বাংলাদেশের জনসংখ্যা',
    'বাংলাদেশের অর্থনীতি',
    'বাংলাদেশের শিল্প ও বাণিজ্য',
    'বাংলাদেশের সংবিধান',
    'বাংলাদেশের রাজনৈতিক ব্যবস্থা',
    'বাংলাদেশের সরকার ব্যবস্থা',
    'বাংলাদেশের জাতীয় অর্জন',
  ],
  'আন্তর্জাতিক বিষয়াবলি': [
    'বৈশ্বিক ইতিহাস',
    'আঞ্চলিক ও আন্তর্জাতিক ব্যবস্থা',
    'ভূ-রাজনীতি',
    'আন্তর্জাতিক নিরাপত্তা ও আন্তরাষ্ট্রীয় ক্ষমতা সম্পর্ক',
    'বিশ্বের সাম্প্রতিক ও চলমান ঘটনা প্রবাহ',
    'আন্তর্জাতিক পরিবেশগত ইস্যু ও কূটনীতি',
    'আন্তর্জাতিক সংগঠনসমূহ ও বৈশ্বিক অর্থনৈতিক প্রতিষ্ঠানাদি',
  ],
  'সাধারণ বিজ্ঞান': ['ভৌত বিজ্ঞান', 'জীববিজ্ঞান', 'আধুনিক বিজ্ঞান'],
  'কম্পিউটার ও তথ্যপ্রযুক্তি': ['কম্পিউটার', 'তথ্যপ্রযুক্তি'],
  'গাণিতিক যুক্তি': ['পাটিগণিত', 'বীজগণিত', 'জ্যামিতি', 'বিচ্ছিন্নগণিত'],
  'মানসিক দক্ষতা': [
    'ভাষাগত যৌক্তিক বিচার (Verbal Reasoning)',
    'সমস্যা সমাধান (Problem Solving)',
    'বানান ও ভাষা (Spelling and Language)',
    'যান্ত্রিক দক্ষতা (Mechanical Reasoning)',
    'স্থানাংক সম্পর্ক (Space Relation)',
    'সংখ্যাগত ক্ষমতা (Numerical Ability)',
  ],
  'নৈতিকতা, মূল্যবোধ ও সুশাসন': [
    'Definition and relation of Values and Good Governance',
    'General perception of Values and Good Governance',
    'Importance in individual, social and national life',
    'Impact on national development',
    'Establishing Good Governance and Values in society',
    'Benefits of Values and Good Governance / cost of their absence',
  ],
  'ভূগোল (বাংলাদেশ ও বিশ্ব), পরিবেশ ও দুর্যোগ ব্যবস্থাপনা': [
    'ভৌগোলিক অবস্থান, সীমানা ও ভূ-রাজনৈতিক গুরুত্ব',
    'ভৌত পরিবেশ ও সম্পদের বণ্টন',
    'বাংলাদেশের পরিবেশ: প্রকৃতি, সম্পদ ও চ্যালেঞ্জ',
    'জলবায়ু পরিবর্তনের প্রভাব',
    'প্রাকৃতিক দুর্যোগ ও ব্যবস্থাপনা',
  ],
};

// Official NTRCA syllabus (৪ subject)
const NTRCA_TAXONOMY: Taxonomy = {
  বাংলা: [
    'ভাষারীতি ও বিরাম চিহ্নের ব্যবহার',
    'ভুল সংশোধন ও শুদ্ধকরণ',
    'বাগধারা ও বাগবিধি',
    'যথার্থ অনুবাদ',
    'সন্ধি বিচ্ছেদ',
    'কারক ও বিভক্তি',
    'সমাস ও প্রত্যয়',
    'সমার্থক ও বিপরীতার্থক শব্দ',
    'বাক্য সংকোচন',
    'লিঙ্গ পরিবর্তন',
  ],
  English: [
    'Sentences (types & structure)',
    'Change of parts of speech',
    'Transformation of sentences',
    'Right forms of verb',
    'Synonyms & antonyms',
    'Idioms & phrases',
    'Fill in the blanks (appropriate word)',
    'Translation from Bengali to English',
    'Identify appropriate title (story/article)',
    'Errors in composition',
    'Appropriate preposition',
    'Uses of article',
  ],
  গণিত: [
    'পাটিগণিত: গড়, একক নিয়ম, লসাগু, গসাগু',
    'পাটিগণিত: সুদ, লাভ-ক্ষতি, শতাংশ, অনুপাত',
    'বীজগণিত: বাস্তব সংখ্যা, সূত্র ও বর্গ-ঘন',
    'বীজগণিত: সূচক ও লগারিদম প্রয়োগ',
    'বীজগণিতীয় সূত্রের গঠন ও প্রয়োগ',
    'জ্যামিতি: রেখা, কোণ, ত্রিভুজ, চতুর্ভুজ',
    'জ্যামিতি: ক্ষেত্রফল ও বৃত্তের ধারণা',
  ],
  'সাধারণ জ্ঞান': [
    'বাংলাদেশ: ইতিহাস, ভূগোল ও জলবায়ু',
    'ভাষা আন্দোলন ও মুক্তিযুদ্ধ',
    'রাজনৈতিক ব্যবস্থা ও অর্থনীতি',
    'সভ্যতা, সংস্কৃতি ও বিখ্যাত স্থান',
    'জাতীয় দিবস, কৃষি, শিল্প ও পানিসম্পদ',
    'আন্তর্জাতিক সংস্থা ও আঞ্চলিক সংগঠন',
    'বিভিন্ন দেশের পরিচিতি ও মুদ্রা',
    'আন্তর্জাতিক দিবস, পুরস্কার ও খেলাধুলা',
    'সাম্প্রতিক ঘটনাবলি (জাতীয় ও আন্তর্জাতিক)',
    'দৈনন্দিন বিজ্ঞান: পদার্থ, রসায়ন, জীববিজ্ঞান',
    'স্বাস্থ্য, চিকিৎসা ও পরিবেশ বিজ্ঞান',
    'তথ্য ও যোগাযোগ প্রযুক্তি',
  ],
};

type ExamType = 'bcs' | 'ntrca';

const TAXONOMY_BY_EXAM: Record<ExamType, Taxonomy> = {
  bcs: BCS_TAXONOMY,
  ntrca: NTRCA_TAXONOMY,
};

/** Detect exam type from the question set's title/source_material (and examName as a backup hint). */
function detectExamType(
  setTitle: string,
  sourceMaterial: string,
  examName: string,
): ExamType | null {
  const hay = `${setTitle} ${sourceMaterial} ${examName}`.toLowerCase();
  if (/বিসিএস|\bbcs\b/.test(hay)) return 'bcs';
  if (
    /ntrca|এনটিআরসিএ|শিক্ষক নিবন্ধন/.test(hay) ||
    // Fallback for titles like "১৮তম শিক্ষক নিয়োগ পরীক্ষা (কলেজ পর্যায়)" that don't
    // spell out NTRCA/নিবন্ধন anywhere (title or source_material).
    (/শিক্ষক নিয়োগ/.test(hay) && /(কলেজ|স্কুল|মাদ্রাসা)\s*পর্যায়/.test(hay))
  ) {
    return 'ntrca';
  }
  return null; // unknown exam type — no taxonomy defined yet, will be skipped
}

function buildTaxonomyBlock(taxonomy: Taxonomy): string {
  return Object.entries(taxonomy)
    .map(
      ([subject, topics]) =>
        `সাবজেক্ট: ${subject}\nটপিকসমূহ:\n${topics.map((t) => `- ${t}`).join('\n')}`,
    )
    .join('\n\n');
}

// ─── API Key Pool (same pattern as other backfill scripts) ────────────────────

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
    console.error('[FATAL] No API keys found. Set MISTRAL_API_KEYS="key1,key2,..." in .env');
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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${slot.key}` },
        body: JSON.stringify({
          model: MISTRAL_MODEL,
          max_tokens: MAX_TOKENS,
          temperature: 0.1,
          response_format: { type: 'json_object' },
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

// ─── Prompt + classification ───────────────────────────────────────────────────

interface QuestionRow {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string | null;
  subject: string | null; // existing value — hint only, not authoritative
  examName: string | null;
  questionSet: {
    title: string | null;
    subject: string | null;
    topics: string | null;
    sourceMaterial: string | null;
  } | null;
}

function buildPrompt(q: QuestionRow, taxonomy: Taxonomy): MistralMessage[] {
  const optionMap: Record<string, string> = {
    A: q.optionA,
    B: q.optionB,
    C: q.optionC,
    D: q.optionD,
  };
  const correctText = optionMap[q.correctAnswer.toUpperCase()] ?? q.correctAnswer;

  return [
    {
      role: 'system',
      content: `তুমি বাংলাদেশের সরকারি চাকরির প্রতিযোগিতামূলক পরীক্ষার জন্য প্রশ্ন প্রণয়নকারী একজন অভিজ্ঞ বিশেষজ্ঞ।
তোমার কাজ হলো নিচে দেওয়া অফিসিয়াল সিলেবাস অনুযায়ী প্রতিটি MCQ প্রশ্নের সঠিক "subject" ও "topic" নির্ধারণ করা।

**কঠোর নিয়ম:**
- "subject" ও "topic" অবশ্যই নিচের তালিকা থেকে হুবহু (word-for-word) কপি করে দিতে হবে — নতুন কোনো শব্দ তৈরি করা যাবে না।
- "topic" অবশ্যই ঐ "subject"-এর নিজের তালিকা থেকে বাছাই করতে হবে, অন্য subject-এর topic ব্যবহার করা যাবে না।
- "topic" কখনোই "subject"-এর নামের হুবহু পুনরাবৃত্তি হবে না — যদি প্রশ্নটি ঠিক কোন topic-এ পড়ে বুঝতে না পারো, সবচেয়ে কাছাকাছি প্রাসঙ্গিক topic বেছে নাও।
- শুধুমাত্র বিশুদ্ধ JSON অবজেক্ট রিটার্ন করবে, অন্য কোনো টেক্সট বা মার্কডাউন যোগ করবে না।

**সিলেবাস:**
${buildTaxonomyBlock(taxonomy)}

**আউটপুট ফরম্যাট (হুবহু):**
{"subject": "...", "topic": "..."}`,
    },
    {
      role: 'user',
      content:
        `প্রশ্ন: ${q.questionText}\n\n` +
        `ক) ${q.optionA}\n` +
        `খ) ${q.optionB}\n` +
        `গ) ${q.optionC}\n` +
        `ঘ) ${q.optionD}\n\n` +
        `সঠিক উত্তর: ${correctText}\n\n` +
        (q.explanation ? `ব্যাখ্যা (প্রসঙ্গের জন্য):\n${q.explanation.slice(0, 1000)}\n\n` : '') +
        (q.subject
          ? `প্রশ্নের বর্তমান subject ট্যাগ (নির্ভরযোগ্য নাও হতে পারে, শুধু ইঙ্গিত): ${q.subject}\n\n`
          : '') +
        (q.questionSet?.subject && q.questionSet.subject !== 'সকল বিষয়'
          ? `যে প্রশ্নসেটের অংশ এই প্রশ্ন, তার subject ট্যাগ (শক্তিশালী ইঙ্গিত): ${q.questionSet.subject}\n\n`
          : '') +
        (q.questionSet?.topics && q.questionSet.topics !== 'সকল বিষয়বস্তু'
          ? `প্রশ্নসেটের topics বর্ণনা (শক্তিশালী ইঙ্গিত): ${q.questionSet.topics}\n\n`
          : '') +
        `উপরের সিলেবাস থেকে সঠিক subject ও topic বেছে JSON আকারে দাও।`,
    },
  ];
}

interface Classification {
  subject: string;
  topic: string;
}

function parseClassification(raw: string, id: string, taxonomy: Taxonomy): Classification {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    logError({ type: 'JSON_PARSE_ERROR', id, raw: cleaned.slice(0, 300) });
    throw new Error(`Could not parse JSON response: ${e}`);
  }

  const obj = parsed as { subject?: unknown; topic?: unknown };
  const subject = typeof obj.subject === 'string' ? obj.subject.trim() : '';
  const topic = typeof obj.topic === 'string' ? obj.topic.trim() : '';

  if (!subject || !topic) {
    logError({ type: 'MISSING_FIELDS', id, parsed });
    throw new Error('Response JSON missing subject or topic.');
  }

  // ── Closed-vocabulary validation: reject anything not verbatim in the taxonomy ──
  const validTopics = taxonomy[subject];
  if (!validTopics) {
    logError({ type: 'INVALID_SUBJECT', id, subject, allowedSubjects: Object.keys(taxonomy) });
    throw new Error(`Subject "${subject}" is not in the fixed taxonomy.`);
  }
  if (!validTopics.includes(topic)) {
    logError({ type: 'INVALID_TOPIC', id, subject, topic, allowedTopics: validTopics });
    throw new Error(`Topic "${topic}" is not a valid topic under subject "${subject}".`);
  }
  if (topic === subject) {
    // Extra safety net — shouldn't happen with a curated closed list, but guard anyway.
    logError({ type: 'TOPIC_EQUALS_SUBJECT', id, subject, topic });
    throw new Error('Topic duplicates subject name.');
  }

  return { subject, topic };
}

async function processQuestion(
  q: QuestionRow,
  taxonomy: Taxonomy,
  pool: KeySlot[],
  maxAttempts = 5,
): Promise<Classification | null> {
  const messages = buildPrompt(q, taxonomy);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const slot = await acquireKey(pool);
    try {
      const raw = await callMistral(slot, messages);
      return parseClassification(raw, q.id, taxonomy);
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
  console.log('  Farhan MCQ — AI Subject / Topic Backfill (closed taxonomy)');
  console.log('  Model:', MISTRAL_MODEL);
  console.log('  Started:', new Date().toLocaleString('bn-BD'));
  console.log('═'.repeat(60));

  const pool = buildKeyPool();
  const done = loadProgress();

  const whereClause = { topic: null } as const;

  let totalPending = await prisma.question.count({ where: whereClause });
  console.log(`[INFO] Questions with null topic: ${totalPending}`);
  console.log(`[INFO] Already processed (from checkpoint): ${done.size}`);

  let processed = 0;
  let succeeded = 0;
  let failed = 0;
  let skippedUnknownExam = 0;

  while (true) {
    const batch = await prisma.question.findMany({
      select: {
        id: true,
        questionText: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        correctAnswer: true,
        explanation: true,
        subject: true,
        examName: true,
        questionSet: { select: { title: true, subject: true, topics: true, sourceMaterial: true } },
      },
      where: whereClause,
      orderBy: { createdAt: 'asc' },
      take: DB_BATCH_SIZE,
    });

    if (batch.length === 0) break;
    const newInBatch = batch.filter((q) => !done.has(q.id));
    if (newInBatch.length === 0) break;

    for (const q of batch) {
      if (done.has(q.id)) continue;

      process.stdout.write(
        `\r[PROGRESS] ${done.size}/${totalPending} | ✓ ${succeeded} | ✗ ${failed} | ⊘ ${skippedUnknownExam} | Key calls: ${pool.reduce((s, k) => s + k.callCount, 0)}   `,
      );

      const examType = detectExamType(
        q.questionSet?.title ?? '',
        q.questionSet?.sourceMaterial ?? '',
        q.examName ?? '',
      );

      if (!examType) {
        skippedUnknownExam++;
        console.log(
          `\n[SKIPPED] id=${q.id} → exam type unknown (setTitle="${q.questionSet?.title ?? ''}", sourceMaterial="${q.questionSet?.sourceMaterial ?? ''}", examName="${q.examName ?? ''}"). No taxonomy defined for this exam yet.`,
        );
        done.add(q.id);
        processed++;
        continue;
      }

      const taxonomy = TAXONOMY_BY_EXAM[examType];
      const result = await processQuestion(q as QuestionRow, taxonomy, pool);

      if (result) {
        await prisma.question.update({
          where: { id: q.id },
          data: { subject: result.subject, topic: result.topic },
        });
        succeeded++;
        console.log(
          `\n[UPDATED] id=${q.id} → subject="${result.subject}" | topic="${result.topic}"`,
        );
      } else {
        failed++;
        console.log(`\n[FAILED] id=${q.id} → classification failed, left as NULL.`);
      }

      done.add(q.id);
      processed++;

      if (processed % CHECKPOINT_EVERY === 0) {
        saveProgress(done);
        totalPending = await prisma.question.count({ where: whereClause });
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
  console.log(`  Skipped (unknown exam type): ${skippedUnknownExam}`);
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
