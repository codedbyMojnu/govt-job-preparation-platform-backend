/**
 * Backfill script: generate ASCII (Banglish) slugs from questionText for
 * every question that has no slug, an auto-assigned q-N slug, or a Bengali
 * (non-ASCII) slug.
 *
 * Slug format: first 5 romanised words, hyphen-joined.
 * Example: 'বালক' পত্রিকা প্রতিষ্ঠা কার কীর্তি  →  balok-potrika-protishtha-kar-kirti
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
 * Transliterates Bengali Unicode text to ASCII Latin (Avro-phonetic style).
 *
 * Conjunct rules applied via 2-char look-ahead (C + ্ + C2):
 *   • যা-ফলা (্য) – word-initial: bends vowel → "e" (ব্যক্তি → bekti)
 *                  – word-initial + matra: keeps "y" (ব্যাকরণ → byakoron)
 *                  – elsewhere: doubles C, adds matra or "o" (সত্য → sotto, বিদ্যা → bidda)
 *   • ব-ফলা  (্ব) – word-initial: phala is silent (দ্বীপ → dip)
 *                  – elsewhere: doubles C (বিশ্বাস → bishshash, অন্বেষণ → onneshon)
 *   • ম-ফলা  (্ম) – word-initial: keeps "m" sound
 *                  – elsewhere: doubles C + inherent "o" (পদ্ম → poddo, গ্রীষ্ম → grissho)
 *   • ক্ষ – word-initial → "kh" (ক্ষুধা → khudha)
 *         – elsewhere  → "kkh" (শিক্ষক → shikkhok, পরীক্ষা → porikkha)
 *   • হ + ্ম → "mmh"  (ব্রহ্মা → brommha)
 *   • হ + ্ন → "nn"   (চিহ্ন → chinno)
 *
 * Other rules:
 *   • Word-final consonants: inherent vowel elided ("balok" not "baloko")
 *   • Chandrabindu (ঁ) → "n" (চাঁদ → chand, পাঁচ → panch)
 *   • Bengali digits (০–৯) → ASCII (0–9)
 *   • NFC normalisation resolves ড়/ঢ়/য় to single code-points
 */
function transliterateBengali(text: string): string {
  text = text.normalize('NFC');
  const chars = [...text];
  let out = '';
  let wordStart = true;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const next = chars[i + 1] ?? '';
    const c2 = chars[i + 2] ?? ''; // consonant that follows hasanta
    const c3 = chars[i + 3] ?? ''; // char after c2 (potential matra or next Bengali)
    const nextIsBengali = next >= '\u0980' && next <= '\u09FF';

    // ── Consonant ─────────────────────────────────────────────────────────
    if (ch in CONSONANT) {
      const r1 = CONSONANT[ch];

      // Two-consonant conjunct: ch + ্ + c2
      if (next === HASANTA && c2 in CONSONANT) {
        // ক্ষ – position-sensitive
        if (ch === '\u0995' && c2 === '\u09B7') {
          out += wordStart ? 'kh' : 'kkh';
          i += 2;
          if (c3 in MATRA) {
            out += MATRA[c3];
            i++;
          } else if (c3 >= '\u0980' && c3 <= '\u09FF') out += 'o';
          wordStart = false;
          continue;
        }

        // হ + ্ম → mmh  (ব্রহ্মা → brommha)
        if (ch === '\u09B9' && c2 === '\u09AE') {
          out += 'mmh';
          i += 2;
          if (c3 in MATRA) {
            out += MATRA[c3];
            i++;
          } else if (c3 >= '\u0980' && c3 <= '\u09FF') out += 'o';
          wordStart = false;
          continue;
        }

        // হ + ্ন → nn  (চিহ্ন → chinno)
        if (ch === '\u09B9' && c2 === '\u09A8') {
          out += 'nn';
          i += 2;
          if (c3 in MATRA) {
            out += MATRA[c3];
            i++;
          } else if (c3 >= '\u0980' && c3 <= '\u09FF') out += 'o';
          wordStart = false;
          continue;
        }

        // হ + ্ব → bb  (জিহ্বা → jibba, গহ্বর → gobbor)
        if (ch === '\u09B9' && c2 === '\u09AC') {
          out += 'bb';
          i += 2;
          if (c3 in MATRA) {
            out += MATRA[c3];
            i++;
          } else if (c3 >= '\u0980' && c3 <= '\u09FF') out += 'o';
          wordStart = false;
          continue;
        }

        // হ + ্ল → llh  (আহ্লাদ → allhad, প্রহ্লাদ → prollhad)
        if (ch === '\u09B9' && c2 === '\u09B2') {
          out += 'llh';
          i += 2;
          if (c3 in MATRA) {
            out += MATRA[c3];
            i++;
          } else if (c3 >= '\u0980' && c3 <= '\u09FF') out += 'o';
          wordStart = false;
          continue;
        }

        // জ্ঞ – position-sensitive (জ্ঞান → gyan, বিজ্ঞান → biggan)
        if (ch === '\u099C' && c2 === '\u099E') {
          out += wordStart ? 'gy' : 'gg';
          i += 2;
          if (c3 in MATRA) {
            out += MATRA[c3];
            i++;
          } else if (c3 >= '\u0980' && c3 <= '\u09FF') out += 'o';
          wordStart = false;
          continue;
        }

        // শ + ্র → sr  (শ্রম → srom, বিশ্রী → bisri)
        if (ch === '\u09B6' && c2 === '\u09B0') {
          out += 's'; // শ loses 'h' before র-ফলা; র processed next iteration
          i++; // skip hasanta
          wordStart = false;
          continue;
        }

        // য-ফলা (্য) – doubles consonant or bends vowel
        if (c2 === '\u09AF') {
          if (wordStart) {
            if (c3 in MATRA) {
              out += r1 + 'y' + MATRA[c3]; // ব্যাকরণ → byakoron
              i += 3;
            } else {
              out += r1 + 'e'; // ব্যক্তি → bekti
              i += 2;
            }
          } else if (c3 in MATRA) {
            out += r1 + r1 + MATRA[c3]; // বিদ্যা → bidda
            i += 3;
          } else {
            out += r1 + r1 + 'o'; // সত্য → sotto
            i += 2;
          }
          wordStart = false;
          continue;
        }

        // ব-ফলা (্ব) – silent at word-start; doubles elsewhere
        if (c2 === '\u09AC') {
          out += wordStart ? r1 : r1 + r1;
          i += 2;
          if (c3 in MATRA) {
            out += MATRA[c3];
            i++;
          } else if (c3 >= '\u0980' && c3 <= '\u09FF') out += 'o';
          wordStart = false;
          continue;
        }

        // ম-ফলা (্ম) – keeps 'm' at word-start; doubles + 'o' elsewhere
        if (c2 === '\u09AE') {
          if (wordStart) {
            out += r1 + 'm';
            i += 2;
            if (c3 in MATRA) {
              out += MATRA[c3];
              i++;
            } else if (c3 >= '\u0980' && c3 <= '\u09FF') out += 'o';
          } else {
            out += r1 + r1;
            i += 2;
            if (c3 in MATRA) {
              out += MATRA[c3];
              i++;
            } else out += 'o'; // পদ্ম → poddo, গ্রীষ্ম → grissho
          }
          wordStart = false;
          continue;
        }

        // Default conjunct: emit C1 without vowel; C2 processed next iteration
        out += r1;
        i++; // skip ্; C2 handled on the next loop turn
        wordStart = false;
        continue;
      }

      // Normal (non-conjunct) consonant
      out += r1;
      if (next === HASANTA) {
        i++; // skip orphaned hasanta
      } else if (next in MATRA) {
        out += MATRA[next];
        i++;
      } else if (nextIsBengali) {
        out += 'o'; // inherent vowel: more Bengali follows in this word
      }
      // word-final: inherent vowel elided
      wordStart = false;

      // ── Independent vowel ────────────────────────────────────────────────
    } else if (ch in VOWEL) {
      out += VOWEL[ch];
      wordStart = false;

      // ── Orphaned matra ───────────────────────────────────────────────────
    } else if (ch in MATRA) {
      out += MATRA[ch];
      wordStart = false;

      // ── Diacritics ───────────────────────────────────────────────────────
    } else if (ch === '\u0982') {
      out += 'ng'; // ং anusvara
    } else if (ch === '\u0983') {
      // Visarga: doubles the immediately following consonant
      const nxt = chars[i + 1] ?? '';
      if (nxt in CONSONANT) {
        const rom = CONSONANT[nxt];
        out += rom.length === 1 ? rom + rom : rom[0] + rom; // k→kk, kh→kkh, sh→ssh
      } else {
        out += 'h'; // fallback
      }
    } else if (ch === '\u0981') {
      out += 'n'; // ঁ chandrabindu → nasalises

      // ── Ignored marks ────────────────────────────────────────────────────
    } else if (ch === HASANTA || ch === NUKTA) {
      /* skip */
      // ── Bengali digits → ASCII 0-9 ───────────────────────────────────────
    } else if (ch >= '\u09E6' && ch <= '\u09EF') {
      out += String.fromCharCode(ch.charCodeAt(0) - 0x09e6 + 0x30);
      wordStart = false;

      // ── ASCII passthrough ─────────────────────────────────────────────────
    } else if (/[a-z0-9]/i.test(ch)) {
      out += ch.toLowerCase();
      wordStart = false;
    } else if (ch === ' ' || ch === '\t' || ch === '\n') {
      out += ' ';
      wordStart = true;
    }
    // Punctuation / other → skip
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
    .slice(0, 4)
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

  // Only target questions that have no slug yet.
  const questions = allQuestions.filter((q) => q.slug === null);

  if (questions.length === 0) {
    console.log('No questions need slug updates. Nothing to do.');
    return;
  }

  console.log(`Found ${questions.length} question(s) to update …`);

  // Seed with ALL existing non-null slugs so new slugs never collide with
  // un-updated rows still in the DB (avoids P2002 unique-constraint errors).
  // Each question's own old slug is removed before its new slug is generated
  // so it can naturally reuse its own slug without an unnecessary suffix.
  const usedSlugs = new Set(allQuestions.filter((q) => q.slug !== null).map((q) => q.slug!));

  let updated = 0;

  for (const q of questions) {
    // Free the question's own old slug so it can reclaim it if unchanged.
    if (q.slug) usedSlugs.delete(q.slug);

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
