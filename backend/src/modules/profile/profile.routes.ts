import { Router } from "express";
import ProfileController from "./profile.controller";
import validateRequest from "../../core/middleware/validate.middleware";
import { createProfileSchema } from "./profile.validation";

const router = Router();

router.get("/", ProfileController.getAllProfiles);
router.get("/:id", ProfileController.getProfileById);
router.post("/", validateRequest(createProfileSchema), ProfileController.createProfile);

export default router;
