import { createClient, getAdminClient } from "@/lib/supabase/server";
import { FarmerDashboardClient } from "./dashboard-client";

export default async function FarmerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch active bookings using admin client to bypass queue_entries RLS
  const adminClient = getAdminClient();
  const { data: bookings } = await adminClient
    .from("bookings")
    .select(`
      *,
      slots(date, start_time, end_time),
      procurement_centres(name),
      commodities(name, unit),
      queue_entries(token_number)
    `)
    .eq("farmer_id", user?.id)
    .in("status", ["SLOT_BOOKED", "GATE_PASS_GENERATED", "YARD_ARRIVED", "QUALITY_CHECK", "WEIGHMENT", "DISPATCH", "SETTLEMENT_INITIATED"])
    .order("created_at", { ascending: false });

  const totalQuantity = bookings?.reduce((acc, b) => acc + (b.estimated_quantity || 0), 0) || 0;

  return (
    <FarmerDashboardClient bookings={bookings || []} totalQuantity={totalQuantity} />
  );
}
