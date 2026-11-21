# SkillStreakr API: the backend stack

Every tool the backend uses, **why** we chose it, **what we rejected**, and **how it is set up** in this repository. Tools marked **Planned** are decided but not installed yet; they are added in the week shown.

See [README.md](README.md) for the full project and [CHECKS.md](CHECKS.md) for every check.

---

## Table of contents

1. [Stack at a glance](#1-stack-at-a-glance)
2. [Runtime and language](#2-runtime-and-language)
3. [Project structure (verifier pattern)](#3-project-structure-verifier-pattern)
4. [Web framework and middleware](#4-web-framework-and-middleware)
5. [Validation and configuration](#5-validation-and-configuration)
6. [Errors and responses](#6-errors-and-responses)
7. [Logging](#7-logging)
8. [Testing](#8-testing)
9. [Code quality tooling](#9-code-quality-tooling)
10. [Local services (Docker)](#10-local-services-docker)
11. [Database (planned)](#11-database-planned)
12. [Auth (planned)](#12-auth-planned)
13. [Cache, queues and jobs (planned)](#13-cache-queues-and-jobs-planned)
14. [Files and email (planned)](#14-files-and-email-planned)
15. [AI and payments (planned)](#15-ai-and-payments-planned)
16. [Observability (planned)](#16-observability-planned)
17. [Deployment (planned)](#17-deployment-planned)
18. [What we do not use, and why](#18-what-we-do-not-use-and-why)
19. [All installed packages](#19-all-installed-packages)

---

## 1. Stack at a glance

| Layer               | Choice                                           | Status                      |
| ------------------- | ------------------------------------------------ | --------------------------- |
| Runtime             | Node.js 24 LTS                                   | In use                      |
| Language            | TypeScript (strict)                              | In use                      |
| Package manager     | npm                                              | In use                      |
| Framework           | Express 5                                        | In use                      |
| Security middleware | helmet, cors                                     | In use                      |
| Validation          | Zod                                              | In use (env); requests next |
| Logging             | pino + pino-http                                 | In use                      |
| Tests               | Vitest + Supertest                               | In use                      |
| Quality             | Prettier, husky, lint-staged, commitlint         | In use                      |
| Linting             | ESLint + typescript-eslint                       | In use                      |
| Local services      | Docker Compose: Postgres 17, Redis 7             | File ready, not started yet |
| Database access     | Drizzle ORM + pg                                 | Week 1                      |
| Auth                | argon2, jose, arctic                             | Weeks 4–5                   |
| Queue / cache       | ioredis + BullMQ                                 | Week 11                     |
| Rate limiting       | express-rate-limit + Redis store                 | Week 4                      |
| Files / email       | AWS S3 + SES (MinIO + Mailpit locally)           | Weeks 9–10                  |
| Errors / traces     | Sentry, OpenTelemetry                            | Week 12                     |
| AI                  | Claude API, pgvector, Voyage embeddings, MCP SDK | v4                          |
| Payments            | Razorpay                                         | v4                          |
| CI                  | GitHub Actions                                   | Next                        |
| Hosting             | Railway / Render, then AWS                       | Week 16                     |

---

## 2. Runtime and language

### Node.js 24 LTS

|                          |                                                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What**                 | The JavaScript runtime that runs the API                                                                                                          |
| **Why**                  | Best at I/O work (APIs, DB calls, webhooks, queues); one language for frontend and backend; huge ecosystem; first-class AI SDKs                   |
| **Weak spots we handle** | CPU-heavy work blocks the single thread, so heavy work goes to a worker process; types disappear at runtime, so every input is validated with Zod |
| **Set up**               | `"engines": { "node": ">=24" }` in `package.json`. Node 24 also gives us `--env-file` (no dotenv package) and `process.loadEnvFile`               |

### TypeScript

|             |                                                                                                                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What**    | JavaScript with types, checked before the code runs                                                                                                                                                      |
| **Why**     | Catches mistakes early, makes refactoring safe, and is expected in every serious Node.js job                                                                                                             |
| **Version** | TypeScript 6. We moved down from 7 because typescript-eslint supports TypeScript only up to 6.0; TypeScript 7 (the new Go rewrite) only made checks faster. Move to 7 when typescript-eslint supports it |
| **Set up**  | `tsconfig.json` (everything, including tests) and `tsconfig.build.json` (everything except tests, used by `npm run build`)                                                                               |

`tsconfig.json` options and why:

| Option                        | Value        | Why                                                                                                        |
| ----------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------- |
| `module` / `moduleResolution` | `nodenext`   | Real Node.js ES modules. That's why imports between our files end in `.js` even though the files are `.ts` |
| `target`                      | `ES2023`     | Modern JavaScript that Node 24 runs natively                                                               |
| `strict`                      | `true`       | All strict checks (null checks, no implicit `any`)                                                         |
| `noUncheckedIndexedAccess`    | `true`       | `array[0]` is typed as "maybe undefined", which forces a check                                             |
| `types`                       | `["node"]`   | TypeScript 6+ no longer loads Node's types by default                                                      |
| `rootDir` / `outDir`          | `.` / `dist` | The build mirrors the source folders inside `dist/`                                                        |
| `sourceMap`                   | `true`       | Error stack traces point to the `.ts` line, not the compiled `.js`                                         |

### ES modules (`import` / `export`)

`"type": "module"` in `package.json`. `npm init` creates `"commonjs"` (`require`), which is the older system. ES modules are the standard for new Node.js code and for every modern library.

### npm

|                          |                                                                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| **Why npm and not pnpm** | We have two separate repositories, not a monorepo, so pnpm's workspace features aren't needed. npm comes with Node: one tool less |
| **Rules**                | `package-lock.json` is committed; CI uses `npm ci` (exact install from the lockfile)                                              |

### tsx (development only)

Runs `.ts` files directly without a build step, and `tsx watch` restarts the server on every save. `npm run dev` = `tsx watch --env-file=.env bin/www.ts`.

---

## 3. Project structure (verifier pattern)

The structure copies the team's `csv-data-verifier` service, so the layout is familiar and proven.

```
bin/www.ts           starts the HTTP server, handles port errors and graceful shutdown
app.ts               builds Express: middleware -> /v1 routes -> 404 -> error handler
config/env.ts        validated environment variables
core/                shared infrastructure: logger (later db, redis, queue)
helper/              status codes + ErrorHandler class
middleware/          dispatcher, notFound, handleError (later validate, currentUser, rateLimit)
utils/               constants and small helpers
modules/index.ts     exports v1
modules/v1/index.ts  mounts every module: v1.use("/health", health)
modules/v1/<name>/   index, route, controller, service, repository, schema, constant
tests/               tests
```

| Decision                                | Why                                                                                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `bin/www.ts` separate from `app.ts`     | Tests import `app` without opening a port; the server file only deals with listening and shutting down                                |
| Every route under `/v1`                 | We can release `/v2` later without breaking old clients                                                                               |
| Controller = plain functions            | Same as the verifier; the controller only reads the request and returns data                                                          |
| Service / repository / helper = classes | Same as the verifier; a service builds its repository in the constructor, which keeps dependencies clear and easy to replace in tests |
| `dispatcher(req, res, next, fn)`        | Every controller gets the same success response and error forwarding, written once                                                    |

---

## 4. Web framework and middleware

### Express 5

|                   |                                                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What**          | The most used Node.js web framework                                                                                                               |
| **Why**           | Shows the fundamentals (middleware, request lifecycle, error handling) that other frameworks hide; we design the layers ourselves; huge community |
| **Why version 5** | A rejected promise in an async handler goes to the error handler automatically (Express 4 needed a wrapper); better path matching                 |
| **Rejected**      | NestJS: hides the fundamentals behind decorators; learn it later. Fastify: faster, but Express knowledge is asked about far more                  |

Middleware order in `app.ts`, and why each one is there:

| #   | Middleware                                               | Why                                                                                                                                                                |
| --- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `app.disable("x-powered-by")`                            | Doesn't tell attackers we run Express                                                                                                                              |
| 2   | `helmet()`                                               | Security headers: Content-Security-Policy, no MIME sniffing, frame protection, HSTS                                                                                |
| 3   | `cors({ origin: WEB_ORIGIN, credentials: true })`        | Only our frontend can call the API from a browser, and it may send cookies. `origin: "*"` is not allowed together with credentials, and would let any site call us |
| 4   | `express.json({ limit: "100kb" })`                       | Parses JSON bodies; the limit stops huge bodies from using memory                                                                                                  |
| 5   | `express.urlencoded({ extended: true, limit: "100kb" })` | Parses form bodies with the same limit                                                                                                                             |
| 6   | `pinoHttp({ logger })`                                   | One log line per request with method, URL, status and time                                                                                                         |
| 7   | `app.use("/v1", v1)`                                     | All routes                                                                                                                                                         |
| 8   | `notFound`                                               | Unknown URL -> 404 in our JSON shape                                                                                                                               |
| 9   | `handleError`                                            | Every error ends here                                                                                                                                              |

### Graceful shutdown (`bin/www.ts`)

On `SIGTERM` (sent by deploys) or `SIGINT` (Ctrl+C), the server stops taking new connections, finishes the requests in progress, then exits. If that takes over 10 seconds it exits anyway. Later the DB pool and Redis close here too. A port that's already in use gives a clear message instead of a crash dump.

---

## 5. Validation and configuration

### Zod

|              |                                                                                                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What**     | Schemas that check data at runtime and also give TypeScript types                                                                                               |
| **Why**      | TypeScript types vanish at runtime; any data from outside (env, requests, webhooks, job payloads) must be checked. One schema gives both the check and the type |
| **Version**  | Zod 4 (`z.url()`, `z.flattenError`)                                                                                                                             |
| **Rejected** | Joi (used at work): no automatic TypeScript types. class-validator: needs decorators and classes for every input                                                |

### Environment config (`config/env.ts`)

- `.env` is loaded by Node itself (`--env-file=.env`), so there is no dotenv package.
- `config/env.ts` validates every variable with Zod: `PORT` becomes a number, URLs must be valid, `NODE_ENV` must be one of three values.
- If anything is wrong, the app prints the exact fields and **stops at startup**, not in the middle of a user's request.
- `.env.example` lists every variable with safe local values and is committed; `.env` is never committed.

Next: a `validate` middleware will check the body, params and query of every request with a Zod schema per route.

---

## 6. Errors and responses

| Piece          | File                         | Job                                                                                                                              |
| -------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `ErrorHandler` | `helper/error-handler.ts`    | Class for expected errors: `throw new ErrorHandler(NOT_FOUND, "Skill not found")`                                                |
| Status codes   | `helper/status-codes.ts`     | Named constants (`OK`, `CREATED`, `BAD_REQUEST`, `NOT_FOUND`…) instead of magic numbers                                          |
| `dispatcher`   | `middleware/dispatcher.ts`   | Sends the controller's return value as `{ status: "success", statusCode: 200, data }`; forwards any thrown error                 |
| `notFound`     | `middleware/not-found.ts`    | 404 for unknown routes                                                                                                           |
| `handleError`  | `middleware/handle-error.ts` | `ErrorHandler` -> its own status and message. Anything else -> logged in full, and the user only sees 500 "Something went wrong" |

The same response shape as the verifier service:

```json
{ "status": "success", "statusCode": 200, "data": { "status": "up" } }
{ "status": "failure", "statusCode": 404, "message": "Route GET /v1/abc not found" }
```

---

## 7. Logging

### pino + pino-http

|                            |                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| **Why pino**               | The fastest Node.js logger; writes JSON that log tools (CloudWatch, Grafana, Datadog) can search |
| **Why pino-http**          | Logs every request automatically, sharing the same logger                                        |
| **pino-pretty** (dev only) | Coloured, readable logs on your machine                                                          |
| **Rejected**               | winston (slower, more setup), `console.log` (no levels, no JSON)                                 |

Set up in `core/logger.ts`:

| Environment | Output                     |
| ----------- | -------------------------- |
| development | Pretty, coloured           |
| test        | Silent (clean test output) |
| production  | Plain JSON lines           |

The level comes from `LOG_LEVEL`. Rule: never log passwords, tokens or personal data.

---

## 8. Testing

| Tool                                 | Why                                                                                |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| **Vitest**                           | Fast, native TypeScript and ES modules, Jest-like API (`describe`, `it`, `expect`) |
| **Supertest**                        | Sends real HTTP requests to `app` in memory, with no open port                     |
| **Testcontainers** (planned, Week 8) | Starts a real Postgres in Docker for repository tests, so no mocked database       |

Set up:

- `vitest.config.ts` loads `.env` (or `.env.example` when there is no `.env`, as in CI) and sets `NODE_ENV=test`.
- Tests live in `tests/**/*.test.ts`.
- Current tests: `GET /v1/health` returns success; an unknown route returns a 404 failure.

---

## 9. Code quality tooling

| Tool               | What it does                                                                                                    | Set up in                                                                                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Prettier**       | Formats code the same way for everyone                                                                          | `.prettierrc.json`: 120 characters per line, double quotes, semicolons, trailing commas. `.prettierignore` skips `node_modules`, `dist`, `coverage`, `package-lock.json` |
| **husky**          | Runs scripts on git events                                                                                      | `.husky/pre-commit`, `.husky/commit-msg`, `.husky/pre-push`; installed by `"prepare": "husky"` on `npm install`                                                          |
| **lint-staged**    | Runs Prettier only on staged files, so commits stay fast                                                        | `"lint-staged"` in `package.json`                                                                                                                                        |
| **commitlint**     | Checks the commit message format                                                                                | `commitlint.config.js`: 10 allowed types                                                                                                                                 |
| **.gitattributes** | Forces LF line endings                                                                                          | Stops Windows CRLF from fighting Prettier and breaking hook scripts                                                                                                      |
| **ESLint**         | Finds bugs and bad patterns using type information: unused variables, promises not awaited, `console.log`, `==` | `eslint.config.js`; runs on staged `.ts` files before Prettier; `npm run lint` / `npm run lint:fix`                                                                      |

Details of every check: [CHECKS.md](CHECKS.md).

---

## 10. Local services (Docker)

`docker-compose.yml`:

| Service  | Image                | Host port | Why this port                                 |
| -------- | -------------------- | --------- | --------------------------------------------- |
| Postgres | `postgres:17-alpine` | **5433**  | 5432 is already used by another local project |
| Redis    | `redis:7-alpine`     | **6380**  | 6379 may already be in use                    |

- Postgres data lives in the `pgdata` volume, so it survives a restart.
- Login: user `skill`, password `skill`, database `skillstreakr` (local only).
- Planned additions: **MinIO** (local S3) in Week 9 and **Mailpit** (local inbox) in Week 10.
- `alpine` images are small and fast to download.

---

## 11. Database (planned)

| Tool                          | Why                                                                                                                                                                                                                       | Rejected                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **PostgreSQL**                | Our data is relational (users, skills, logs, groups); strong transactions; the database enforces rules such as "one daily log per user per day"; window functions for streaks; JSONB for template fields; pgvector for AI | MongoDB: joins and constraints are awkward; stats need complex pipelines        |
| **Drizzle ORM + drizzle-kit** | Schema written in TypeScript; queries look like SQL, so we learn SQL; light and fast; migrations as plain SQL files                                                                                                       | Prisma (used at work; we learn something new here), TypeORM (heavy, decorators) |
| **pg (node-postgres)**        | The standard Postgres driver, with a connection pool                                                                                                                                                                      |                                                                                 |
| **JSONB**                     | Template-specific fields in `skills.details` and other flexible data                                                                                                                                                      | A table per skill type                                                          |
| **pgvector** (v4)             | Vector search for "ask my notes" in the same database                                                                                                                                                                     | A separate vector database                                                      |

Rules: `snake_case` names; UTC timestamps; `user_id` + an index starting with it on every user table; migrations run only on the local SkillStreakr database (port 5433) and, in production, by a pipeline step.

---

## 12. Auth (planned)

Built by hand to learn the most-asked interview topics.

| Tool                                 | Job                                                                                   | Why                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **argon2**                           | Password hashing                                                                      | Current best practice; memory-hard, so guessing is slow and expensive |
| **jose**                             | JWT access tokens                                                                     | Standards-based, no native dependencies                               |
| Refresh tokens                       | 30-day tokens stored only as hashes, rotated on every use, reuse revokes all sessions | Stolen tokens stop working                                            |
| **arctic**                           | Google and GitHub OAuth (state + PKCE)                                                | Small and typed; we still write the flow ourselves                    |
| Cookies                              | `HttpOnly`, `Secure`, `SameSite=Lax`, domain `.skillstreakr.com`                      | JavaScript can't read the token, so XSS can't steal it                |
| **express-rate-limit** + Redis store | Limits login, signup, reset, AI and webhooks                                          | Stops brute force and cost spikes across many API copies              |

Rejected: Clerk, Auth0, NextAuth. They hide exactly what we want to learn.

---

## 13. Cache, queues and jobs (planned)

| Tool           | Job                                                                       | Why                                                                                                           |
| -------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Redis**      | Cache (dashboard stats), rate-limit counters, leaderboards, queue storage | Very fast in-memory store                                                                                     |
| **ioredis**    | Redis client                                                              | Required by BullMQ; stable                                                                                    |
| **BullMQ**     | Background jobs: reminders, weekly reports, exports, webhooks, AI         | Retries with backoff, scheduled jobs, fixed job ids (no duplicates), the same pattern as the verifier service |
| Worker process | Runs the jobs separately from the API                                     | Heavy work never slows down API requests; scales on its own                                                   |

Rejected: `node-cron` inside the API (runs on every copy, no retries); Upstash free Redis for BullMQ (constant commands burn the free quota).

---

## 14. Files and email (planned)

| Need            | Local                                                  | Production                               | Why                                                                                   |
| --------------- | ------------------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------- |
| File storage    | MinIO                                                  | AWS S3 (private bucket, lifecycle rules) | Presigned URLs: the browser uploads straight to S3 and our API never handles the file |
| S3 SDK          | `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` | same                                     | Official SDK                                                                          |
| Email           | Mailpit                                                | AWS SES                                  | Cheap, reliable; Mailpit catches every email locally                                  |
| Email templates | React Email                                            | same                                     | Emails written as components                                                          |

---

## 15. AI and payments (planned)

| Tool                                 | Job                                                       | Why                                                        |
| ------------------------------------ | --------------------------------------------------------- | ---------------------------------------------------------- |
| **Claude API** (`@anthropic-ai/sdk`) | Ask my notes, writing corrector, quiz, planner            | Cheap model for simple tasks, stronger model for hard ones |
| **Voyage AI**                        | Embeddings for notes                                      | Recommended embeddings for Claude-based RAG                |
| **pgvector**                         | Vector search                                             | Keeps everything in Postgres                               |
| **MCP SDK**                          | MCP server so AI apps can read a user's SkillStreakr data | Standard protocol for AI tools                             |
| **Razorpay**                         | Pro subscription in India                                 | Subscriptions + webhooks; Stripe later for other countries |

Cost control: a Redis counter per user per day, caching of results, Pro-only access.

---

## 16. Observability (planned)

| Tool                               | Job                                                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| pino                               | JSON logs with request id, user id, module and step                                                   |
| **Sentry**                         | Error tracking with stack traces (API and worker)                                                     |
| **OpenTelemetry** -> Grafana Cloud | Traces (request -> DB -> queue -> job) and metrics (latency, error rate, queue depth, event-loop lag) |
| Health checks                      | `/v1/health` (alive) and a readiness check of Postgres + Redis                                        |

---

## 17. Deployment (planned)

| Part          | Start                                                          | Later (learn AWS) |
| ------------- | -------------------------------------------------------------- | ----------------- |
| API + worker  | Railway / Render / Fly.io                                      | AWS ECS Fargate   |
| Postgres      | Neon                                                           | AWS RDS           |
| Redis         | Railway Redis / a VPS                                          | ElastiCache       |
| Files + email | AWS S3 + SES                                                   | same              |
| Container     | Docker multi-stage build                                       | same              |
| CI/CD         | GitHub Actions: `npm ci` -> lint -> typecheck -> test -> build | + deploy step     |

The API is served from `api.skillstreakr.com`, the same parent domain as the app, so cookies work.

---

## 18. What we do not use, and why

| Not used                 | Why                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| Next.js API routes       | The backend is a separate Express service; two backends would only confuse where code goes |
| NestJS (for now)         | Hides the fundamentals; a one-week topic later                                             |
| MongoDB                  | The data is relational; Postgres + JSONB covers the flexible parts                         |
| Microservices            | A modular monolith first; split a module only when it needs its own scaling                |
| Kafka, Kubernetes        | Too much for now; learned later as demos                                                   |
| Clerk / Auth0 / NextAuth | Auth is built by hand to learn it                                                          |
| Prisma, Joi              | Already used at work; here we learn Drizzle and Zod                                        |
| dotenv                   | Node 24 reads `.env` itself with `--env-file`                                              |
| winston, morgan          | pino + pino-http do both jobs, faster                                                      |

---

## 19. All installed packages

### Runtime dependencies

| Package     | Version | Used for                             |
| ----------- | ------- | ------------------------------------ |
| `express`   | ^5.3.0  | Web framework                        |
| `helmet`    | ^8.3.0  | Security headers                     |
| `cors`      | ^2.8.6  | Cross-origin access for the frontend |
| `pino`      | ^10.4.0 | Logger                               |
| `pino-http` | ^11.0.0 | Request logging                      |
| `zod`       | ^4.6.7  | Validation                           |

### Development dependencies

| Package                           | Version  | Used for                                   |
| --------------------------------- | -------- | ------------------------------------------ |
| `typescript`                      | ~6.0.3   | Type checking and build                    |
| `eslint`                          | ^10.15.0 | Linter                                     |
| `@eslint/js`                      | ^10.0.1  | Core JavaScript rules                      |
| `typescript-eslint`               | ^8.73.0  | TypeScript rules and parser                |
| `globals`                         | ^17.14.0 | Node.js globals for ESLint                 |
| `tsx`                             | ^4.23.15 | Run TypeScript in dev with restart on save |
| `@types/node`                     | ^24.19.2 | Node.js types (pinned to Node 24)          |
| `@types/express`                  | ^5.0.6   | Express types                              |
| `@types/cors`                     | ^2.8.19  | cors types                                 |
| `pino-pretty`                     | ^13.2.0  | Readable dev logs                          |
| `vitest`                          | ^5.1.0   | Test runner                                |
| `supertest`                       | ^7.3.2   | HTTP tests                                 |
| `@types/supertest`                | ^7.2.1   | supertest types                            |
| `prettier`                        | ^3.10.1  | Formatting                                 |
| `husky`                           | ^9.1.7   | Git hooks                                  |
| `lint-staged`                     | ^17.6.1  | Format staged files only                   |
| `@commitlint/cli`                 | ^21.2.4  | Commit message check                       |
| `@commitlint/config-conventional` | ^21.2.4  | Base commit rules                          |

`npm audit` reports 0 vulnerabilities (checked 2026-11-22).
