import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../app.js";
import HealthRepository from "../modules/v1/health/health.repository.js";

// The checks are replaced, so these tests need no running Postgres or Redis (CI has neither).
const mockChecks = (database: "up" | "down", redis: "up" | "down") => {
  vi.spyOn(HealthRepository.prototype, "checkDatabase").mockResolvedValue({ status: database, latencyMs: 1 });
  vi.spyOn(HealthRepository.prototype, "checkRedis").mockResolvedValue({ status: redis, latencyMs: 1 });
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /v1/health", () => {
  it("returns 200 when Postgres and Redis are up", async () => {
    mockChecks("up", "up");

    const res = await request(app).get("/v1/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.status).toBe("up");
    expect(res.body.data.services.database.status).toBe("up");
    expect(res.body.data.services.redis.status).toBe("up");
  });

  it("returns 503 when the database is down", async () => {
    mockChecks("down", "up");

    const res = await request(app).get("/v1/health");

    expect(res.status).toBe(503);
    expect(res.body.status).toBe("failure");
    expect(res.body.data.status).toBe("down");
    expect(res.body.data.services.database.status).toBe("down");
  });

  it("returns 503 when Redis is down", async () => {
    mockChecks("up", "down");

    const res = await request(app).get("/v1/health");

    expect(res.status).toBe(503);
    expect(res.body.data.services.redis.status).toBe("down");
  });
});

describe("unknown routes", () => {
  it("returns a 404 failure response", async () => {
    const res = await request(app).get("/v1/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body.status).toBe("failure");
    expect(res.body.statusCode).toBe(404);
  });
});
