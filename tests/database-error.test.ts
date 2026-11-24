import { describe, expect, it } from "vitest";
import { mapDatabaseError } from "../helper/index.js";

// Shaped like Drizzle's DrizzleQueryError: the Postgres error sits in `cause`.
const drizzleError = (code: string) => Object.assign(new Error("Failed query"), { cause: { code } });

describe("mapDatabaseError", () => {
  it.each([
    ["23505", 409],
    ["23503", 409],
    ["23514", 400],
    ["23502", 400],
    ["22P02", 400],
  ])("maps Postgres code %s to HTTP %i", (code, statusCode) => {
    expect(mapDatabaseError(drizzleError(code))?.statusCode).toBe(statusCode);
  });

  it("also reads a code on the error itself", () => {
    expect(mapDatabaseError({ code: "23505" })?.statusCode).toBe(409);
  });

  it("returns null for errors that are not constraint errors", () => {
    expect(mapDatabaseError(drizzleError("ECONNREFUSED"))).toBeNull();
    expect(mapDatabaseError(new Error("boom"))).toBeNull();
    expect(mapDatabaseError("text")).toBeNull();
  });
});
