"use client";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  labels: string[];
  data: number[];
}

const PieChart = ({ labels, data }: PieChartProps) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FF6384",
        ],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;
