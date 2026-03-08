"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/lib/auth";

export default function RoleGuard({
  allowed,
  children,
}: {
  allowed: string[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = getUserFromToken();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allowed.includes(user.role ?? "")) {
      router.replace("/dashboard");
    }
  }, [user, allowed, router]);

  if (!user || !allowed.includes(user.role ?? "")) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Access denied or redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;
}
