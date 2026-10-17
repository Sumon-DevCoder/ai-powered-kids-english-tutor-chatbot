import { Router } from "express";
import AnalyticsController from "./analytics.controller";

const router = Router();

router.get("/metrics", AnalyticsController.getMetrics);

export default router;
