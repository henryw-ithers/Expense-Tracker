export const TransactionType = {
    INCOME: "INCOME",
    EXPENSE: "EXPENSE",
} as const;

export type TransactionType =
    (typeof TransactionType)[keyof typeof TransactionType];

export interface CreateTransactionRequest {
    description: string;
    amount: string;
    date: string;
    categoryId: string;
    type: TransactionType;
}

export interface TransactionResponse {
    id: string;
    amount: number;
    type: TransactionType;
    date: string;
    description: string;
    categoryId: string;
    categoryName: string;

}