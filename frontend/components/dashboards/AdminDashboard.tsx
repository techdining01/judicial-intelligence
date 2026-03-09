"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">System analytics, courts, and users</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/analytics"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-800">Court Analytics</h3>
          <p className="mt-1 text-sm text-slate-500">
            Case volume, status breakdown, and trends
          </p>
        </Link>
        <Link
          href="/dashboard/alerts"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-800">Morning Alerts</h3>
          <p className="mt-1 text-sm text-slate-500">
            Cause lists and hearing notifications
          </p>
        </Link>
        <Link
          href="/dashboard/judgments"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-800">Judgments</h3>
          <p className="mt-1 text-sm text-slate-500">
            Search and AI summarization
          </p>
        </Link>
      </div>
    </div>
  );
}
