/**
 * Backfill script: clean up explanation fields by:
 *
 *  1. Nullifying explanations that contain "Live MCQ".
 *  2. Stripping the trailing analytics block from explanations that contain it.
 *     The analytics block looks like (percentages are dynamic):
 *       "Question Analytics:\nসঠিক উত্তরদাতা: 47%, ভুল উত্তরদাতা: 33%, উত্তর করেননি: 19%"
 *     Both same-line and newline-separated formats are handled.
 *     After stripping, if the remaining text is blank the field is also nullified.
 *
 * Run with:
 *   npx tsx --env-file=.env prisma/backfill-question-explanation.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * NON-global regex — used only for .test() checks inside .filter().
 * A /g regex is stateful: lastIndex advances after each .test() hit, causing
 * every other item in a .filter() loop to be silently skipped.
 */
const ANALYTICS_REGEX_TEST =
  /Question Analytics:[\s\S]*?সঠিক উত্তরদাতা:\s*\d+%,\s*ভুল উত্তরদাতা:\s*\d+%,\s*উত্তর করেননি:\s*\d+%/;

/**
 * Global regex — used only for .replace() inside stripAnalytics().
 * Handles the case where the block appears more than once in a single explanation.
 */
const ANALYTICS_REGEX_REPLACE =
  /Question Analytics:[\s\S]*?সঠিক উত্তরদাতা:\s*\d+%,\s*ভুল উত্তরদাতা:\s*\d+%,\s*উত্তর করেননি:\s*\d+%/g;

/**
 * Strips the analytics block from an explanation string.
 * Returns null if the result is empty after stripping.
 */
function stripAnalytics(explanation: string): string | null {
  const cleaned = explanation.replace(ANALYTICS_REGEX_REPLACE, '').trim();
  return cleaned.length > 0 ? cleaned : null;
}

async function main() {
  // Fetch all questions that have a non-null explanation
  const allQuestions = await prisma.question.findMany({
    select: { id: true, explanation: true },
    where: { explanation: { not: null } },
    orderBy: { createdAt: 'asc' },
  });

  // Classify each question into one of two buckets:
  //   • nullify  – explanation contains "Live MCQ" → set to null entirely
  //   • strip    – explanation contains the analytics block → strip it out
  const toNullify = allQuestions.filter((q) => q.explanation && q.explanation.includes('Live MCQ'));

  const toStrip = allQuestions.filter(
    (q) =>
      q.explanation &&
      !q.explanation.includes('Live MCQ') && // already handled above
      ANALYTICS_REGEX_TEST.test(q.explanation), // non-global: no lastIndex issue
  );

  if (toNullify.length === 0 && toStrip.length === 0) {
    console.log('Nothing to update. All explanations are already clean.');
    return;
  }

  console.log(`Found ${toNullify.length} explanation(s) to nullify ("Live MCQ").`);
  console.log(`Found ${toStrip.length} explanation(s) to strip (analytics block).`);

  let updated = 0;
  const total = toNullify.length + toStrip.length;

  // ── 1. Nullify "Live MCQ" explanations ──────────────────────────────────
  for (const q of toNullify) {
    await prisma.question.update({
      where: { id: q.id },
      data: { explanation: null },
    });
    updated++;
    if (updated % 100 === 0) console.log(`  … ${updated} / ${total} processed`);
  }

  // ── 2. Strip analytics block from remaining explanations ────────────────
  for (const q of toStrip) {
    const cleaned = stripAnalytics(q.explanation!);
    await prisma.question.update({
      where: { id: q.id },
      data: { explanation: cleaned }, // null if nothing remained after stripping
    });
    updated++;
    if (updated % 100 === 0) console.log(`  … ${updated} / ${total} processed`);
  }

  console.log(`Done. Processed ${updated} explanation(s) in total.`);
}

main()
  .catch((err) => {
    console.error('Backfill failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
