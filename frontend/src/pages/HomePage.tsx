import { useMemo } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import { SectionTitle } from "../components/ui/SectionTitle";
import { SummaryCard } from "../components/ui/SummaryCard";
import { DashboardChart } from "../components/charts/DashboardChart";
import { useTransactions } from "../hooks/useTransactions";
import type { TransactionResponse } from "../types/Transaction";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value);
}

export function HomePage() {
  const { transactions } = useTransactions();

  const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
    return transactions.reduce(
      (
        totals: {
          totalIncome: number;
          totalExpenses: number;
          netBalance: number;
        },
        transaction: TransactionResponse
      ) => {
        const amount = Number(transaction.amount);

        if (transaction.type === "INCOME") {
          totals.totalIncome += amount;
          totals.netBalance += amount;
        } else {
          totals.totalExpenses += amount;
          totals.netBalance -= amount;
        }

        return totals;
      },
      {
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
      }
    );
  }, [transactions]);

  return (
    <PageContainer>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <SectionTitle className="mb-0">Dashboard</SectionTitle>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-4">
          <SummaryCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            subtitle="All recorded income"
          />
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <SummaryCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            subtitle="All recorded expenses"
          />
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <SummaryCard
            title="Net Balance"
            value={formatCurrency(netBalance)}
            subtitle="Income minus expenses"
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <DashboardChart transactions={transactions} />
        </div>
      </div>
    </PageContainer>
  );
}