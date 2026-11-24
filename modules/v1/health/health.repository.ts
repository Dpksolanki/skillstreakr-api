import { sql } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { redis } from "../../../core/index.js";

export interface DependencyStatus {
  status: "up" | "down";
  latencyMs: number;
}

// Each check never throws: a failure is reported as "down" so the other check still runs.
class HealthRepository {
  async checkDatabase(): Promise<DependencyStatus> {
    return this.measure(async () => {
      await db.execute(sql`select 1`);
    });
  }

  async checkRedis(): Promise<DependencyStatus> {
    return this.measure(async () => {
      await redis.ping();
    });
  }

  private async measure(check: () => Promise<void>): Promise<DependencyStatus> {
    const start = performance.now();
    try {
      await check();
      return { status: "up", latencyMs: Math.round(performance.now() - start) };
    } catch {
      return { status: "down", latencyMs: Math.round(performance.now() - start) };
    }
  }
}

export default HealthRepository;
