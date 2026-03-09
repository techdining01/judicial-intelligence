"use client";

import dynamic from "next/dynamic";
import LawyerDashboard from "../../../components/dashboards/LawyerDashboard";

const RoleGuard = dynamic(() => import("../../../components/RoleGuard"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[40vh]">
      <p className="text-slate-500">Loading...</p>
    </div>
  ),
});

export default function LawyerPage() {
  return (
    <RoleGuard allowed={["LAWYER"]}>
      <LawyerDashboard />
    </RoleGuard>
  );
}
