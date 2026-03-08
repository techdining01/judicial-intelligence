"use client";

export default function SimulationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">AI Moot Court</h1>
        <p className="text-slate-500 mt-1">
          Practice advocacy with AI judge personas. Legal reasoning evaluation and scoring.
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <p className="text-slate-500">
          Simulation scenarios and dialogue engine will be available here.
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Scenario DSL and judge personas from the Judicial Intelligence platform.
        </p>
      </div>
    </div>
  );
}
