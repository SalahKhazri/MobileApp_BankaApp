// src/controllers/authController.js
import * as authService from "../services/authService.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    return successResponse(res, 201, "Compte créé avec succès.", result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    return successResponse(res, 200, "Connexion réussie.", result);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user._id);
    return successResponse(res, 200, "Profil récupéré.", user);
  } catch (error) {
    next(error);
  }
};