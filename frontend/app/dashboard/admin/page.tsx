"use client";

import RoleGuard from "../../../components/RoleGuard";
import AdminDashboard from "../../../components/dashboards/AdminDashboard";

export default function AdminPage() {
  return (
    <RoleGuard allowed={["ADMIN"]}>
      <AdminDashboard />
    </RoleGuard>
  );
}
