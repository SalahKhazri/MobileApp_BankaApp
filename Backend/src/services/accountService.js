// src/services/accountService.js
import Account from "../models/account.js";

// ─── Créer un compte bancaire ─────────────────────────────────────────────────
export const createAccount = async (userId, { type, currency }) => {
  const account = await Account.create({
    owner: userId,
    type: type || "courant",
    currency: currency || "MAD",
  });
  return account;
};

// ─── Récupérer tous les comptes d'un utilisateur ──────────────────────────────
export const getUserAccounts = async (userId) => {
  const accounts = await Account.find({ owner: userId, isActive: true });
  return accounts;
};

// ─── Récupérer un compte par son ID ───────────────────────────────────────────
export const getAccountById = async (accountId, userId) => {
  const account = await Account.findOne({ _id: accountId, owner: userId });
  if (!account) throw new Error("Compte introuvable ou accès refusé.");
  return account;
};

// ─── Désactiver un compte ─────────────────────────────────────────────────────
export const deactivateAccount = async (accountId, userId) => {
  const account = await Account.findOne({ _id: accountId, owner: userId });
  if (!account) throw new Error("Compte introuvable ou accès refusé.");

  if (account.balance > 0) {
    throw new Error("Impossible de fermer un compte avec un solde positif.");
  }

  account.isActive = false;
  await account.save();
  return account;
};