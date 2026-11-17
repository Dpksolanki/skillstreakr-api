import type { Request } from "express";
import HealthService from "./health.service.js";

const healthService = new HealthService();

/** GET /v1/health — returns the server status. */
const healthCheck = (_req: Request) => {
  return healthService.getStatus();
};

export { healthCheck };
