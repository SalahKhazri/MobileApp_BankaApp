// src/routes/authRoutes.js
import { Router } from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile); // Route protégée

export default router;