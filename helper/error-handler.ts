// Throw this for expected errors (bad input, not found...). Anything else becomes a 500.
export class ErrorHandler extends Error {
  readonly statusCode: number;
  // Extra info for the client, e.g. which fields failed validation.
  readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = "ErrorHandler";
    this.statusCode = statusCode;
    this.details = details;
  }
}
