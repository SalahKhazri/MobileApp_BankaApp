// src/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Le nom complet est obligatoire"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Format email invalide"],
    },

    phone: {
      type: String,
      required: [true, "Le numéro de téléphone est obligatoire"],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
      select: false, // Ne jamais retourner le mdp dans les requêtes
    },

    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },

    isActive: {
      type: Boolean,
      default: true, // Permet de désactiver un compte sans le supprimer
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  }
);

// ─── Middleware : hashage du mot de passe avant sauvegarde ───────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Seulement si mdp modifié
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Méthode : comparer le mot de passe lors du login ───────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;