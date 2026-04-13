// src/services/authService.js
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

// ─── Inscription ─────────────────────────────────────────────────────────────
export const registerUser = async ({ fullName, email, phone, password }) => {
  // Vérifier si l'email ou le téléphone existe déjà
  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    throw new Error("Un compte avec cet email ou ce téléphone existe déjà.");
  }

  const user = await User.create({ fullName, email, phone, password });
  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

// ─── Connexion ────────────────────────────────────────────────────────────────
export const loginUser = async ({ email, password }) => {
  // Récupérer l'utilisateur avec le mot de passe (select: false par défaut)
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Email ou mot de passe incorrect.");
  }

  if (!user.isActive) {
    throw new Error("Ce compte est désactivé. Contactez le support.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Email ou mot de passe incorrect.");
  }

  // Mettre à jour la date de dernière connexion
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      lastLogin: user.lastLogin,
    },
  };
};

// ─── Profil utilisateur ───────────────────────────────────────────────────────
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Utilisateur introuvable.");
  return user;
};