/**
 * Job Circular Scraper — Farhan MCQ
 * ─────────────────────────────────────────────────────────────────────────────
 * Scrapes alljobs.teletalk.com.bd/jobs/government and maps each circular
 * to the exact `JobCircular` Prisma model shape, saving a JSON file
 * that `seed-job-circulars.ts` can directly insert.
 *
 * Why Puppeteer:
 *   The site is a fully client-side Next.js SPA — raw HTML fetch returns
 *   only the empty shell. Puppeteer loads the JS and waits for React to paint.
 *
 * Run (from repo root):
 *   npx tsx --env-file=.env prisma/scrape-job-circulars.ts
 *
 * Options (env vars):
 *   START_PAGE=1          first page to scrape (default 1)
 *   MAX_PAGES=999         safety ceiling (default 999)
 *   DELAY_MS=1500         ms between requests (default 1500)
 *   OUTPUT=./prisma/scraped-job-circulars.json   output path
 *
 * Resume: progress is checkpointed — re-running skips already-scraped jobIds.
 */

import * as fs from 'fs';
import * as path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';
import { fileURLToPath } from 'url';

// ─── ES Module __dirname shim ─────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Config ───────────────────────────────────────────────────────────────────
const BASE_URL = 'https://alljobs.teletalk.com.bd';
const LIST_URL = `${BASE_URL}/jobs/government`;
const OUTPUT = process.env.OUTPUT ?? path.join(__dirname, 'scraped-job-circulars.json');
const DELAY_MS = Number(process.env.DELAY_MS ?? 1500);
const START_PAGE = Number(process.env.START_PAGE ?? 1);
const MAX_PAGES = Number(process.env.MAX_PAGES ?? 999);

// ─── Types (mirror Prisma schema) ─────────────────────────────────────────────
type OrgType = 'GOVERNMENT' | 'PRIVATE' | 'AUTONOMOUS' | 'NGO';
type CircularStatus = 'LIVE' | 'UPCOMING' | 'EXPIRED';

interface ScrapedCircular {
  gjobId: string | null; // jobId param from URL
  organizationName: string;
  organizationSlug: string;
  orgType: OrgType;
  logoUrl: string | null;
  title: string;
  totalPosts: number;
  applicationUrl: string | null;
  publishDate: string | null; // "YYYY-MM-DD"
  deadline: string | null;
  examDate: string | null;
  description: string | null;
  eligibility: string | null;
  salary: string | null;
  experience: string | null;
  location: string | null;
  source: string | null; // canonical URL of the detail page
  category: string | null;
  ministry: string | null;
  status: CircularStatus;
  isActive: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Convert a Bangla/English date string like "১৫ জুন, ২০২৫" → "2025-06-15" */
function parseDate(raw: string | null): string | null {
  if (!raw) return null;

  // Normalize Bangla numerals → ASCII
  const BANGLA_DIGIT_MAP: Record<string, string> = {
    '০': '0',
    '১': '1',
    '২': '2',
    '৩': '3',
    '৪': '4',
    '৫': '5',
    '৬': '6',
    '৭': '7',
    '৮': '8',
    '৯': '9',
  };
  const normalized = raw
    .split('')
    .map((ch) => BANGLA_DIGIT_MAP[ch] ?? ch)
    .join('')
    .trim();

  // Try common formats
  const fmts: { re: RegExp; handler: (m: RegExpMatchArray) => string | null }[] = [
    // "15 Jun, 2025" / "15 June 2025" / "15-Jun-2025"
    {
      re: /(\d{1,2})[\/\- ,]+([A-Za-z]+)[\/\- ,]+(\d{4})/,
      handler: (m) => {
        const d = m[1]?.padStart(2, '0');
        const mo = monthNameToNum(m[2] ?? '');
        const y = m[3];
        if (!d || !mo || !y) return null;
        return `${y}-${mo}-${d}`;
      },
    },
    // "2025-06-15" or "2025/06/15"
    {
      re: /(\d{4})[\/\-](\d{2})[\/\-](\d{2})/,
      handler: (m) => `${m[1]}-${m[2]}-${m[3]}`,
    },
    // "15/06/2025" or "15-06-2025"
    {
      re: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
      handler: (m) => {
        const d = (m[1] ?? '').padStart(2, '0');
        const mo = (m[2] ?? '').padStart(2, '0');
        return `${m[3]}-${mo}-${d}`;
      },
    },
  ];

  for (const { re, handler } of fmts) {
    const match = normalized.match(re);
    if (match) {
      const result = handler(match);
      if (result) return result;
    }
  }
  return null; // unparseable — store null, fix manually
}

function monthNameToNum(name: string): string | null {
  const map: Record<string, string> = {
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    aug: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dec: '12',
    january: '01',
    february: '02',
    march: '03',
    april: '04',
    june: '06',
    july: '07',
    august: '08',
    september: '09',
    october: '10',
    november: '11',
    december: '12',
    // Bangla month names
    জানুয়ারি: '01',
    ফেব্রুয়ারি: '02',
    মার্চ: '03',
    এপ্রিল: '04',
    মে: '05',
    জুন: '06',
    জুলাই: '07',
    আগস্ট: '08',
    সেপ্টেম্বর: '09',
    অক্টোবর: '10',
    নভেম্বর: '11',
    ডিসেম্বর: '12',
  };
  return map[name.toLowerCase()] ?? null;
}

/** "Bangladesh Secretariat" → "bangladesh-secretariat" */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-') // spaces → dashes
    .replace(/-+/g, '-') // collapse multiple dashes
    .replace(/^-+|-+$/g, ''); // trim leading/trailing
}

/** Determine CircularStatus from deadline string */
function deriveStatus(deadline: string | null, publishDate: string | null): CircularStatus {
  if (!deadline) return 'LIVE';
  const now = new Date();
  const dead = new Date(deadline);
  const pub = publishDate ? new Date(publishDate) : null;
  if (dead < now) return 'EXPIRED';
  if (pub && pub > now) return 'UPCOMING';
  return 'LIVE';
}

/** Parse totalPosts from strings like "৫০", "50 টি", "মোট ৫০", "50 posts" */
function parseTotalPosts(raw: string | null): number {
  if (!raw) return 0;
  const BANGLA_DIGIT_MAP: Record<string, string> = {
    '০': '0',
    '১': '1',
    '২': '2',
    '৩': '3',
    '৪': '4',
    '৫': '5',
    '৬': '6',
    '৭': '7',
    '৮': '8',
    '৯': '9',
  };
  const normalized = raw
    .split('')
    .map((ch) => BANGLA_DIGIT_MAP[ch] ?? ch)
    .join('');
  const match = normalized.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

// ─── Load/save checkpoint ──────────────────────────────────────────────────────
function loadExisting(): ScrapedCircular[] {
  if (fs.existsSync(OUTPUT)) {
    try {
      return JSON.parse(fs.readFileSync(OUTPUT, 'utf-8')) as ScrapedCircular[];
    } catch {
      return [];
    }
  }
  return [];
}

function saveAll(items: ScrapedCircular[]) {
  fs.writeFileSync(OUTPUT, JSON.stringify(items, null, 2), 'utf-8');
}

// ─── Scrape list page → extract all detail-page links ─────────────────────────
async function scrapeListPage(
  page: Page,
  pageNum: number,
): Promise<{ href: string; gjobId: string }[]> {
  const url = pageNum === 1 ? LIST_URL : `${LIST_URL}?page=${pageNum}`;
  console.log(`  📄 List page ${pageNum}: ${url}`);

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30_000 });

  // Wait for job cards — try common selectors
  try {
    await page.waitForSelector(
      'a[href*="/jobs/government/"], [class*="job-card"], [class*="jobCard"], .job-list-item',
      { timeout: 15_000 },
    );
  } catch {
    console.warn('    ⚠️  No job cards found on page', pageNum);
    return [];
  }

  const links = await page.evaluate((): { href: string; gjobId: string }[] => {
    const results: { href: string; gjobId: string }[] = [];
    const seen = new Set<string>();

    // Collect all <a> tags pointing to government job detail pages
    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href*="/jobs/government/"]'),
    );

    for (const a of anchors) {
      const href = a.href;
      if (!href || seen.has(href)) continue;

      // Extract jobId from ?jobId=XXXXX
      const match = href.match(/[?&]jobId=(\d+)/);
      if (!match) continue;

      const gjobId = match[1] ?? '';
      seen.add(href);
      results.push({ href, gjobId });
    }
    return results;
  });

  return links;
}

/** Check if there is a "next page" button / more content */
async function hasNextPage(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    // Common patterns: disabled next button, or ">" link
    const selectors = [
      'button[aria-label*="next" i]:not([disabled])',
      'a[aria-label*="next" i]',
      '[class*="pagination"] [class*="next"]:not([class*="disabled"])',
      'button[class*="next"]:not([disabled])',
      'a[class*="next"]:not([class*="disabled"])',
      'li.next:not(.disabled) a',
    ];
    return selectors.some((sel) => document.querySelector(sel) !== null);
  });
}

// ─── Scrape a single job detail page ──────────────────────────────────────────
async function scrapeDetailPage(
  page: Page,
  url: string,
  gjobId: string,
): Promise<ScrapedCircular | null> {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30_000 });

    // Wait for content beyond the nav
    await page.waitForSelector('main, [class*="detail"], [class*="job-info"], h1, h2', {
      timeout: 15_000,
    });

    const raw = await page.evaluate((sourceUrl: string) => {
      // ── Helper: get text content of first matching selector ──
      const text = (...sels: string[]): string | null => {
        for (const sel of sels) {
          const el = document.querySelector(sel);
          if (el?.textContent?.trim()) return el.textContent.trim();
        }
        return null;
      };

      // ── Helper: get src/href attribute ──
      const attr = (sel: string, attrName: string): string | null => {
        const el = document.querySelector(sel);
        return el?.getAttribute(attrName) ?? null;
      };

      // ── Helper: find a labeled field by scanning the whole document ──
      // Many Bangladeshi government portals label fields like:
      //   <dt>পদসংখ্যা</dt><dd>৫০</dd>  OR  "পদসংখ্যা: ৫০" in a <p>
      const labeledField = (labels: string[]): string | null => {
        // Strategy 1: <dt>/<dd> pairs
        const dts = Array.from(document.querySelectorAll('dt, th'));
        for (const dt of dts) {
          const text = dt.textContent ?? '';
          if (labels.some((l) => text.includes(l))) {
            const sibling =
              dt.nextElementSibling ?? (dt as HTMLElement).parentElement?.nextElementSibling;
            if (sibling?.textContent?.trim()) return sibling.textContent.trim();
          }
        }

        // Strategy 2: inline "Label: Value" text
        const allTexts = Array.from(document.querySelectorAll('p, li, span, td, div'));
        for (const el of allTexts) {
          const t = el.textContent ?? '';
          for (const label of labels) {
            const idx = t.indexOf(label);
            if (idx !== -1) {
              // Return everything after "label:" up to next newline or 200 chars
              const after = t
                .slice(idx + label.length)
                .replace(/^[\s:：]+/, '')
                .slice(0, 200);
              if (after.trim()) return after.trim();
            }
          }
        }
        return null;
      };

      // ── Extract each field ──────────────────────────────────────────────────

      // Organization name (try multiple selectors)
      const orgName =
        text(
          '[class*="organization-name"]',
          '[class*="orgName"]',
          '[class*="company-name"]',
          '[class*="ministry"]',
          'header h2',
        ) ??
        labeledField(['প্রতিষ্ঠানের নাম', 'মন্ত্রণালয়', 'Organization', 'Ministry']) ??
        '';

      // Job title
      const title =
        text('h1[class*="title"]', '[class*="job-title"]', '[class*="post-name"]', 'h1', 'h2') ??
        labeledField(['পদের নাম', 'পদবি', 'Post Name', 'Position']) ??
        'অজানা পদ';

      // Logo
      const logoUrl =
        attr('img[class*="logo"]', 'src') ??
        attr('[class*="org-logo"] img', 'src') ??
        attr('[class*="organization"] img', 'src') ??
        null;

      // Total posts / vacancies
      const postsRaw =
        labeledField(['পদসংখ্যা', 'মোট পদ', 'শূন্য পদ', 'Vacancy', 'Total Post', 'Posts']) ??
        text('[class*="total-post"]', '[class*="vacancy"]');

      // Deadline
      const deadlineRaw =
        labeledField(['আবেদনের শেষ তারিখ', 'শেষ তারিখ', 'Deadline', 'Last Date', 'Apply By']) ??
        text('[class*="deadline"]', '[class*="last-date"]');

      // Publish date
      const publishDateRaw =
        labeledField(['প্রকাশের তারিখ', 'Publish Date', 'Published']) ??
        text('[class*="publish-date"]', '[class*="published"]', 'time');

      // Exam date
      const examDateRaw =
        labeledField(['পরীক্ষার তারিখ', 'Exam Date', 'পরীক্ষা']) ?? text('[class*="exam-date"]');

      // Salary
      const salary =
        labeledField(['বেতন', 'বেতন স্কেল', 'Salary', 'Pay Grade', 'Pay Scale']) ??
        text('[class*="salary"]');

      // Experience
      const experience = labeledField(['অভিজ্ঞতা', 'Experience']) ?? text('[class*="experience"]');

      // Location
      const location =
        labeledField(['কর্মস্থল', 'পোস্টিং', 'Location', 'Posting']) ?? text('[class*="location"]');

      // Ministry
      const ministry =
        labeledField(['মন্ত্রণালয়', 'Ministry', 'Department']) ??
        text('[class*="ministry"]', '[class*="department"]');

      // Category
      const category =
        labeledField(['বিভাগ', 'Category', 'ধরন', 'Job Type']) ??
        text('[class*="category"]', '[class*="job-type"]');

      // Eligibility / qualifications
      const eligibility =
        labeledField(['শিক্ষাগত যোগ্যতা', 'যোগ্যতা', 'Qualification', 'Eligibility']) ??
        text('[class*="eligibility"]', '[class*="qualification"]');

      // Application URL — look for teletalk applyonline link
      const appLinkEl = document.querySelector<HTMLAnchorElement>(
        'a[href*="applyonline.teletalk"], a[href*="apply"], a[class*="apply-btn"], a[class*="applyBtn"]',
      );
      const applicationUrl = appLinkEl?.href ?? null;

      // Full description — biggest block of text on the page
      const descEl =
        document.querySelector('[class*="description"]') ??
        document.querySelector('[class*="job-details"]') ??
        document.querySelector('article') ??
        document.querySelector('main');
      const description = descEl?.innerText?.trim() ?? null;

      return {
        orgName,
        title,
        logoUrl,
        postsRaw,
        deadlineRaw,
        publishDateRaw,
        examDateRaw,
        salary,
        experience,
        location,
        ministry,
        category,
        eligibility,
        applicationUrl,
        description,
        sourceUrl,
      };
    }, url);

    // ── Post-process ──────────────────────────────────────────────────────────
    const deadline = parseDate(raw.deadlineRaw);
    const publishDate = parseDate(raw.publishDateRaw);
    const examDate = parseDate(raw.examDateRaw);
    const status = deriveStatus(deadline, publishDate);

    const result: ScrapedCircular = {
      gjobId: gjobId || null,
      organizationName: raw.orgName || 'অজানা প্রতিষ্ঠান',
      organizationSlug: slugify(raw.orgName || 'unknown'),
      orgType: 'GOVERNMENT',
      logoUrl: raw.logoUrl
        ? raw.logoUrl.startsWith('http')
          ? raw.logoUrl
          : `${BASE_URL}${raw.logoUrl}`
        : null,
      title: raw.title || 'অজানা পদ',
      totalPosts: parseTotalPosts(raw.postsRaw),
      applicationUrl: raw.applicationUrl,
      publishDate,
      deadline,
      examDate,
      description: raw.description?.slice(0, 10_000) ?? null, // DB Text limit guard
      eligibility: raw.eligibility,
      salary: raw.salary,
      experience: raw.experience,
      location: raw.location,
      source: url,
      category: raw.category,
      ministry: raw.ministry,
      status,
      isActive: status !== 'EXPIRED',
    };

    return result;
  } catch (err) {
    console.error(`    ❌ Failed to scrape ${url}:`, (err as Error).message);
    return null;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Farhan MCQ — Job Circular Scraper');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Output  : ${OUTPUT}`);
  console.log(`  Delay   : ${DELAY_MS}ms`);
  console.log(`  Pages   : ${START_PAGE} – ${MAX_PAGES}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Load checkpoint
  const existing = loadExisting();
  const doneIds = new Set(existing.map((j) => j.gjobId).filter(Boolean) as string[]);
  const allResults = [...existing];
  console.log(`  Resuming: ${doneIds.size} circulars already scraped.\n`);

  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--lang=bn,en',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'bn,en-US;q=0.9,en;q=0.8' });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  );

  let totalNewlyScraped = 0;

  try {
    for (let pageNum = START_PAGE; pageNum <= MAX_PAGES; pageNum++) {
      console.log(`\n── Page ${pageNum} ──────────────────────────────────────────`);

      const links = await scrapeListPage(page, pageNum);
      if (links.length === 0) {
        console.log('  No links found — stopping pagination.');
        break;
      }

      console.log(`  Found ${links.length} job links on page ${pageNum}`);

      let newOnPage = 0;
      for (const { href, gjobId } of links) {
        if (doneIds.has(gjobId)) {
          console.log(`  ⏭  Skip ${gjobId} (already done)`);
          continue;
        }

        await sleep(DELAY_MS);
        console.log(`  🔍 Scraping jobId=${gjobId} …`);

        const circular = await scrapeDetailPage(page, href, gjobId);
        if (circular) {
          allResults.push(circular);
          doneIds.add(gjobId);
          totalNewlyScraped++;
          newOnPage++;
          saveAll(allResults); // checkpoint after every job
          console.log(`     ✓ ${circular.organizationName} — ${circular.title}`);
        }
      }

      console.log(`  Newly scraped on page ${pageNum}: ${newOnPage}`);

      // Check for next page
      const more = await hasNextPage(page);
      if (!more) {
        console.log('\n  No next page — scraping complete.');
        break;
      }

      await sleep(DELAY_MS);
    }
  } finally {
    await browser.close();
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Done! Total circulars in file : ${allResults.length}`);
  console.log(`  Newly scraped this run        : ${totalNewlyScraped}`);
  console.log(`  Output file                   : ${OUTPUT}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
