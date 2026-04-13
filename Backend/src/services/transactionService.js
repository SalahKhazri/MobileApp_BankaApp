// src/services/transactionService.js
import mongoose from "mongoose";
import Account from "../models/account.js";
import Transaction from "../models/transaction.js";

// ─── Effectuer un virement ────────────────────────────────────────────────────
export const transferFunds = async (senderId, { receiverAccountNumber, amount, description }) => {
  // Utiliser une session MongoDB pour garantir l'atomicité
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderAccount = await Account.findById(senderId).session(session);
    if (!senderAccount || !senderAccount.isActive) {
      throw new Error("Compte émetteur introuvable ou inactif.");
    }

    const receiverAccount = await Account.findOne({
      accountNumber: receiverAccountNumber,
      isActive: true,
    }).session(session);
    if (!receiverAccount) {
      throw new Error("Compte destinataire introuvable.");
    }

    if (senderAccount._id.equals(receiverAccount._id)) {
      throw new Error("Impossible de virer vers le même compte.");
    }

    if (!senderAccount.hasSufficientFunds(amount)) {
      throw new Error("Solde insuffisant.");
    }

    // Débiter et créditer les comptes
    senderAccount.balance -= amount;
    receiverAccount.balance += amount;

    await senderAccount.save({ session });
    await receiverAccount.save({ session });

    // Créer la transaction
    const transaction = await Transaction.create(
      [
        {
          sender: senderAccount._id,
          receiver: receiverAccount._id,
          amount,
          type: "virement",
          status: "completee",
          description,
          balanceAfterSender: senderAccount.balance,
          balanceAfterReceiver: receiverAccount.balance,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// ─── Dépôt ────────────────────────────────────────────────────────────────────
export const depositFunds = async (accountId, { amount, description }) => {
  const account = await Account.findById(accountId);
  if (!account || !account.isActive) throw new Error("Compte introuvable ou inactif.");

  account.balance += amount;
  await account.save();

  const transaction = await Transaction.create({
    sender: accountId,
    receiver: accountId,
    amount,
    type: "depot",
    status: "completee",
    description: description || "Dépôt",
    balanceAfterSender: account.balance,
    balanceAfterReceiver: account.balance,
  });

  return transaction;
};

// ─── Historique des transactions ──────────────────────────────────────────────
export const getTransactionHistory = async (accountId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const transactions = await Transaction.find({
    $or: [{ sender: accountId }, { receiver: accountId }],
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("sender", "accountNumber type")
    .populate("receiver", "accountNumber type");

  const total = await Transaction.countDocuments({
    $or: [{ sender: accountId }, { receiver: accountId }],
  });

  return {
    transactions,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};