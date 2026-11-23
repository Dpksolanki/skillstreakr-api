# SkillStreakr: what to learn

Everything explained while building SkillStreakr, in one place, and everything still to learn, in order.

- **Part A** explains what is already built, so you understand every file before writing new code.
- **Part B** is the study plan: what to read, what to focus on, how to check yourself.
- **Part C** collects every self-check and interview question.

See [README.md](README.md) for the project, [STACK.md](STACK.md) for the tools, [CHECKS.md](CHECKS.md) for the checks and [DRIZZLE.md](DRIZZLE.md) for the database layer.

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
| Wrote `SKILLSTREAKR.md` (full plan) and added the system design track                                 | 16-week system design roadmap; daily time split                                          | [20](#20-system-design-track-16-weeks), [22](#22-daily-time-split) |
| GitHub repo settings                                                                                  | Visibility, no license, branch rules, squash merge, Dependabot, secret scanning          | [10](#10-git-github-settings-and-branch-protection)                |
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
| Web pushed to `main` (first commit)                                                                              | First push to an empty repo goes to `main`                                                                          | [10](#10-git-github-settings-and-branch-protection)                                                               |
| Got the 2-week study list                                                                                        | What to read before coding                                                                                          | [14](#14-week-1-backend-fundamentals), [15](#15-week-2-frontend-fundamentals), [16](#16-before-the-database-step) |

### 2026-11-21: Coding checklist, docs, database check

| Done                                                                                                                               | Learned                                                                        | Read again                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Got the coding checklist: Phase 0 fixes -> DB design note -> Drizzle -> shared blocks -> skills + logs modules -> tests -> screens | Order of work; write the DB design note yourself first                         | CHECKS.md section 13                                               |
| Wrote README.md, STACK.md, CHECKS.md in both repos                                                                                 | Full project, every tool and why, every check                                  | README, STACK, CHECKS                                              |
| Checked whether Postgres and Redis exist                                                                                           | Images were downloaded, but containers, volume and database were never created | [2](#2-docker-postgres-and-redis-how-they-are-created-and-started) |

### 2026-11-22: Docker, ESLint, GitHub branches and protection

| Done                                                                                   | Learned                                                                                                                                                                           | Read again                                                                       |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Docker guide: how Postgres and Redis are created and started                           | Image vs container vs volume; port mapping; `up -d`, `stop`, `down` vs `down -v`; `psql` and `redis-cli`                                                                          | [2](#2-docker-postgres-and-redis-how-they-are-created-and-started)               |
| Wrote LEARN.md with this date-wise log                                                 | Where to find every explanation                                                                                                                                                   | This file                                                                        |
| Started Postgres + Redis with `docker compose up -d`                                   | The `skillstreakr` containers run next to the DriftCharge ones on different ports                                                                                                 | [2.3](#23-create-and-start-them)                                                 |
| Listed the running containers and learned to stop / start them                         | `docker ps`, `ps -a`, `stats`; stop vs rm vs down vs down -v; what breaks when a container stops; API server is stopped with Ctrl + C, not Docker                                 | [2.9](#29-see-which-containers-are-running)–[2.13](#213-daily-routine)           |
| Added ESLint to the API; moved TypeScript 7 -> 6                                       | typescript-eslint supports TypeScript only up to 6.0; type-aware rules catch promises not awaited, unused names, `console.log`, `==`; ESLint runs before Prettier on every commit | CHECKS.md section 2.1                                                            |
| Learned GitHub Actions cost                                                            | Free with no limit on public repos (Linux runners); private repos get 2,000 free minutes a month                                                                                  | [17](#17-learn-when-the-feature-starts)                                          |
| Created `main` + `development` in both repos; `development` is the default branch      | Branch model; the `git push origin -u origin main` typo                                                                                                                           | [10.1](#101-the-branch-model)–[10.3](#103-default-branch--development)           |
| Changed repository settings (wiki off, squash + merge commit, rebase off, auto-delete) | Why each setting; why the wiki is off (shop register example)                                                                                                                     | [10.4](#104-repository-settings-and-why)                                         |
| Imported the ruleset on `main` + `development`; added CODEOWNERS by PR                 | What each rule blocks; why the owner needs a bypass; who can merge                                                                                                                | [10.5](#105-the-ruleset)–[10.7](#107-who-can-create-and-merge-pull-requests)     |
| Tested direct pushes on all 4 branches: all rejected (GH013)                           | `--allow-empty`, `commit-tree`, `reset --hard`                                                                                                                                    | [10.10](#1010-how-the-protection-was-tested)                                     |
| Decided to learn the tools before CI                                                   | GitHub Actions basics; the Week 0 plan                                                                                                                                            | [11](#11-github-actions-the-basics), [13](#13-week-0-understand-the-tools-first) |

### 2026-11-23 and 2026-11-24: Database design and Drizzle

| Done                                                                        | Learned                                                                                                                               | Read again                              |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Designed the 4 v1 tables (`users`, `skills`, `daily_logs`, `log_entries`)   | Design from the questions the app asks; uuid v7; `timestamptz` vs `date`; `text` + CHECK; unique and partial indexes; race conditions | [docs/db-design.md](docs/db-design.md)  |
| Chose Drizzle over Prisma and Sequelize                                     | Close to SQL; CHECK and partial indexes in the schema; types without a generate step                                                  | [DRIZZLE.md](DRIZZLE.md) section 1      |
| Built `db/`: connection pool, one file per table, shared columns, relations | How `pg.Pool` + `drizzle(pool, { schema })` connect; `.references()` vs `relations()`                                                 | [DRIZZLE.md](DRIZZLE.md) sections 4–6   |
| Generated `db/migrations/0000_init.sql` (not applied yet)                   | drizzle-kit vs drizzle-orm; generate vs migrate                                                                                       | [DRIZZLE.md](DRIZZLE.md) section 12     |
| Learned to read and write queries                                           | `eq`, `and`, `with`, joins, `groupBy`, transactions, upserts; the SQL behind each                                                     | [DRIZZLE.md](DRIZZLE.md) sections 10–11 |
| Wrote DRIZZLE.md                                                            | Everything about the database layer in one file                                                                                       | [DRIZZLE.md](DRIZZLE.md)                |

**Next day's work:** start Docker, run `npm run db:migrate`, check the tables in `psql` ([DRIZZLE.md](DRIZZLE.md) section 15), then continue Week 0 ([13](#13-week-0-understand-the-tools-first)).

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
10. [Git, GitHub settings and branch protection](#10-git-github-settings-and-branch-protection)
11. [GitHub Actions: the basics](#11-github-actions-the-basics)

**Part B: what to learn next**

12. [Rules while studying](#12-rules-while-studying)
13. [Week 0: understand the tools first](#13-week-0-understand-the-tools-first)
14. [Week 1: backend fundamentals](#14-week-1-backend-fundamentals)
15. [Week 2: frontend fundamentals](#15-week-2-frontend-fundamentals)
16. [Before the database step](#16-before-the-database-step)
17. [Learn when the feature starts](#17-learn-when-the-feature-starts)
18. [Months 1–4 topic plan](#18-months-14-topic-plan)
19. [Node.js depth checklist](#19-nodejs-depth-checklist)
20. [System design track (16 weeks)](#20-system-design-track-16-weeks)
21. [English plan](#21-english-plan)
22. [Daily time split](#22-daily-time-split)

**Part C: check yourself**

23. [Self-check questions](#23-self-check-questions)
24. [Interview questions this setup prepares you for](#24-interview-questions-this-setup-prepares-you-for)
25. [Progress tracker](#25-progress-tracker)

---

# Part A: understand what is built

## 1. How to use this file

1. Read one section of Part A, then open the files it mentions and read the real code.
2. Answer that section's questions in Part C, **in English, in your own words**, without looking.
3. Then follow Part B day by day. Every topic ends with something you build.
4. Tick the boxes in [section 25](#25-progress-tracker) as you go.

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

## 10. Git, GitHub settings and branch protection

### 10.1 The branch model

```
feature branch  --PR (squash)-->  development  --PR (merge commit)-->  main
(feat/..., fix/...,               (finished work                       (latest stable,
 chore/..., ci/...)                comes together)                      released code)
```

| Branch                                       | Purpose                                                       | Direct push | Merged by                                   |
| -------------------------------------------- | ------------------------------------------------------------- | ----------- | ------------------------------------------- |
| `main`                                       | Latest stable, released code                                  | Blocked     | Only the owner, by PR from `development`    |
| `development`                                | All finished work comes together here; the **default branch** | Blocked     | Only the owner, by PR from feature branches |
| `feat/...`, `fix/...`, `chore/...`, `ci/...` | One task each                                                 | Allowed     | Deleted automatically after merge           |

### 10.2 How the branches were created

`skillstreakr-api` had no `main` yet (the first push went to `project-setup`), so `main` was made from it, then `development` from `main`:

```bash
git fetch origin
git checkout project-setup
git pull
git checkout -b main              # new branch "main" from here
git push -u origin main           # create it on GitHub
git checkout -b development       # new branch "development" from main
git push -u origin development
```

`skillstreakr-web` already had `main`, so only `development` was created from it.

**A mistake that happened, and why:**

```
git push origin -u origin main
fatal: refs/remotes/origin/HEAD cannot be resolved to branch
```

`origin` was written twice. Git reads the second `origin` as a branch name to push, which means `origin/HEAD`, a pointer that wasn't set locally. Nothing was pushed or broken. The right command names the remote once: `git push -u origin main`.

| Part of `git push -u origin main` | Meaning                                                           |
| --------------------------------- | ----------------------------------------------------------------- |
| `-u`                              | Remember the link, so later a plain `git push` / `git pull` works |
| `origin`                          | The remote (the GitHub repo)                                      |
| `main`                            | The branch to push                                                |

### 10.3 Default branch = `development`

Settings -> General -> Default branch. New pull requests then target `development` automatically, so nobody opens a PR into `main` by mistake. It's also the branch people see first on GitHub.

### 10.4 Repository settings and why

**Features**

| Setting                   | Value                 | Why                                                                              |
| ------------------------- | --------------------- | -------------------------------------------------------------------------------- |
| Wikis                     | **Off**               | See the example below                                                            |
| Issues                    | On, anyone can create | Anyone can report a bug; only the owner acts on it                               |
| Sponsorships, Discussions | Off                   | Not needed                                                                       |
| Projects                  | On                    | Task board for both repos                                                        |
| Pull requests             | On, anyone can create | Anyone can **create** a PR; only the owner can **merge** (the ruleset does that) |

**Why the wiki is off: a real-life example.** A shop keeps one main register (the repo) and a separate diary in the corner (the wiki). The owner changes a price in the register and forgets the diary. A customer reads the diary and gets the wrong price. Two places with the same information always drift apart one day. Our docs (README, STACK, CHECKS, LEARN) live **inside** the repo: they change in the same PR as the code, they are reviewed, and they have history. A wiki is edited outside PRs, so the hooks and reviews never see it. Turning it off deletes nothing, and it can be turned on again later.

**Pull Requests**

| Setting                                       | Value                                            | Why                                                                                       |
| --------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Allow merge commits                           | On, message "Pull request title and description" | Used for release PRs `development` -> `main`                                              |
| Allow squash merging                          | On, message "Pull request title"                 | Used for feature PRs: one commit per task, named after the PR (`feat: add skills module`) |
| Allow rebase merging                          | Off                                              | Only two merge methods, so nobody has to choose                                           |
| Always suggest updating pull request branches | On                                               | Shows "Update branch" when `development` has moved ahead                                  |
| Allow auto-merge                              | Off                                              | Turn on after CI exists                                                                   |
| Automatically delete head branches            | On                                               | Feature branches disappear after merge                                                    |

**Why two merge methods:** squash for features keeps `development` clean (one commit per task). A **merge commit** for releases keeps `development` and `main` sharing the same history. If `development` were squashed into `main`, the histories would split, and every later release PR would show old changes again as conflicts.

**Other sections:** Commits, Archives, Pushes and Issues stay at their defaults. **Never touch the Danger Zone**; "Disable branch protection rules" there would switch off the ruleset.

### 10.5 The ruleset

Settings -> Rules -> Rulesets -> `protect-main-and-development`. It was created by **importing** `D:\skillstreakr\ruleset-protect-main-and-development.json` (kept outside both repos), so both repos have exactly the same rules.

| Field       | Value                                        | Why                                                                                                                                                        |
| ----------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enforcement | **Active**                                   | "Evaluate" would only report, not block                                                                                                                    |
| Bypass      | **Repository admin, for pull requests only** | GitHub doesn't let you approve your own PR, so the owner needs a bypass to merge. "For pull requests only" still forbids direct pushes, even for the owner |
| Targets     | `main`, `development`                        | The two long-lived branches                                                                                                                                |

| Rule                                   | On?           | What it does                                                                                                          |
| -------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------- |
| Restrict deletions                     | Yes           | Nobody can delete `main` or `development` (this also protects `development` when auto-delete runs after a release PR) |
| Require a pull request before merging  | Yes           | No direct pushes                                                                                                      |
| Required approvals                     | 1             | Someone must approve                                                                                                  |
| Dismiss stale approvals on new commits | Yes           | New code needs a new approval                                                                                         |
| Require review from Code Owners        | Yes           | That approval must come from the owner (CODEOWNERS)                                                                   |
| Require conversation resolution        | Yes           | All review comments resolved first                                                                                    |
| Allowed merge methods                  | Merge, Squash | Same as the repository settings                                                                                       |
| Block force pushes                     | Yes           | Nobody can rewrite history                                                                                            |
| Require linear history                 | **No**        | It would block the merge commit used for releases                                                                     |
| Require status checks to pass          | Not yet       | Turned on after the first CI run (section 11.4)                                                                       |

### 10.6 CODEOWNERS

File `.github/CODEOWNERS`:

```
# Every file needs a review from the repository owner before it can be merged.
* @Dpksolanki
```

`*` means every file. With "Require review from Code Owners", every PR needs **this person's** approval. The file was added through a PR (`chore/codeowners`) because direct pushes were already blocked; the owner merged it with **"Confirm bypass rules and merge"**.

### 10.7 Who can create and merge pull requests

| Person                         | Create a PR?                   | Merge?                                   | Why                                      |
| ------------------------------ | ------------------------------ | ---------------------------------------- | ---------------------------------------- |
| Owner                          | Yes                            | **Yes**                                  | Admin bypass for pull requests           |
| Any GitHub user (public repo)  | Yes, by forking                | **No**                                   | No write access                          |
| A collaborator (if ever added) | Yes, from a branch in the repo | **No, not without the owner's approval** | The ruleset requires a Code Owner review |

Personal repositories have no read-only collaborator role: anyone added can push branches. The ruleset is what keeps `main` and `development` safe.

### 10.8 Daily workflow

```bash
git checkout development
git pull                               # get the latest
git checkout -b feat/skills-module     # one branch per task
# ... write code ...
git status                             # .env must NOT be listed
git add .
git commit -m "feat: add skills module"     # hooks run
git push -u origin feat/skills-module       # tests run
```

On GitHub: PR `feat/skills-module` -> `development` -> **Confirm bypass rules and merge** with **Squash and merge**. Afterwards, locally: `git checkout development && git pull`.

### 10.9 Release workflow

1. New pull request: base **`main`**, compare **`development`**.
2. Title `release: v0.1.0`; the body lists what's included. (It's a PR title, not a commit message, so commitlint doesn't check it.)
3. Merge with **Create a merge commit**, not squash.
4. Optional: Releases -> Draft a new release -> tag `v0.1.0` on `main`.

### 10.10 How the protection was tested

**`git commit --allow-empty -m "test: direct push"`** makes a commit with no file changes. Normally Git refuses ("nothing to commit"); `--allow-empty` allows it. It's the safest dummy for testing a push, because no code changes.

Real-life example: to check that the guard at a gate really stops people without a pass, you walk up with an **empty box**. Nothing inside can get lost. If the guard stops you (push rejected), the rule works. Then you throw the box away.

The actual test used an even safer way, which never touches local branches:

```bash
SHA=$(git commit-tree "origin/development^{tree}" -p origin/development -m "test: direct push")
git push origin "$SHA:refs/heads/development"
```

`git commit-tree` builds the empty commit object without putting it on any branch, so no `git reset` is needed afterwards.

Result on 2026-11-22: all four branches rejected the push, and none changed on GitHub.

```
remote: error: GH013: Repository rule violations found for refs/heads/development.
remote: - Changes must be made through a pull request.
 ! [remote rejected] ... -> development (push declined due to repository rule violations)
```

**`git reset --hard origin/development`** makes the local branch exactly like GitHub's and **also deletes uncommitted changes**. Run `git status` first; use it only when the working tree is clean.

### 10.11 Git commands used so far

| Command                                    | What it does                                                          |
| ------------------------------------------ | --------------------------------------------------------------------- |
| `git status`                               | What changed, what's staged, which branch you're on                   |
| `git branch` / `git branch --show-current` | List local branches / show the current one                            |
| `git fetch origin`                         | Download what's new on GitHub without changing your files             |
| `git pull`                                 | Fetch + bring the current branch up to date                           |
| `git checkout <branch>`                    | Switch branch                                                         |
| `git checkout -b <branch>`                 | Create a branch from where you are and switch to it                   |
| `git add .`                                | Stage all changes for the next commit                                 |
| `git commit -m "type: text"`               | Save a commit (hooks run)                                             |
| `git push -u origin <branch>`              | Upload the branch and remember the link                               |
| `git log --oneline -5`                     | Last 5 commits, one line each                                         |
| `git ls-remote --heads origin`             | List the branches on GitHub                                           |
| `git reset --hard origin/<branch>`         | Make the local branch equal to GitHub's (deletes uncommitted changes) |
| `git push --no-verify`                     | Skip the hooks: emergency only                                        |

---

## 11. GitHub Actions: the basics

### 11.1 What CI is

**CI (Continuous Integration)** means: every time code is pushed or a pull request is opened, a machine automatically installs the project and runs the checks (lint, typecheck, tests, build). **GitHub Actions** is GitHub's built-in service that does this.

Real-life example: a teacher checks every answer sheet with the same answer key before the result is published. The hooks on your PC are like checking your own sheet: useful, but you can skip it (`--no-verify`). CI is the teacher: it checks every sheet the same way, on a clean machine, and you can't skip it. With "Require status checks to pass", a red result means the PR can't be merged.

### 11.2 The words

| Word                | Meaning                                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Workflow**        | A YAML file in `.github/workflows/` that describes an automation                                                             |
| **Event (trigger)** | What starts the workflow: `push`, `pull_request`, a schedule, a manual button                                                |
| **Job**             | A group of steps that runs on one machine; jobs can run in parallel                                                          |
| **Step**            | One command (`run:`) or one ready-made action (`uses:`)                                                                      |
| **Runner**          | The machine that runs a job; `ubuntu-latest` is a fresh Linux machine from GitHub, deleted after the job                     |
| **Action**          | A reusable step written by someone else, e.g. `actions/checkout` (download the code), `actions/setup-node` (install Node.js) |
| **Status check**    | The pass/fail result GitHub shows on a PR                                                                                    |
| **Cache**           | Saved files (e.g. the npm cache) reused by the next run, so installs are faster                                              |
| **Secret**          | A password or key stored in the repo settings, given to the workflow without appearing in logs                               |
| **Matrix**          | Running the same job with several settings, e.g. Node 22 and Node 24                                                         |

### 11.3 The planned workflow for the API, line by line

File: `.github/workflows/ci.yml`

```yaml
name: CI # name shown in the Actions tab

on: # the events that start it
  pull_request:
    branches: [development, main] # every PR into these branches
  push:
    branches: [development, main] # and every merge into them

permissions:
  contents: read # the job can only read the code (least privilege)

jobs:
  ci: # job id; this becomes the status check name
    runs-on: ubuntu-latest # fresh Linux machine
    steps:
      - uses: actions/checkout@v4 # download the repo
      - uses: actions/setup-node@v4 # install Node.js
        with:
          node-version: 24
          cache: npm # reuse the npm cache between runs
      - run: npm ci # exact install from package-lock.json
      - run: npm run lint # ESLint
      - run: npm run typecheck # tsc --noEmit
      - run: npm test # Vitest (uses .env.example, because CI has no .env)
      - run: npm run build # tsc -> dist/
```

If any step fails, the next steps don't run and the check turns red.

| Detail                      | Why                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| `npm ci`, not `npm install` | Installs exactly the lockfile versions and fails if `package.json` and the lockfile disagree |
| `.env.example` in tests     | CI has no `.env` (it is never committed); `vitest.config.ts` falls back to `.env.example`    |
| `@v4` after an action       | Pins the major version so a new release can't silently change the workflow                   |
| Indentation                 | YAML uses spaces, never tabs; wrong indentation is the most common error                     |

The web repo's workflow is the same idea with `npm ci -> npm run lint -> npm run build`.

### 11.4 How CI connects to the ruleset

After the first run, the check `ci` appears on PRs. Then: Ruleset -> tick **Require status checks to pass** -> add the check **`ci`**. From then on a PR with a red check can't be merged, not even by mistake.

### 11.5 Cost

| Repo                   | Linux minutes                                                             |
| ---------------------- | ------------------------------------------------------------------------- |
| Public (our two repos) | Free, no limit                                                            |
| Private (Free plan)    | 2,000 free minutes a month; Windows minutes count double, macOS ten times |

One run takes about 1–2 minutes. No credit card is needed: on the Free plan, a private repo that runs out of minutes simply stops running jobs until next month.

### 11.6 Where to see it

| Place                           | Shows                                                |
| ------------------------------- | ---------------------------------------------------- |
| PR page -> Checks               | Pass or fail for that PR                             |
| Actions tab                     | Every run, with full logs per step                   |
| A failed run -> **Re-run jobs** | Runs it again (useful for a temporary network error) |

### 11.7 Common mistakes

| Mistake                           | Result                               | Fix                                    |
| --------------------------------- | ------------------------------------ | -------------------------------------- |
| Tabs or wrong indentation in YAML | Workflow invalid                     | 2 spaces per level                     |
| File outside `.github/workflows/` | Never runs                           | Exact folder name                      |
| `npm install` in CI               | Different versions from your machine | `npm ci`                               |
| Secrets written in the YAML       | Leaked publicly                      | Repo Settings -> Secrets and variables |
| Node version different from local | "Works on my machine"                | Same major version (24)                |

---

# Part B: what to learn next

## 12. Rules while studying

1. **Read the docs, then type the code yourself.** No copy-paste.
2. **Every topic ends with something you built.** Reading alone is not learning.
3. **Write 5 lines in English after each topic**, in your own words.
4. **Learn the 20% you need now.** Redis, BullMQ, auth and AI each come when that feature starts.
5. **Stuck for more than 30 minutes?** Ask, but first say what you tried.

---

## 13. Week 0: understand the tools first

Before Week 1, learn the four tools everything so far is built on: **Git -> GitHub -> GitHub Actions -> Docker**. Same rules as always: read, then do it yourself, then explain it in 5 lines of English.

| Day     | Topic                        | Read / do                                                                                                                                   | Focus on                                                                        | Build / self-check                                                                                                      |
| ------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1       | **Git basics**               | learngitbranching.js.org (Main: levels 1–4; Remote: levels 1–3); git-scm.com/book chapters 2 and 3                                          | Commit, branch, checkout, merge, what `origin` is, fetch vs pull                | Make a practice folder, `git init`, 3 commits on 2 branches, merge them                                                 |
| 2       | **GitHub flow**              | docs.github.com: "About pull requests", "About merge methods on GitHub", "About protected branches" / "About rulesets", "About code owners" | PR lifecycle, squash vs merge commit vs rebase, why rules and code owners exist | Explain sections 10.4–10.7 of this file without looking                                                                 |
| 3       | **Your GitHub settings**     | Open both repos' Settings next to section 10                                                                                                | Find every setting; say why it has its value                                    | Open a small docs PR yourself and merge it with the bypass                                                              |
| 4       | **GitHub Actions**           | docs.github.com: "Understanding GitHub Actions", "Quickstart for GitHub Actions", "Workflow syntax" (on, jobs, steps, runs-on)              | Workflow, event, job, step, runner, action, status check                        | Explain every line of the workflow in section 11.3                                                                      |
| 5       | **GitHub Actions, hands-on** | A throwaway public practice repo                                                                                                            | Triggers, a failing step, logs, re-run                                          | Workflow that prints "hello" on push; then add a step that fails on purpose and read the log                            |
| 6 (Sat) | **Docker**                   | docs.docker.com "Get started" parts 1–3; "Docker Compose overview"                                                                          | Image, container, volume, port mapping, network, compose                        | Re-read section 2; stop and start the SkillStreakr containers; connect with `psql` and `redis-cli`                      |
| 7 (Sun) | **Docker, deeper + review**  | docs.docker.com: "Writing a Dockerfile", "Multi-stage builds"                                                                               | Layers, `FROM` / `COPY` / `RUN` / `CMD`, why multi-stage                        | Write a practice Dockerfile for a tiny Node "hello" server (not the API yet); answer all Week 0 questions in section 23 |

What you must be able to do at the end of Week 0:

- [ ] Create a branch, commit, push, open a PR and merge it, explaining each step
- [ ] Explain the difference between `fetch`, `pull` and `push`
- [ ] Explain squash vs merge commit, and why releases use a merge commit
- [ ] Explain what the ruleset blocks and why the owner needs a bypass
- [ ] Read a workflow YAML file and say what each line does
- [ ] Explain image vs container vs volume, and what `5433:5432` means
- [ ] Start, stop and inspect the SkillStreakr containers without notes

Resources: learngitbranching.js.org, git-scm.com/book (free), docs.github.com, docs.docker.com/get-started.

---

## 14. Week 1: backend fundamentals

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

## 15. Week 2: frontend fundamentals

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

## 16. Before the database step

| Topic             | Read                                                                        | Why                                                                                                                        |
| ----------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **SQL basics**    | sqlbolt.com, all lessons (about 3 hours)                                    | SELECT, WHERE, JOIN, GROUP BY, INSERT, UPDATE, DELETE                                                                      |
| **PostgreSQL**    | postgresqltutorial.com: data types, primary key, foreign key, unique, index | Our main database                                                                                                          |
| **Drizzle ORM**   | orm.drizzle.team: Get started with PostgreSQL, Schema, Migrations           | Tables defined in TypeScript                                                                                               |
| **Docker basics** | docs.docker.com Get started, parts 1–3                                      | What `docker compose up -d` actually does (and [section 2](#2-docker-postgres-and-redis-how-they-are-created-and-started)) |

Then write the **DB design note** by hand (`users`, `skills`, `daily_logs`, `log_entries`: columns, types, keys, unique rules, indexes) and get it reviewed before any code.

---

## 17. Learn when the feature starts

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

## 18. Months 1–4 topic plan

| Month | Weeks | Topics                                                                               |
| ----- | ----- | ------------------------------------------------------------------------------------ |
| 1     | 1–4   | JavaScript, Node.js internals, TypeScript, HTTP + cookies + CORS + caching           |
| 2     | 5–8   | Auth (JWT, OAuth, HMAC), SQL + Postgres, transactions + locks, idempotency + testing |
| 3     | 9–12  | AWS IAM + S3, Lambda + SQS + SES, Redis + BullMQ + webhooks, observability           |
| 4     | 13–16 | React deep, frontend data + routing, system design basics, project story             |

---

## 19. Node.js depth checklist

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

## 20. System design track (16 weeks)

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

## 21. English plan

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

## 22. Daily time split

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

## 23. Self-check questions

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

### Git and GitHub

24. What is the difference between `git fetch`, `git pull` and `git push`?
25. Why did `git push origin -u origin main` fail?
26. Why is `development` the default branch and not `main`?
27. Why do feature PRs use squash but release PRs use a merge commit?
28. Why is "Require linear history" off?
29. Why does the owner need a bypass, and what does "for pull requests only" stop?
30. What does `* @Dpksolanki` in CODEOWNERS do?
31. Who can create a PR on our repos, and who can merge it?
32. What does `git commit --allow-empty` do, and why was it used?
33. Why is the wiki turned off? Give the real-life example.

### GitHub Actions

34. What is CI, and why are git hooks alone not enough?
35. Explain workflow, event, job, step, runner and action.
36. Why `npm ci` in CI and not `npm install`?
37. How do tests get environment variables in CI when there is no `.env`?
38. What does "Require status checks to pass" change?
39. Is GitHub Actions free for us? What changes for a private repo?

### Docker (deeper)

40. What is a Dockerfile, and how is it different from `docker-compose.yml`?
41. What is a layer, and why does the order of `COPY` and `RUN` matter?
42. What is a multi-stage build, and why does it make images smaller?

---

## 24. Interview questions this setup prepares you for

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
13. How do you protect the main branch in a team?
14. What is CI, and what does your pipeline check?
15. What is the difference between a Docker image, a container and a volume?

---

## 25. Progress tracker

### Part A: understood

- [ ] Docker, Postgres and Redis started and checked (`PING` -> `PONG`, `\l` shows `skillstreakr`)
- [ ] API files read in flow order
- [ ] Request flow traced end to end
- [ ] Module template understood
- [ ] Commit types and hooks understood
- [ ] Frontend steps 1–5 understood
- [ ] Branch model, repository settings, ruleset and CODEOWNERS understood (section 10)
- [ ] GitHub Actions words and the planned workflow understood (section 11)

### Part B: learned

- [ ] Week 0: Git, GitHub flow, GitHub settings, GitHub Actions, Docker
- [ ] Week 1: Node.js, Express, own code, TypeScript, Zod, HTTP, testing
- [ ] Week 2: React, effects, Tailwind, shadcn, Router, Query, Git workflow
- [ ] SQL basics (sqlbolt)
- [ ] PostgreSQL basics
- [ ] Drizzle basics
- [ ] Docker basics
- [ ] DB design note written and reviewed

### Part C: answered

- [ ] Self-check questions 1–42
- [ ] Interview questions 1–15, said out loud and recorded once
