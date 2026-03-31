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
import { theme } from "../../theme/theme";
import type { TransactionResponse } from "../../types/Transaction";

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
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.primary,
            tension: 0.3,
          },
        ],
      },
    };
  }, [transactions]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: theme.colors.text,
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
            color: theme.colors.textMuted,
          },
          grid: {
            color: "rgba(148, 163, 184, 0.15)",
          },
        },
        y: {
          ticks: {
            color: theme.colors.textMuted,
          },
          grid: {
            color: "rgba(148, 163, 184, 0.15)",
          },
        },
      },
    };
  }, [groupedTransactions]);

  return (
    <Card className="h-100">
      <SectionTitle className="mb-4">Transactions Overview</SectionTitle>
      <div style={{ height: "350px" }}>
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}