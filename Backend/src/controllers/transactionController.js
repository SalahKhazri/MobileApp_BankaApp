// src/controllers/transactionController.js
import * as transactionService from "../services/transactionService.js";
import { successResponse } from "../utils/response.js";

export const transfer = async (req, res, next) => {
  try {
    // req.params.accountId = le compte émetteur
    const transaction = await transactionService.transferFunds(
      req.params.accountId,
      req.body
    );
    return successResponse(res, 201, "Virement effectué avec succès.", transaction);
  } catch (error) {
    next(error);
  }
};

export const deposit = async (req, res, next) => {
  try {
    const transaction = await transactionService.depositFunds(
      req.params.accountId,
      req.body
    );
    return successResponse(res, 201, "Dépôt effectué avec succès.", transaction);
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const result = await transactionService.getTransactionHistory(
      req.params.accountId,
      req.query // page & limit depuis l'URL
    );
    return successResponse(res, 200, "Historique récupéré.", result);
  } catch (error) {
    next(error);
  }
};