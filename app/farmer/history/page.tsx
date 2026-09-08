import { createClient, getAdminClient } from "@/lib/supabase/server";
import { FarmerHistoryClient } from "./history-client";

export default async function FarmerHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminClient = getAdminClient();
  const { data: bookings, error } = await adminClient
    .from("bookings")
    .select(`
      *,
      slots(date, start_time, end_time),
      procurement_centres(name),
      commodities(name, unit),
      procurements(
        total_value,
        quality_status,
        accepted_quantity
      )
    `)
    .eq("farmer_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("HISTORY ERROR:", error);
  }

  return <FarmerHistoryClient bookings={bookings || []} />;
}
