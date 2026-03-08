"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/analytics", label: "Court Analytics" },
  { href: "/dashboard/alerts", label: "Morning Alerts" },
  { href: "/dashboard/judgments", label: "Judgments" },
  { href: "/dashboard/simulations", label: "Moot Court" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col border-r border-slate-700/50">
      <div className="p-5 border-b border-slate-700/50">
        <Link href="/dashboard" className="block">
          <span className="text-lg font-semibold tracking-tight text-white">
            Judicial Intel
          </span>
          <span className="block text-xs text-slate-400 mt-0.5">
            Nigerian Legal Platform
          </span>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sky-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 px-3">
          Research · Operations · Training
        </p>
      </div>
    </aside>
  );
}
