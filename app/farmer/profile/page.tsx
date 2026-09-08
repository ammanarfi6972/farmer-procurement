import { createClient } from "@/lib/supabase/server";
import { FarmerProfileClient } from "./profile-client";

export default async function FarmerProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return <FarmerProfileClient profile={profile} />;
}
