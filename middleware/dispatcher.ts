import type { NextFunction, Request, Response } from "express";
import { OK } from "../helper/index.js";
import { SUCCESS } from "../utils/constant.js";

// `unknown` already covers Promises; the dispatcher awaits whatever comes back.
export type ControllerFn = (req: Request, res: Response, next: NextFunction) => unknown;

// Runs a controller, sends its return value as the standard success response, passes errors to handleError.
export const dispatcher = async (
  req: Request,
  res: Response,
  next: NextFunction,
  func: ControllerFn,
): Promise<void> => {
  try {
    const data = await func(req, res, next);

    if (data !== undefined) {
      res.status(OK).json({ status: SUCCESS, statusCode: OK, data });
    }
  } catch (error) {
    next(error);
  }
};
