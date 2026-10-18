import { Router } from "express";
import profileRoutes from "../modules/profile/profile.routes";
import tutorRoutes from "../modules/tutor/tutor.routes";
import analyticsRoutes from "../modules/analytics/analytics.routes";
import authRoutes from "../modules/auth/auth.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/tutor", tutorRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
