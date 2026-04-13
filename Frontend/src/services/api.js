// src/services/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.67.69:3000/api'; // ← Remplace par ton IP locale

// Pour trouver ton IP : ipconfig (Windows) ou ifconfig (Mac/Linux)
// Exemple : http://192.168.1.15:5000/api

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Erreur serveur');
  return json;
};

// ─── AUTH ────────────────────────────────────────────────────────────────────

export const register = async ({ fullName, email, phone, password }) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, phone, password }),
  });
  return handleResponse(res);
};

export const login = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const getProfile = async () => {
  const res = await fetch(`${BASE_URL}/auth/profile`, {
    headers: await getHeaders(),
  });
  return handleResponse(res);
};

// ─── ACCOUNTS ────────────────────────────────────────────────────────────────

export const createAccount = async ({ type, currency = 'MAD' }) => {
  const res = await fetch(`${BASE_URL}/accounts`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ type, currency }),
  });
  return handleResponse(res);
};

export const getAccounts = async () => {
  const res = await fetch(`${BASE_URL}/accounts`, {
    headers: await getHeaders(),
  });
  return handleResponse(res);
};

export const getAccountById = async (id) => {
  const res = await fetch(`${BASE_URL}/accounts/${id}`, {
    headers: await getHeaders(),
  });
  return handleResponse(res);
};

export const closeAccount = async (id) => {
  const res = await fetch(`${BASE_URL}/accounts/${id}`, {
    method: 'DELETE',
    headers: await getHeaders(),
  });
  return handleResponse(res);
};

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────

export const deposit = async (accountId, { amount, description }) => {
  const res = await fetch(`${BASE_URL}/transactions/${accountId}/deposit`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ amount: Number(amount), description }),
  });
  return handleResponse(res);
};

export const transfer = async (accountId, { receiverAccountNumber, amount, description }) => {
  const res = await fetch(`${BASE_URL}/transactions/${accountId}/transfer`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({
      receiverAccountNumber,
      amount: Number(amount),
      description,
    }),
  });
  return handleResponse(res);
};

export const getHistory = async (accountId, { page = 1, limit = 10 } = {}) => {
  const res = await fetch(
    `${BASE_URL}/transactions/${accountId}/history?page=${page}&limit=${limit}`,
    { headers: await getHeaders() }
  );
  return handleResponse(res);
};