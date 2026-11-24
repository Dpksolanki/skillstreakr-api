import { ErrorHandler } from "./error-handler.js";
import { BAD_REQUEST, CONFLICT } from "./status-codes.js";

// Postgres error codes we expect from our own constraints, and what the client should see.
const POSTGRES_ERRORS: Record<string, { statusCode: number; message: string }> = {
  "23505": { statusCode: CONFLICT, message: "This already exists" },
  "23503": { statusCode: CONFLICT, message: "A related record is missing or still in use" },
  "23514": { statusCode: BAD_REQUEST, message: "A value is outside the allowed range" },
  "23502": { statusCode: BAD_REQUEST, message: "A required value is missing" },
  "22P02": { statusCode: BAD_REQUEST, message: "A value has the wrong format" },
};

// Drizzle wraps the driver error (DrizzleQueryError.cause), so look a few levels down for the code.
const findKnownError = (error: unknown): { statusCode: number; message: string } | undefined => {
  let current = error;
  for (let depth = 0; depth < 3; depth++) {
    if (typeof current !== "object" || current === null) return undefined;
    const { code, cause } = current as { code?: unknown; cause?: unknown };
    const known = typeof code === "string" ? POSTGRES_ERRORS[code] : undefined;
    if (known) return known;
    current = cause;
  }
  return undefined;
};

/** Turns a known Postgres constraint error into an ErrorHandler; returns null for anything else. */
export const mapDatabaseError = (error: unknown): ErrorHandler | null => {
  const known = findKnownError(error);
  return known ? new ErrorHandler(known.statusCode, known.message) : null;
};
