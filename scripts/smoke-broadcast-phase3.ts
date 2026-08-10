/**
 * Phase 3 broadcast E2E smoke test.
 *
 * Usage (from backend/):
 *   npx tsx --env-file=.env scripts/smoke-broadcast-phase3.ts
 *
 * Optional env (or reads ../telegram-facebook-broadcast/.env for BOT_TOKEN etc.):
 *   API_ORIGIN=http://localhost:3002
 *   ADMIN_MOBILE=01700000000
 *   ADMIN_PASSWORD=admin123
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const API_ORIGIN = (process.env.API_ORIGIN || 'http://localhost:3002').replace(/\/+$/, '');

function loadDreamBotEnv(): Record<string, string> {
  const path = resolve(__dir, '../../telegram-facebook-broadcast/.env');
  if (!existsSync(path)) return {};
  const text = readFileSync(path, 'utf8');
  const out: Record<string, string> = {};
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

const dream = loadDreamBotEnv();

async function jsonFetch<T>(
  path: string,
  init?: RequestInit & { token?: string },
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };
  if (init?.token) headers.Authorization = `Bearer ${init.token}`;

  const res = await fetch(`${API_ORIGIN}/api${path}`, { ...init, headers });
  const text = await res.text();
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(`${path} → ${res.status}: ${text.slice(0, 300)}`);
  }
  return body as T;
}

async function main() {
  console.log('=== Broadcast Phase 3 E2E ===\n');
  console.log(`API: ${API_ORIGIN}`);

  const mobile = process.env.ADMIN_MOBILE || '01700000000';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  console.log('\n1. Login...');
  const login = await jsonFetch<{ data: { token: string; user: { id: string } } }>(
    '/v1/auth/login',
    { method: 'POST', body: JSON.stringify({ mobile, password }) },
  );
  const token = login.data.token;
  const userId = login.data.user.id;
  console.log(`   OK — admin ${userId.slice(0, 8)}...`);

  const botToken = process.env.BOT_TOKEN || dream.BOT_TOKEN;
  const groupChatId = process.env.GROUP_CHAT_ID || dream.GROUP_CHAT_ID;
  const fbPageId = process.env.FB_PAGE_ID || dream.FB_PAGE_ID;
  const fbPageToken = process.env.FB_PAGE_ACCESS_TOKEN || dream.FB_PAGE_ACCESS_TOKEN;

  if (!botToken || !groupChatId) {
    throw new Error('Missing BOT_TOKEN / GROUP_CHAT_ID — set env or telegram-facebook-broadcast/.env');
  }

  console.log('\n2. Ensure Telegram group credential...');
  const creds = await jsonFetch<{ data: { id: string; platform: string }[] }>(
    '/v1/integration-credentials',
    { token },
  );
  const hasTgGroup = creds.data.some((c) => c.platform === 'TELEGRAM_GROUP');
  if (!hasTgGroup) {
    await jsonFetch('/v1/integration-credentials', {
      method: 'POST',
      token,
      body: JSON.stringify({
        platform: 'TELEGRAM_GROUP',
        label: 'E2E smoke group',
        config: { botToken, chatId: groupChatId },
      }),
    });
    console.log('   Created TELEGRAM_GROUP credential');
  } else {
    console.log('   TELEGRAM_GROUP credential exists');
  }

  if (fbPageId && fbPageToken) {
    const hasFb = creds.data.some((c) => c.platform === 'FACEBOOK_PAGE');
    if (!hasFb) {
      await jsonFetch('/v1/integration-credentials', {
        method: 'POST',
        token,
        body: JSON.stringify({
          platform: 'FACEBOOK_PAGE',
          label: 'E2E smoke page',
          config: { pageId: fbPageId, pageAccessToken: fbPageToken },
        }),
      });
      console.log('   Created FACEBOOK_PAGE credential');
    } else {
      console.log('   FACEBOOK_PAGE credential exists');
    }
  }

  console.log('\n3. Create automation rule (1 question, 9999 min — manual run only)...');
  const rule = await jsonFetch<{ data: { id: string; name: string } }>(
    '/v1/broadcast-automation/rules',
    {
      method: 'POST',
      token,
      body: JSON.stringify({
        name: `E2E smoke ${new Date().toISOString()}`,
        platforms: ['TELEGRAM_GROUP'],
        questionCount: 1,
        intervalMinutes: 9999,
        isActive: false,
      }),
    },
  );
  console.log(`   Rule id: ${rule.data.id}`);

  console.log('\n4. Run now (sends 1 random question to Telegram group)...');
  const run = await jsonFetch<{ data: { sent: number; failed: number } }>(
    `/v1/broadcast-automation/rules/${rule.data.id}/run-now`,
    { method: 'POST', token, body: '{}' },
  );
  console.log(`   Result: sent=${run.data.sent}, failed=${run.data.failed}`);

  if (run.data.sent === 0) {
    throw new Error('No posts sent — check credentials, questions in DB, and logs');
  }

  console.log('\n5. Broadcast history...');
  const logs = await jsonFetch<{
    data: { contentType: string; status: string; errorMessage: string | null }[];
  }>('/v1/broadcasts?limit=5', { token });
  for (const row of logs.data.slice(0, 3)) {
    console.log(`   - ${row.contentType} ${row.status}${row.errorMessage ? `: ${row.errorMessage}` : ''}`);
  }

  console.log('\n=== Phase 3 E2E PASSED ===');
  console.log('Check your Telegram group for the MCQ post.');
}

main().catch((err) => {
  console.error('\nE2E FAILED:', err instanceof Error ? err.message : err);
  process.exit(1);
});
