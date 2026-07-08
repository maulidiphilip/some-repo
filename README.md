# eticket-backend-repo

Standalone Express + Prisma + Stripe API for the e-ticketing marketplace.

## Folder structure

```
eticket-backend-repo/
├── src/
│   ├── app.ts               # Express app, exported WITHOUT .listen()
│   ├── server.ts            # entrypoint - calls .listen()
│   ├── lib/                 # prisma + stripe singleton clients
│   ├── middleware/          # auth (JWT), Zod validation, error handler
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── schemas/             # Zod schemas
├── tests/
│   ├── setup.ts
│   └── integration/
├── prisma/
│   └── schema.prisma
├── .github/workflows/ci.yml
├── Dockerfile
├── docker-compose.yml        # local Postgres
├── tsconfig.json
├── jest.config.js
└── package.json
```

This is a flat, single-package repo — no Turborepo, no `apps/api` nesting.
All scripts run from the repo root.

## 1. Install dependencies

```bash
pnpm add express cors jsonwebtoken zod stripe dotenv @prisma/client
pnpm add -D typescript ts-node-dev ts-jest jest @types/jest @types/express \
  @types/cors @types/jsonwebtoken supertest @types/supertest prisma eslint
```

## 2. Start Postgres locally

```bash
docker compose up -d
cp .env.example .env
```

## 3. Generate Prisma client + run migrations

```bash
pnpm exec prisma generate
pnpm exec prisma migrate dev --name init
```

## 4. Run the dev server

```bash
pnpm run dev
```

API will be at `http://localhost:4000`, health check at `/health`.

## 5. Run tests

```bash
pnpm run test
```

Stripe calls are mocked in `tests/integration/orders.test.ts`, so tests never
hit the real Stripe API.

## 6. CI

`.github/workflows/ci.yml` runs on every push/PR to `main`: spins up a real
Postgres service container, installs deps, lints, runs Prisma migrations,
runs tests, then builds. No changes needed to the workflow for this to work
as long as your `package.json` has `lint`, `test`, and `build` scripts
(already scaffolded).

## Notes

- `src/app.ts` is intentionally separate from `src/server.ts` so tests can
  import the Express app directly via `supertest` without binding a real
  port.
- The Stripe webhook route (`src/routes/stripeWebhook.routes.ts`) is mounted
  before `express.json()` in `app.ts`, since Stripe requires the raw request
  body to verify webhook signatures.
- Wire up your own auth routes (register/login) in `src/routes/index.ts`
  where the `authRouter` import is commented out — this scaffold assumes
  you're building auth separately (or already have it).
- `prisma/schema.prisma` here is a plain starter matching the fields the
  code references (`role`, `priceCents`, `quantity`, `stripeSessionId`,
  `status`, `totalCents`). Adjust to taste before your first migration.
