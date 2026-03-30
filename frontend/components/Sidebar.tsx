"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  X, Scale, Home, Search, FileText, Gavel, FolderOpen, 
  Users, Video, BookOpen, Bell, BarChart3, User, Settings
} from "lucide-react";
import { useState, useEffect } from "react";
import { getUserFromToken } from "@/lib/auth";

const getNavItems = (userRole?: string) => {
  // Core Platform (All Users)
  const coreNav = [
    { href: "/dashboard/home", label: "Legal Intel", icon: Home },
    { href: "/dashboard/research", label: "AI Legal Research", icon: Search },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  // Staff/Superuser Only - AI Legal Practice Tools
  const staffNav = [
    { href: "/dashboard/legal-drafting", label: "Legal Drafting", icon: FileText },
    { href: "/dashboard/case-analysis", label: "Case Analysis Engine", icon: Gavel },
    { href: "/dashboard/evidence", label: "Evidence Organizer", icon: FolderOpen },
  ];

  // AI Law Training System (All Users)
  const trainingNav = [
    { href: "/dashboard/legal-modules", label: "Legal Concept Modules", icon: BookOpen },
    { href: "/dashboard/judgment-analysis", label: "Judgment Analysis Training", icon: BarChart3 },
    { href: "/dashboard/moot-court", label: "Legal Scenario Simulations", icon: Video },
    { href: "/dashboard/argument-construction", label: "Argument Construction Training", icon: Users },
  ];

  // Team Management (Role-based)
  const teamNav = [
    { href: "/dashboard/team", label: "Team Management", icon: Users },
  ];

  // Combine based on role
  let navItems = [...coreNav];
  
  // Add training system for all users
  navItems = [...navItems, ...trainingNav];
  
  if (userRole === "ADMIN" || userRole === "SUPERUSER") {
    navItems = [...navItems, ...staffNav, ...teamNav];
  } else if (userRole === "LAWYER" || userRole === "STUDENT_LAWYER" || userRole === "JUDGE" || userRole === "RESEARCHER") {
    navItems = [...navItems, ...teamNav];
  }
  
  return navItems;
};

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
  const [user, setUser] = useState<{name?: string; email?: string; avatarUrl?: string; role: string} | null>(null);

  useEffect(() => {
    const u = getUserFromToken();
    setUser(u);
  }, [pathname]);

  const navItems = getNavItems(user?.role);

  return (
    <aside className="min-h-screen bg-slate-900 text-white flex flex-col border-r border-slate-700/50">
      <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
        <Link href="/dashboard/home" className="flex items-center gap-3" onClick={onClose}>
          <Scale className="h-8 w-8 text-white" />
          <div>
            <span className="text-lg font-semibold tracking-tight text-white">
              Legal Intel
            </span>
            <span className="block text-xs text-slate-400 mt-0.5">
              Unified Legal Intelligence
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
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard/home" && pathname.startsWith(item.href));
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
                <item.icon className="h-5 w-5" />
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
          © {new Date().getFullYear()} Legal Intel
        </p>
      </div>
    </aside>
  );
}
