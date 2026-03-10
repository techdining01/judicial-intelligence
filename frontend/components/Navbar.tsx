"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getUserFromToken, logout } from "@/lib/auth";
import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<{ email?: string; role?: string; avatarUrl?: string } | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const pathname = usePathname();

  // update on mount and whenever the route changes to keep server/client markup aligned
  useEffect(() => {
    setHydrated(false); // show placeholder during hydration phase for each new page
    setUser(null); // clear previous state immediately
    const u = getUserFromToken();
    setUser(u);
    setHydrated(true);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="h-14 border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-slate-800 transition-colors"
          >
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
        )}
        <h1 className="font-semibold text-slate-800 text-base sm:text-lg">
          Nigerian Judicial Intelligence
        </h1>
      </div>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        >
          {hydrated && user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="profile"
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-slate-300 flex items-center justify-center">
              <span className="text-xs font-medium text-slate-600">
                {hydrated && user?.email ? user.email.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
          )}
          <span className="font-medium text-slate-700 hidden sm:inline">
            {hydrated ? user?.email ?? "User" : "User"}
          </span>
          <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
            {hydrated ? user?.role ?? "—" : "—"}
          </span>
          <svg
            className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-slate-200 py-1 shadow-lg z-50">
            <div className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500">
              {user?.email}
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
