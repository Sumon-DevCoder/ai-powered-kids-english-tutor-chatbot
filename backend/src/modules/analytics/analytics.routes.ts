import { Router } from "express";
import AnalyticsController from "./analytics.controller";
import requireAuth from "../../core/middleware/auth.middleware";

const router = Router();

router.get("/metrics", requireAuth, AnalyticsController.getMetrics);

export default router;
