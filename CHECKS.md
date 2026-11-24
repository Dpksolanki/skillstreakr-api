# SkillStreakr API: every check

Every check that protects this code: **what** it checks, **when** it runs, **what it blocks**, and **how to see it work**. Then the manual checklists and the build checklist with what is done and what is next.

See [README.md](README.md) for the full project and [STACK.md](STACK.md) for the tools.

---

## Table of contents

1. [When each check runs](#1-when-each-check-runs)
2. [Before a commit: pre-commit hook](#2-before-a-commit-pre-commit-hook)
3. [The commit message: commit-msg hook](#3-the-commit-message-commit-msg-hook)
4. [Before a push: pre-push hook](#4-before-a-push-pre-push-hook)
5. [When the app starts: environment check](#5-when-the-app-starts-environment-check)
6. [On every request: runtime checks](#6-on-every-request-runtime-checks)
7. [Tests](#7-tests)
8. [Type checks](#8-type-checks)
9. [Git and repository protections](#9-git-and-repository-protections)
10. [Checks still to add](#10-checks-still-to-add)
11. [Manual checklist before a pull request](#11-manual-checklist-before-a-pull-request)
12. [Manual checklist for a new module](#12-manual-checklist-for-a-new-module)
13. [Build checklist: done and next](#13-build-checklist-done-and-next)
14. [Skipping a check](#14-skipping-a-check)

---

## 1. When each check runs

```
write code
  -> git commit
       pre-commit:  ESLint + Prettier on staged files, then typecheck (blocks on a lint or type error)
       commit-msg:  commitlint                                        (blocks a bad message)
  -> git push
       pre-push:    all tests                                         (blocks on a failing test)
  -> npm run dev / npm start
       startup:     environment variables validated                   (app refuses to start)
  -> every request
       runtime:     security headers, CORS, body size, 404, error handling
  -> pull request (next)
       CI:          npm ci -> lint -> typecheck -> test -> build      (blocks the merge)
```

| Check            | Tool                     | Runs                         | Blocks                                                    |
| ---------------- | ------------------------ | ---------------------------- | --------------------------------------------------------- |
| Lint             | ESLint via lint-staged   | Every commit                 | Yes, on errors it can't fix by itself                     |
| Formatting       | Prettier via lint-staged | Every commit                 | Never blocks; fixes the files and adds them to the commit |
| Types            | `tsc --noEmit`           | Every commit                 | Yes                                                       |
| Commit message   | commitlint               | Every commit                 | Yes                                                       |
| Tests            | Vitest                   | Every push                   | Yes                                                       |
| Environment      | Zod (`config/env.ts`)    | App start                    | Yes: the app exits                                        |
| Security headers | helmet                   | Every request                | Adds headers                                              |
| Allowed origin   | cors                     | Every request from a browser | The browser blocks other sites                            |
| Body size        | `express.json` limit     | Every request                | 413 over 100 KB                                           |
| Unknown routes   | `notFound`               | Every request                | 404                                                       |
| Errors           | `handleError`            | Any thrown error             | Hides internal details                                    |

The hooks are installed automatically by `"prepare": "husky"` when anyone runs `npm install`.

---

## 2. Before a commit: pre-commit hook

File: `.husky/pre-commit`

```
npx lint-staged
npm run typecheck
```

`lint-staged` runs only on the **staged** files, so it stays fast:

| Staged files         | Commands, in order                      |
| -------------------- | --------------------------------------- |
| `*.ts`               | `eslint --fix`, then `prettier --write` |
| `*.{js,json,md,yml}` | `prettier --write`                      |

### 2.1 ESLint (lint-staged)

|                     |                                                                                 |
| ------------------- | ------------------------------------------------------------------------------- |
| **Checks**          | Bugs and bad patterns, using TypeScript's type information (`eslint.config.js`) |
| **Fixes by itself** | What it safely can, for example `import` -> `import type`                       |
| **Blocks**          | Any error it can't fix                                                          |
| **Skips**           | `dist`, `coverage`                                                              |
| **By hand**         | `npm run lint` (report), `npm run lint:fix` (fix what it can)                   |

Rules and what they catch:

| Rule                                                         | Catches                                                                                                                 | Example that fails                                      |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `@eslint/js` recommended                                     | Unreachable code, duplicate keys, undefined variables                                                                   | `return; doSomething();`                                |
| `typescript-eslint` recommended (type-checked)               | Unsafe `any`, wrong promise use                                                                                         |                                                         |
| `@typescript-eslint/no-floating-promises` (in the set above) | A promise that is neither awaited nor handled                                                                           | `save();` instead of `await save();`                    |
| `@typescript-eslint/no-misused-promises` (in the set above)  | An async function passed where a normal callback is expected                                                            | `if (asyncFn())`                                        |
| `@typescript-eslint/no-unused-vars`                          | Unused variables and parameters. A name starting with `_` is allowed (needed for the 4-parameter Express error handler) | `const unused = 5;`                                     |
| `@typescript-eslint/consistent-type-imports`                 | Types imported without `import type`                                                                                    | `import { Request } from "express"` used only as a type |
| `no-console`                                                 | `console.log` / `info` / `warn`. Only `console.error` is allowed, for errors before the logger exists (`config/env.ts`) | `console.log("hi")`                                     |
| `eqeqeq`                                                     | `==` and `!=`                                                                                                           | `a == 1`                                                |

Exceptions:

| Files                              | Change                                                | Why                                    |
| ---------------------------------- | ----------------------------------------------------- | -------------------------------------- |
| `tests/**`                         | `no-unsafe-member-access`, `no-unsafe-assignment` off | supertest's `res.body` is untyped JSON |
| `*.js` (eslint, commitlint config) | Only the base JavaScript rules                        | No TypeScript types there              |
| `vitest.config.ts`                 | Linted with a default project                         | It isn't part of `tsconfig.json`       |

**See it work:** put `const unused = 5;` and `console.log("hi");` in any `.ts` file, then run `npm run lint`.

### 2.2 Prettier (lint-staged)

|             |                                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| **Checks**  | Code style: 120 characters per line, double quotes, semicolons, trailing commas (`.prettierrc.json`) |
| **On**      | Only the **staged** files, after ESLint for `.ts` files                                              |
| **Result**  | Rewrites the files to the right format and keeps them in the commit. It never blocks                 |
| **Skips**   | `node_modules`, `dist`, `coverage`, `package-lock.json` (`.prettierignore`)                          |
| **By hand** | `npm run format` (fix all), `npm run format:check` (only report)                                     |

### 2.3 Type check

|                 |                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------- |
| **Checks**      | The whole project with `tsc --noEmit` and the strict settings in `tsconfig.json`         |
| **Blocks**      | Any type error: wrong argument, possible `undefined`, missing import, typo in a property |
| **See it work** | Write `const port: number = "4000";` anywhere, then try to commit                        |
| **By hand**     | `npm run typecheck`                                                                      |

Strict settings that make it catch more:

| Setting                    | Catches                                                      |
| -------------------------- | ------------------------------------------------------------ |
| `strict`                   | `null`/`undefined` not handled, implicit `any`, wrong `this` |
| `noUncheckedIndexedAccess` | Using `array[0]` or `object[key]` without checking it exists |

---

## 3. The commit message: commit-msg hook

File: `.husky/commit-msg` runs `commitlint`; the rules are in `commitlint.config.js`.

Format: `<type>: <short description>`

### 3.1 Allowed types (only these 10)

| Type       | Use it for                        | Example                                         |
| ---------- | --------------------------------- | ----------------------------------------------- |
| `feat`     | A new feature the user can see    | `feat: add streak counter API`                  |
| `fix`      | A bug fix                         | `fix: streak resets at wrong timezone`          |
| `chore`    | Setup, configs, packages, tooling | `chore: setup express api with class structure` |
| `refactor` | Code changed, behaviour the same  | `refactor: move user logic into service`        |
| `test`     | Only tests added or changed       | `test: add health route tests`                  |
| `docs`     | Only documentation                | `docs: add local setup steps to README`         |
| `style`    | Formatting only                   | `style: format with prettier`                   |
| `perf`     | Makes something faster            | `perf: add index on habits.user_id`             |
| `ci`       | GitHub Actions / pipeline         | `ci: add test workflow`                         |
| `build`    | Build system or dependencies      | `build: upgrade typescript to 7`                |

### 3.2 Rules

| Rule                | Checks                            | Blocked example                    | Allowed example             |
| ------------------- | --------------------------------- | ---------------------------------- | --------------------------- |
| `type-enum`         | Type is one of the 10             | `feature: add x`, `revert: undo x` | `feat: add x`               |
| `type-case`         | Type is lowercase                 | `Feat: add x`                      | `feat: add x`               |
| `type-empty`        | A type exists                     | `added stuff`                      | `chore: add stuff`          |
| `subject-empty`     | Text after `:` exists             | `feat:`                            | `feat: add skills API`      |
| `subject-case`      | Off: any case allowed             | none                               | `feat: add API for Streaks` |
| `header-max-length` | First line at most 100 characters | a very long message                | a short one                 |

Rule levels in the config: `0` = off, `1` = warning (commit allowed), `2` = error (commit blocked).

**See it work:**

```bash
echo "added stuff" | npx commitlint        # 2 errors
echo "feat: add skills API" | npx commitlint   # passes
```

---

## 4. Before a push: pre-push hook

File: `.husky/pre-push` runs `npm test`.

|                                |                                                       |
| ------------------------------ | ----------------------------------------------------- |
| **Checks**                     | Every test in `tests/`                                |
| **Blocks**                     | The push, if any test fails                           |
| **Why on push, not on commit** | Commits stay fast; nothing broken leaves your machine |

---

## 5. When the app starts: environment check

File: `config/env.ts`

| Variable       | Rule                                                           | Default       |
| -------------- | -------------------------------------------------------------- | ------------- |
| `NODE_ENV`     | `development`, `test` or `production`                          | `development` |
| `PORT`         | Whole positive number (text converted to a number)             | `4000`        |
| `LOG_LEVEL`    | `fatal`, `error`, `warn`, `info`, `debug`, `trace` or `silent` | `info`        |
| `DATABASE_URL` | Valid URL                                                      | Required      |
| `REDIS_URL`    | Valid URL                                                      | Required      |
| `WEB_ORIGIN`   | Valid URL                                                      | Required      |

If a value is missing or wrong, the app prints the field names and exits with code 1.

**See it work:** delete the `WEB_ORIGIN` line from `.env` and run `npm run dev`:

```
Invalid environment variables: {
  WEB_ORIGIN: [ 'Invalid input: expected string, received undefined' ]
}
```

**Why:** a missing setting crashes the app at startup, where you see it, instead of in the middle of a user's request.

---

## 6. On every request: runtime checks

| Check              | Where                                                         | What it does                                                                                |
| ------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Hide the framework | `app.disable("x-powered-by")`                                 | No `X-Powered-By: Express` header for attackers to read                                     |
| Security headers   | `helmet()`                                                    | Content-Security-Policy, `X-Content-Type-Options: nosniff`, frame protection, HSTS and more |
| Allowed origin     | `cors({ origin: WEB_ORIGIN, credentials: true })`             | Browsers allow only `WEB_ORIGIN` to read responses and send cookies                         |
| Body size          | `express.json({ limit: "100kb" })`, `express.urlencoded(...)` | Bodies over 100 KB are refused, so one request can't eat the memory                         |
| Unknown route      | `middleware/not-found.ts`                                     | `404 { status: "failure", message: "Route GET /v1/x not found" }`                           |
| Expected errors    | `ErrorHandler` + `handleError`                                | The thrown status code and message go to the user                                           |
| Unexpected errors  | `handleError`                                                 | Full error logged; the user only sees `500 "Something went wrong"`, never a stack trace     |
| Async errors       | Express 5 + `dispatcher`                                      | A rejected promise in a controller reaches `handleError`                                    |
| Request log        | `pino-http`                                                   | Every request logged with method, URL, status and time                                      |
| Port in use        | `bin/www.ts`                                                  | Clear message "Port 4000 is already in use" and exit                                        |
| Shutdown           | `bin/www.ts`                                                  | On SIGTERM / SIGINT, finishes requests in progress, forced exit after 10 seconds            |

**See some of them:**

```bash
curl -i http://localhost:4000/v1/health    # helmet headers + Access-Control-Allow-Origin
curl http://localhost:4000/v1/nope          # 404 JSON
```

---

## 7. Tests

|            |                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------- |
| **Runner** | Vitest (`vitest.config.ts`)                                                                     |
| **HTTP**   | Supertest calls `app` in memory, with no port opened                                            |
| **Env**    | Loads `.env`, or `.env.example` when there is no `.env` (CI); `NODE_ENV=test` makes logs silent |
| **Files**  | `tests/**/*.test.ts`                                                                            |
| **Run**    | `npm test` (once), `npm run test:watch` (re-run on save)                                        |

Current tests:

| File                           | Test                                                                                                    | Checks                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `tests/health.test.ts`         | 200 when Postgres and Redis are up; 503 when either is down                                             | Repository replaced with fakes, so no database is needed |
| `tests/me.test.ts`             | `GET /v1/me`: profile without the password hash; 401 when the dev user isn't seeded; 409 on a duplicate | currentUser + users module + database error mapping      |
| `tests/date.test.ts`           | `getLocalDate` in India, New York, UTC and London (daylight saving)                                     | The user's "today"                                       |
| `tests/validate.test.ts`       | `parseInput` returns cleaned data or a 400 with field errors                                            | Request validation                                       |
| `tests/database-error.test.ts` | Postgres codes 23505/23503 -> 409, 23514/23502/22P02 -> 400, others -> not mapped                       | Database error mapping                                   |
| `tests/health.test.ts`         | returns a 404 failure response for an unknown route                                                     | `GET /v1/does-not-exist` -> 404, `status: "failure"`     |

Edge cases every future feature must test:

- Logging near midnight in different timezones.
- Streak across missed days and daylight-saving changes.
- A user can never see or change another user's data (404).
- Invalid input -> 400 with the field errors.
- Refresh-token reuse -> all sessions revoked.
- Duplicate webhook -> processed once.
- Upload over the size limit -> refused.

---

## 8. Type checks

| Command             | Uses                  | Checks                                                         |
| ------------------- | --------------------- | -------------------------------------------------------------- |
| `npm run typecheck` | `tsconfig.json`       | All code including tests, no output files                      |
| `npm run build`     | `tsconfig.build.json` | All code except tests, writes `dist/`; fails on any type error |

---

## 9. Git and repository protections

| Protection                                     | File / place                                                 | Stops                                                    |
| ---------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| Secret files ignored                           | `.gitignore`: `.env`, `.env.*` (but not `.env.example`)      | Passwords and keys reaching GitHub                       |
| Build output ignored                           | `.gitignore`: `node_modules/`, `dist/`, `coverage/`, `*.log` | Huge or generated files in git                           |
| Editor folders ignored                         | `.gitignore`: `.vscode/`, `.idea/`, `.DS_Store`              | Personal settings in git                                 |
| Line endings                                   | `.gitattributes`: `* text=auto eol=lf`                       | Windows CRLF breaking hook scripts and fighting Prettier |
| Exact installs                                 | `package-lock.json` committed                                | "Works on my machine" version differences                |
| Branch rule on `main` (GitHub settings)        | Require a pull request, block force pushes                   | Direct pushes and history rewrites on `main`             |
| Dependabot + secret scanning (GitHub settings) | Dependency alerts, push protection                           | Known vulnerable packages, leaked keys                   |

---

## 10. Checks still to add

| Check                    | Tool                                                           | When                      | Will block                                        |
| ------------------------ | -------------------------------------------------------------- | ------------------------- | ------------------------------------------------- |
| CI on every pull request | GitHub Actions: `npm ci` -> lint -> typecheck -> test -> build | Next                      | Merging broken code                               |
| Ownership                | Every repository query filters by `user_id`                    | With the first module     | Reading another user's data                       |
| Database constraints     | Unique `(user_id, log_date)` and others                        | Week 1                    | Duplicate rows, even under race conditions        |
| Auth                     | JWT + refresh rotation                                         | Weeks 4–5                 | Unauthenticated access, stolen tokens             |
| Rate limiting            | express-rate-limit + Redis                                     | Week 4                    | Brute force, cost spikes                          |
| Webhook signature        | HMAC with `timingSafeEqual`                                    | Week 11                   | Fake webhook calls                                |
| Idempotency              | Unique `delivery_id`, fixed job ids                            | Week 8–11                 | Duplicate processing                              |
| Real-DB tests            | Testcontainers                                                 | Week 8                    | Bugs that mocks hide                              |
| Error tracking           | Sentry                                                         | Week 12                   | Errors nobody notices                             |
| Dependency audit         | `npm audit` in CI                                              | With CI                   | Known vulnerable packages                         |
| Module boundaries        | dependency-cruiser                                             | When there are 3+ modules | One module reaching into another's internal files |

---

## 11. Manual checklist before a pull request

- [ ] Branch name follows the type: `feat/skills-module`, `fix/streak-timezone`, `chore/eslint`
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes, and the new code has tests
- [ ] `npm run build` passes
- [ ] Ran it with `npm run dev` and called the endpoint
- [ ] No `console.log` left; logs use the pino logger with no secrets or personal data
- [ ] New env variable? Added to `config/env.ts` **and** `.env.example`
- [ ] `git status` shows no `.env` file
- [ ] README / STACK / CHECKS updated if something changed
- [ ] PR description in English: what, why, how it was tested

---

## 12. Manual checklist for a new module

- [ ] Folder `modules/v1/<name>/` with `index.ts`, route, controller, service, repository, schema
- [ ] Route uses `(req, res, next) => dispatcher(req, res, next, fn)`
- [ ] Controller only reads the request, calls the service and **returns** data (no `res.json`)
- [ ] Service is a class; repository is a class; the service creates the repository in its constructor
- [ ] Expected errors use `new ErrorHandler(STATUS, "message")`
- [ ] Every create / update / delete validates its input with Zod
- [ ] Every query filters by the current user's id
- [ ] `user_id` is never read from the request body
- [ ] Mounted in `modules/v1/index.ts`
- [ ] Tests for success, bad input (400), not found / other user (404)
- [ ] The endpoint is listed in README section 13

---

## 13. Build checklist: done and next

### Done

- [x] Repository, npm, TypeScript (strict), ES modules
- [x] Express 5 app with the verifier structure (`bin/www.ts`, `app.ts`, `modules/v1`)
- [x] helmet, cors, body limits, request logging
- [x] `dispatcher`, `notFound`, `handleError`, `ErrorHandler`, status codes
- [x] Zod environment check
- [x] pino logger (pretty in dev, silent in tests, JSON in production)
- [x] `GET /v1/health` with a controller function and a service class
- [x] Vitest + Supertest, 2 tests
- [x] Prettier, husky, lint-staged, commitlint (10 types), `.gitattributes`
- [x] ESLint with type-aware rules, run on every commit (TypeScript moved from 7 to 6 for it)
- [x] `docker-compose.yml` written: Postgres 17 (5433), Redis 7 (6380)
- [x] Graceful shutdown
- [x] README, STACK, CHECKS

### Next (in order)

- [ ] Start Postgres + Redis for the first time: `docker compose up -d` (containers and the database don't exist yet)
- [ ] GitHub Actions CI
- [ ] DB design note for `users`, `skills`, `daily_logs`, `log_entries` (written by hand, then reviewed)
- [ ] Drizzle + pg: `core/db.ts`, schema, migrations, seed dev user
- [x] Health checks Postgres + Redis (200 / 503)
- [x] `parseInput` (validation), `currentUser` + dev user seed, `getLocalDate`, Postgres error mapping, `GET /v1/me`
- [ ] Cursor pagination (with the first list endpoint)
- [ ] `skills` module (list, create, update, archive)
- [ ] `logs` module (create entry in a transaction, list by date range, update, delete)
- [ ] Tests for the timezone helper and both modules

---

## 14. Skipping a check

`git commit --no-verify` and `git push --no-verify` skip the hooks. Use them only in a real emergency, never as a habit: once CI is in place, the same checks run on the pull request anyway and will block the merge.
