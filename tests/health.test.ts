import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("GET /v1/health", () => {
  it("returns the success response", async () => {
    const res = await request(app).get("/v1/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.status).toBe("up");
  });

  it("returns a 404 failure response for an unknown route", async () => {
    const res = await request(app).get("/v1/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body.status).toBe("failure");
    expect(res.body.statusCode).toBe(404);
  });
});
