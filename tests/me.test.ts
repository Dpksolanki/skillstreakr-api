import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../app.js";
import type { User } from "../db/schema/index.js";
import UsersRepository from "../modules/v1/users/users.repository.js";

// The repository is replaced, so these tests need no database.
const devUser: User = {
  id: "0193a1c2-0000-7000-8000-000000000001",
  email: "dev@skillstreakr.local",
  emailVerifiedAt: null,
  passwordHash: "$argon2id$secret",
  name: "Dev User",
  timezone: "Asia/Kolkata",
  dailyGoalMinutes: 120,
  role: "user",
  plan: "free",
  createdAt: new Date("2026-11-24T00:00:00Z"),
  updatedAt: new Date("2026-11-24T00:00:00Z"),
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /v1/me", () => {
  it("returns the current user's profile without the password hash", async () => {
    vi.spyOn(UsersRepository.prototype, "findByEmail").mockResolvedValue(devUser);
    vi.spyOn(UsersRepository.prototype, "findById").mockResolvedValue(devUser);

    const res = await request(app).get("/v1/me");

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ id: devUser.id, email: devUser.email, timezone: "Asia/Kolkata" });
    expect(res.body.data).not.toHaveProperty("passwordHash");
    expect(res.body.data).not.toHaveProperty("password_hash");
  });

  it("returns 401 when the dev user has not been seeded", async () => {
    vi.spyOn(UsersRepository.prototype, "findByEmail").mockResolvedValue(undefined);

    const res = await request(app).get("/v1/me");

    expect(res.status).toBe(401);
    expect(res.body.message).toContain("npm run db:seed");
  });

  it("returns 409 when the database reports a duplicate", async () => {
    const duplicate = Object.assign(new Error("Failed query"), { cause: { code: "23505" } });
    vi.spyOn(UsersRepository.prototype, "findByEmail").mockRejectedValue(duplicate);

    const res = await request(app).get("/v1/me");

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("This already exists");
  });
});
