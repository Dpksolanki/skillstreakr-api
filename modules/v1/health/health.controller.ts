import type { Request, Response } from "express";
import { OK, SERVICE_UNAVAILABLE } from "../../../helper/index.js";
import { FAILURE, SUCCESS } from "../../../utils/constant.js";
import HealthService from "./health.service.js";

const healthService = new HealthService();

/**
 * GET /v1/health — 200 when Postgres and Redis both answer, 503 when either is down.
 * Sends its own response (not the dispatcher) because an unhealthy result is a 503 with data,
 * which load balancers and uptime monitors read.
 */
const healthCheck = (req: Request, res: Response): Promise<void> =>
  healthService.getStatus(req.log).then((data) => {
    const statusCode = data.status === "up" ? OK : SERVICE_UNAVAILABLE;

    res.status(statusCode).json({
      status: data.status === "up" ? SUCCESS : FAILURE,
      statusCode,
      message: data.status === "up" ? "Service is healthy" : "Service is unhealthy",
      data,
    });
  });

export { healthCheck };
