// src/app.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

// ─── Middlewares globaux ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

// ─── Route de santé (health check) ───────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Serveur opérationnel ✅" });
});

// ─── Gestion des erreurs (toujours en dernier) ────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;