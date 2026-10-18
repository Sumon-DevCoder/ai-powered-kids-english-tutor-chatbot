import { Router } from "express";
import AuthController from "./auth.controller";
import validateRequest from "../../core/middleware/validate.middleware";
import requireAuth from "../../core/middleware/auth.middleware";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router();

router.post("/login", validateRequest(loginSchema), AuthController.login);
router.post("/register", validateRequest(registerSchema), AuthController.register);
router.get("/me", requireAuth, AuthController.getMe);

export default router;
