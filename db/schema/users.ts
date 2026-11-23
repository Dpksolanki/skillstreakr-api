import { sql } from "drizzle-orm";
import { check, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./columns.js";

export const USER_ROLES = ["user", "admin"] as const;
export const USER_PLANS = ["free", "pro"] as const;

// Design and reasons: docs/db-design.md section 3.
export const users = pgTable(
  "users",
  {
    id: id(),
    email: text("email").notNull(),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    passwordHash: text("password_hash"),
    name: text("name"),
    timezone: text("timezone").notNull().default("UTC"),
    dailyGoalMinutes: integer("daily_goal_minutes").notNull().default(60),
    role: text("role", { enum: USER_ROLES }).notNull().default("user"),
    plan: text("plan", { enum: USER_PLANS }).notNull().default("free"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    // Case-insensitive: Asha@Mail.com and asha@mail.com are one account.
    uniqueIndex("users_email_lower_unique").on(sql`lower(${t.email})`),
    check("users_email_length", sql`char_length(${t.email}) <= 254`),
    check("users_name_length", sql`char_length(${t.name}) BETWEEN 1 AND 100`),
    check("users_daily_goal_range", sql`${t.dailyGoalMinutes} BETWEEN 1 AND 1440`),
    check("users_role_valid", sql`${t.role} IN ('user', 'admin')`),
    check("users_plan_valid", sql`${t.plan} IN ('free', 'pro')`),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
