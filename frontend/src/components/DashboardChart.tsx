import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function DashboardChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = chartRef.current;

    if (!canvas) return;

    const chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        datasets: [
          {
            data: [15339, 21345, 18483, 24003, 23489, 24092, 12034],
            tension: 0,
            backgroundColor: "transparent",
            borderColor: "#007bff",
            borderWidth: 4,
            pointBackgroundColor: "#007bff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div style={{ position: "relative", height: "300px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}