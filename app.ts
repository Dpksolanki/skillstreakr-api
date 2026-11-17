import express from "express";
import helmet from "helmet";
import cors from "cors";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { logger } from "./core/index.js";
import { handleError, notFound } from "./middleware/index.js";
import { v1 } from "./modules/index.js";

const app = express();

app.disable("x-powered-by");

app
  .use(helmet())
  .use(cors({ origin: env.WEB_ORIGIN, credentials: true }))
  .use(express.json({ limit: "100kb" }))
  .use(express.urlencoded({ extended: true, limit: "100kb" }))
  .use(pinoHttp({ logger }));

// All routes go through here: /v1/<module>/...
app.use("/v1", v1);

app.use(notFound);
app.use(handleError);

export default app;
