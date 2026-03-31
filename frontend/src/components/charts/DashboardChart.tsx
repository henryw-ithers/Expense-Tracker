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

export function DashboardChart({ transactions }: DashboardChartProps) {
  const rootStyles = getComputedStyle(document.documentElement);
  const primaryColor =
    rootStyles.getPropertyValue("--color-primary").trim() || "#3b82f6";
  const textMutedColor =
    rootStyles.getPropertyValue("--color-text-muted").trim() || "#94a3b8";

  const { chartData, groupedTransactions } = useMemo(() => {
    const groupedTotals: Record<string, number> = {};
    const groupedTransactions: Record<string, TransactionResponse[]> = {};

    transactions.forEach((transaction) => {
      const dateKey = new Date(transaction.date).toLocaleDateString();

      if (!groupedTotals[dateKey]) {
        groupedTotals[dateKey] = 0;
      }

      if (!groupedTransactions[dateKey]) {
        groupedTransactions[dateKey] = [];
      }

      const amount = Number(transaction.amount);

      if (transaction.type === "EXPENSE") {
        groupedTotals[dateKey] -= amount;
      } else {
        groupedTotals[dateKey] += amount;
      }

      groupedTransactions[dateKey].push(transaction);
    });

    const labels = Object.keys(groupedTotals);
    const values = Object.values(groupedTotals);

    return {
      groupedTransactions,
      chartData: {
        labels,
        datasets: [
          {
            label: "Daily Net",
            data: values,
            borderColor: primaryColor,
            backgroundColor: primaryColor,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.35,
          },
        ],
      },
    };
  }, [transactions, primaryColor]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: textMutedColor,
            boxWidth: 12,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context: TooltipItem<"line">) {
              const date = context.label;
              const dayTransactions = groupedTransactions[date] || [];

              return dayTransactions.map((transaction) => {
                const sign = transaction.type === "EXPENSE" ? "-" : "+";
                return `${transaction.categoryName}: ${sign}$${transaction.amount}`;
              });
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textMutedColor,
            maxRotation: 0,
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
  }, [groupedTransactions, textMutedColor]);

  return (
    <Card className="h-100">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-4">
        <div>
          <SectionTitle className="mb-1">Transactions Overview</SectionTitle>
          <p
            className="mb-0"
            style={{
              fontSize: theme.fontSizes.sm,
              color: theme.colors.textMuted,
            }}
          >
            Daily net balance based on recorded transactions.
          </p>
        </div>
      </div>

      <div style={{ height: "380px" }}>
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}