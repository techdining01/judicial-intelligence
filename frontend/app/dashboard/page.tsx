"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromToken();
    if (!user) {
      router.push("/login");
      return;
    }
    // Redirect all users to the new unified dashboard home
    router.push("/dashboard/home");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <p className="text-slate-500">Redirecting to Legal Intel Dashboard...</p>
    </div>
  );
}
