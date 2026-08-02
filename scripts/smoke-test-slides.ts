/**
 * End-to-end smoke test for slide generation (Phase 4).
 * Usage: npx tsx --env-file=.env scripts/smoke-test-slides.ts [questionSetId]
 */
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

import { authConfig } from '../src/config/auth.js';

const STYLE = {
  mode: 'GROUPED' as const,
  questionsPerSlide: 5,
  slideWidth: 1080,
  slideHeight: 1080,
  bgColor: '#ffffff',
  bgGradient: null,
  textColor: '#0a1a2e',
  textSize: 28,
  showOptions: true,
  showAnswer: true,
  showExplanation: true,
};

const prisma = new PrismaClient();
const API = `http://localhost:${process.env.PORT ?? 3002}/api`;

async function mintToken(): Promise<string> {
  const mobile = '01799999998';
  let user = await prisma.user.findUnique({ where: { mobile } });
  if (!user) {
    user = await prisma.user.create({
      data: { mobile, password: 'smoke-test', name: 'Phase 4 Smoke Test' },
    });
  }
  return jwt.sign({ userId: user.id, role: user.role }, authConfig.jwtSecret, {
    expiresIn: authConfig.jwtExpiresIn as string & jwt.SignOptions['expiresIn'],
  });
}

async function api<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
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

async function resolveQuestionSetId(): Promise<string> {
  const arg = process.argv[2];
  if (arg) return arg;

  const set = await prisma.questionSet.findFirst({
    where: { questions: { some: {} } },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true },
  });
  if (!set) throw new Error('No question set with questions found in DB');
  console.log(`Using question set: ${set.title} (${set.id})`);
  return set.id;
}

async function pollJob(token: string, jobId: string): Promise<{ slideCount: number }> {
  for (let i = 0; i < 90; i++) {
    const { data } = await api<{
      data: { status: string; progress: number; slides?: unknown[]; errorMessage?: string };
    }>(`/v1/slides/jobs/${jobId}`, token);

    console.log(`  poll ${i + 1}: ${data.status} ${data.progress}%`);

    if (data.status === 'DONE') {
      return { slideCount: data.slides?.length ?? 0 };
    }
    if (data.status === 'FAILED') {
      throw new Error(data.errorMessage ?? 'Job failed');
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error('Job timed out after 3 minutes');
}

async function main() {
  const questionSetId = await resolveQuestionSetId();
  const token = await mintToken();

  console.log('1. POST /v1/slides/generate');
  const { data: gen } = await api<{ data: { cached: boolean; jobId?: string; slides?: unknown[] } }>(
    '/v1/slides/generate',
    token,
    { method: 'POST', body: JSON.stringify({ questionSetId, styleConfig: STYLE }) },
  );

  let slideCount = gen.slides?.length ?? 0;
  if (gen.cached) {
    console.log(`   cache hit — ${slideCount} slides`);
  } else if (gen.jobId) {
    console.log(`   job enqueued: ${gen.jobId}`);
    console.log('2. Polling job status...');
    const result = await pollJob(token, gen.jobId);
    slideCount = result.slideCount;
    console.log(`   done — ${slideCount} slides`);
  } else {
    throw new Error('Unexpected generate response');
  }

  console.log('3. GET /v1/slides/:questionSetId');
  const { data: listed } = await api<{ data: { slides: { id: string; order: number }[] } }>(
    `/v1/slides/${questionSetId}`,
    token,
  );
  console.log(`   listed ${listed.slides.length} slides`);

  const [first] = listed.slides;
  if (first) {
    console.log(`4. GET /v1/slides/${first.id}/download`);
    const res = await fetch(`${API}/v1/slides/${first.id}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    console.log(`   PNG size: ${(buf.length / 1024).toFixed(1)} KB`);
  }

  console.log('\n✅ Phase 4 slide smoke test passed');
}

main()
  .catch((err) => {
    console.error('\n❌ Smoke test failed:', err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
