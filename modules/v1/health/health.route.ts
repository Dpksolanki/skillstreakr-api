import express from "express";
import { dispatcher } from "../../../middleware/index.js";
import { healthCheck } from "./health.controller.js";

const router = express.Router();

router.get("/", (req, res, next) => dispatcher(req, res, next, healthCheck));

export default router;
