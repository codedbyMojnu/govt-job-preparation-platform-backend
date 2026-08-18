/**
 * End-to-end smoke test for docx export (/docs feature).
 * Usage: npx tsx --env-file=.env scripts/smoke-test-docx.ts [questionSetId1] [questionSetId2...]
 */
import { PrismaClient } from '@prisma/client';

const STYLE = {
  templateStyle: 'COLORFUL' as const,
  columnCount: 1 as const,
  fontSizePt: null,
  fontBn: 'Kalpurush',
  brandName: 'Farhan MCQ',
  brandSubtitle: 'farhanmcq.com',
  footerText: 'নিয়মিত অনুশীলন করতে ফলো করুন — Farhan MCQ',
  showExplanation: false,
  explanationMaxChars: 400,
  siteBaseUrl: 'https://farhanmcq.com',
};

const prisma = new PrismaClient();
const API = `http://127.0.0.1:${process.env.PORT ?? 3002}/api`;
const ADMIN_MOBILE = '01700000000';
const ADMIN_PASSWORD = 'admin123';

async function loginAdmin(): Promise<string> {
  const res = await fetch(`${API}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile: ADMIN_MOBILE, password: ADMIN_PASSWORD }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`Login failed → ${res.status}: ${JSON.stringify(body)}`);
  }
  const token = (body as { data?: { token?: string } })?.data?.token;
  if (!token) throw new Error('Login response missing token');
  return token;
}

async function api<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`${init?.method ?? 'GET'} ${path} → ${res.status}: ${JSON.stringify(body)}`);
  }
  return body as T;
}

async function resolveQuestionSetIds(): Promise<string[]> {
  const args = process.argv.slice(2).filter(Boolean);
  if (args.length > 0) return args;

  const sets = await prisma.questionSet.findMany({
    where: { questions: { some: {} } },
    orderBy: { createdAt: 'desc' },
    take: 2,
    select: { id: true, title: true },
  });
  if (sets.length === 0) throw new Error('No question sets with questions found in DB');
  for (const s of sets) console.log(`  • ${s.title} (${s.id})`);
  return sets.map((s) => s.id);
}

async function pollJob(
  token: string,
  jobId: string,
): Promise<{ documentId: string; questionCount: number; setCount: number }> {
  for (let i = 0; i < 90; i++) {
    const { data } = await api<{
      data: {
        status: string;
        progress: number;
        document?: { id: string; questionCount: number; setCount: number };
        errorMessage?: string;
      };
    }>(`/v1/docs/jobs/${jobId}`, token);

    console.log(`  poll ${i + 1}: ${data.status} ${data.progress}%`);
    if (data.status === 'DONE' && data.document) {
      return {
        documentId: data.document.id,
        questionCount: data.document.questionCount,
        setCount: data.document.setCount,
      };
    }
    if (data.status === 'FAILED') {
      throw new Error(data.errorMessage ?? 'Docx job failed');
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error('Docx job timed out');
}

async function main() {
  console.log('=== Docx export smoke test ===\n');

  const questionSetIds = await resolveQuestionSetIds();
  console.log(`\nUsing ${questionSetIds.length} question set(s)\n`);

  console.log('1. Login as admin');
  const token = await loginAdmin();
  console.log('   OK\n');

  console.log('2. POST /v1/docs/generate');
  const { data: gen } = await api<{
    data: { cached: boolean; jobId?: string; document?: { id: string } };
  }>('/v1/docs/generate', token, {
    method: 'POST',
    body: JSON.stringify({ questionSetIds, styleConfig: STYLE }),
  });

  let documentId = gen.document?.id;
  if (gen.cached && documentId) {
    console.log(`   cache hit — document ${documentId}\n`);
  } else if (gen.jobId) {
    console.log(`   job queued: ${gen.jobId}`);
    const done = await pollJob(token, gen.jobId);
    documentId = done.documentId;
    console.log(
      `   done — document ${documentId} (${done.setCount} set(s), ${done.questionCount} questions)\n`,
    );
  } else {
    throw new Error('Generate returned neither cache nor jobId');
  }

  console.log(`3. GET /v1/docs/exports/${documentId}`);
  const { data: exportData } = await api<{
    data: { document: { questionCount: number; setCount: number }; styleConfig: { templateStyle: string } };
  }>(`/v1/docs/exports/${documentId}`, token);
  console.log(
    `   ${exportData.document.setCount} set(s), ${exportData.document.questionCount} questions, template=${exportData.styleConfig.templateStyle}\n`,
  );

  console.log(`4. GET /v1/docs/exports/${documentId}/download`);
  const dlRes = await fetch(`${API}/v1/docs/exports/${documentId}/download`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!dlRes.ok) {
    const err = await dlRes.text();
    throw new Error(`Download failed → ${dlRes.status}: ${err.slice(0, 200)}`);
  }
  const buf = Buffer.from(await dlRes.arrayBuffer());
  const isDocx = buf[0] === 0x50 && buf[1] === 0x4b;
  if (!isDocx || buf.length < 1000) {
    throw new Error(`Downloaded file is not a valid docx (size=${buf.length}, sig=${buf.slice(0, 4).toString('hex')})`);
  }
  console.log(`   downloaded ${buf.length} bytes — valid ZIP/docx signature OK\n`);

  console.log('5. Cache hit check (same sets + style)');
  const { data: gen2 } = await api<{ data: { cached: boolean; document?: { id: string } } }>(
    '/v1/docs/generate',
    token,
    {
      method: 'POST',
      body: JSON.stringify({ questionSetIds, styleConfig: STYLE }),
    },
  );
  if (!gen2.cached || gen2.document?.id !== documentId) {
    throw new Error('Expected cache hit on second generate with identical config');
  }
  console.log('   cache hit confirmed\n');

  console.log('✅ All docx smoke tests passed.');
}

main()
  .catch((err) => {
    console.error('\n❌', err.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
