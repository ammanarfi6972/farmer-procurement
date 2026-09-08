import { getManagerDirectory } from "@/lib/manager/actions";
import { ManagersClient } from "./managers-client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ManagersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { getAdminClient } = await import("@/lib/supabase/server");
  const { data: profile } = await getAdminClient()
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === 'centre_manager') {
    redirect("/admin"); // Managers cannot manage managers
  }

  const { managers, centres } = await getManagerDirectory();
  
  return <ManagersClient initialManagers={managers} centres={centres} />;
}
