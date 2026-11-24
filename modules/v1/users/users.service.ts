import { ErrorHandler, NOT_FOUND } from "../../../helper/index.js";
import type { User } from "../../../db/schema/index.js";
import UsersRepository from "./users.repository.js";

// What the API may show about a user. Listed one by one, so a new secret column never leaks by accident.
export type PublicUser = Pick<
  User,
  "id" | "email" | "emailVerifiedAt" | "name" | "timezone" | "dailyGoalMinutes" | "role" | "plan" | "createdAt"
>;

export const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  email: user.email,
  emailVerifiedAt: user.emailVerifiedAt,
  name: user.name,
  timezone: user.timezone,
  dailyGoalMinutes: user.dailyGoalMinutes,
  role: user.role,
  plan: user.plan,
  createdAt: user.createdAt,
});

class UsersService {
  private readonly repository: UsersRepository;

  constructor(repository: UsersRepository = new UsersRepository()) {
    this.repository = repository;
  }

  async getProfile(userId: string): Promise<PublicUser> {
    const user = await this.repository.findById(userId);
    if (!user) throw new ErrorHandler(NOT_FOUND, "User not found");
    return toPublicUser(user);
  }
}

export default UsersService;
