"use client";

export default function JudgmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Judgments</h1>
        <p className="text-slate-500 mt-1">
          Search and browse court judgments. AI summarization and precedent search.
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <p className="text-slate-500">
          Judgment search and normalization pipeline will be available here.
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Connect to the scraping and vector search APIs to enable.
        </p>
      </div>
    </div>
  );
}
