// src/routes/transactionRoutes.js
import { Router } from "express";
import { transfer, deposit, getHistory } from "../controllers/transactionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(protect);

router.post("/:accountId/transfer", transfer);
router.post("/:accountId/deposit", deposit);
router.get("/:accountId/history", getHistory);

export default router;