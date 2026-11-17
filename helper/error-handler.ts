// Throw this for expected errors (bad input, not found...). Anything else becomes a 500.
export class ErrorHandler extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "ErrorHandler";
    this.statusCode = statusCode;
  }
}
