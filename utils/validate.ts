import { z } from "zod";
import { BAD_REQUEST, ErrorHandler } from "../helper/index.js";

/**
 * Checks request data with a Zod schema and returns it typed.
 * Bad data -> 400 with `errors: { formErrors, fieldErrors }`, e.g. { fieldErrors: { name: ["Too small..."] } }.
 */
export const parseInput = <T extends z.ZodType>(schema: T, input: unknown): z.output<T> => {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ErrorHandler(BAD_REQUEST, "Invalid request", z.flattenError(result.error));
  }
  return result.data;
};
