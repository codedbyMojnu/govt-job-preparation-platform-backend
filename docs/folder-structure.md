# Express.js API Server — Folder Structure

> Quick reference for the express-api-starter project structure.
> For architectural explanations, see `express-api-architecture.md`.

---

```
project-root/
│
├── prisma/                                          # Database schema & migrations
│   ├── schema/
│   │   ├── base.prisma                              # datasource + generator config
│   │   ├── user.prisma
│   │   ├── order.prisma
│   │   ├── product.prisma
│   │   └── notification.prisma
│   ├── migrations/
│   │   ├── 20260101000000_initial/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── seed.ts
│
├── src/
│   │
│   ├── server.ts                                    # HTTP server bootstrap, graceful shutdown
│   ├── app.ts                                       # Express app factory
│   ├── container.ts                                 # Awilix DI container
│   │
│   ├── config/
│   │   ├── index.ts                                 # Barrel: re-exports + validates env
│   │   ├── env.schema.ts                            # Zod env schema
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── auth.ts
│   │   ├── queue.ts
│   │   └── logger.ts
│   │
│   ├── features/
│   │   │
│   │   ├── user/
│   │   │   ├── api/
│   │   │   │   ├── v1/
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── index.ts
│   │   │   ├── domain/
│   │   │   │   ├── service.ts
│   │   │   │   ├── types.ts
│   │   │   │   ├── repository.contract.ts
│   │   │   │   ├── errors.ts
│   │   │   │   └── mapper.ts
│   │   │   ├── infra/
│   │   │   │   └── repository.ts
│   │   │   ├── __tests__/
│   │   │   │   ├── unit/
│   │   │   │   │   ├── service.test.ts
│   │   │   │   │   └── controller.test.ts
│   │   │   │   └── integration/
│   │   │   │       └── routes.test.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   ├── v1/
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── index.ts
│   │   │   ├── domain/
│   │   │   │   ├── service.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── errors.ts
│   │   │   ├── infra/
│   │   │   │   ├── jwt.provider.ts
│   │   │   │   └── oauth.provider.ts
│   │   │   ├── __tests__/
│   │   │   │   ├── unit/
│   │   │   │   │   └── service.test.ts
│   │   │   │   └── integration/
│   │   │   │       └── routes.test.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── order/
│   │   │   ├── api/
│   │   │   │   ├── v1/
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── v2/                              # Only when breaking changes exist
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── index.ts
│   │   │   ├── domain/
│   │   │   │   ├── service.ts
│   │   │   │   ├── types.ts
│   │   │   │   ├── repository.contract.ts
│   │   │   │   ├── errors.ts
│   │   │   │   └── mapper.ts
│   │   │   ├── infra/
│   │   │   │   └── repository.ts
│   │   │   ├── __tests__/
│   │   │   │   ├── unit/
│   │   │   │   │   ├── service.test.ts
│   │   │   │   │   ├── controller.v1.test.ts
│   │   │   │   │   └── controller.v2.test.ts
│   │   │   │   └── integration/
│   │   │   │       └── routes.test.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── product/
│   │   │   ├── api/
│   │   │   │   ├── v1/
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── index.ts
│   │   │   ├── domain/
│   │   │   │   ├── service.ts
│   │   │   │   ├── types.ts
│   │   │   │   ├── repository.contract.ts
│   │   │   │   ├── errors.ts
│   │   │   │   └── mapper.ts
│   │   │   ├── infra/
│   │   │   │   └── repository.ts
│   │   │   ├── __tests__/
│   │   │   │   ├── unit/
│   │   │   │   │   └── service.test.ts
│   │   │   │   └── integration/
│   │   │   │       └── routes.test.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── notification/
│   │   │   ├── api/
│   │   │   │   ├── v1/
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── routes.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── index.ts
│   │   │   ├── domain/
│   │   │   │   ├── service.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── errors.ts
│   │   │   ├── infra/
│   │   │   │   ├── repository.ts
│   │   │   │   └── email.sender.ts
│   │   │   ├── __tests__/
│   │   │   │   ├── unit/
│   │   │   │   │   └── service.test.ts
│   │   │   │   └── integration/
│   │   │   │       └── routes.test.ts
│   │   │   └── index.ts
│   │   │
│   │   └── health/
│   │       ├── controller.ts
│   │       ├── routes.ts
│   │       └── index.ts
│   │
│   ├── infrastructure/
│   │   │
│   │   ├── http/
│   │   │   ├── middleware/
│   │   │   │   ├── correlation-id.middleware.ts
│   │   │   │   ├── request-logger.middleware.ts
│   │   │   │   ├── rate-limiter.middleware.ts
│   │   │   │   ├── request-context.middleware.ts
│   │   │   │   ├── authenticate.middleware.ts
│   │   │   │   ├── authorize.middleware.ts
│   │   │   │   ├── validate.middleware.ts
│   │   │   │   ├── not-found.middleware.ts
│   │   │   │   └── error-handler.middleware.ts
│   │   │   ├── routes/
│   │   │   │   ├── v1.ts
│   │   │   │   └── v2.ts
│   │   │   └── create-app.ts
│   │   │
│   │   ├── database/
│   │   │   └── prisma-client.ts
│   │   │
│   │   ├── cache/
│   │   │   ├── redis-client.ts
│   │   │   └── cache.service.ts
│   │   │
│   │   ├── queue/
│   │   │   ├── bullmq-client.ts
│   │   │   ├── producers/
│   │   │   │   └── email.producer.ts
│   │   │   └── consumers/
│   │   │       └── email.consumer.ts
│   │   │
│   │   ├── http-client/
│   │   │   └── external-api.client.ts
│   │   │
│   │   └── observability/
│   │       ├── tracing.ts
│   │       ├── metrics.ts
│   │       └── logger.ts
│   │
│   └── shared/
│       ├── errors/
│       │   ├── app-error.contract.ts
│       │   ├── app-error.ts
│       │   ├── http-errors.ts
│       │   └── error-codes.ts
│       ├── types/
│       │   ├── express.d.ts
│       │   ├── pagination.types.ts
│       │   ├── common.types.ts
│       │   └── guards.ts
│       ├── utils/
│       │   ├── async-handler.ts
│       │   ├── pagination.utils.ts
│       │   ├── slug.utils.ts
│       │   └── date.utils.ts
│       └── constants/
│           ├── http-status.ts
│           └── app.constants.ts
│
├── tests/
│   ├── setup.ts
│   ├── teardown.ts
│   ├── helpers/
│   │   ├── prisma-mock.ts
│   │   ├── request.helper.ts
│   │   └── auth.helper.ts
│   ├── fixtures/
│   │   ├── users.fixture.ts
│   │   └── orders.fixture.ts
│   └── factories/
│       ├── index.ts
│       ├── user.factory.ts
│       └── order.factory.ts
│
├── docs/
│   └── adr/
│       ├── 0001-use-feature-based-architecture.md
│       ├── 0002-global-api-versioning.md
│       ├── 0003-prisma-as-orm.md
│       ├── 0004-awilix-for-dependency-injection.md
│       ├── 0005-fishery-for-test-factories.md
│       └── template.md
│
├── tsconfig.json
├── vitest.config.ts
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── package.json
└── README.md
```
