import express from "express";
import authUser from "../middleware/auth.js";
import { permit } from "../middleware/permissions.js";
import { getDashboardStats } from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/stats", authUser, permit("admin"), getDashboardStats);

export default dashboardRouter;