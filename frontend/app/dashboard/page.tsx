"use client";

import { useEffect, useState } from "react";
import BarChart from "../../components/Charts/BarChart";
import Card from "../../components/Card";
import { fetchCourtAnalytics } from "../../lib/api";

const DashboardPage = () => {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchCourtAnalytics().then((data) => setAnalytics(data));
  }, []);

  if (!analytics) return <p>Loading...</p>;

  const courtNames = analytics.map((c: any) => c.court_name);
  const totalCases = analytics.map((c: any) => c.total_cases);

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="flex flex-wrap gap-4">
        <Card title="Total Courts" value={analytics.length} />
        <Card
          title="Total Cases"
          value={analytics.reduce((sum: number, c: any) => sum + c.total_cases, 0)}
        />
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 shadow rounded-md">
        <h2 className="font-bold mb-4">Cases Per Court</h2>
        <BarChart labels={courtNames} data={totalCases} title="Total Cases" />
      </div>
    </div>
  );
};

export default DashboardPage;
