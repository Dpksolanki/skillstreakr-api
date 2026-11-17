import http from "node:http";
import app from "../app.js";
import { env } from "../config/env.js";
import { logger } from "../core/index.js";

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

// Finish in-flight requests before exiting (deploys send SIGTERM).
const shutdown = (signal: string): void => {
  logger.info(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
