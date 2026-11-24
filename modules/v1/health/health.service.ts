import type { Logger } from "pino";
import HealthRepository, { type DependencyStatus } from "./health.repository.js";

export interface HealthStatus {
  status: "up" | "down";
  uptimeSeconds: number;
  timestamp: string;
  services: {
    database: DependencyStatus;
    redis: DependencyStatus;
  };
}

class HealthService {
  private readonly repository: HealthRepository;

  constructor(repository: HealthRepository = new HealthRepository()) {
    this.repository = repository;
  }

  async getStatus(log: Logger): Promise<HealthStatus> {
    const baseLog = { service: "health", module: "get_status" };

    // Both checks at the same time, so a slow one doesn't delay the other.
    const [database, redis] = await Promise.all([this.repository.checkDatabase(), this.repository.checkRedis()]);
    const status = database.status === "up" && redis.status === "up" ? "up" : "down";

    if (status === "down") {
      log.warn({ ...baseLog, step: "DEPENDENCY_DOWN", database, redis }, "Health check failed");
    }

    return {
      status,
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      services: { database, redis },
    };
  }
}

export default HealthService;
