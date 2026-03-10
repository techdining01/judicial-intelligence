"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Scale } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserFromToken } from "@/lib/auth";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📊" },
  { href: "/dashboard/alerts", label: "Alerts", icon: "🔔" },
  { href: "/dashboard/judgments", label: "Judgments", icon: "⚖️" },
  { href: "/dashboard/legal-research", label: "Legal Research", icon: "🔍" },
  { href: "/dashboard/legal-practice", label: "Legal Practice", icon: "⚖️" },
  { href: "/dashboard/ai-courtroom", label: "AI Courtroom", icon: "🎥" },
  { href: "/dashboard/moot-court", label: "Moot Court", icon: "🎭" },
  { href: "/dashboard/learning", label: "Learning", icon: "📚" },
  { href: "/dashboard/research-library", label: "Research", icon: "🔬" },
  { href: "/dashboard/simulations", label: "Simulations", icon: "🎯" },
  { href: "/dashboard/team", label: "Team", icon: "👥" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
];

interface SidebarProps {
  onClose?: () => void;
}

function NoSSR({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient ? <>{children}</> : null;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<{name?: string; email?: string; avatarUrl?: string} | null>(null);

  useEffect(() => {
    const u = getUserFromToken();
    setUser(u);
  }, [pathname]);

  return (
    <aside className="min-h-screen bg-slate-900 text-white flex flex-col border-r border-slate-700/50">
      <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <Scale className="h-8 w-8 text-white" />
          <div>
            <span className="text-lg font-semibold tracking-tight text-white">
              Judicial Intel
            </span>
            <span className="block text-xs text-slate-400 mt-0.5">
              Nigerian Legal Platform
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        <NoSSR>
          {nav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sky-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </NoSSR>
      </nav>
      <div className="p-3 border-t border-slate-700/50">
        <NoSSR>
          <div className="flex items-center gap-2 px-3 mb-2">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center">
                <span className="text-xs font-medium text-slate-300">
                  {user?.name ? user.name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-xs text-slate-300 truncate block">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-slate-500 truncate block">
                {user?.email}
              </span>
            </div>
          </div>
        </NoSSR>
        <p className="text-xs text-slate-500 px-3">
          © {new Date().getFullYear()} Judicial Intelligence
        </p>
      </div>
    </aside>
  );
}
