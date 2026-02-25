import { api } from "./api";
import type {
  TransactionResponse,
  CreateTransactionRequest,
} from "../types/Transaction";

export async function getTransactions(): Promise<TransactionResponse[]> {
  const res = await api.get<TransactionResponse[]>("/api/transactions");
  return res.data;
}

export async function getTransactionById(
  id: string
): Promise<TransactionResponse> {
  const res = await api.get<TransactionResponse>(`/api/transactions/${id}`);
  return res.data;
}

export async function createTransaction(
  payload: CreateTransactionRequest
): Promise<TransactionResponse> {
  const res = await api.post<TransactionResponse>(
    "/api/transactions",
    payload
  );
  return res.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/api/transactions/${id}`);
}