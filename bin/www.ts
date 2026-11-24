import http from "node:http";
import app from "../app.js";
import { env } from "../config/env.js";
import { closeRedis, logger } from "../core/index.js";
import { closeDb } from "../db/index.js";

const server = http.createServer(app);

server.listen(env.PORT);

server.on("listening", () => {
  logger.info(`Server ${process.pid} running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    logger.error(`Port ${env.PORT} is already in use`);
    process.exit(1);
  }
  throw error;
});

// Finish in-flight requests, then close Postgres and Redis, before exiting (deploys send SIGTERM).
const shutdown = (signal: string): void => {
  logger.info(`${signal} received, shutting down`);
  server.close(() => {
    void Promise.allSettled([closeDb(), closeRedis()])
      .then((results) => {
        for (const result of results) {
          if (result.status === "rejected") logger.error({ err: result.reason }, "Failed to close a connection");
        }
      })
      .finally(() => process.exit(0));
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
