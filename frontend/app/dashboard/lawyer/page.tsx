"use client";

import RoleGuard from "../../../components/RoleGuard";
import LawyerDashboard from "../../../components/dashboards/LawyerDashboard";

export default function LawyerPage() {
  return (
    <RoleGuard allowed={["LAWYER"]}>
      <LawyerDashboard />
    </RoleGuard>
  );
}
