import { useCategories } from "../hooks/useCategories";
import { useTransactions } from "../hooks/useTransactions";
import { TransactionForm } from "../components/transactionForm";

export function AddTransactionPage() {
  const { categories, loading, error } = useCategories();
  const { create } = useTransactions();

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Add Transaction</h1>
      <TransactionForm categories={categories} onSubmit={create} />
    </div>
  );
}