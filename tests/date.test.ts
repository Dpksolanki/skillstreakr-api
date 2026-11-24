import { describe, expect, it } from "vitest";
import { getLocalDate, isValidTimezone } from "../utils/date.js";

describe("getLocalDate", () => {
  // 19:00 UTC on 23 Nov = 00:30 on 24 Nov in India, 14:00 on 23 Nov in New York.
  const moment = new Date("2026-11-23T19:00:00Z");

  it("returns the next day in a timezone ahead of UTC", () => {
    expect(getLocalDate("Asia/Kolkata", moment)).toBe("2026-11-24");
  });

  it("returns the same day in a timezone behind UTC", () => {
    expect(getLocalDate("America/New_York", moment)).toBe("2026-11-23");
  });

  it("returns the UTC day for UTC", () => {
    expect(getLocalDate("UTC", moment)).toBe("2026-11-23");
  });

  it("follows daylight saving time (London is UTC+1 in summer)", () => {
    expect(getLocalDate("Europe/London", new Date("2026-07-10T23:30:00Z"))).toBe("2026-07-11");
    expect(getLocalDate("Europe/London", new Date("2026-01-10T23:30:00Z"))).toBe("2026-01-10");
  });
});

describe("isValidTimezone", () => {
  it("accepts IANA names", () => {
    expect(isValidTimezone("Asia/Kolkata")).toBe(true);
    expect(isValidTimezone("UTC")).toBe(true);
  });

  it("rejects made-up names and fixed offsets written as names", () => {
    expect(isValidTimezone("Mars/Base")).toBe(false);
    expect(isValidTimezone("")).toBe(false);
  });
});
