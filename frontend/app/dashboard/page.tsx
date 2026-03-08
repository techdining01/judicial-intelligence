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
    switch (user.role) {
      case "ADMIN":
        router.push("/dashboard/admin");
        break;
      case "LAWYER":
        router.push("/dashboard/lawyer");
        break;
      case "STUDENT_LAWYER":
        router.push("/dashboard/student");
        break;
      case "RESEARCHER":
        router.push("/dashboard/researcher");
        break;
      default:
        router.push("/dashboard/admin");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <p className="text-slate-500">Redirecting...</p>
    </div>
  );
}
