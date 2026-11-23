import { relations } from "drizzle-orm";
import { dailyLogs } from "./daily-logs.js";
import { logEntries } from "./log-entries.js";
import { skills } from "./skills.js";
import { users } from "./users.js";

// Only for Drizzle's query API (db.query.x.findMany({ with: ... })); the real
// foreign keys are the .references() calls in each table file.
export const usersRelations = relations(users, ({ many }) => ({
  skills: many(skills),
  dailyLogs: many(dailyLogs),
  logEntries: many(logEntries),
}));

export const skillsRelations = relations(skills, ({ one, many }) => ({
  user: one(users, { fields: [skills.userId], references: [users.id] }),
  logEntries: many(logEntries),
}));

export const dailyLogsRelations = relations(dailyLogs, ({ one, many }) => ({
  user: one(users, { fields: [dailyLogs.userId], references: [users.id] }),
  entries: many(logEntries),
}));

export const logEntriesRelations = relations(logEntries, ({ one }) => ({
  dailyLog: one(dailyLogs, { fields: [logEntries.dailyLogId], references: [dailyLogs.id] }),
  user: one(users, { fields: [logEntries.userId], references: [users.id] }),
  skill: one(skills, { fields: [logEntries.skillId], references: [skills.id] }),
}));
