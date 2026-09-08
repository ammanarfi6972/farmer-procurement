import { getAdminDashboardData } from "@/lib/admin/actions";
import { AdminDashboardClient } from "./dashboard-client";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { period?: string; from?: string; to?: string };
}) {
  const sp = await searchParams;
  const data = await getAdminDashboardData(sp);
  
  return <AdminDashboardClient initialData={data} initialParams={sp} />;
}
