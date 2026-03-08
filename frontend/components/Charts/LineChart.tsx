"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface LineChartProps {
  labels: string[];
  data: number[];
}

const LineChart = ({ labels, data }: LineChartProps) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Cases Over Time",
        data,
        fill: false,
        borderColor: "#36A2EB",
        tension: 0.3,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default LineChart;
