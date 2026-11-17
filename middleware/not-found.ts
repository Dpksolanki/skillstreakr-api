import type { NextFunction, Request, Response } from "express";
import { ErrorHandler, NOT_FOUND } from "../helper/index.js";

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(new ErrorHandler(NOT_FOUND, `Route ${req.method} ${req.originalUrl} not found`));
};
