"use client";

import { useEffect, useState } from "react";
import BarChart from "@/components/Charts/BarChart";
import PieChart from "@/components/Charts/PieChart";
import LineChart from "@/components/Charts/LineChart";
import Card from "@/components/Card";
import { fetchCourtAnalytics, type CourtAnalyticsItem } from "@/lib/api";

export default function CourtAnalyticsPage() {
  const [analytics, setAnalytics] = useState<CourtAnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourtAnalytics()
      .then(setAnalytics)
      .catch(() => setError("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Loading court analytics...</p>
      </div>
    );
  }
  if (error || !analytics.length) {
    return (
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-8 text-center">
        <p className="text-slate-600">
          {error || "No court data yet. Add courts and cases in the admin."}
        </p>
      </div>
    );
  }

  const courtNames = analytics.map((c) => c.court_name);
  const totalCases = analytics.map((c) => c.total_cases);
  const statusTotals = analytics.reduce<Record<string, number>>(
    (acc, c) => {
      Object.entries(c.status_breakdown).forEach(([k, v]) => {
        acc[k] = (acc[k] || 0) + v;
      });
      return acc;
    },
    {}
  );
  const firstTrend = analytics[0].monthly_trend || {};
  const trendLabels = Object.keys(firstTrend);
  const trendData = trendLabels.map((label) => firstTrend[label]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Card title="Courts Covered" value={analytics.length} />
        <Card
          title="Total Cases"
          value={totalCases.reduce((a, b) => a + b, 0)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-3">Cases per court</h3>
          <BarChart labels={courtNames} data={totalCases} title="Cases" />
        </div>
        <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-3">Case status</h3>
          <PieChart
            labels={Object.keys(statusTotals)}
            data={Object.values(statusTotals)}
          />
        </div>
        <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-100 md:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-3">Trend over time</h3>
          {trendLabels.length ? (
            <LineChart labels={trendLabels} data={trendData} />
          ) : (
            <p className="text-slate-500 py-4">No trend data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
