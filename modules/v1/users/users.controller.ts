import type { Request } from "express";
import { requireUser } from "../../../middleware/index.js";
import UsersService from "./users.service.js";

const usersService = new UsersService();

/** GET /v1/me — the current user's profile (never the password hash). */
const getMe = (req: Request) => usersService.getProfile(requireUser(req).id);

export { getMe };
