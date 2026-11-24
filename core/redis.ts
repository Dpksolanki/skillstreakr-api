import { Redis } from "ioredis";
import { env } from "../config/env.js";
import { logger } from "./logger.js";

// lazyConnect: nothing connects at import time (tests, scripts); the first command opens the connection.
export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  connectTimeout: 2_000,
  maxRetriesPerRequest: 1,
  retryStrategy: (attempt) => Math.min(attempt * 500, 5_000),
});

// Without a listener, a lost connection would crash the process with an "unhandled error" event.
redis.on("error", (error) => logger.warn({ err: error }, "Redis connection error"));

export const closeRedis = async (): Promise<void> => {
  if (redis.status !== "end" && redis.status !== "wait") await redis.quit();
};
