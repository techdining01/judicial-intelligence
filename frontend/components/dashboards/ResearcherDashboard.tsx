"use client";

import Link from "next/link";

export default function ResearcherDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Researcher Dashboard</h1>
        <p className="text-slate-500 mt-1">Legal research and precedent discovery</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/judgments"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-800">Judgment Search</h3>
          <p className="mt-1 text-sm text-slate-500">
            AI summarization and vector search
          </p>
        </Link>
        <Link
          href="/dashboard/analytics"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-800">Court Analytics</h3>
          <p className="mt-1 text-sm text-slate-500">
            Case volume and status trends
          </p>
        </Link>
        <Link
          href="/dashboard/simulations"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-800">Moot Court</h3>
          <p className="mt-1 text-sm text-slate-500">
            Legal reasoning and advocacy practice
          </p>
        </Link>
      </div>
    </div>
  );
}
