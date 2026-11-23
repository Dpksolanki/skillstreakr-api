# Drizzle in SkillStreakr

How the database layer works: what Drizzle is, how it connects, every file in `db/`, how the TypeScript becomes SQL, how to write queries, how migrations work, the best practices we follow, and a cheat sheet.

See [README.md](README.md) for the project, [docs/db-design.md](docs/db-design.md) for **why** each table and column exists, and [LEARN.md](LEARN.md) for the study plan.

---

## Table of contents

1. [What Drizzle is, and why we use it](#1-what-drizzle-is-and-why-we-use-it)
2. [The stack and versions](#2-the-stack-and-versions)
3. [The big picture: two halves](#3-the-big-picture-two-halves)
4. [Folder structure](#4-folder-structure)
5. [Every file explained](#5-every-file-explained)
6. [How the connection works](#6-how-the-connection-works)
7. [From TypeScript to SQL: what happens at compile time and at run time](#7-from-typescript-to-sql-what-happens-at-compile-time-and-at-run-time)
8. [Our data: the 4 tables](#8-our-data-the-4-tables)
9. [Column types: Drizzle, Postgres, TypeScript](#9-column-types-drizzle-postgres-typescript)
10. [Writing queries](#10-writing-queries)
11. [Transactions and upserts](#11-transactions-and-upserts)
12. [Migrations](#12-migrations)
13. [Best practices we follow](#13-best-practices-we-follow)
14. [Errors and how to fix them](#14-errors-and-how-to-fix-them)
15. [Debugging](#15-debugging)
16. [Cheat sheet](#16-cheat-sheet)
17. [Check yourself](#17-check-yourself)

---

## 1. What Drizzle is, and why we use it

**An ORM** (Object-Relational Mapper) lets you talk to a SQL database from your programming language instead of writing SQL strings by hand. **Drizzle** is a TypeScript ORM that stays very close to SQL: its code reads like the SQL it produces.

```ts
// Drizzle
await db.select().from(skills).where(eq(skills.userId, userId));
```

```sql
-- the SQL it sends
select "id", "user_id", "name", ... from "skills" where "skills"."user_id" = $1
```

| Why Drizzle for this project  |                                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Close to SQL                  | Streaks (window functions), stats (`GROUP BY`) and leaderboards are natural to write, and you learn real SQL       |
| Schema in TypeScript          | Tables are `.ts` files; no extra schema language                                                                   |
| Types without a generate step | Row types come straight from the table definitions                                                                 |
| Database rules in the schema  | CHECK constraints, partial unique indexes and expression indexes (`lower(email)`) are written in the schema itself |
| Light                         | No extra engine; it builds SQL and hands it to the `pg` driver                                                     |

Compared with the others:

|                                   | Drizzle             | Prisma                              | Sequelize        |
| --------------------------------- | ------------------- | ----------------------------------- | ---------------- |
| Style                             | SQL-like TypeScript | Own API (`prisma.user.findMany`)    | Old-style models |
| Schema                            | TypeScript          | `schema.prisma`                     | JS classes       |
| Complex SQL                       | Natural             | Often raw SQL                       | Awkward          |
| CHECK / partial indexes in schema | Yes                 | No (hand-edit migrations)           | Partly           |
| TypeScript types                  | Excellent           | Excellent (after `prisma generate`) | Weak             |

Prisma is great for simple CRUD and is already used at work (DriftCharge). Sequelize is for old projects only.

---

## 2. The stack and versions

| Package              | Version  | Kind    | Job                                                                 |
| -------------------- | -------- | ------- | ------------------------------------------------------------------- |
| `drizzle-orm`        | ^0.45.4  | runtime | Builds SQL from TypeScript, runs it, maps results                   |
| `pg` (node-postgres) | ^8.23.1  | runtime | The **driver**: opens network connections to Postgres and sends SQL |
| `uuid`               | ^14.0.3  | runtime | Makes UUID v7 ids in the app                                        |
| `drizzle-kit`        | ^0.31.11 | dev     | CLI: generates migrations, applies them, opens Drizzle Studio       |
| `@types/pg`          | ^8.23.1  | dev     | TypeScript types for `pg`                                           |
| PostgreSQL           | 17       | Docker  | The database (`docker-compose.yml`, port 5433)                      |

Scripts in `package.json`:

| Script                                 | Runs                   | Touches the database?           |
| -------------------------------------- | ---------------------- | ------------------------------- |
| `npm run db:generate -- --name <name>` | `drizzle-kit generate` | No: writes a SQL file           |
| `npm run db:migrate`                   | `drizzle-kit migrate`  | **Yes**: runs pending SQL files |
| `npm run db:studio`                    | `drizzle-kit studio`   | Reads (and edits if you click)  |

---

## 3. The big picture: two halves

Drizzle has **two separate parts**. Keep them apart in your head.

```
                     db/schema/*.ts  (tables written in TypeScript)
                       │                       │
         ┌─────────────┘                       └──────────────┐
         ▼                                                    ▼
  HALF 1: drizzle-kit (a CLI tool, dev only)          HALF 2: drizzle-orm (inside the app)
  "change the STRUCTURE"                              "read and write the DATA"
         │                                                    │
  db:generate -> db/migrations/0000_init.sql          db/index.ts: pg.Pool + drizzle(pool, { schema })
  db:migrate  -> runs the SQL on Postgres                     │
         │                                            modules/.../*.repository.ts use `db`
         ▼                                                    ▼
                         PostgreSQL (Docker, port 5433)
```

|                      | drizzle-kit                                   | drizzle-orm                    |
| -------------------- | --------------------------------------------- | ------------------------------ |
| What                 | Command-line tool                             | Library imported by the app    |
| When                 | When a table changes                          | On every API request           |
| Reads                | `drizzle.config.ts` + `db/schema/`            | `db/index.ts` (+ `db/schema/`) |
| Output               | SQL migration files, schema changes in the DB | Rows (data)                    |
| Ships to production? | No (dev dependency)                           | Yes                            |

---

## 4. Folder structure

```
db/
├── index.ts              connection pool + Drizzle instance (`db`) + closeDb()
├── schema/
│   ├── index.ts          re-exports every table and relation
│   ├── columns.ts        shared columns: id (uuid v7), created_at, updated_at
│   ├── users.ts          table users
│   ├── skills.ts         table skills
│   ├── daily-logs.ts     table daily_logs
│   ├── log-entries.ts    table log_entries
│   └── relations.ts      table-to-table links for the query API (`with`)
└── migrations/
    ├── 0000_init.sql     SQL that creates all 4 tables (generated)
    └── meta/
        ├── _journal.json         ordered list of migrations
        └── 0000_snapshot.json    the schema after migration 0000
drizzle.config.ts         settings for drizzle-kit
```

Why this structure:

| Choice                                                 | Reason                                                                                          |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| One file per table                                     | 30+ tables later; small files are easy to read and cause fewer merge conflicts                  |
| `columns.ts`                                           | `id`, `created_at`, `updated_at` are written once and look the same on every table              |
| `schema/index.ts`                                      | One import gives the app and drizzle-kit everything                                             |
| `relations.ts` separate                                | Relations import several tables; keeping them apart avoids circular imports between table files |
| Services and repositories stay in `modules/v1/<name>/` | Same as the verifier pattern; `db/` only knows about tables, never about business rules         |

---

## 5. Every file explained

### 5.1 `db/schema/columns.ts`: shared columns

```ts
export const id = () =>
  uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7());

export const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

export const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());
```

| Helper        | SQL                                  | Who fills the value                                                       |
| ------------- | ------------------------------------ | ------------------------------------------------------------------------- |
| `id()`        | `"id" uuid PRIMARY KEY NOT NULL`     | **The app**: on insert, Drizzle calls `uuidv7()` in Node and sends the id |
| `createdAt()` | `timestamptz DEFAULT now() NOT NULL` | **Postgres** (`now()`)                                                    |
| `updatedAt()` | `timestamptz DEFAULT now() NOT NULL` | Postgres on insert; **Drizzle** on every `db.update()` (`$onUpdate`)      |

They are **functions** (`id()`), not shared objects, so every table gets its own fresh column definition.

`$defaultFn` and `$onUpdate` run **in Node**, not in Postgres, so they don't appear in the SQL file. A row inserted by a manual SQL query must provide its own `id`.

### 5.2 A table file (`db/schema/skills.ts` as the example)

```ts
export const SKILL_TEMPLATES = ["general", "practice", "language", "course", "project"] as const;

export const skills = pgTable(
  "skills", // 1. table name in Postgres
  {
    // 2. columns
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    template: text("template", { enum: SKILL_TEMPLATES }).notNull().default("general"),
    color: text("color"),
    dailyGoalMinutes: integer("daily_goal_minutes"),
    details: jsonb("details").$type<Record<string, unknown>>().notNull().default({}),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    // 3. indexes and rules
    index("skills_user_id_idx").on(t.userId),
    uniqueIndex("skills_user_name_active_unique")
      .on(t.userId, sql`lower(${t.name})`)
      .where(sql`${t.archivedAt} IS NULL`),
    check("skills_name_length", sql`char_length(${t.name}) BETWEEN 1 AND 60`),
    // ...more checks
  ],
);

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
```

| Code                                                   | Meaning                                                                                                                                |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `pgTable("skills", ...)`                               | A Postgres table named `skills`                                                                                                        |
| `userId: uuid("user_id")`                              | TypeScript name `userId` (camelCase), database name `user_id` (snake_case). Drizzle translates both ways                               |
| `.notNull()`                                           | `NOT NULL`: value required                                                                                                             |
| `.default("general")`                                  | `DEFAULT 'general'`: used when no value is sent                                                                                        |
| `.references(() => users.id, { onDelete: "cascade" })` | A real **foreign key**. The arrow function `() =>` lets a table point to a table defined in another file without import-order problems |
| `text("template", { enum: SKILL_TEMPLATES })`          | TypeScript only allows those 5 strings. The database rule is the `check(...)` below it                                                 |
| `.$type<...>()`                                        | Sets the TypeScript type of a JSON column (no effect on SQL)                                                                           |
| `(t) => [ ... ]`                                       | `t` = this table's columns; the list = indexes and CHECK rules                                                                         |
| `sql\`...\``                                           | A small piece of raw SQL; `${t.name}` inserts a column reference safely                                                                |
| `$inferSelect` / `$inferInsert`                        | Free TypeScript types: a row you read / a row you insert (columns with defaults become optional)                                       |

What each table file adds (full reasons in `docs/db-design.md`):

| File             | Table         | Key rules                                                                                                                       |
| ---------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `users.ts`       | `users`       | Unique `lower(email)`; checks on email length, name length, goal 1–1440, role, plan                                             |
| `skills.ts`      | `skills`      | FK to users (cascade); partial unique `(user_id, lower(name))` for active skills; checks on name, template, hex colour, goal    |
| `daily-logs.ts`  | `daily_logs`  | FK to users (cascade); **unique `(user_id, log_date)`**; `log_date` is `date` in string mode                                    |
| `log-entries.ts` | `log_entries` | FKs to daily_logs (cascade), users (cascade), skills (**no action**); 3 FK indexes; checks on minutes 1–1440, kind, note length |

### 5.3 `db/schema/relations.ts`: links for the query API

```ts
export const dailyLogsRelations = relations(dailyLogs, ({ one, many }) => ({
  user: one(users, { fields: [dailyLogs.userId], references: [users.id] }),
  entries: many(logEntries),
}));
```

|              | `.references()` in a table file | `relations()` in this file                              |
| ------------ | ------------------------------- | ------------------------------------------------------- |
| Creates SQL? | **Yes**: a real foreign key     | **No**: nothing in the database                         |
| Job          | Stops bad data; cascade deletes | Lets you write `db.query.x.findMany({ with: { ... } })` |
| Used by      | Postgres, drizzle-kit           | Only Drizzle's query API                                |

`one(...)` needs `fields` + `references` (which column joins). `many(...)` finds the join from the other table's `one(...)`, so **define both sides** of every link.

How it reaches Drizzle:

```
relations.ts --export--> schema/index.ts --import * as schema--> db/index.ts: drizzle(pool, { schema })
                                                                  -> db.query.dailyLogs.findFirst({ with: { entries: ... } })
```

Remove it (or the `{ schema }` option) and `with` stops working; everything else (`db.select`, inserts, migrations) keeps working.

### 5.4 `db/schema/index.ts`: one door

```ts
export * from "./users.js";
export * from "./skills.js";
export * from "./daily-logs.js";
export * from "./log-entries.js";
export * from "./relations.js";
```

New table = new file + one line here. The `.js` endings are required by Node's ES modules (`nodenext`), even though the files are `.ts`.

### 5.5 `db/index.ts`: the connection

```ts
export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export const db = drizzle(pool, { schema });

export const closeDb = (): Promise<void> => pool.end();
```

Explained in [section 6](#6-how-the-connection-works). `closeDb()` is called by `bin/www.ts` on shutdown, after the HTTP server stops.

`import pg from "pg"` (then `pg.Pool`) is used because `pg` is a CommonJS package; the default import is the reliable way to use it from ES modules.

### 5.6 `drizzle.config.ts`: settings for drizzle-kit

```ts
if (existsSync(".env")) process.loadEnvFile(".env");

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  strict: true,
  verbose: true,
});
```

| Setting                       | Meaning                                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| `process.loadEnvFile(".env")` | drizzle-kit runs outside the app, so it reads `.env` itself (Node 24 built-in, no dotenv) |
| `dialect`                     | Write Postgres SQL                                                                        |
| `schema`                      | Where the tables are                                                                      |
| `out`                         | Where migration files go                                                                  |
| `dbCredentials.url`           | Which database `db:migrate` and `db:studio` use                                           |
| `strict`                      | Ask before risky changes (for example a rename that might be a drop)                      |
| `verbose`                     | Print the SQL it runs                                                                     |

### 5.7 `db/migrations/`: the SQL history

| File                      | What it is                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `0000_init.sql`           | Exact SQL for 4 tables, 5 foreign keys, 7 indexes, 13 CHECK rules                                                    |
| `meta/_journal.json`      | The ordered list of migrations (`0000_init`, later `0001_...`)                                                       |
| `meta/0000_snapshot.json` | The whole schema after this migration; the next `db:generate` compares against it and writes **only the difference** |

`--> statement-breakpoint` lines in the SQL mark where one statement ends; drizzle-kit runs them one by one.

---

## 6. How the connection works

```
.env DATABASE_URL=postgres://skill:skill@localhost:5433/skillstreakr
          │
config/env.ts      Zod checks it is a valid URL; the app stops at startup if not
          │
db/index.ts        new pg.Pool({ connectionString, max: 10, ... })
          │        drizzle(pool, { schema })  ->  `db`
          ▼
repository code:   await db.select().from(skills).where(...)
          │
Drizzle            builds SQL text + a list of parameters
          │
pg.Pool            borrows a free connection (opens one if needed, up to 10)
          │
Postgres           runs the SQL, returns rows
          │
pg.Pool            gets the connection back for the next query
          │
Drizzle            maps rows: snake_case -> camelCase, timestamptz -> Date, ...
```

**The URL, piece by piece:** `postgres://skill:skill@localhost:5433/skillstreakr` = protocol `postgres`, user `skill`, password `skill`, host `localhost`, port `5433`, database `skillstreakr`.

**Why a pool:** opening a connection is slow (network handshake + login). A pool keeps a few connections open and lends them out:

```
request 1  -> borrow conn 1 -> query -> return conn 1
request 2  -> borrow conn 2 -> query -> return conn 2
request 11 -> all 10 busy -> waits (up to 5 s, then error)
```

| Pool option               | Value | Why                                                                                                                  |
| ------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------- |
| `max`                     | 10    | Postgres has a total connection limit (Neon's free plan is lower). Every API copy has its own pool, so keep it small |
| `idleTimeoutMillis`       | 30 s  | Close connections nobody is using                                                                                    |
| `connectionTimeoutMillis` | 5 s   | Fail fast if Postgres is down, instead of hanging                                                                    |

**The pool is lazy:** nothing connects when the app starts. The first query opens the first connection. That's why the app starts even when Docker is off, and the first query then fails with `ECONNREFUSED`.

**Parameters, not string gluing:** values go separately from the SQL text (`$1`, `$2`). Postgres never treats them as SQL, which prevents **SQL injection**:

```ts
db.select().from(users).where(eq(users.email, "a'; DROP TABLE users; --"));
// SQL:    select ... from "users" where "users"."email" = $1
// params: ["a'; DROP TABLE users; --"]   <- just a text value, harmless
```

---

## 7. From TypeScript to SQL: what happens at compile time and at run time

| Stage               | Tool                                           | What happens to the Drizzle code                                                                                                                                                   |
| ------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Writing code**    | VS Code + TypeScript                           | Types from `$inferSelect` / `$inferInsert`: autocomplete for columns, errors for wrong names or values (`template: "music"` is an error)                                           |
| **Type check**      | `npm run typecheck` (`tsc --noEmit`)           | Checks every query; nothing is created                                                                                                                                             |
| **Development run** | `npm run dev` (`tsx`)                          | `tsx` turns `.ts` into JavaScript in memory and runs it                                                                                                                            |
| **Build**           | `npm run build` (`tsc -p tsconfig.build.json`) | `db/index.ts` and `db/schema/*.ts` compile to `dist/db/...js`. **Types disappear**; the table objects stay as plain JavaScript objects. `db/migrations` is excluded from the build |
| **Run time**        | `node dist/bin/www.js`                         | Each query call builds a **SQL string + parameters** in memory, sends it through `pg`, and maps the rows back                                                                      |
| **Migrations**      | `drizzle-kit`                                  | Reads the `.ts` schema with its own loader (no build needed), compares it with the last snapshot, writes SQL                                                                       |

Two important facts:

1. **Types are compile time only.** TypeScript can't stop bad data coming from a request at run time. That's why requests are checked with **Zod** in the API, and the database has **CHECK rules** as the last guard.
2. **Drizzle doesn't run SQL at import time.** Importing `db` does nothing until a query is called and awaited.

How one query becomes SQL:

```ts
db.select({ name: skills.name })
  .from(skills)
  .where(and(eq(skills.userId, id), isNull(skills.archivedAt)))
  .orderBy(skills.name);
```

```sql
select "name" from "skills"
where ("skills"."user_id" = $1 and "skills"."archived_at" is null)
order by "skills"."name"
-- params: [id]
```

The query is a **builder**: each `.from()`, `.where()` adds a piece; the SQL is sent only when you `await` it.

---

## 8. Our data: the 4 tables

```
users 1 ──── * skills           skills.user_id        on delete cascade
users 1 ──── * daily_logs       daily_logs.user_id    on delete cascade
users 1 ──── * log_entries      log_entries.user_id   on delete cascade
daily_logs 1 ──── * log_entries log_entries.daily_log_id  on delete cascade
skills 1 ──── * log_entries     log_entries.skill_id  on delete no action
```

| Table         | Holds                          | Example                                               |
| ------------- | ------------------------------ | ----------------------------------------------------- |
| `users`       | Accounts and settings          | Asha, `Asia/Kolkata`, goal 120 min, free              |
| `skills`      | What a user learns             | DSA (practice), English (language), Guitar (archived) |
| `daily_logs`  | One row per user per local day | Asha, 2026-11-23                                      |
| `log_entries` | One practice session           | 60 min DSA, practice, "sliding window"                |

Example data for Asha (`Asia/Kolkata`): DSA 45 min yesterday; DSA 60 min and English 20 min today.

```
daily_logs:   d-22 (2026-11-22)         d-23 (2026-11-23)
log_entries:  e-1 d-22 DSA 45           e-2 d-23 DSA 60      e-3 d-23 English 20
```

---

## 9. Column types: Drizzle, Postgres, TypeScript

| Drizzle                                  | Postgres             | TypeScript value             | Used for                          |
| ---------------------------------------- | -------------------- | ---------------------------- | --------------------------------- |
| `uuid("id")`                             | `uuid`               | `string`                     | Ids, foreign keys                 |
| `text("name")`                           | `text`               | `string`                     | Names, notes, emails, fixed lists |
| `text("role", { enum: [...] })`          | `text` (+ our CHECK) | `"user" \| "admin"`          | Fixed lists                       |
| `integer("minutes")`                     | `integer`            | `number`                     | Minutes, goals                    |
| `jsonb("details").$type<T>()`            | `jsonb`              | `T`                          | Template-only fields              |
| `timestamp("x", { withTimezone: true })` | `timestamptz`        | `Date`                       | Moments (created, archived)       |
| `date("log_date", { mode: "string" })`   | `date`               | `string` like `"2026-11-23"` | Calendar days                     |
| `.notNull()` missing                     | nullable             | `T \| null`                  | Optional columns                  |

Why `date` in **string** mode: a JavaScript `Date` is a moment, and converting it between timezones can move it to the previous or next day. A plain string `"2026-11-23"` can never shift.

Aggregates and their types:

| Helper / SQL                    | Comes back as                                  | Fix                                                  |
| ------------------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| `count()` (from `drizzle-orm`)  | `number`                                       | none needed                                          |
| `sum(col)` (from `drizzle-orm`) | `string \| null` (Postgres `bigint`/`numeric`) | `.mapWith(Number)` or `sql<number>\`sum(...)::int\`` |
| `sql\`count(*)\`` (raw)         | `string`                                       | `::int` in the SQL                                   |

---

## 10. Writing queries

There are **two ways** to read data. Pick by what you need.

|                      | Relational query: `db.query.x.findMany({ with })` | SQL-like: `db.select().from()`                    |
| -------------------- | ------------------------------------------------- | ------------------------------------------------- |
| Use for              | Nested data (day -> entries -> skill)             | Totals, counts, groups, rankings, complex filters |
| Result               | Nested objects                                    | Flat rows                                         |
| Needs `relations.ts` | Yes                                               | No                                                |

### 10.1 Select

```ts
import { and, asc, eq, isNull } from "drizzle-orm";

// my active skills, A to Z
const mySkills = await db
  .select()
  .from(skills)
  .where(and(eq(skills.userId, userId), isNull(skills.archivedAt)))
  .orderBy(asc(skills.name));

// only some columns
const names = await db.select({ id: skills.id, name: skills.name }).from(skills).where(eq(skills.userId, userId));
```

### 10.2 Relational query with `with`

```ts
const today = await db.query.dailyLogs.findFirst({
  where: (d, { and, eq }) => and(eq(d.userId, userId), eq(d.logDate, "2026-11-23")),
  with: {
    entries: {
      columns: { id: true, minutes: true, kind: true, note: true },
      with: { skill: { columns: { id: true, name: true } } },
    },
  },
});
// { id, userId, logDate, createdAt, entries: [{ id, minutes, kind, note, skill: { id, name } }] }
```

`d` = the `daily_logs` columns (any name works); `and`, `eq` = helpers Drizzle passes in.

### 10.3 Join + group (minutes per skill this week)

```ts
import { and, between, desc, eq, sql } from "drizzle-orm";

const weekly = await db
  .select({
    skillId: skills.id,
    skillName: skills.name,
    totalMinutes: sql<number>`sum(${logEntries.minutes})::int`,
    sessions: sql<number>`count(*)::int`,
  })
  .from(logEntries)
  .innerJoin(dailyLogs, eq(dailyLogs.id, logEntries.dailyLogId))
  .innerJoin(skills, eq(skills.id, logEntries.skillId))
  .where(and(eq(logEntries.userId, userId), between(dailyLogs.logDate, "2026-11-17", "2026-11-23")))
  .groupBy(skills.id, skills.name)
  .orderBy(desc(sql`sum(${logEntries.minutes})`));
```

```sql
SELECT s.id, s.name, SUM(e.minutes)::int AS total_minutes, COUNT(*)::int AS sessions
FROM log_entries e
JOIN daily_logs d ON d.id = e.daily_log_id
JOIN skills s ON s.id = e.skill_id
WHERE e.user_id = $1 AND d.log_date BETWEEN $2 AND $3
GROUP BY s.id, s.name
ORDER BY SUM(e.minutes) DESC;
```

`innerJoin` drops rows with no match; `leftJoin` keeps the left row and fills the right side with `null`.

### 10.4 Insert

```ts
const [skill] = await db
  .insert(skills)
  .values({ userId, name: "DSA", template: "practice" }) // id, createdAt, updatedAt filled automatically
  .returning(); // get the saved row back
```

### 10.5 Update

```ts
const [archived] = await db
  .update(skills)
  .set({ archivedAt: new Date() }) // updatedAt is set by $onUpdate
  .where(and(eq(skills.id, skillId), eq(skills.userId, userId)))
  .returning();

if (!archived) throw new ErrorHandler(NOT_FOUND, "Skill not found"); // other user's skill, or no such id
```

### 10.6 Delete

```ts
await db.delete(logEntries).where(and(eq(logEntries.id, entryId), eq(logEntries.userId, userId)));
```

**Always** include `userId` in the `where` of updates and deletes, so a user can only change their own rows.

### 10.7 Raw SQL when needed

```ts
const result = await db.execute(sql`select count(*)::int as total from ${skills} where ${skills.userId} = ${userId}`);
```

`${userId}` becomes a parameter, not glued text, so it's still safe. Use raw SQL only when the builder can't express the query.

---

## 11. Transactions and upserts

### 11.1 Transaction

A **transaction** runs several statements as one unit: either **all** succeed or **none** do.

```ts
await db.transaction(async (tx) => {
  // use `tx`, not `db`, inside the transaction
  await tx.insert(...);
  await tx.update(...);
  // if anything throws here, everything above is undone (rollback)
});
```

### 11.2 Upsert: "create today's daily log if it doesn't exist"

The rule "one daily log per user per day" is the unique index `(user_id, log_date)`. Two requests at the same moment must not create two rows:

```ts
const logDate = getLocalDate(user.timezone); // "2026-11-23" in the user's timezone

const entry = await db.transaction(async (tx) => {
  await tx
    .insert(dailyLogs)
    .values({ userId: user.id, logDate })
    .onConflictDoNothing({ target: [dailyLogs.userId, dailyLogs.logDate] }); // already exists? do nothing

  const [day] = await tx
    .select({ id: dailyLogs.id })
    .from(dailyLogs)
    .where(and(eq(dailyLogs.userId, user.id), eq(dailyLogs.logDate, logDate)));

  const [created] = await tx
    .insert(logEntries)
    .values({ dailyLogId: day!.id, userId: user.id, skillId, minutes: 30, kind: "practice" })
    .returning();

  return created;
});
```

| Step                              | Why                                                                                           |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| `onConflictDoNothing({ target })` | If the row exists (or another request just made it), the insert is skipped instead of failing |
| Select it again                   | `returning()` gives nothing when the insert was skipped, so read the row                      |
| Same transaction for the entry    | The day and the entry are saved together or not at all                                        |
| `skillId` belongs to the user     | Checked in the service **before** this, with `where id = skillId and user_id = user.id`       |

`onConflictDoUpdate({ target, set: { ... } })` is the other form: update the existing row instead of skipping.

---

## 12. Migrations

### 12.1 The workflow

```
1. Change a table file in db/schema/      (add a column, an index, a table)
2. npm run db:generate -- --name add_skill_icon
      -> db/migrations/0001_add_skill_icon.sql  (only the difference)
      -> meta/0001_snapshot.json, _journal.json updated
3. Read the SQL file. Is it what you meant?
4. npm run db:migrate                      (applies pending files to the database)
5. Commit the schema change + the migration files together
```

### 12.2 How drizzle-kit knows what already ran

`db:migrate` keeps a table **`drizzle.__drizzle_migrations`** (table `__drizzle_migrations` in schema `drizzle`) inside the database, with one row per applied migration. It runs only the files that aren't recorded there, in the order of `_journal.json`.

### 12.3 Rules

| Rule                                                          | Why                                                                                             |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Never edit a migration that already ran anywhere              | Other databases already applied the old version; they would go out of sync                      |
| Never delete migration files                                  | The history must stay complete for new environments                                             |
| Commit migrations with the schema change                      | Code and database structure stay matched                                                        |
| Read the generated SQL before migrating                       | Catch drops and renames you didn't mean                                                         |
| A rename asks a question (`strict`)                           | drizzle-kit can't tell "rename" from "drop + add"; choose rename, or you lose the column's data |
| Production migrations run from a pipeline step, never by hand | Same steps every time, logged                                                                   |
| Local migrations only on the SkillStreakr DB (port 5433)      | Never point `DATABASE_URL` at another project's database                                        |

`0000_init.sql` exists but has **not been applied** yet. Apply it with `npm run db:migrate` once Docker is running.

### 12.4 Drizzle Studio

`npm run db:studio` opens a web page (`https://local.drizzle.studio`) to browse tables and rows. Clicking can also edit data, so be careful.

---

## 13. Best practices we follow

| #   | Practice                                                                                                          | Where                                              |
| --- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 1   | One file per table; shared columns in `columns.ts`                                                                | `db/schema/`                                       |
| 2   | `snake_case` in the database, `camelCase` in TypeScript                                                           | Every column `text("user_id")` -> `userId`         |
| 3   | UUID v7 ids made by the app                                                                                       | `columns.ts`                                       |
| 4   | `timestamptz` for moments, `date` (string mode) for calendar days                                                 | `columns.ts`, `daily-logs.ts`                      |
| 5   | Fixed lists as `text` + `CHECK`, values in lowercase; the same list exported as a constant for TypeScript and Zod | `USER_ROLES`, `SKILL_TEMPLATES`, `LOG_ENTRY_KINDS` |
| 6   | Database rules (NOT NULL, UNIQUE, CHECK, FK) as the last guard, Zod in the API for good error messages            | Table files                                        |
| 7   | Index every foreign key, and only add indexes a real query needs                                                  | `skills_user_id_idx`, `log_entries_*_idx`          |
| 8   | Every query on user data filters by the user id from the token                                                    | Repositories                                       |
| 9   | `returning()` instead of a second select after insert / update                                                    | Repositories                                       |
| 10  | Transactions for multi-step writes                                                                                | Logging a session                                  |
| 11  | Upserts with `onConflictDoNothing` backed by a unique index                                                       | `daily_logs`                                       |
| 12  | Archive instead of delete for data with history                                                                   | `skills.archived_at`                               |
| 13  | Only the `db` from `db/index.ts`; never create a second pool                                                      | Whole app                                          |
| 14  | Close the pool on shutdown                                                                                        | `bin/www.ts`                                       |
| 15  | Repositories are the only place that imports `db`; services and controllers never write SQL                       | `modules/v1/<name>/<name>.repository.ts`           |
| 16  | Migrations are generated, reviewed, committed, never edited after they run                                        | `db/migrations/`                                   |

---

## 14. Errors and how to fix them

Drizzle wraps database errors in `DrizzleQueryError`; the original Postgres error is in `error.cause`, with a `code`.

| Error                                                   | Postgres code | Cause                                                                                             | Fix                                                         |
| ------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `ECONNREFUSED ...:5433`                                 |               | Postgres isn't running                                                                            | Start Docker Desktop, `docker compose up -d`                |
| `password authentication failed`                        | 28P01         | Wrong user/password in `DATABASE_URL`                                                             | Match `docker-compose.yml`                                  |
| `relation "skills" does not exist`                      | 42P01         | Migrations not applied                                                                            | `npm run db:migrate`                                        |
| `duplicate key value violates unique constraint`        | **23505**     | Same email / same active skill name / same day                                                    | Return 409 Conflict with a clear message                    |
| `insert or update ... violates foreign key constraint`  | **23503**     | The parent row doesn't exist (wrong `user_id` / `skill_id`), or deleting a skill that has entries | Check ownership first; archive skills instead of deleting   |
| `new row ... violates check constraint`                 | **23514**     | Value breaks a CHECK (minutes 0, bad colour)                                                      | The Zod schema should have caught it: fix the Zod rule      |
| `null value in column ... violates not-null constraint` | **23502**     | A required value is missing                                                                       | Send the value or give the column a default                 |
| `column ... must appear in the GROUP BY clause`         | 42803         | A selected column isn't grouped                                                                   | Add it to `.groupBy(...)`                                   |
| A total comes back as `"105"` (text)                    |               | `sum` / `count(*)` return big numbers as text                                                     | `::int` in SQL, `.mapWith(Number)`, or the `count()` helper |
| `with: { entries }` is a TypeScript error               |               | Relation missing, or `drizzle(pool)` without `{ schema }`                                         | Check `relations.ts` and `db/index.ts`                      |

---

## 15. Debugging

| Want to                                     | Do                                                                                            |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| See the SQL of every query                  | Temporarily `drizzle(pool, { schema, logger: true })` in `db/index.ts`                        |
| See the SQL of one query without running it | `const { sql, params } = db.select().from(skills).toSQL();`                                   |
| Look at the data                            | `npm run db:studio`, or `docker exec -it skillstreakr-postgres psql -U skill -d skillstreakr` |
| See a table's columns and indexes           | In `psql`: `\d skills`                                                                        |
| List tables                                 | In `psql`: `\dt`                                                                              |
| See applied migrations                      | In `psql`: `select * from drizzle.__drizzle_migrations;`                                      |
| Check a query uses an index                 | In `psql`: `EXPLAIN ANALYZE <the SQL>;`                                                       |

---

## 16. Cheat sheet

### Commands

```bash
docker compose up -d                          # start Postgres + Redis
npm run db:generate -- --name <what_changed>  # schema change -> new SQL file
npm run db:migrate                            # apply pending SQL files
npm run db:studio                             # browse data in the browser
```

### Imports

```ts
import { db } from "../../../db/index.js";
import { users, skills, dailyLogs, logEntries } from "../../../db/schema/index.js";
import type { Skill, NewSkill } from "../../../db/schema/index.js";
import {
  and,
  or,
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  between,
  inArray,
  isNull,
  isNotNull,
  like,
  ilike,
  asc,
  desc,
  sql,
  count,
  sum,
} from "drizzle-orm";
```

### Operators

| Drizzle                              | SQL                               |
| ------------------------------------ | --------------------------------- |
| `eq(a, b)` / `ne(a, b)`              | `a = b` / `a <> b`                |
| `gt`, `gte`, `lt`, `lte`             | `>`, `>=`, `<`, `<=`              |
| `between(a, x, y)`                   | `a BETWEEN x AND y`               |
| `inArray(a, [..])`                   | `a IN (...)`                      |
| `isNull(a)` / `isNotNull(a)`         | `a IS NULL` / `a IS NOT NULL`     |
| `like(a, "%x%")` / `ilike(a, "%x%")` | `LIKE` / case-insensitive `ILIKE` |
| `and(...)` / `or(...)`               | `AND` / `OR`                      |
| `asc(a)` / `desc(a)`                 | `ORDER BY a ASC / DESC`           |

### Snippets

```ts
// read
await db.select().from(skills).where(eq(skills.userId, userId));
await db.query.skills.findMany({ where: (s, { eq }) => eq(s.userId, userId), with: { logEntries: true } });

// write
const [row] = await db.insert(skills).values({ ... }).returning();
await db.update(skills).set({ ... }).where(and(eq(skills.id, id), eq(skills.userId, userId)));
await db.delete(logEntries).where(and(eq(logEntries.id, id), eq(logEntries.userId, userId)));

// upsert
await db.insert(dailyLogs).values({ ... }).onConflictDoNothing({ target: [dailyLogs.userId, dailyLogs.logDate] });

// transaction
await db.transaction(async (tx) => { /* tx.insert / tx.update */ });

// counts
await db.select({ total: count() }).from(skills).where(eq(skills.userId, userId));

// pagination (cursor, uuid v7 is time-ordered)
await db.select().from(skills).where(and(eq(skills.userId, userId), gt(skills.id, afterId))).orderBy(asc(skills.id)).limit(20);
```

### Adding a new table (steps)

1. `db/schema/<table>.ts` with `id()`, `createdAt()`, `updatedAt()`, foreign keys, indexes, CHECKs, `$inferSelect` / `$inferInsert` types.
2. One line in `db/schema/index.ts`.
3. Links in `relations.ts` (both sides).
4. Write the reasons in `docs/db-design.md`.
5. `npm run db:generate -- --name create_<table>`, read the SQL.
6. `npm run db:migrate`.
7. Commit schema + migration together.

---

## 17. Check yourself

1. What are the two halves of Drizzle, and which one ships to production?
2. Why does the app start even when Postgres is down? When does it fail?
3. What does `pg.Pool` do, and why `max: 10`?
4. How does a value like an email reach Postgres safely (no SQL injection)?
5. Which values are filled by the app and which by Postgres: `id`, `created_at`, `updated_at`?
6. What is the difference between `.references()` and `relations()`?
7. Why is `log_date` a string and not a `Date`?
8. Why does `sum()` come back as text, and how do you fix it?
9. When do you use `db.query...with` and when `db.select().innerJoin()`?
10. Why does the daily log use `onConflictDoNothing`, and why inside a transaction?
11. How does drizzle-kit know which migrations already ran?
12. Why must you never edit a migration that already ran?
13. Which error code means "duplicate", and what should the API return?
