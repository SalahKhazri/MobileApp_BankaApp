// src/routes/accountRoutes.js
import { Router } from "express";
import {
  createAccount,
  getMyAccounts,
  getAccount,
  closeAccount,
} from "../controllers/accountController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// Toutes les routes comptes nécessitent d'être connecté
router.use(protect);

router.post("/", createAccount);
router.get("/", getMyAccounts);
router.get("/:id", getAccount);
router.delete("/:id", closeAccount);

export default router;