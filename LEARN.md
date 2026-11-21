# SkillStreakr: what to learn

Everything explained while building SkillStreakr, in one place, and everything still to learn, in order.

- **Part A** explains what is already built, so you understand every file before writing new code.
- **Part B** is the study plan: what to read, what to focus on, how to check yourself.
- **Part C** collects every self-check and interview question.

See [README.md](README.md) for the project, [STACK.md](STACK.md) for the tools and [CHECKS.md](CHECKS.md) for the checks.

---

## Date-wise log

What was done and learned each day. Add a new entry at the bottom every day you work.

### 2026-11-16: Planning the product

| Done                                                                         | Learned                                                                                                        | Read again                             |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Decided the product: track any skill, streaks, revision, groups, AI later    | A product has users, a problem and a small v1                                                                  | README sections 1–8                    |
| Listed the 45 features in 4 versions + platform                              | Build one version at a time; ship before the next                                                              | README section 8                       |
| Chose the stack: Node.js + Express, React + Vite, PostgreSQL, Redis + BullMQ | Why Postgres over MongoDB, React + Vite over Next.js, Express over NestJS, modular monolith over microservices | STACK.md section 18, README section 10 |
| Checked the name SkillStreakr (domains + GitHub free)                        | How to check a name before using it                                                                            | README section 21                      |

### 2026-11-17: Plan document, repos, API setup, Husky

| Done                                                                                                  | Learned                                                                                  | Read again                                                         |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Wrote `SKILLSTREAKR.md` (full plan) and added the system design track                                 | 16-week system design roadmap; daily time split                                          | [18](#18-system-design-track-16-weeks), [20](#20-daily-time-split) |
| GitHub repo settings                                                                                  | Visibility, no license, branch rules, squash merge, Dependabot, secret scanning          | [10](#10-git-workflow)                                             |
| Decided **two repos** (api + web)                                                                     | Monorepo vs two repos trade-offs                                                         | [9](#9-two-repos-instead-of-one)                                   |
| API: npm, TypeScript, Express 5, helmet, cors, Zod env, pino, Vitest + Supertest, Docker Compose file | Why each package; `"type": "module"`; `nodenext` and `.js` imports; env check at startup | [3](#3-the-api-setup-file-by-file)                                 |
| Learned what `chore` means                                                                            | Conventional Commits: 10 types                                                           | [6](#6-commit-types-conventional-commits)                          |
| Husky + lint-staged + commitlint + Prettier; only our 10 types allowed; plain-word comments, no emoji | What each hook runs and blocks; rule levels 0/1/2                                        | [7](#7-git-hooks-husky-lint-staged-commitlint)                     |

### 2026-11-18: Verifier pattern, first commits, the whole frontend

| Done                                                                                                             | Learned                                                                                                             | Read again                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Restructured the API like `csv-data-verifier`: `bin/www.ts`, `app.ts`, `modules/v1`, `dispatcher`, `handleError` | Every route goes through `app.ts` under `/v1`; one response shape                                                   | [3](#3-the-api-setup-file-by-file), [4](#4-how-one-request-travels)                                               |
| Fixed 2 Sonar warnings                                                                                           | `unknown` covers Promises; no `async` without `await`                                                               | [3.6](#36-two-sonar-fixes-and-the-lesson)                                                                         |
| Controller = functions, service/repository/helper = classes                                                      | Where classes belong; the module template                                                                           | [5](#5-where-classes-are-used-the-verifier-pattern)                                                               |
| API commit pushed (`project-setup` branch)                                                                       | Commit message format with a body                                                                                   | [6](#6-commit-types-conventional-commits)                                                                         |
| Web step 1: Vite + React + TS; chose ESLint over Oxlint                                                          | Why ESLint for jobs and plugins                                                                                     | [8](#8-the-frontend-setup-step-by-step)                                                                           |
| Web steps 2–5: Tailwind 4, `@/` alias, shadcn/ui, TanStack Router + Query                                        | Utility classes; why both TS and Vite need the alias; owned component code; file-based typed routes; Query defaults | [8](#8-the-frontend-setup-step-by-step)                                                                           |
| Web pushed to `main` (first commit)                                                                              | First push to an empty repo goes to `main`                                                                          | [10](#10-git-workflow)                                                                                            |
| Got the 2-week study list                                                                                        | What to read before coding                                                                                          | [12](#12-week-1-backend-fundamentals), [13](#13-week-2-frontend-fundamentals), [14](#14-before-the-database-step) |

### 2026-11-21: Coding checklist, docs, database check

| Done                                                                                                                               | Learned                                                                        | Read again                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Got the coding checklist: Phase 0 fixes -> DB design note -> Drizzle -> shared blocks -> skills + logs modules -> tests -> screens | Order of work; write the DB design note yourself first                         | CHECKS.md section 13                                               |
| Wrote README.md, STACK.md, CHECKS.md in both repos                                                                                 | Full project, every tool and why, every check                                  | README, STACK, CHECKS                                              |
| Checked whether Postgres and Redis exist                                                                                           | Images were downloaded, but containers, volume and database were never created | [2](#2-docker-postgres-and-redis-how-they-are-created-and-started) |

### 2026-11-22: Docker guide and this file

| Done                                                           | Learned                                                                                                                                                                           | Read again                                                             |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Docker guide: how Postgres and Redis are created and started   | Image vs container vs volume; port mapping; `up -d`, `stop`, `down` vs `down -v`; `psql` and `redis-cli`                                                                          | [2](#2-docker-postgres-and-redis-how-they-are-created-and-started)     |
| Wrote LEARN.md with this date-wise log                         | Where to find every explanation                                                                                                                                                   | This file                                                              |
| Started Postgres + Redis with `docker compose up -d`           | The `skillstreakr` containers run next to the DriftCharge ones on different ports                                                                                                 | [2.3](#23-create-and-start-them)                                       |
| Listed the running containers and learned to stop / start them | `docker ps`, `ps -a`, `stats`; stop vs rm vs down vs down -v; what breaks when a container stops; API server is stopped with Ctrl + C, not Docker                                 | [2.9](#29-see-which-containers-are-running)–[2.13](#213-daily-routine) |
| Added ESLint to the API; moved TypeScript 7 -> 6               | typescript-eslint supports TypeScript only up to 6.0; type-aware rules catch promises not awaited, unused names, `console.log`, `==`; ESLint runs before Prettier on every commit | CHECKS.md section 2.1                                                  |
| Learned GitHub Actions cost                                    | Free with no limit on public repos (Linux runners); private repos get 2,000 free minutes a month                                                                                  | [15](#15-learn-when-the-feature-starts)                                |

**Next day's work:** follow the daily routine ([2.13](#213-daily-routine)), then start Week 1, Day 1 ([12](#12-week-1-backend-fundamentals)).

---

## Table of contents

**Part A: understand what is built**

1. [How to use this file](#1-how-to-use-this-file)
2. [Docker, Postgres and Redis: how they are created and started](#2-docker-postgres-and-redis-how-they-are-created-and-started)
3. [The API setup, file by file](#3-the-api-setup-file-by-file)
4. [How one request travels](#4-how-one-request-travels)
5. [Where classes are used (the verifier pattern)](#5-where-classes-are-used-the-verifier-pattern)
6. [Commit types (Conventional Commits)](#6-commit-types-conventional-commits)
7. [Git hooks: husky, lint-staged, commitlint](#7-git-hooks-husky-lint-staged-commitlint)
8. [The frontend setup, step by step](#8-the-frontend-setup-step-by-step)
9. [Two repos instead of one](#9-two-repos-instead-of-one)
10. [Git workflow](#10-git-workflow)

**Part B: what to learn next**

11. [Rules while studying](#11-rules-while-studying)
12. [Week 1: backend fundamentals](#12-week-1-backend-fundamentals)
13. [Week 2: frontend fundamentals](#13-week-2-frontend-fundamentals)
14. [Before the database step](#14-before-the-database-step)
15. [Learn when the feature starts](#15-learn-when-the-feature-starts)
16. [Months 1–4 topic plan](#16-months-14-topic-plan)
17. [Node.js depth checklist](#17-nodejs-depth-checklist)
18. [System design track (16 weeks)](#18-system-design-track-16-weeks)
19. [English plan](#19-english-plan)
20. [Daily time split](#20-daily-time-split)

**Part C: check yourself**

21. [Self-check questions](#21-self-check-questions)
22. [Interview questions this setup prepares you for](#22-interview-questions-this-setup-prepares-you-for)
23. [Progress tracker](#23-progress-tracker)

---

# Part A: understand what is built

## 1. How to use this file

1. Read one section of Part A, then open the files it mentions and read the real code.
2. Answer that section's questions in Part C, **in English, in your own words**, without looking.
3. Then follow Part B day by day. Every topic ends with something you build.
4. Tick the boxes in [section 23](#23-progress-tracker) as you go.

---

## 2. Docker, Postgres and Redis: how they are created and started

The database and Redis don't run directly on your PC. They run inside **Docker containers**: small isolated machines that Docker starts from a recipe. Our recipe is `docker-compose.yml`.

### 2.1 The picture

```
Your PC (Windows)
|
+-- Docker Desktop
|   +-- container: skillstreakr-postgres   (port 5432 inside)  <- reached from your PC on 5433
|   +-- container: skillstreakr-redis      (port 6379 inside)  <- reached from your PC on 6380
|   +-- volume:    pgdata                  (where Postgres saves its files)
|
+-- skillstreakr-api (npm run dev)
        DATABASE_URL = localhost:5433  -> reaches the Postgres container
        REDIS_URL    = localhost:6380  -> reaches the Redis container
```

| Word                         | Meaning                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| **Image**                    | The template: an installed copy of Postgres 17 or Redis 7, downloaded once                         |
| **Container**                | A running copy of an image                                                                         |
| **Volume**                   | A folder Docker keeps for a container's data. It survives restarts and even deleting the container |
| **Port mapping** `5433:5432` | Left = the port on your PC, right = the port inside the container                                  |
| **Network**                  | Docker creates one per compose project so its containers can reach each other                      |

### 2.2 The recipe, line by line

```yaml
services:
  postgres:
    image: postgres:17-alpine # which image
    container_name: skillstreakr-postgres
    environment: # read on the FIRST start only
      POSTGRES_USER: skill #   creates this user
      POSTGRES_PASSWORD: skill #   with this password
      POSTGRES_DB: skillstreakr #   and this empty database
    ports:
      - "5433:5432" # PC 5433 -> container 5432
    volumes:
      - pgdata:/var/lib/postgresql/data # data kept in the volume

  redis:
    image: redis:7-alpine
    container_name: skillstreakr-redis
    ports:
      - "6380:6379" # PC 6380 -> container 6379

volumes:
  pgdata: # Docker creates this volume
```

- You never run `CREATE DATABASE` yourself: the Postgres image reads `POSTGRES_DB` on its first start and creates the database.
- **Why 5433 and 6380:** the DriftCharge containers already use 5432 and 6379 on your PC, and two programs can't listen on the same port. Inside the containers the normal ports stay the same.
- **Why `alpine`:** a very small Linux base, so images download and start fast.

### 2.3 Create and start them

Docker Desktop must be running (whale icon in the taskbar, "Engine running"). Then:

```bash
cd D:/skillstreakr/skillstreakr-api
docker compose up -d
```

| Part             | Meaning                                                 |
| ---------------- | ------------------------------------------------------- |
| `docker compose` | Read `docker-compose.yml` in this folder                |
| `up`             | Create whatever is missing, then start it               |
| `-d`             | Detached: run in the background, give the terminal back |

Expected output:

```
Network skillstreakr-api_default    Created
Volume skillstreakr-api_pgdata      Created
Container skillstreakr-redis        Started
Container skillstreakr-postgres     Started
```

### 2.4 Check that they run

```bash
docker ps --filter "name=skillstreakr"        # both "Up", ports 5433 and 6380
docker logs -f skillstreakr-postgres          # Ctrl + C to stop watching
```

The Postgres log should end with `database system is ready to accept connections`.

### 2.5 Go inside and look

**Postgres** (`docker exec -it` opens a shell inside the container; `psql` is the Postgres command-line tool):

```bash
docker exec -it skillstreakr-postgres psql -U skill -d skillstreakr
```

```sql
\l                 -- list databases: "skillstreakr" is there
\dt                -- list tables: none yet (they come with Drizzle)
SELECT version();  -- PostgreSQL 17...
\q                 -- quit
```

**Redis:**

```bash
docker exec -it skillstreakr-redis redis-cli
```

```
PING            -> PONG
SET hello world
GET hello       -> "world"
DEL hello
exit
```

**From a GUI (optional):** pgAdmin at `http://localhost:5050` -> add a server: host `host.docker.internal` (pgAdmin itself runs in Docker), port `5433`, database `skillstreakr`, user and password `skill`.

### 2.6 Daily commands

| Command                           | What it does                          | Data kept?                 |
| --------------------------------- | ------------------------------------- | -------------------------- |
| `docker compose up -d`            | Start (creates them if missing)       | Yes                        |
| `docker compose stop`             | Stop the containers, keep them        | Yes                        |
| `docker compose start`            | Start stopped containers again        | Yes                        |
| `docker compose ps`               | Status of this project's containers   | n/a                        |
| `docker compose logs -f postgres` | Follow the Postgres logs              | n/a                        |
| `docker compose down`             | Delete the containers and the network | **Yes** (the volume stays) |
| `docker compose down -v`          | Delete containers **and the volume**  | **No: all data is gone**   |

Normal day: `docker compose up -d` before work, `docker compose stop` after. Use `down -v` only when you really want an empty database.

### 2.7 How the API uses them

```
DATABASE_URL=postgres://skill:skill@localhost:5433/skillstreakr
              protocol  user  pass  host      port  database
REDIS_URL=redis://localhost:6380
```

The URL matches the recipe exactly. Today the API only checks that these are valid URLs; it connects for real from the Drizzle step (`core/db.ts`), and then `/v1/health` will report `database: up`.

### 2.8 If something goes wrong

| Problem                                     | Cause                                                                          | Fix                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `error during connect ... docker_engine`    | Docker Desktop isn't running                                                   | Start it, wait for "Engine running"                              |
| `port is already allocated`                 | Another program uses 5433 or 6380                                              | Change the left number in `ports`, and the same number in `.env` |
| Changed `POSTGRES_PASSWORD` but login fails | Env values are used only on the **first** start; the volume keeps the old user | `docker compose down -v`, then `up -d` (deletes the data)        |
| Container shows `Exited`                    | It crashed on start                                                            | `docker logs skillstreakr-postgres`, read the last lines         |

### 2.9 See which containers are running

| Command                                       | Shows                                                |
| --------------------------------------------- | ---------------------------------------------------- |
| `docker ps`                                   | Only **running** containers                          |
| `docker ps -a`                                | **All** containers, including stopped ones           |
| `docker stats`                                | Live CPU and memory per container (Ctrl + C to exit) |
| `docker compose ls`                           | Running compose projects and their folders           |
| `docker compose ps` (inside a project folder) | Only that project's containers                       |

Docker Desktop shows the same in the **Containers** tab, with a Start / Stop button next to each one.

The containers on this PC (checked on 2026-11-22):

| Container                          | Project                  | Port on your PC | Memory       |
| ---------------------------------- | ------------------------ | --------------- | ------------ |
| `skillstreakr-postgres`            | SkillStreakr             | 5433            | about 38 MB  |
| `skillstreakr-redis`               | SkillStreakr             | 6380            | about 4 MB   |
| `driftcharge-postgres`             | DriftCharge              | 5432            | about 28 MB  |
| `drift-redis`                      | DriftCharge              | 6379            | about 13 MB  |
| `drift-pgadmin`                    | DriftCharge (DB GUI)     | 5050            | about 276 MB |
| `driftcharge-postgres-pg17-backup` | DriftCharge (old backup) | none            | stopped      |

Leave `driftcharge-postgres-pg17-backup` alone: it's already stopped, uses nothing, and looks like an old database backup.

### 2.10 Which ones to stop

| You're working on | Keep running                                                            | Can stop                                                             |
| ----------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| SkillStreakr only | `skillstreakr-postgres`, `skillstreakr-redis`                           | The 3 DriftCharge containers                                         |
| DriftCharge only  | `driftcharge-postgres`, `drift-redis` (+ `drift-pgadmin` if you use it) | The 2 SkillStreakr containers                                        |
| Both              | All                                                                     | Only `drift-pgadmin` when you don't use it (it uses the most memory) |

Stopping a DriftCharge container means DriftCharge's local app can't reach its database until you start it again.

### 2.11 How to stop and start

One container, by name:

```bash
docker stop drift-pgadmin
docker start drift-pgadmin
```

Several at once:

```bash
docker stop skillstreakr-postgres skillstreakr-redis
docker start skillstreakr-postgres skillstreakr-redis
```

A whole compose project (run it from that project's folder):

```bash
cd D:/skillstreakr/skillstreakr-api
docker compose stop        # stops both SkillStreakr containers
docker compose up -d       # starts them again
```

| Command                  | What happens                                                 | Data                          |
| ------------------------ | ------------------------------------------------------------ | ----------------------------- |
| `docker stop <name>`     | Pauses the container; it stays in `docker ps -a` as `Exited` | Kept                          |
| `docker start <name>`    | Runs it again                                                | Kept                          |
| `docker rm <name>`       | Deletes a **stopped** container                              | Kept only if it uses a volume |
| `docker compose down`    | Deletes the project's containers + network                   | Kept (the volume stays)       |
| `docker compose down -v` | Deletes containers **and volumes**                           | **Lost**                      |

For daily use, only `stop` and `start`: they never lose data.

### 2.12 What happens when you stop the SkillStreakr containers

| Thing                   | Result                                                                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Your data               | **Safe.** It lives in the `pgdata` volume, which stop doesn't touch                                                                                                                                                             |
| The containers          | Still exist; `docker ps -a` shows them as `Exited`                                                                                                                                                                              |
| Memory / CPU            | Freed                                                                                                                                                                                                                           |
| Ports 5433 and 6380     | Free until you start them again                                                                                                                                                                                                 |
| DriftCharge             | Not affected; it has its own containers                                                                                                                                                                                         |
| The API (`npm run dev`) | **Today:** still works, because it doesn't connect to the database yet. **After the Drizzle step:** `/v1/health` shows `database: down` and every request that reads or writes data fails with a 500 until you start them again |

Start them again with `docker compose up -d` (or `docker start skillstreakr-postgres skillstreakr-redis`). They come back with all the old data in a few seconds.

**The API server is not a container.** `npm run dev` runs in your terminal:

| Action             | How                                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| Stop               | **Ctrl + C** in that terminal                                                                                   |
| Start              | `npm run dev`                                                                                                   |
| Effect of stopping | `http://localhost:4000` stops answering, so the React app's API calls fail; the database and Redis keep running |

### 2.13 Daily routine

```bash
# start of work
cd D:/skillstreakr/skillstreakr-api
docker compose up -d     # database + redis
npm run dev              # API

# end of work
Ctrl + C                 # stop the API
docker compose stop      # stop database + redis (data kept)
```

---

## 3. The API setup, file by file

### 3.1 Project basics

| What                                 | Why                                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------------------- |
| `npm init -y` created `package.json` | The project's identity, scripts and dependencies                                    |
| `"type": "module"`                   | Use `import` / `export`. `npm init` sets `"commonjs"` (`require`), the older system |
| `"engines": { "node": ">=24" }`      | Node 24 gives `--env-file` (no dotenv) and `process.loadEnvFile`                    |
| `package-lock.json` committed        | Everyone installs exactly the same versions                                         |

### 3.2 TypeScript config

| Option                                  | Why                                                                                                                                                      |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `module` / `moduleResolution: nodenext` | Real Node ES modules. That's why our imports end in `.js` even though the files are `.ts`: the import must name the file that will exist after the build |
| `strict: true`                          | Null checks, no implicit `any`                                                                                                                           |
| `noUncheckedIndexedAccess`              | `array[0]` might be `undefined`, so you must check                                                                                                       |
| `types: ["node"]`                       | TypeScript 6+ no longer loads Node's types by default                                                                                                    |
| `tsconfig.build.json`                   | Same settings but without `tests/`, so tests never go into `dist/`                                                                                       |

### 3.3 Packages and their jobs

| Package               | Job                                                     |
| --------------------- | ------------------------------------------------------- |
| `express`             | HTTP server and routing                                 |
| `helmet`              | Security headers on every response                      |
| `cors`                | Lets the React app (port 5173) call the API (port 4000) |
| `zod`                 | Validates `.env` now, request bodies later              |
| `pino`, `pino-http`   | Fast JSON logs, one line per request                    |
| `tsx`                 | Runs `.ts` directly in dev, restarts on save            |
| `vitest`, `supertest` | Tests; supertest calls the API without opening a port   |
| `pino-pretty`         | Coloured logs locally                                   |

### 3.4 The files

| File                         | Job                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `bin/www.ts`                 | Starts the HTTP server; clear message if the port is busy; graceful shutdown         |
| `app.ts`                     | Builds Express: helmet -> cors -> json -> logger -> `/v1` -> 404 -> errors           |
| `config/env.ts`              | Reads `.env`, checks it with Zod, **stops the app at startup** if something is wrong |
| `core/logger.ts`             | pino: pretty in dev, silent in tests, JSON in production                             |
| `helper/status-codes.ts`     | Named codes (`OK`, `NOT_FOUND`) instead of magic numbers                             |
| `helper/error-handler.ts`    | `class ErrorHandler(statusCode, message)` for expected errors                        |
| `middleware/dispatcher.ts`   | Runs the controller and sends `{ status, statusCode, data }`                         |
| `middleware/not-found.ts`    | 404 for unknown URLs                                                                 |
| `middleware/handle-error.ts` | One place for every error; unknown errors become 500 "Something went wrong"          |
| `utils/constant.ts`          | `SUCCESS` / `FAILURE`                                                                |
| `modules/v1/index.ts`        | Mounts every module: `v1.use("/health", health)`                                     |
| `modules/v1/health/*`        | First module: route, controller, service                                             |
| `tests/health.test.ts`       | 2 tests: success, and 404 for an unknown route                                       |
| `vitest.config.ts`           | Loads `.env` (or `.env.example` in CI) for tests                                     |
| `docker-compose.yml`         | Postgres + Redis (section 2)                                                         |

### 3.5 Key ideas behind the files

| Idea                                         | Explanation                                                                                                                                                   |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`app.ts` and `bin/www.ts` are separate**   | Tests import `app` and call it in memory. If `app.ts` also started listening, every test would open a port                                                    |
| **Validate env at startup**                  | A missing `DATABASE_URL` crashes the app when it starts, where you see it, not in the middle of a user's request                                              |
| **Hide unknown errors**                      | Internal messages and stack traces can leak details to attackers; log them, show the user a generic message                                                   |
| **`/v1` prefix**                             | A future `/v2` can change responses without breaking old clients                                                                                              |
| **CORS `credentials: true` with one origin** | The browser may send cookies only to an API that names the exact allowed origin; `origin: "*"` with credentials isn't allowed, and would let any site call us |
| **Graceful shutdown**                        | On deploy (SIGTERM) the server finishes requests in progress before exiting, so users don't see failed requests                                               |

### 3.6 Two Sonar fixes and the lesson

| Warning                                             | Fix                                            | Lesson                                              |
| --------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------- |
| `'unknown' overrides all other types in this union` | `Promise<unknown> \| unknown` became `unknown` | `unknown` already includes every type, Promises too |
| `async function has no await`                       | Removed `async` from `getStatus`               | Write `async` only when there is an `await` inside  |

### 3.7 Things that went wrong during setup, and the fixes

| Problem                                        | Fix                                                                          |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| `npm init` set `"type": "commonjs"`            | Changed to `"module"`                                                        |
| TypeScript 6+ didn't load Node types           | Added `"types": ["node"]`                                                    |
| `@types/node` installed v26 for Node 24        | Pinned to v24                                                                |
| Windows changed line endings to CRLF           | `.gitattributes` with `eol=lf`                                               |
| `npm audit`: 5 high issues                     | Left on purpose (Vitest, dev only); after the 2026-11-22 update it reports 0 |
| typescript-eslint doesn't support TypeScript 7 | Moved the API to TypeScript 6 (same as the web repo)                         |

---

## 4. How one request travels

```
GET /v1/health
 -> bin/www.ts          the server receives the request
 -> app.ts              helmet, cors, json, logger
 -> app.use("/v1", v1)
 -> modules/v1/index.ts v1.use("/health", health)
 -> health.route.ts     router.get("/", (req, res, next) => dispatcher(req, res, next, healthCheck))
 -> health.controller   healthCheck() returns healthService.getStatus()
 -> HealthService       returns { status: "up", uptimeSeconds, timestamp }
 -> dispatcher          res.json({ status: "success", statusCode: 200, data })
```

Error path:

```
anything throws -> dispatcher catches -> next(error) -> handleError
   ErrorHandler   -> its own status + message
   anything else  -> logged, 500 "Something went wrong"
unknown URL     -> notFound -> 404 in the same JSON shape
```

---

## 5. Where classes are used (the verifier pattern)

The structure copies the `csv-data-verifier` service.

| Layer      | Style                                                      | Example               |
| ---------- | ---------------------------------------------------------- | --------------------- |
| route      | `(req, res, next) => dispatcher(req, res, next, fn)`       | `health.route.ts`     |
| controller | Plain exported functions that **return** data              | `healthCheck`         |
| service    | **Class**; builds its repository/helper in the constructor | `HealthService`       |
| repository | **Class**, database queries only                           | from the Drizzle step |
| helper     | **Class**, small steps / external calls                    | when needed           |

Arrow functions and `this`: when Express calls a class method as a plain callback, `this` is lost. An arrow function property (`getStatus = () => {}`) keeps `this`. With plain controller functions this problem disappears.

### Template for every new module

```
modules/v1/<name>/
+-- index.ts               export { default } from "./<name>.route.js"
+-- <name>.route.ts        router + dispatcher
+-- <name>.controller.ts   functions: read req, call the service, return data
+-- <name>.service.ts      class: business logic
+-- <name>.repository.ts   class: DB queries only
+-- <name>.constant.ts     constants (optional)
```

Then one line in `modules/v1/index.ts`: `v1.use("/<name>", <name>)`.

---

## 6. Commit types (Conventional Commits)

Format: `<type>: <short description>`. `chore` means maintenance that adds no feature and fixes no bug.

| Type       | When                              | Example                                         |
| ---------- | --------------------------------- | ----------------------------------------------- |
| `feat`     | A new feature the user can see    | `feat: add streak counter API`                  |
| `fix`      | A bug fix                         | `fix: streak resets at wrong timezone`          |
| `chore`    | Setup, configs, packages, tooling | `chore: setup express api with class structure` |
| `refactor` | Code changed, behaviour the same  | `refactor: move user logic into service`        |
| `test`     | Only tests                        | `test: add health route tests`                  |
| `docs`     | Only documentation                | `docs: add local setup steps to README`         |
| `style`    | Formatting only                   | `style: format with prettier`                   |
| `perf`     | Faster                            | `perf: add index on habits.user_id`             |
| `ci`       | GitHub Actions / pipeline         | `ci: add test workflow`                         |
| `build`    | Build system or dependencies      | `build: upgrade typescript to 7`                |

Why: `git log` is easy to scan, changelogs can be generated, and teams expect it. Branch names use the same idea: `chore/project-setup`, `feat/auth-signup`, `fix/streak-timezone`.

---

## 7. Git hooks: husky, lint-staged, commitlint

| Git action             | Hook                | Runs                                                                  | Blocks if                                                                |
| ---------------------- | ------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `git commit` (before)  | `.husky/pre-commit` | lint-staged (ESLint + Prettier on staged files) + `npm run typecheck` | A lint error ESLint can't fix, or a type error                           |
| `git commit` (message) | `.husky/commit-msg` | commitlint                                                            | Not one of the 10 types, uppercase type, empty text, over 100 characters |
| `git push`             | `.husky/pre-push`   | `npm test`                                                            | A failing test                                                           |

- `"prepare": "husky"` installs the hooks automatically on `npm install`, on any machine.
- Tests run on push, not on commit, so committing stays fast.
- Rule levels in `commitlint.config.js`: `0` off, `1` warning, `2` error (blocks).
- `--no-verify` skips the hooks: emergency only.

---

## 8. The frontend setup, step by step

| Step          | What we did                                                             | What to understand                                                                                                                                                                                              |
| ------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1             | `npm create vite@latest . -- --template react-ts`                       | Vite = dev server + bundler; the `.` creates the app in the cloned folder                                                                                                                                       |
| Linter choice | **ESLint**, not Oxlint                                                  | ESLint is the company standard with plugins (React hooks, TanStack Query, accessibility); Oxlint is faster but has no plugins yet. Speed doesn't matter here because lint-staged checks only changed files      |
| 2             | Tailwind 4 (`@tailwindcss/vite`, `@import "tailwindcss";`)              | Style with classes in JSX. `flex items-center justify-center` = centre; `min-h-screen` = full height; `bg-slate-100` = light grey; `text-4xl font-bold text-blue-600` = big, bold, blue                         |
| 3             | `@/` alias in `tsconfig.json`, `tsconfig.app.json` and `vite.config.ts` | TypeScript needs it for types, Vite needs it to find the files at runtime, shadcn's CLI reads the root `tsconfig.json`. No `baseUrl`: TypeScript 6 deprecated it                                                |
| 4             | shadcn/ui (Radix, Nova): button, card, input, label                     | The component code is copied into `src/components/ui/`, so you own it. `cn` package (from shadcn) merges classes. ESLint fast-refresh rule turned off for that folder because shadcn files also export variants |
| 5             | TanStack Router + Query                                                 | File in `src/routes/` = a page; `routeTree.gen.ts` is generated and **committed** (tsc needs it); typed `<Link>`; preload on hover; Query defaults: `staleTime` 60 s, `retry` 1, no refetch on tab focus        |
| Port          | `strictPort: true` on 5173                                              | The API's CORS allows only 5173, so Vite stops rather than move to 5174                                                                                                                                         |

Why the alias matters:

```ts
import { Button } from "../../../components/ui/button"; // breaks when the file moves
import { Button } from "@/components/ui/button"; // always the same
```

Why not fetch in `useEffect`: no cache, race conditions, double requests in StrictMode, manual loading and error state. TanStack Query handles all of it.

---

## 9. Two repos instead of one

We chose **two repositories** (`skillstreakr-api`, `skillstreakr-web`) because they are easier to understand while learning: each repo has one job.

|               | One repo (monorepo)                  | Two repos (our choice)                                           |
| ------------- | ------------------------------------ | ---------------------------------------------------------------- |
| Shared types  | One `packages/shared`                | Copy types into the web repo (later: generate them from OpenAPI) |
| One feature   | One PR                               | Two PRs, merged in order                                         |
| CI            | One workflow                         | One per repo                                                     |
| Understanding | More tooling (workspaces, Turborepo) | Simple: one app per repo                                         |

Monorepos (Google, Shopify, Vercel) are worth knowing for interviews; you can explain both.

---

## 10. Git workflow

```
git checkout -b feat/skills-module     # one branch per task
... write code ...
git add .
git status                              # .env must NOT be listed
git commit -m "feat: add skills module" # hooks run
git push -u origin feat/skills-module   # tests run
GitHub -> Compare & pull request -> Squash and merge
```

Repo settings that protect `main`: pull request required, force push blocked, squash merge only, auto-delete branches, Dependabot, secret scanning with push protection.

---

# Part B: what to learn next

## 11. Rules while studying

1. **Read the docs, then type the code yourself.** No copy-paste.
2. **Every topic ends with something you built.** Reading alone is not learning.
3. **Write 5 lines in English after each topic**, in your own words.
4. **Learn the 20% you need now.** Redis, BullMQ, auth and AI each come when that feature starts.
5. **Stuck for more than 30 minutes?** Ask, but first say what you tried.

---

## 12. Week 1: backend fundamentals

| Day     | Topic              | Read                                                                                                                                               | Focus on                                                                            | Build / self-check                                   |
| ------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1       | **Node.js basics** | nodejs.org/learn: Introduction, Event loop, ES modules                                                                                             | Event loop, `import` vs `require`, why `"type": "module"`, why imports end in `.js` | Explain the event loop in 5 lines                    |
| 2       | **Express 5**      | expressjs.com: Routing, Writing middleware, Error handling                                                                                         | `app.use`, `Router`, middleware order, 4-parameter error handler                    | Trace `/v1/health` from `bin/www.ts` to the response |
| 3       | **Your own code**  | Every API file in flow order: `bin/www.ts` -> `app.ts` -> `modules/v1/index.ts` -> route -> controller -> service -> `dispatcher` -> `handleError` | Why each file exists                                                                | Add `GET /v1/version` yourself                       |
| 4       | **TypeScript**     | typescriptlang.org Handbook: Everyday Types, Narrowing, Generics, Classes                                                                          | `unknown` vs `any`, interfaces, classes + constructors, `strict`                    | Why does the dispatcher return `unknown`?            |
| 5       | **Zod + env**      | zod.dev: Basic usage, Primitives, Objects, safeParse                                                                                               | Why `config/env.ts` checks at startup                                               | Add a new env variable with a default                |
| 6 (Sat) | **HTTP + REST**    | MDN: HTTP overview, HTTP methods, Status codes, CORS                                                                                               | GET/POST/PUT/PATCH/DELETE; 200/201/400/401/404/500; what CORS blocks and why        | Why `credentials: true` and not `origin: "*"`?       |
| 7 (Sun) | **Testing**        | vitest.dev Getting started + supertest README                                                                                                      | `describe` / `it` / `expect`, testing without a server                              | Write the test for `/v1/version`                     |

---

## 13. Week 2: frontend fundamentals

| Day      | Topic               | Read                                                                          | Focus on                                                                    | Build / self-check                        |
| -------- | ------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------- |
| 8        | **React basics**    | react.dev/learn: Describing the UI, Adding interactivity, Managing state      | Components, props, `useState`, re-render, lists + `key`                     | A counter component                       |
| 9        | **React effects**   | react.dev: Synchronizing with Effects, You might not need an effect           | When **not** to use `useEffect`                                             | Explain why we don't fetch in `useEffect` |
| 10       | **Tailwind**        | tailwindcss.com: Styling with utility classes, Responsive design, Hover/focus | Flex, grid, spacing, `md:` breakpoints                                      | A responsive 2-column card layout         |
| 11       | **shadcn/ui**       | ui.shadcn.com: Introduction, Button, Card, Input, Form                        | Code copied into the repo, variants, `cn()`                                 | Add a `dialog` and open it from a button  |
| 12       | **TanStack Router** | tanstack.com/router: File-based routing, Navigation, Path params              | `src/routes`, `<Link>`, `<Outlet>`, `$id`                                   | Create `/skills/$id` showing the id       |
| 13 (Sat) | **TanStack Query**  | tanstack.com/query: Overview, Queries, Query keys, Mutations, Invalidation    | `useQuery`, `useMutation`, `staleTime`, `invalidateQueries`                 | Explain caching in your own words         |
| 14 (Sun) | **Git workflow**    | conventionalcommits.org + GitHub "About pull requests"                        | Branch -> commit -> push -> PR -> squash merge; how hooks block bad commits | One full PR on the web repo               |

---

## 14. Before the database step

| Topic             | Read                                                                        | Why                                                                                                                        |
| ----------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **SQL basics**    | sqlbolt.com, all lessons (about 3 hours)                                    | SELECT, WHERE, JOIN, GROUP BY, INSERT, UPDATE, DELETE                                                                      |
| **PostgreSQL**    | postgresqltutorial.com: data types, primary key, foreign key, unique, index | Our main database                                                                                                          |
| **Drizzle ORM**   | orm.drizzle.team: Get started with PostgreSQL, Schema, Migrations           | Tables defined in TypeScript                                                                                               |
| **Docker basics** | docs.docker.com Get started, parts 1–3                                      | What `docker compose up -d` actually does (and [section 2](#2-docker-postgres-and-redis-how-they-are-created-and-started)) |

Then write the **DB design note** by hand (`users`, `skills`, `daily_logs`, `log_entries`: columns, types, keys, unique rules, indexes) and get it reviewed before any code.

---

## 15. Learn when the feature starts

| Topic                                        | When        | Key points                                                                                          |
| -------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| Auth: argon2, JWT, cookies, refresh rotation | Weeks 4–5   | Hashing vs encryption; access vs refresh token; HttpOnly / Secure / SameSite; token reuse detection |
| OAuth 2.0 (Google, GitHub)                   | Week 5      | Authorization code flow, state, PKCE                                                                |
| SQL depth                                    | Week 6      | Window functions (streaks), indexes, `EXPLAIN ANALYZE`                                              |
| Transactions + locks                         | Week 7      | ACID, isolation levels, upsert, race conditions                                                     |
| Idempotency + real-DB testing                | Week 8      | Unique keys, Testcontainers                                                                         |
| AWS S3 + IAM                                 | Week 9      | Presigned URLs, private buckets, least privilege                                                    |
| Lambda + SQS + SES                           | Week 10     | Queues, retries, dead-letter queues, email                                                          |
| Redis + BullMQ + webhooks                    | Week 11     | Cache-aside, TTL, job schedulers, HMAC                                                              |
| Observability                                | Week 12     | Structured logs, Sentry, OpenTelemetry traces and metrics                                           |
| React deep + frontend data                   | Weeks 13–14 | Rendering, memo, Suspense, charts                                                                   |
| AI engineering                               | v4          | LLM APIs, structured output, embeddings + RAG, pgvector, tool calling, MCP, evals                   |
| Payments                                     | v4          | Subscriptions, webhooks, grace periods                                                              |
| NestJS                                       | Month 5–6   | One week, to compare with Express                                                                   |
| MongoDB                                      | Month 6–7   | One week, to compare with Postgres                                                                  |
| Go                                           | Months 7–9  | Rewrite one service (export worker or stats)                                                        |

---

## 16. Months 1–4 topic plan

| Month | Weeks | Topics                                                                               |
| ----- | ----- | ------------------------------------------------------------------------------------ |
| 1     | 1–4   | JavaScript, Node.js internals, TypeScript, HTTP + cookies + CORS + caching           |
| 2     | 5–8   | Auth (JWT, OAuth, HMAC), SQL + Postgres, transactions + locks, idempotency + testing |
| 3     | 9–12  | AWS IAM + S3, Lambda + SQS + SES, Redis + BullMQ + webhooks, observability           |
| 4     | 13–16 | React deep, frontend data + routing, system design basics, project story             |

---

## 17. Node.js depth checklist

- [ ] Event loop phases
- [ ] `process.nextTick` vs `setImmediate`
- [ ] libuv thread pool
- [ ] Streams, backpressure, `pipeline`
- [ ] `worker_threads` vs `cluster`
- [ ] Async error handling, `unhandledRejection`
- [ ] Graceful shutdown (already in `bin/www.ts`)
- [ ] Memory, heap snapshots
- [ ] Profiling, event-loop lag
- [ ] Security: prototype pollution, ReDoS, supply chain
- [ ] Connection pooling, timeouts, retries

---

## 18. System design track (16 weeks)

25 minutes every weekday, 1.5 hours on Saturday (one full design with a diagram), 1 hour on Sunday (revise + explain one design out loud and record it).

| Phase           | Week | Topics                                                                                      |
| --------------- | ---- | ------------------------------------------------------------------------------------------- |
| Basics          | 1    | What happens when you type a URL (DNS, TCP, TLS, HTTP), latency vs throughput, availability |
|                 | 2    | Vertical vs horizontal scaling, load balancer, stateless servers, sessions                  |
|                 | 3    | Caching (browser, CDN, Redis, cache-aside, TTL, invalidation)                               |
|                 | 4    | SQL vs NoSQL, indexes, read replicas, back-of-the-envelope estimates                        |
| Building blocks | 5    | Sharding / partitioning, consistent hashing                                                 |
|                 | 6    | CAP theorem, consistency models, distributed transactions                                   |
|                 | 7    | Message queues (SQS, Kafka basics), retries, dead-letter queues, idempotency                |
|                 | 8    | API design (REST, GraphQL, pagination), rate-limiting algorithms, unique IDs                |
| Classic designs | 9    | URL shortener                                                                               |
|                 | 10   | Rate limiter                                                                                |
|                 | 11   | Notification / email system                                                                 |
|                 | 12   | Webhook ingestion system                                                                    |
|                 | 13   | Payment / subscription billing                                                              |
|                 | 14   | News feed / activity feed                                                                   |
|                 | 15   | Chat app / leaderboard                                                                      |
|                 | 16   | Full SkillStreakr design doc                                                                |

Resources: **System Design Primer** (GitHub, free), **ByteByteGo** / _System Design Interview_ Vol 1 + 2 (Alex Xu), _Designing Data-Intensive Applications_ (Martin Kleppmann).

---

## 19. English plan

| Daily (25 min)                         | Weekly                                                        |
| -------------------------------------- | ------------------------------------------------------------- |
| 8 min: read a tech article aloud       | Saturday: 200–300 word note                                   |
| 9 min: write a 5-line summary          | Sunday: 5-minute recorded explanation; compare with last week |
| 8 min: speak 2 minutes, record, listen |                                                               |

- Short sentences, one idea each.
- 5 tech phrases a day: "The request fails because…", "The trade-off here is…", "This change only affects…".
- All commits, PRs and design notes in English.
- Use a grammar tool, but rewrite the sentence yourself.

---

## 20. Daily time split

| Slot                      | Weekday (3 h) | Saturday (7 h)    | Sunday (7 h)                   |
| ------------------------- | ------------- | ----------------- | ------------------------------ |
| Study (topic of the week) | 50 min        | —                 | 1.5 h revision                 |
| System design             | 25 min        | 1.5 h             | 1 h                            |
| Project                   | 40 min        | 3 h               | 1 h                            |
| DSA                       | 40 min        | 1.5 h             | 2 h (redo the week's problems) |
| English                   | 25 min        | 1 h (weekly note) | 1 h (recording)                |
| Weekly review             | —             | —                 | 30 min                         |

Take a 10-minute break every 50 minutes.

---

# Part C: check yourself

## 21. Self-check questions

Answer in English, in your own words, without looking. Then check against Part A.

### Docker

1. What is the difference between an image, a container and a volume?
2. Why is the mapping `5433:5432` and not `5432:5432`?
3. Which command keeps your data, `down` or `down -v`?
4. Who created the `skillstreakr` database, and when?

### API setup

5. Why are `app.ts` and `bin/www.ts` separate?
6. What happens if `DATABASE_URL` is missing from `.env`, and why is that good?
7. Why does `cors` need `credentials: true`, and why not `origin: "*"`?
8. What does the `dispatcher` save you from writing in every controller?
9. Why does `handleError` hide the real message for unknown errors?
10. Why do imports end in `.js` when the files are `.ts`?
11. Why does `ErrorMiddleware.handle` / `handleError` need exactly 4 parameters?
12. What does `server.close()` in the shutdown code protect against during a deploy?
13. Why was `getStatus` an arrow function in the class version?
14. What is the difference between the pre-commit hook and the pre-push hook, and why are tests on push?

### Frontend

15. Why does the dev server use `strictPort`?
16. Why must `routeTree.gen.ts` be committed?
17. Why do TypeScript **and** Vite both need the `@/` alias?
18. Why did we choose ESLint over Oxlint?
19. `useEffect` vs TanStack Query for data fetching: which one, and why?
20. What does `staleTime: 60_000` change?

### Node.js and JavaScript

21. Explain the event loop in 5 lines.
22. What is a closure? Give one real use.
23. Microtask vs macrotask: which runs first, and why?

---

## 22. Interview questions this setup prepares you for

1. What happens between `app.listen` and your controller running?
2. How does middleware order matter in Express?
3. Why separate the app and the server files?
4. What is CORS, and why does the browser enforce it, not the server?
5. `useEffect` vs TanStack Query for data fetching: which one and why?
6. What does `staleTime` change?
7. Why validate env variables at startup?
8. What is a squash merge, and why use it?
9. Monorepo vs separate repos: trade-offs?
10. Why Postgres and not MongoDB for this product?
11. Why a modular monolith and not microservices?
12. How do you make sure one user can never read another user's data?

---

## 23. Progress tracker

### Part A: understood

- [ ] Docker, Postgres and Redis started and checked (`PING` -> `PONG`, `\l` shows `skillstreakr`)
- [ ] API files read in flow order
- [ ] Request flow traced end to end
- [ ] Module template understood
- [ ] Commit types and hooks understood
- [ ] Frontend steps 1–5 understood

### Part B: learned

- [ ] Week 1: Node.js, Express, own code, TypeScript, Zod, HTTP, testing
- [ ] Week 2: React, effects, Tailwind, shadcn, Router, Query, Git workflow
- [ ] SQL basics (sqlbolt)
- [ ] PostgreSQL basics
- [ ] Drizzle basics
- [ ] Docker basics
- [ ] DB design note written and reviewed

### Part C: answered

- [ ] Self-check questions 1–23
- [ ] Interview questions 1–12, said out loud and recorded once
