import { Router } from "express";
import TutorController from "./tutor.controller";
import validateRequest from "../../core/middleware/validate.middleware";
import { interactSchema, sessionParamSchema } from "./tutor.validation";

const router = Router();

router.post("/interact", validateRequest(interactSchema), TutorController.interact);
router.get("/history/:childId", validateRequest(sessionParamSchema), TutorController.getHistory);
router.post("/reset/:childId", validateRequest(sessionParamSchema), TutorController.resetSession);

export default router;
