import express from "express";
import { healthCheck } from "./health.controller.js";

const router = express.Router();

// No dispatcher: the controller chooses 200 or 503 itself. Express 5 passes a thrown error to handleError.
router.get("/", healthCheck);

export default router;
