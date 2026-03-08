"use client";

import { useEffect, useState } from "react";
import { fetchMyAlerts, type AlertItem } from "@/lib/api";
import AlertCard from "@/components/AlertCard";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyAlerts()
      .then(setAlerts)
      .catch(() => setError("Failed to load alerts"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Loading alerts...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Morning Alerts</h1>
        <p className="text-slate-500 mt-1">Court cause lists and hearing notifications</p>
      </div>
      {alerts.length === 0 ? (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-8 text-center text-slate-600">
          No alerts yet. Subscribe to courts and cause lists in your profile.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
