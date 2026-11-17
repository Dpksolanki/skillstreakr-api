import type { NextFunction, Request, Response } from "express";
import { ErrorHandler, SERVER_ERROR } from "../helper/index.js";
import { FAILURE } from "../utils/constant.js";
import { logger } from "../core/index.js";

// Express treats a middleware with 4 arguments as the error handler.
export const handleError = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof ErrorHandler) {
    res.status(err.statusCode).json({ status: FAILURE, statusCode: err.statusCode, message: err.message });
    return;
  }

  logger.error({ err }, "Unhandled error");
  res.status(SERVER_ERROR).json({ status: FAILURE, statusCode: SERVER_ERROR, message: "Something went wrong" });
};
