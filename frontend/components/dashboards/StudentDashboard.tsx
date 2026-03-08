"use client";

import Link from "next/link";

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Student Lawyer Dashboard</h1>
        <p className="text-slate-500 mt-1">Learning and practice tools</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/simulations"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-800">AI Moot Court</h3>
          <p className="mt-1 text-sm text-slate-500">
            Practice with judge personas and scoring
          </p>
        </Link>
        <Link
          href="/dashboard/judgments"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-800">Judgments</h3>
          <p className="mt-1 text-sm text-slate-500">
            Read and search case law
          </p>
        </Link>
        <Link
          href="/dashboard/analytics"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
        >
          <h3 className="font-semibold text-slate-800">Court Analytics</h3>
          <p className="mt-1 text-sm text-slate-500">
            Explore case trends and outcomes
          </p>
        </Link>
      </div>
    </div>
  );
}
