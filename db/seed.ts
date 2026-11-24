import { env } from "../config/env.js";
import { logger } from "../core/index.js";
import { closeDb, db } from "./index.js";
import { users } from "./schema/index.js";

// Local development data only. Safe to run many times: an existing dev user is left as it is.
if (env.NODE_ENV === "production") {
  logger.error("Refusing to seed a production database");
  process.exit(1);
}

const inserted = await db
  .insert(users)
  .values({
    email: env.DEV_USER_EMAIL,
    name: "Dev User",
    timezone: "Asia/Kolkata",
    dailyGoalMinutes: 120,
  })
  .onConflictDoNothing()
  .returning({ id: users.id });

logger.info(
  inserted.length > 0 ? `Dev user ${env.DEV_USER_EMAIL} created` : `Dev user ${env.DEV_USER_EMAIL} already exists`,
);

await closeDb();
