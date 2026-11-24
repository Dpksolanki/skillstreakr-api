import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { ErrorHandler, UNAUTHORIZED } from "../helper/index.js";
import type { User } from "../db/schema/index.js";
import UsersRepository from "../modules/v1/users/users.repository.js";

// The user a request acts as. user_id always comes from here, never from the request body.
export type AuthUser = Pick<User, "id" | "email" | "timezone" | "role" | "plan">;

const usersRepository = new UsersRepository();

/**
 * TEMPORARY until login exists (Week 4): every request acts as the seeded dev user (DEV_USER_EMAIL).
 * Refused in production, so this can never ship as "everyone is the same user".
 */
export const currentUser = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  if (env.NODE_ENV === "production") {
    next(new ErrorHandler(UNAUTHORIZED, "Not authenticated"));
    return;
  }

  const user = await usersRepository.findByEmail(env.DEV_USER_EMAIL);
  if (!user) {
    next(new ErrorHandler(UNAUTHORIZED, `Dev user ${env.DEV_USER_EMAIL} not found. Run "npm run db:seed".`));
    return;
  }

  req.user = { id: user.id, email: user.email, timezone: user.timezone, role: user.role, plan: user.plan };
  next();
};

/** The current user, or 401. Use in controllers of routes mounted behind currentUser. */
export const requireUser = (req: Request): AuthUser => {
  if (!req.user) throw new ErrorHandler(UNAUTHORIZED, "Not authenticated");
  return req.user;
};
