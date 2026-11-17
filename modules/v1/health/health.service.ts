export interface HealthStatus {
  status: "up";
  uptimeSeconds: number;
  timestamp: string;
}

// Day 2: add a constructor with `this.repository = new HealthRepository()` for the DB + Redis checks.
class HealthService {
  getStatus(): HealthStatus {
    return {
      status: "up",
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}

export default HealthService;
