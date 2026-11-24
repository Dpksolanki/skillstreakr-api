import type { NextFunction, Request, Response } from "express";
import { ErrorHandler, mapDatabaseError, SERVER_ERROR } from "../helper/index.js";
import { FAILURE } from "../utils/constant.js";
import { logger } from "../core/index.js";

const sendError = (res: Response, error: ErrorHandler): void => {
  res.status(error.statusCode).json({
    status: FAILURE,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.details !== undefined && { errors: error.details }),
  });
};

// Express treats a middleware with 4 arguments as the error handler.
export const handleError = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof ErrorHandler) {
    sendError(res, err);
    return;
  }

  const databaseError = mapDatabaseError(err);
  if (databaseError) {
    logger.warn({ err }, "Database constraint error");
    sendError(res, databaseError);
    return;
  }

  logger.error({ err }, "Unhandled error");
  res.status(SERVER_ERROR).json({ status: FAILURE, statusCode: SERVER_ERROR, message: "Something went wrong" });
};
