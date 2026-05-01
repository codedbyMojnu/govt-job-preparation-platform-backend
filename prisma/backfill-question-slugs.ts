/**
 * Backfill script: generate text-based slugs from questionText for every
 * question that has no slug OR still has an auto-assigned q-N slug.
 *
 * Slug format: first 5 meaningful words from the question text, hyphen-joined.
 * Example: 'বালক' পত্রিকা প্রতিষ্ঠা কার কীর্তি  →  বালক-পত্রিকা-প্রতিষ্ঠা-কার-কীর্তি
 *
 * Run with:
 *   npx tsx --env-file=.env prisma/backfill-question-slugs.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Derives a URL slug from a question text:
 * 1. Strips leading ordinal numbers  ("১.", "২)", "25." …)
 * 2. Removes every symbol / punctuation — keeps Bengali (\u0980-\u09FF),
 *    ASCII letters/digits, and whitespace
 * 3. Takes the first 5 words, joins with "-", lowercases any ASCII
 */
function toSlug(questionText: string): string {
  let text = questionText;

  // Drop leading numbers: "১.", "২)", "25." "3." etc.
  text = text.replace(/^[\d\u09E6-\u09EF]+\s*[.)।\]]\s*/, '');

  // Strip anything that isn't a Bengali char, ASCII word char, or whitespace
  text = text.replace(/[^\w\u0980-\u09FF\s]/g, ' ');

  // Collapse runs of whitespace
  text = text.trim().replace(/\s+/g, ' ');

  return text
    .split(' ')
    .filter((w) => w.length > 0)
    .slice(0, 5)
    .join('-')
    .toLowerCase();
}

async function main() {
  // Process questions with no slug OR old auto-assigned q-N slugs
  const questions = await prisma.question.findMany({
    where: {
      OR: [{ slug: null }, { slug: { startsWith: 'q-' } }],
    },
    select: { id: true, questionText: true },
    orderBy: { createdAt: 'asc' },
  });

  if (questions.length === 0) {
    console.log('No questions need slug updates. Nothing to do.');
    return;
  }

  console.log(`Found ${questions.length} question(s) to update …`);

  // Seed the uniqueness set with slugs already in use (non q-N only)
  const reserved = await prisma.question.findMany({
    where: {
      slug: { not: null },
      NOT: { slug: { startsWith: 'q-' } },
    },
    select: { slug: true },
  });
  const usedSlugs = new Set(reserved.map((q) => q.slug!));

  let updated = 0;

  for (const q of questions) {
    const base = toSlug(q.questionText);

    // Append -2, -3 … until the slug is unique
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

  console.log(`Done. Updated ${updated} question(s) with text-based slugs.`);
}

main()
  .catch((err) => {
    console.error('Backfill failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
