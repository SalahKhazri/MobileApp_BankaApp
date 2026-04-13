// src/models/Account.js
import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    accountNumber: {
      type: String,
      unique: true,
      required: true,
    },

    type: {
      type: String,
      enum: ["courant", "epargne"],
      default: "courant",
    },

    balance: {
      type: Number,
      default: 0,
      min: [0, "Le solde ne peut pas être négatif"],
    },

    currency: {
      type: String,
      default: "MAD", // Dirham marocain (adapte selon ton projet)
      uppercase: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Méthode : vérifier si le solde est suffisant ───────────────────────────
accountSchema.methods.hasSufficientFunds = function (amount) {
  return this.balance >= amount;
};

// ─── Middleware : génération auto du numéro de compte avant création ─────────
accountSchema.pre("save", function (next) {
  if (!this.accountNumber) {
    // Format : MA + timestamp + 4 chiffres aléatoires
    this.accountNumber = "MA" + Date.now() + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

const Account = mongoose.model("Account", accountSchema);
export default Account;