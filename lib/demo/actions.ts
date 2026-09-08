"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getDemoState() {
  const supabase = await createClient();

  // Get active bookings
  const { data: activeBookings } = await supabase
    .from("bookings")
    .select("id, status");

  // Get queue size
  const { data: queueEntries } = await supabase
    .from("queue_entries")
    .select("id, status");

  // Get settlements
  const { data: settlements } = await supabase
    .from("settlements")
    .select(`
      id,
      amount,
      status,
      created_at,
      procurements (
        bookings (
          profiles (full_name)
        )
      )
    `)
    .order("created_at", { ascending: false });

  return {
    bookingCount: activeBookings?.length || 0,
    queueCount: queueEntries?.length || 0,
    settlements: settlements || []
  };
}

export async function triggerPaymentSettlements() {
  const supabase = await createClient();

  // Find pending settlements
  const { data: pending } = await supabase
    .from("settlements")
    .select("id")
    .eq("status", "PENDING");

  if (!pending || pending.length === 0) {
    return { message: "No pending payments found." };
  }

  // Update to COMPLETED and set transaction reference
  const updates = pending.map((p, index) => {
    return supabase
      .from("settlements")
      .update({ 
        status: "COMPLETED", 
        transaction_reference: `DEMO-TXN-${Date.now()}-${index}`,
        updated_at: new Date().toISOString()
      })
      .eq("id", p.id);
  });

  await Promise.all(updates);

  revalidatePath("/demo");
  return { message: `Settled ${pending.length} payments.` };
}

export async function resetDemoState() {
  const supabase = await createClient();

  // We are going to wipe transactional tables.
  // Order matters due to foreign keys: settlements -> procurements -> queue_entries -> bookings
  
  await supabase.from("settlements").delete().neq("id", "00000000-0000-0000-0000-000000000000"); // Hack to delete all
  await supabase.from("procurements").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("queue_entries").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("bookings").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  revalidatePath("/demo");
  revalidatePath("/admin");
  revalidatePath("/manager");
  
  return { message: "Database reset complete." };
}
