"use client";

import Link from "next/link";

export default function LawyerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Lawyer Dashboard</h1>
        <p className="text-slate-500 mt-1">Your cases, alerts, and precedents</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/alerts"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-800">Morning Alerts</h3>
          <p className="mt-1 text-sm text-slate-500">
            Cause lists and hearing dates
          </p>
        </Link>
        <Link
          href="/dashboard/judgments"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-800">Precedent Search</h3>
          <p className="mt-1 text-sm text-slate-500">
            Find similar judgments and citations
          </p>
        </Link>
        <Link
          href="/dashboard/simulations"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-800">Moot Court</h3>
          <p className="mt-1 text-sm text-slate-500">
            Practice with AI judge personas
          </p>
        </Link>
      </div>
    </div>
  );
}
