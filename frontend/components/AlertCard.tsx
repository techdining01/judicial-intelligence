import type { AlertItem } from "@/lib/api";

export default function AlertCard({ alert }: { alert: AlertItem }) {
  const date = alert.sent_at
    ? new Date(alert.sent_at).toLocaleDateString("en-NG", {
        dateStyle: "medium",
      })
    : null;

  return (
    <article className="rounded-xl border border-amber-200/60 bg-amber-50/80 p-5 shadow-sm transition hover:shadow-md">
      <h3 className="font-semibold text-slate-800">{alert.title}</h3>
      {date && (
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-amber-800/80">
          {date}
        </p>
      )}
      <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
        {alert.content}
      </p>
    </article>
  );
}
