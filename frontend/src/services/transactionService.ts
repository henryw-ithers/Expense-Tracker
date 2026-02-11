import { api } from "./api";
import type {
    CreateTransactionRequest,
    TransactionResponse,
} from "../types/Transaction";

export const getTransactions = async (): Promise<TransactionResponse[]> => {
    const response = await api.get<TransactionResponse[]>("/transactions");
    return response.data;
};

export const createTransaction = async (
    data: CreateTransactionRequest
): Promise<TransactionResponse> => {
    const response = await api.post<TransactionResponse>(
        "/transactions",
        data
    );
    return response.data;
};