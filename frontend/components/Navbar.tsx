"use client";

import { useState, useRef, useEffect } from "react";
import { getUserFromToken, logout } from "@/lib/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = getUserFromToken();

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
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      <h1 className="font-semibold text-slate-800 text-lg">
        Nigerian Judicial Intelligence
      </h1>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        >
          <span className="font-medium text-slate-700">{user?.email ?? "User"}</span>
          <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
            {user?.role ?? "—"}
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
          <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg z-50">
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
