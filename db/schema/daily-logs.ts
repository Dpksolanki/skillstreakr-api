import { date, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "./columns.js";
import { users } from "./users.js";

// Design and reasons: docs/db-design.md section 5.
export const dailyLogs = pgTable(
  "daily_logs",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // The user's local calendar day, computed in the API from users.timezone.
    logDate: date("log_date", { mode: "string" }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    // One daily log per user per local date; also serves "today", date ranges and the streak.
    uniqueIndex("daily_logs_user_date_unique").on(t.userId, t.logDate),
  ],
);

export type DailyLog = typeof dailyLogs.$inferSelect;
export type NewDailyLog = typeof dailyLogs.$inferInsert;
