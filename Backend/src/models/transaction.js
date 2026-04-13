// src/models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    amount: {
      type: Number,
      required: [true, "Le montant est obligatoire"],
      min: [1, "Le montant doit être supérieur à 0"],
    },

    currency: {
      type: String,
      default: "MAD",
      uppercase: true,
    },

    type: {
      type: String,
      enum: ["virement", "depot", "retrait"],
      required: true,
    },

    status: {
      type: String,
      enum: ["en_attente", "completee", "echouee", "annulee"],
      default: "en_attente",
    },

    description: {
      type: String,
      trim: true,
      maxlength: [200, "La description ne peut pas dépasser 200 caractères"],
    },

    reference: {
      type: String,
      unique: true,
    },

    fees: {
      type: Number,
      default: 0, // Frais de transaction (ex: virement international)
    },

    balanceAfterSender: {
      type: Number, // Solde du compte émetteur après transaction (audit)
    },

    balanceAfterReceiver: {
      type: Number, // Solde du compte récepteur après transaction (audit)
    },
  },
  {
    timestamps: true,
  }
);

// ─── Middleware : génération auto de la référence de transaction ─────────────
transactionSchema.pre("save", function (next) {
  if (!this.reference) {
    // Format : TXN + timestamp + 5 chiffres aléatoires
    this.reference = "TXN" + Date.now() + Math.floor(10000 + Math.random() * 90000);
  }
  next();
});

// ─── Index : pour accélérer les recherches par compte et par date ────────────
transactionSchema.index({ sender: 1, createdAt: -1 });
transactionSchema.index({ receiver: 1, createdAt: -1 });
transactionSchema.index({ reference: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;