import { useMemo } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import { SectionTitle } from "../components/ui/SectionTitle";
import { SummaryCard } from "../components/ui/SummaryCard";
import { DashboardChart } from "../components/charts/DashboardChart";
import { useTransactions } from "../hooks/useTransactions";
import type { TransactionResponse } from "../types/Transaction";
import { theme } from "../theme/theme";
import { Card } from "../components/ui/Card";

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
      <div className="dashboard-header mb-4">
        <SectionTitle className="mb-2">Dashboard</SectionTitle>
        <p
          className="mb-0"
          style={{
            color: theme.colors.textMuted,
            fontSize: theme.fontSizes.sm,
          }}
        >
          A quick view of your recent financial activity and overall balance.
        </p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-4">
          <SummaryCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            subtitle="All recorded income"
            tone="positive"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <SummaryCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            subtitle="All recorded expenses"
            tone="negative"
          />
        </div>

        <div className="col-12 col-xl-4">
          <SummaryCard
            title="Net Balance"
            value={formatCurrency(netBalance)}
            subtitle="Income minus expenses"
            tone="neutral"
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12">
          {transactions.length > 0 ? (
            <DashboardChart transactions={transactions} />
          ) : (
            <Card>
              <div className="dashboard-empty-state text-center py-5">
                <h3
                  style={{
                    fontSize: theme.fontSizes.lg,
                    fontWeight: theme.fontWeights.bold,
                    color: theme.colors.text,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  No transactions yet
                </h3>
                <p
                  className="mb-0"
                  style={{
                    fontSize: theme.fontSizes.sm,
                    color: theme.colors.textMuted,
                  }}
                >
                  Add your first transaction to start seeing totals and chart data.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12">
          <Card>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <SectionTitle className="mb-0">Recent Transactions</SectionTitle>
            </div>

            {transactions.length > 0 ? (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th
                        style={{
                          color: theme.colors.textMuted,
                          fontSize: theme.fontSizes.xs,
                          fontWeight: theme.fontWeights.medium,
                          borderColor: "rgba(148, 163, 184, 0.12)",
                          background: "transparent",
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          color: theme.colors.textMuted,
                          fontSize: theme.fontSizes.xs,
                          fontWeight: theme.fontWeights.medium,
                          borderColor: "rgba(148, 163, 184, 0.12)",
                          background: "transparent",
                        }}
                      >
                        Category
                      </th>
                      <th
                        style={{
                          color: theme.colors.textMuted,
                          fontSize: theme.fontSizes.xs,
                          fontWeight: theme.fontWeights.medium,
                          borderColor: "rgba(148, 163, 184, 0.12)",
                          background: "transparent",
                        }}
                      >
                        Description
                      </th>
                      <th
                        style={{
                          color: theme.colors.textMuted,
                          fontSize: theme.fontSizes.xs,
                          fontWeight: theme.fontWeights.medium,
                          borderColor: "rgba(148, 163, 184, 0.12)",
                          background: "transparent",
                          textAlign: "right",
                        }}
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {[...transactions]
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() - new Date(a.date).getTime()
                      )
                      .slice(0, 5)
                      .map((transaction) => (
                        <tr key={transaction.id}>
                          <td
                            style={{
                              color: theme.colors.text,
                              borderColor: "rgba(148, 163, 184, 0.08)",
                              background: "transparent",
                            }}
                          >
                            {new Date(transaction.date).toLocaleDateString("en-CA")}
                          </td>

                          <td
                            style={{
                              color: theme.colors.text,
                              borderColor: "rgba(148, 163, 184, 0.08)",
                              background: "transparent",
                            }}
                          >
                            {transaction.categoryName}
                          </td>

                          <td
                            style={{
                              color: theme.colors.textMuted,
                              borderColor: "rgba(148, 163, 184, 0.08)",
                              background: "transparent",
                            }}
                          >
                            {transaction.description || "—"}
                          </td>

                          <td
                            style={{
                              color:
                                transaction.type === "INCOME"
                                  ? theme.colors.accent
                                  : theme.colors.secondary,
                              borderColor: "rgba(148, 163, 184, 0.08)",
                              background: "transparent",
                              textAlign: "right",
                              fontWeight: theme.fontWeights.bold,
                            }}
                          >
                            {transaction.type === "EXPENSE" ? "-" : "+"}
                            {formatCurrency(Number(transaction.amount))}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p
                className="mb-0"
                style={{
                  color: theme.colors.textMuted,
                  fontSize: theme.fontSizes.sm,
                }}
              >
                No transactions to display yet.
              </p>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}