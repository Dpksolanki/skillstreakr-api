import { Router } from "express";
import { currentUser } from "../../middleware/index.js";
import health from "./health/index.js";
import users from "./users/index.js";

// Every v1 module is mounted here. New module = one import + one router.use line.
const v1 = Router();

// Public
v1.use("/health", health);

// Need a user: currentUser runs first and sets req.user
v1.use("/me", currentUser, users);

export default v1;
