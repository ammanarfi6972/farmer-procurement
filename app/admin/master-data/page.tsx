import { getMasterData } from "@/lib/master-data/actions";
import { MasterDataClient } from "./master-data-client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MasterDataPage() {
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
    redirect("/admin");
  }

  const data = await getMasterData();
  
  return <MasterDataClient initialData={data} />;
}
