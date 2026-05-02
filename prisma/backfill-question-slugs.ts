/**
 * Backfill script: generate ASCII (Banglish) slugs from questionText for
 * every question that has no slug, an auto-assigned q-N slug, or a Bengali
 * (non-ASCII) slug.
 *
 * Slug format: first 5 romanised words, hyphen-joined.
 * Example: 'বালক' পত্রিকা প্রতিষ্ঠা কার কীর্তি  →  balok-potrika-protishtho-kar-kirti
 *
 * Run with:
 *   npx tsx --env-file=.env prisma/backfill-question-slugs.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Bengali → Latin transliteration tables ──────────────────────────────────

/** Consonants – each carries an inherent "o" vowel unless overridden */
const CONSONANT: Record<string, string> = {
  '\u0995': 'k', // ক
  '\u0996': 'kh', // খ
  '\u0997': 'g', // গ
  '\u0998': 'gh', // ঘ
  '\u0999': 'ng', // ঙ
  '\u099A': 'ch', // চ
  '\u099B': 'chh', // ছ
  '\u099C': 'j', // জ
  '\u099D': 'jh', // ঝ
  '\u099E': 'ny', // ঞ
  '\u099F': 't', // ট
  '\u09A0': 'th', // ঠ
  '\u09A1': 'd', // ড
  '\u09A2': 'dh', // ঢ
  '\u09A3': 'n', // ণ
  '\u09A4': 't', // ত
  '\u09A5': 'th', // থ
  '\u09A6': 'd', // দ
  '\u09A7': 'dh', // ধ
  '\u09A8': 'n', // ন
  '\u09AA': 'p', // প
  '\u09AB': 'ph', // ফ
  '\u09AC': 'b', // ব
  '\u09AD': 'bh', // ভ
  '\u09AE': 'm', // ম
  '\u09AF': 'j', // য
  '\u09B0': 'r', // র
  '\u09B2': 'l', // ল
  '\u09B6': 'sh', // শ
  '\u09B7': 'sh', // ষ
  '\u09B8': 's', // স
  '\u09B9': 'h', // হ
  '\u09CE': 't', // ৎ
  '\u09DC': 'r', // ড় (ড + nukta)
  '\u09DD': 'rh', // ঢ় (ঢ + nukta)
  '\u09DF': 'y', // য় (য + nukta)
};

/** Independent vowels (syllable-initial position) */
const VOWEL: Record<string, string> = {
  '\u0985': 'o', // অ
  '\u0986': 'a', // আ
  '\u0987': 'i', // ই
  '\u0988': 'i', // ঈ
  '\u0989': 'u', // উ
  '\u098A': 'u', // ঊ
  '\u098B': 'ri', // ঋ
  '\u098F': 'e', // এ
  '\u0990': 'oi', // ঐ
  '\u0993': 'o', // ও
  '\u0994': 'ou', // ঔ
};

/** Dependent vowel signs (matras) – replace the inherent vowel */
const MATRA: Record<string, string> = {
  '\u09BE': 'a', // া
  '\u09BF': 'i', // ি
  '\u09C0': 'i', // ী
  '\u09C1': 'u', // ু
  '\u09C2': 'u', // ূ
  '\u09C3': 'ri', // ৃ
  '\u09C7': 'e', // ে
  '\u09C8': 'oi', // ৈ
  '\u09CB': 'o', // ো
  '\u09CC': 'ou', // ৌ
};

const HASANTA = '\u09CD'; // ্  virama – suppresses inherent vowel
const NUKTA = '\u09BC'; // ় – handled via NFC normalisation

/**
 * Transliterates Bengali Unicode text to ASCII Latin characters.
 * Rules:
 *   - Every consonant gets inherent vowel "o" unless followed by a matra or hasanta.
 *   - Hasanta (্) joins consonant clusters without a vowel.
 *   - NFC normalisation ensures ড়/ঢ়/য় are single code-points.
 */
function transliterateBengali(text: string): string {
  text = text.normalize('NFC');
  const chars = [...text]; // Unicode-aware array
  let out = '';

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const next = chars[i + 1] ?? '';

    if (ch in CONSONANT) {
      out += CONSONANT[ch];
      if (next === HASANTA) {
        i++; // conjunct cluster – no inherent vowel; skip hasanta
      } else if (next in MATRA) {
        out += MATRA[next];
        i++; // consume matra
      } else {
        out += 'o'; // inherent vowel
      }
    } else if (ch in VOWEL) {
      out += VOWEL[ch];
    } else if (ch in MATRA) {
      out += MATRA[ch]; // orphaned matra (edge case)
    } else if (ch === '\u0982') {
      // ং anusvara
      out += 'ng';
    } else if (ch === '\u0983') {
      // ঃ visarga
      out += 'h';
    } else if (ch === '\u0981') {
      // ঁ chandrabindu
      out += 'n';
    } else if (ch === HASANTA || ch === NUKTA) {
      // already consumed above, or orphaned – skip
    } else if (/[a-z0-9]/i.test(ch)) {
      out += ch.toLowerCase();
    } else if (ch === ' ' || ch === '\t' || ch === '\n') {
      out += ' ';
    }
    // Punctuation, Bengali digits, etc. → skip
  }

  return out.trim();
}

// ─── Slug derivation ─────────────────────────────────────────────────────────

/**
 * Derives a URL slug from a question text:
 * 1. Strips leading ordinal numbers ("১.", "২)", "25." …)
 * 2. Transliterates Bengali → Latin (Banglish)
 * 3. Removes non-word characters
 * 4. Takes the first 5 words, joins with "-"
 */
function toSlug(questionText: string): string {
  let text = questionText;

  // Drop leading ordinal: "১.", "২)", "25." "3." etc.
  text = text.replace(/^[\d\u09E6-\u09EF]+\s*[.)।\]]\s*/, '');

  // Transliterate Bengali → ASCII
  text = transliterateBengali(text);

  // Strip anything that isn't an ASCII word char or whitespace
  text = text.replace(/[^\w\s]/g, ' ');

  // Collapse whitespace
  text = text.trim().replace(/\s+/g, ' ');

  return text
    .split(' ')
    .filter((w) => w.length > 0)
    .slice(0, 5)
    .join('-')
    .toLowerCase();
}

/** True when a slug still contains Bengali (non-ASCII) characters */
function hasBengaliChars(slug: string): boolean {
  return /[\u0980-\u09FF]/.test(slug);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Fetch ALL questions; filter in JS (Prisma has no regex filter for slugs)
  const allQuestions = await prisma.question.findMany({
    select: { id: true, questionText: true, slug: true },
    orderBy: { createdAt: 'asc' },
  });

  // Target: null slug, old q-N slug, or any existing Bengali (non-ASCII) slug
  const questions = allQuestions.filter((q) => q.slug);

  if (questions.length === 0) {
    console.log('No questions need slug updates. Nothing to do.');
    return;
  }

  console.log(`Found ${questions.length} question(s) to update …`);

  // Seed the uniqueness set with slugs of questions we are NOT touching
  const updatingIds = new Set(questions.map((q) => q.id));
  const usedSlugs = new Set(
    allQuestions.filter((q) => q.slug && !updatingIds.has(q.id)).map((q) => q.slug!),
  );

  let updated = 0;

  for (const q of questions) {
    const base = toSlug(q.questionText);

    // Append -2, -3 … until unique
    let slug = base;
    let suffix = 2;
    while (usedSlugs.has(slug)) {
      slug = `${base}-${suffix}`;
      suffix++;
    }
    usedSlugs.add(slug);

    await prisma.question.update({
      where: { id: q.id },
      data: { slug },
    });

    updated++;
    if (updated % 100 === 0) {
      console.log(`  … ${updated} / ${questions.length} updated`);
    }
  }

  console.log(`Done. Updated ${updated} question(s) with Banglish slugs.`);
}

main()
  .catch((err) => {
    console.error('Backfill failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
