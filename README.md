# Farhan MCQ — Backend API

Production-grade REST API for the **Farhan MCQ** exam preparation platform. Built with Express.js and TypeScript, it powers authentication, question banks, live exams, subscriptions, slide generation, social broadcast automation, and admin operations for Bangladesh government job aspirants.

**Version:** 1.1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Prerequisites](#prerequisites)
5. [Setup Guide](#setup-guide)
6. [Environment Variables](#environment-variables)
7. [Available Scripts](#available-scripts)
8. [API Surface](#api-surface)
9. [Infrastructure Services](#infrastructure-services)
10. [Project Structure](#project-structure)
11. [Testing](#testing)
12. [Production Notes](#production-notes)

---

## Overview

The backend exposes a versioned REST API under `/api/v1/*` and serves as the single source of truth for:

- **Member features** — registration, login, exam attempts, favorites, subscriptions, and notifications
- **Admin features** — exam categories, question sets, routines, syllabi, job circulars, packages, and transactions
- **Content tooling** — AI provider key management, PDF generation, video library, and slide rendering
- **Broadcast automation** — social media dispatch rules, integration credentials, and broadcast logs

The API validates all configuration at startup using a Zod schema (`src/config/env.schema.ts`). Invalid or missing required variables cause an immediate, structured fatal error before the server accepts traffic.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js ≥ 22 |
| Framework | Express.js 4 |
| Language | TypeScript (strict mode) |
| Database | PostgreSQL 17 + Prisma ORM 6 |
| Cache / Queue | Redis 7 + BullMQ |
| Object Storage | MinIO (S3-compatible) |
| Dependency Injection | Awilix |
| Validation | Zod |
| Authentication | JWT (jsonwebtoken + bcryptjs) |
| Logging | Pino |
| Observability | OpenTelemetry |
| Testing | Vitest + Testcontainers |
| Build | tsup |

---

## Architecture

The codebase follows a **feature-based modular architecture** with a dedicated infrastructure layer:

```
┌─────────────────────────────────────────────────────────┐
│  HTTP Layer (Express middleware, rate limits, CORS)     │
├─────────────────────────────────────────────────────────┤
│  Feature Modules (auth, question-set, slide, broadcast) │
│    api/ → domain/ → infra/                              │
├─────────────────────────────────────────────────────────┤
│  Infrastructure (Prisma, Redis, BullMQ, MinIO, Pino)    │
├─────────────────────────────────────────────────────────┤
│  Shared utilities, constants, crypto                    │
└─────────────────────────────────────────────────────────┘
```

### Design principles

- **Validated configuration** — environment variables are parsed and type-checked before boot
- **Feature isolation** — each domain owns its routes, services, repositories, and validation schemas
- **Factory-based I/O** — database, cache, and queue clients are created in `src/infrastructure/`
- **Graceful shutdown** — SIGTERM/SIGINT drain HTTP connections, workers, Prisma, and Redis cleanly
- **Security by default** — Helmet, CORS, rate limiting, input sanitization, and request timeouts

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | ≥ 22.0.0 | Enforced in `package.json` engines |
| npm | ≥ 9 | Or compatible package manager |
| Docker & Docker Compose | Latest stable | For PostgreSQL, Redis, and MinIO locally |
| PostgreSQL | 17 (via Docker) | Or a hosted instance (e.g. Supabase) |
| Redis | 7 (via Docker) | Required for caching and job queues |

Optional for maintenance scripts:

- **Supabase CLI** — if using `BACKUP_METHOD=supabase`
- **pg_dump** — for manual database backups

---

## Setup Guide

Follow these steps in order to run the API locally.

### Step 1 — Clone and install dependencies

```bash
cd backend
npm install
```

### Step 2 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and set all **required** values. See [Environment Variables](#environment-variables) for a full reference and analysis.

At minimum, generate strong secrets before your first run:

```bash
openssl rand -hex 32   # Use for JWT_SECRET, INTERNAL_API_SECRET
openssl rand -hex 32   # Use for AI_KEY_ENCRYPTION_SECRET (64 hex chars)
```

Ensure `INTERNAL_API_SECRET` matches the value in `frontend/.env.local`.

### Step 3 — Start infrastructure services

Start PostgreSQL, Redis, and MinIO using Docker Compose:

```bash
docker compose up -d postgres redis minio minio-init
```

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Cache and BullMQ queues |
| MinIO API | 9000 | Slide image storage (S3-compatible) |
| MinIO Console | 9001 | Web UI for bucket management |

> **Note:** If you use a remote database (e.g. Supabase), point `DATABASE_URL` to that instance. The local `postgres` Docker service is optional in that case.

### Step 4 — Apply database schema

```bash
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Apply pending migrations
```

Optional — seed sample data:

```bash
npm run db:seed
```

### Step 5 — Start the development server

```bash
npm run dev
```

The API starts on **http://localhost:3002** (or the port set in `PORT`).

Verify the health endpoint:

```bash
curl http://localhost:3002/api/health
# {"status":"ok","timestamp":"..."}
```

### Step 6 — (Optional) Start the slide worker

Slide generation jobs are processed by a BullMQ worker. In development, the worker is **embedded automatically** in the API process. For production-like behaviour:

```bash
# Option A — dedicated worker process
npm run worker:dev

# Option B — Docker worker container
docker compose up -d worker
```

### Step 7 — Connect the frontend

In `frontend/.env.local`, set:

```env
USE_MOCKS=false
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_API_ORIGIN=http://localhost:3002
API_PROXY_TARGET=http://localhost:3002
INTERNAL_API_SECRET=<same value as backend>
JWT_SECRET=<same value as backend>
```

Start the frontend from its directory with `npm run dev`. Browser requests to `/api/v1/*` are proxied to this backend.

---

## Environment Variables

All runtime variables are validated by `src/config/env.schema.ts` at startup. Copy `.env.example` to `.env` and configure each section below.

### Core runtime

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | `development`, `production`, or `test` |
| `PORT` | No | `3002` | HTTP listen port (1–65535) |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string (`postgresql://` or `postgres://`) |
| `REDIS_URL` | **Yes** | — | Redis connection string (`redis://` or `rediss://`) |
| `LOG_LEVEL` | No | `info` | Pino log level: `fatal` \| `error` \| `warn` \| `info` \| `debug` \| `trace` \| `silent` |

**Analysis:** `DATABASE_URL` is the primary data store for all Prisma models (users, questions, exams, subscriptions, broadcasts, etc.). `REDIS_URL` backs BullMQ job queues (slide rendering, broadcast dispatch) and future caching. In development, pretty-printed logs are enabled automatically when `NODE_ENV=development`.

### Authentication and internal security

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | **Yes** | — | JWT signing key (≥ 32 chars, high character diversity) |
| `JWT_EXPIRES_IN` | No | `15m` | Token lifetime (`<n>s\|m\|h\|d`, max 30 days) |
| `AI_KEY_ENCRYPTION_SECRET` | **Yes** | — | AES key for encrypted AI provider keys in DB (64 hex chars) |
| `INTERNAL_API_SECRET` | **Yes** | — | Shared secret for server-to-server calls from Next.js (≥ 32 chars) |

**Analysis:** `JWT_SECRET` signs member and admin session tokens. Weak or short values are rejected in production. `AI_KEY_ENCRYPTION_SECRET` encrypts third-party API keys stored via the admin panel (`/api/v1/ai-provider-keys`). `INTERNAL_API_SECRET` must be identical in the frontend `.env.local` so Next.js API routes can call protected backend endpoints securely.

Generate secrets:

```bash
openssl rand -hex 32   # JWT_SECRET, INTERNAL_API_SECRET
openssl rand -hex 32   # AI_KEY_ENCRYPTION_SECRET
```

### CORS

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CORS_ORIGINS` | No | `*` | Comma-separated allowed origins |

**Analysis:** In development, `*` permits any origin. In **production**, the wildcard is rejected — you must list explicit frontend URLs (e.g. `https://farhanmcq.com`).

### Bulk SMS (MiMSMS)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MIMSMS_API_KEY` | **Yes** | — | MiMSMS API key |
| `MIMSMS_USER_NAME` | **Yes** | — | MiMSMS account username |
| `MIMSMS_SENDER_NAME` | **Yes** | — | Sender ID / phone number |

**Analysis:** Used for OTP and transactional SMS (registration, password reset). All three fields are mandatory at startup even if SMS is not exercised in local development — use placeholder values and replace before going live.

### MinIO (slide storage)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MINIO_ENDPOINT` | No | `localhost` | MinIO hostname |
| `MINIO_PORT` | No | `9000` | MinIO API port |
| `MINIO_USE_SSL` | No | `false` | `true` or `false` (string, not boolean coercion) |
| `MINIO_ACCESS_KEY` | **Yes** | — | S3 access key |
| `MINIO_SECRET_KEY` | **Yes** | — | S3 secret key |
| `MINIO_BUCKET` | No | `farhan-slides` | Bucket for rendered slide PNGs and scene JSON |

**Analysis:** Powers the `/api/v1/slides` feature. Credentials must match `docker-compose.yml` (`MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD`). The `minio-init` service creates the bucket on first boot.

### Slide worker

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EMBED_SLIDE_WORKER` | No | `true` in dev | Embed BullMQ worker in the API process |

**Analysis:** When `true`, slide jobs are processed inside `npm run dev`. In production, disable embedding and run `docker compose up worker` or `npm run start:worker` so rendering does not block HTTP request handling.

### Maintenance scripts (not validated at startup)

| Variable | Required | Description |
|----------|----------|-------------|
| `MISTRAL_API_KEYS` | No | Comma-separated Mistral keys for Prisma backfill scripts |
| `MISTRAL_API_KEY` | No | Single-key alias accepted by scripts |

Used by:

- `npm run db:backfill-explanation-mistral-ai`
- `npm run db:backfill-topic-subTopic`

### Database backup tooling (optional, operational)

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKUP_DIR` | `backups` | Local directory for dump files |
| `USE_SUPABASE_CLI` | `true` | Use Supabase CLI for remote dumps |
| `BACKUP_METHOD` | `supabase` | Backup strategy identifier |
| `BACKUP_DATA_ONLY` | `true` | Data-only dumps (no schema) |
| `SUPABASE_DUMP_USE_COPY` | `true` | Use COPY format in pg_dump |
| `BACKUP_KEEP_COUNT` | `20` | Number of backups to retain |
| `PG_DUMP_COMMAND` | `pg_dump` | pg_dump binary path |
| `SUPABASE_COMMAND` | `supabase` | Supabase CLI binary path |

**Analysis:** These variables support external backup workflows and are **not** read by the API runtime. They are documented here because they appear in the project `.env` for operational use with hosted Supabase databases.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start API with hot reload (`tsx --watch`) |
| `npm run worker:dev` | Start slide worker with hot reload |
| `npm run build` | Production build via tsup |
| `npm start` | Run compiled `dist/server.js` |
| `npm run start:worker` | Run compiled slide worker |
| `npm run typecheck` | TypeScript type check |
| `npm run lint` | ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Prettier formatting |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:integration` | Integration tests (Testcontainers) |
| `npm run test:coverage` | Tests with coverage report |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run Prisma migrations (dev) |
| `npm run db:push` | Push schema without migration files |
| `npm run db:seed` | Seed question data |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run smoke:slides` | Smoke test slide generation pipeline |
| `npm run smoke:broadcast` | Smoke test broadcast automation |

---

## API Surface

All routes are prefixed with `/api/v1`.

| Route prefix | Domain |
|--------------|--------|
| `/auth` | Registration, login, token refresh |
| `/exam-categories` | Top-level exam categories (BCS, Bank, etc.) |
| `/sub-exam-categories` | Sub-divisions within categories |
| `/question-sets` | Curated exam question sets |
| `/routines` | Exam schedules |
| `/syllabuses` | Syllabus content |
| `/job-circulars` | Government job notifications |
| `/packages` | Subscription packages and payments |
| `/notifications` | Push notifications |
| `/slides` | Slide generation and retrieval |
| `/videos` | Video library |
| `/pdfs` | PDF document management |
| `/ai-provider-keys` | Encrypted third-party AI key storage |
| `/integration-credentials` | Social platform credentials |
| `/broadcasts` | Broadcast dispatch logs |
| `/broadcast-automation/rules` | Automation rule CRUD |

Health check (unversioned): `GET /api/health`

---

## Infrastructure Services

### Docker Compose services

```bash
docker compose up -d          # All services
docker compose up -d postgres redis minio minio-init   # Minimum for local dev
docker compose up -d worker   # Production slide worker
```

### Infrastructure layer (`src/infrastructure/`)

| Module | Role |
|--------|------|
| `database/prisma-client.ts` | Prisma client factory |
| `cache/redis-client.ts` | ioredis connection |
| `queue/bullmq-client.ts` | BullMQ Redis connection |
| `observability/logger.ts` | Pino logger with redaction |
| `observability/tracing.ts` | OpenTelemetry auto-instrumentation |

Sensitive fields (authorization headers, passwords, tokens) are redacted from logs. Redaction paths are defined in `src/config/logger.ts`.

---

## Project Structure

```
backend/
├── prisma/
│   └── schema/              # Multi-file Prisma schema + migrations
├── src/
│   ├── server.ts            # Entry point
│   ├── app.ts               # Express app factory
│   ├── container.ts         # Awilix DI container
│   ├── config/              # Env schema, logger config
│   ├── features/            # Domain modules
│   │   ├── auth/
│   │   ├── exam-category/
│   │   ├── question-set/
│   │   ├── slide/
│   │   ├── broadcast/
│   │   └── ...
│   ├── infrastructure/      # DB, cache, queue, middleware
│   ├── shared/              # Utilities, constants
│   └── worker/              # BullMQ slide worker bootstrap
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.worker
└── .env.example
```

---

## Testing

```bash
# Unit tests
npm run test:unit

# Integration tests (spins up Postgres + Redis via Testcontainers)
npm run test:integration

# Full suite with coverage
npm run test:coverage
```

Test setup seeds minimum env vars in `src/config/__tests__/setup-env.ts` so config validation does not block test imports.

---

## Production Notes

1. Set `NODE_ENV=production` and use explicit `CORS_ORIGINS` (no wildcard).
2. Replace all placeholder secrets with cryptographically random values.
3. Run the slide worker as a separate process or container — do not embed it in the API.
4. Use a managed PostgreSQL instance with connection pooling (e.g. Supabase pooler).
5. Enable TLS for MinIO (`MINIO_USE_SSL=true`) when not on a private network.
6. Monitor logs at `LOG_LEVEL=info` or `warn`; use `debug` only for short-lived troubleshooting.
7. Build and run:

```bash
npm run build
npm start
```

---

## License

MIT
