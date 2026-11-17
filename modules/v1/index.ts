import { Router } from "express";
import health from "./health/index.js";

// Every v1 module is mounted here. New module = one import + one router.use line.
const v1 = Router();

v1.use("/health", health);

export default v1;
