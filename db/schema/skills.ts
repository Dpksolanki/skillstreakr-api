import { sql } from "drizzle-orm";
import { check, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./columns.js";
import { users } from "./users.js";

export const SKILL_TEMPLATES = ["general", "practice", "language", "course", "project"] as const;

// Design and reasons: docs/db-design.md section 4.
export const skills = pgTable(
  "skills",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    template: text("template", { enum: SKILL_TEMPLATES }).notNull().default("general"),
    color: text("color"),
    dailyGoalMinutes: integer("daily_goal_minutes"),
    // Template-only fields (e.g. a course's chapter count); checked by a Zod schema per template.
    details: jsonb("details").$type<Record<string, unknown>>().notNull().default({}),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("skills_user_id_idx").on(t.userId),
    // One active skill per name per user; an archived "DSA" doesn't block a new "DSA".
    uniqueIndex("skills_user_name_active_unique")
      .on(t.userId, sql`lower(${t.name})`)
      .where(sql`${t.archivedAt} IS NULL`),
    check("skills_name_length", sql`char_length(${t.name}) BETWEEN 1 AND 60`),
    check("skills_template_valid", sql`${t.template} IN ('general', 'practice', 'language', 'course', 'project')`),
    check("skills_color_hex", sql`${t.color} ~ '^#[0-9a-fA-F]{6}$'`),
    check("skills_daily_goal_range", sql`${t.dailyGoalMinutes} BETWEEN 1 AND 1440`),
  ],
);

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
