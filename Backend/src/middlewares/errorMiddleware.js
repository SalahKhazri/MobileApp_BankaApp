// src/middlewares/errorMiddleware.js
import { ENV } from "../config/env.js";

// Middleware pour les routes inexistantes (404)
export const notFound = (req, res, next) => {
  const error = new Error(`Route introuvable : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware global de gestion des erreurs
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Erreur interne du serveur";

  // Erreur MongoDB : ID invalide
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Identifiant invalide.";
  }

  // Erreur MongoDB : champ unique dupliqué
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `La valeur du champ "${field}" est déjà utilisée.`;
  }

  // Erreur de validation Mongoose
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Erreur JWT
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token invalide.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expiré.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Stack trace uniquement en développement
    stack: ENV.NODE_ENV === "development" ? err.stack : undefined,
  });
};