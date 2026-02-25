import { useTransactions } from "../hooks/useTransactions";
import { TransactionTable } from "../components/transactionTable";

export function DashboardPage() {
  const { transactions, loading, error, totals, remove } = useTransactions();

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Income: {totals.income}</p>
      <p>Expense: {totals.expense}</p>
      <p>Net: {totals.net}</p>

      <TransactionTable transactions={transactions} onDelete={remove} />
    </div>
  );
}