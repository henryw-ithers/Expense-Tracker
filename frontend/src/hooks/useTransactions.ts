import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  TransactionResponse,
  CreateTransactionRequest,
} from "../types/Transaction";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "../services/transactionService";

type UseTransactionsResult = {
  transactions: TransactionResponse[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (payload: CreateTransactionRequest) => Promise<TransactionResponse>;
  remove: (id: string) => Promise<void>;
  totals: { income: number; expense: number; net: number };
};

function toMessage(e: unknown, fallback: string): string {
  if (e instanceof Error) return e.message;
  return fallback;
}

export function useTransactions(): UseTransactionsResult {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(toMessage(e, "Failed to load transactions"));
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: CreateTransactionRequest) => {
    setError(null);
    const created = await createTransaction(payload);
    setTransactions((prev) => [created, ...prev]);
    return created;
  }, []);

  const remove = useCallback(async (id: string) => {
    setError(null);
    await deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;

    for (const t of transactions) {
      if (t.type === "INCOME") income += t.amount;
      else if (t.type === "EXPENSE") expense += t.amount;
    }

    return { income, expense, net: income - expense };
  }, [transactions]);

  return { transactions, loading, error, refresh, create, remove, totals };
}