import { sql } from "drizzle-orm";
import { check, index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./columns.js";
import { dailyLogs } from "./daily-logs.js";
import { skills } from "./skills.js";
import { users } from "./users.js";

export const LOG_ENTRY_KINDS = ["study", "practice", "revision", "writing", "speaking", "build"] as const;

// Design and reasons: docs/db-design.md section 6.
export const logEntries = pgTable(
  "log_entries",
  {
    id: id(),
    dailyLogId: uuid("daily_log_id")
      .notNull()
      .references(() => dailyLogs.id, { onDelete: "cascade" }),
    // Stored again (also reachable via daily_logs) so every query can filter by user directly.
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // "no action", not "restrict": checked at the end of the statement, so deleting a user
    // (which cascades to both skills and entries) works, but deleting a skill that has entries fails.
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "no action" }),
    minutes: integer("minutes").notNull(),
    kind: text("kind", { enum: LOG_ENTRY_KINDS }).notNull().default("study"),
    note: text("note"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    // Postgres doesn't index foreign keys by itself; joins and cascades need these.
    index("log_entries_daily_log_id_idx").on(t.dailyLogId),
    index("log_entries_user_id_idx").on(t.userId),
    index("log_entries_skill_id_idx").on(t.skillId),
    check("log_entries_minutes_range", sql`${t.minutes} BETWEEN 1 AND 1440`),
    check(
      "log_entries_kind_valid",
      sql`${t.kind} IN ('study', 'practice', 'revision', 'writing', 'speaking', 'build')`,
    ),
    check("log_entries_note_length", sql`char_length(${t.note}) <= 2000`),
  ],
);

export type LogEntry = typeof logEntries.$inferSelect;
export type NewLogEntry = typeof logEntries.$inferInsert;
