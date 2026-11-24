import { describe, expect, it } from "vitest";
import { z } from "zod";
import { ErrorHandler } from "../helper/index.js";
import { parseInput } from "../utils/validate.js";

const schema = z.object({
  name: z.string().trim().min(1).max(60),
  minutes: z.coerce.number().int().min(1).max(1440),
});

describe("parseInput", () => {
  it("returns typed, cleaned data when valid", () => {
    expect(parseInput(schema, { name: "  DSA ", minutes: "30" })).toEqual({ name: "DSA", minutes: 30 });
  });

  it("throws a 400 ErrorHandler with the field errors when invalid", () => {
    let caught: unknown;
    try {
      parseInput(schema, { name: "", minutes: 0 });
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(ErrorHandler);
    const error = caught as ErrorHandler;
    expect(error.statusCode).toBe(400);
    expect(error.details).toMatchObject({
      fieldErrors: { name: expect.any(Array), minutes: expect.any(Array) },
    });
  });
});
