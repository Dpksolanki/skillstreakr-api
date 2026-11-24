import type { AuthUser } from "../middleware/current-user.js";

// Adds `user` to Express's Request type; set by the currentUser middleware.
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
