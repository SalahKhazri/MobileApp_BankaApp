// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import User from "../models/user.js";
import { errorResponse } from "../utils/response.js";

export const protect = async (req, res, next) => {
  try {
    // 1. Récupérer le token depuis le header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, 401, "Accès refusé. Token manquant.");
    }

    const token = authHeader.split(" ")[1];

    // 2. Vérifier et décoder le token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    // 3. Récupérer l'utilisateur depuis la DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isActive) {
      return errorResponse(res, 401, "Utilisateur introuvable ou désactivé.");
    }

    // 4. Attacher l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 401, "Token invalide ou expiré.");
  }
};

// Middleware pour restreindre l'accès aux admins uniquement
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return errorResponse(res, 403, "Accès réservé aux administrateurs.");
  }
  next();
};