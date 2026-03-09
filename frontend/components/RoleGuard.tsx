"use client";

import { useEffect, useState, useRef } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || hasCheckedAuth.current) return;

    hasCheckedAuth.current = true;

    const user = getUserFromToken();
    if (!user) {
      setIsAuthorized(false);
      router.replace("/login");
      setIsLoading(false);
      return;
    }
    if (!allowed.includes(user.role ?? "")) {
      setIsAuthorized(false);
      router.replace("/dashboard");
      setIsLoading(false);
      return;
    }
    setIsAuthorized(true);
    setIsLoading(false);
  }, [allowed, router, isMounted]);

  // Show loading state during hydration to prevent mismatch
  if (!isMounted || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Verifying access...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Access denied or redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;

  return <>{children}</>;
}
