import express from "express";
import { dispatcher } from "../../../middleware/index.js";
import { getMe } from "./users.controller.js";

const router = express.Router();

router.get("/", (req, res, next) => dispatcher(req, res, next, getMe));

export default router;
