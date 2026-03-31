import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card } from "../ui/Card";
import { SectionTitle } from "../ui/SectionTitle";
import type { TransactionResponse } from "../../types/Transaction";
import { theme } from "../../theme/theme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type DashboardChartProps = {
  transactions: TransactionResponse[];
};

function getCategoryColor(categoryName: string): string {
  let hash = 0;

  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 55%)`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value);
}

export function DashboardChart({ transactions }: DashboardChartProps) {
  const rootStyles = getComputedStyle(document.documentElement);
  const textMutedColor =
    rootStyles.getPropertyValue("--color-text-muted").trim() || "#94a3b8";

  const recentTransactions = useMemo(() => {
    const today = new Date();
    const cutoff = new Date();
    cutoff.setDate(today.getDate() - 30);

    return [...transactions]
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= cutoff && transactionDate <= today;
      })
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }, [transactions]);

  const summary = useMemo(() => {
    return recentTransactions.reduce(
      (totals, transaction) => {
        const amount = Number(transaction.amount);

        if (transaction.type === "INCOME") {
          totals.income += amount;
          totals.net += amount;
        } else {
          totals.expenses += amount;
          totals.net -= amount;
        }

        return totals;
      },
      {
        income: 0,
        expenses: 0,
        net: 0,
      }
    );
  }, [recentTransactions]);

  const chartData = useMemo(() => {
    return {
      labels: recentTransactions.map((transaction, index) => {
        const formattedDate = new Date(transaction.date).toLocaleDateString(
          "en-CA",
          {
            month: "short",
            day: "numeric",
          }
        );

        return `${formattedDate} #${index + 1}`;
      }),
      datasets: [
        {
          label: "Transactions",
          data: recentTransactions.map((transaction) =>
            transaction.type === "EXPENSE"
              ? -Number(transaction.amount)
              : Number(transaction.amount)
          ),
          borderColor: "rgba(148, 163, 184, 0.28)",
          backgroundColor: "rgba(148, 163, 184, 0.28)",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: recentTransactions.map((transaction) =>
            getCategoryColor(transaction.categoryName)
          ),
          pointBorderColor: recentTransactions.map((transaction) =>
            getCategoryColor(transaction.categoryName)
          ),
          pointBorderWidth: 1,
        },
      ],
    };
  }, [recentTransactions]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "nearest" as const,
        intersect: true,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            title: function (tooltipItems: TooltipItem<"line">[]) {
              const transaction = recentTransactions[tooltipItems[0].dataIndex];
              return new Date(transaction.date).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            },
            label: function (context: TooltipItem<"line">) {
              const transaction = recentTransactions[context.dataIndex];
              const amount = Number(transaction.amount);

              return [
                `Category: ${transaction.categoryName}`,
                `Type: ${transaction.type}`,
                `Amount: ${formatCurrency(
                  transaction.type === "EXPENSE" ? -amount : amount
                )}`,
                `Description: ${transaction.description || "None"}`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textMutedColor,
            autoSkip: true,
            maxTicksLimit: 8,
          },
          grid: {
            color: "rgba(148, 163, 184, 0.10)",
          },
          border: {
            display: false,
          },
        },
        y: {
          ticks: {
            color: textMutedColor,
            callback: function (value: string | number) {
              return formatCurrency(Number(value));
            },
          },
          grid: {
            color: "rgba(148, 163, 184, 0.10)",
          },
          border: {
            display: false,
          },
        },
      },
    };
  }, [recentTransactions, textMutedColor]);

  const categoryLegend = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(recentTransactions.map((transaction) => transaction.categoryName))
    );

    return uniqueCategories.map((categoryName) => ({
      name: categoryName,
      color: getCategoryColor(categoryName),
    }));
  }, [recentTransactions]);

  if (recentTransactions.length === 0) {
    return (
      <Card className="h-100">
        <SectionTitle className="mb-2">Transactions Overview</SectionTitle>
        <p
          className="mb-0"
          style={{
            fontSize: theme.fontSizes.sm,
            color: theme.colors.textMuted,
          }}
        >
          No transactions recorded in the past 30 days.
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-100">
      <div className="d-flex flex-column gap-3 mb-4">
        <div>
          <SectionTitle className="mb-1">Transactions Overview</SectionTitle>
          <p
            className="mb-0"
            style={{
              fontSize: theme.fontSizes.sm,
              color: theme.colors.textMuted,
            }}
          >
            Past 30 days · one dot per transaction · colored by category
          </p>
        </div>

        <div className="d-flex flex-wrap gap-3">
          <div
            style={{
              fontSize: theme.fontSizes.xs,
              color: theme.colors.textMuted,
            }}
          >
            Income:{" "}
            <span style={{ color: theme.colors.text }}>
              {formatCurrency(summary.income)}
            </span>
          </div>

          <div
            style={{
              fontSize: theme.fontSizes.xs,
              color: theme.colors.textMuted,
            }}
          >
            Expenses:{" "}
            <span style={{ color: theme.colors.text }}>
              {formatCurrency(summary.expenses)}
            </span>
          </div>

          <div
            style={{
              fontSize: theme.fontSizes.xs,
              color: theme.colors.textMuted,
            }}
          >
            Net:{" "}
            <span style={{ color: theme.colors.text }}>
              {formatCurrency(summary.net)}
            </span>
          </div>

          <div
            style={{
              fontSize: theme.fontSizes.xs,
              color: theme.colors.textMuted,
            }}
          >
            Transactions:{" "}
            <span style={{ color: theme.colors.text }}>
              {recentTransactions.length}
            </span>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-3">
          {categoryLegend.map((category) => (
            <div
              key={category.name}
              className="d-flex align-items-center gap-2"
              style={{
                fontSize: theme.fontSizes.xs,
                color: theme.colors.textMuted,
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: category.color,
                  display: "inline-block",
                }}
              />
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: "380px" }}>
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}