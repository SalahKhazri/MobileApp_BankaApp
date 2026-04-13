// src/controllers/accountController.js
import * as accountService from "../services/accountService.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createAccount = async (req, res, next) => {
  try {
    const account = await accountService.createAccount(req.user._id, req.body);
    return successResponse(res, 201, "Compte bancaire créé.", account);
  } catch (error) {
    next(error);
  }
};

export const getMyAccounts = async (req, res, next) => {
  try {
    const accounts = await accountService.getUserAccounts(req.user._id);
    return successResponse(res, 200, "Comptes récupérés.", accounts);
  } catch (error) {
    next(error);
  }
};

export const getAccount = async (req, res, next) => {
  try {
    const account = await accountService.getAccountById(req.params.id, req.user._id);
    return successResponse(res, 200, "Compte récupéré.", account);
  } catch (error) {
    next(error);
  }
};

export const closeAccount = async (req, res, next) => {
  try {
    const account = await accountService.deactivateAccount(req.params.id, req.user._id);
    return successResponse(res, 200, "Compte fermé avec succès.", account);
  } catch (error) {
    next(error);
  }
};