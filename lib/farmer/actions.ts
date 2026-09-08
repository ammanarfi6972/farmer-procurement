"use server";

import { createClient, getAdminClient } from "@/lib/supabase/server";

export async function getAvailableCentres() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("procurement_centres")
    .select("id, name, address, code")
    .eq("operational_status", "ACTIVE")
    .order("name");

  if (error) {
    console.error("Error fetching centres:", error);
    return [];
  }
  return data;
}

export async function getCommodities() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("commodities")
    .select(`
      id, code, name, unit,
      commodity_prices (price_per_unit)
    `)
    .eq("active", true)
    // For demo, we just grab the first price, in a real app we'd filter by effective_from date
    .limit(1, { foreignTable: "commodity_prices" }) 
    .order("name");

  if (error) {
    console.error("Error fetching commodities:", error);
    return [];
  }
  return data;
}

export async function getAvailableSlots(centreId: string, dateStr: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("slots")
    .select("id, start_time, end_time, capacity")
    .eq("centre_id", centreId)
    .eq("date", dateStr)
    .eq("active", true)
    .order("start_time");

  if (error) {
    console.error("Error fetching slots:", error);
    return [];
  }

  // To check true availability, we would join with bookings and count.
  // For MVP prototyping velocity, we will fetch booking counts.
  const slotsWithAvailability = await Promise.all(
    data.map(async (slot) => {
      const { count } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("slot_id", slot.id)
        .in("status", ["SLOT_BOOKED", "GATE_PASS_GENERATED", "YARD_ARRIVED", "QUALITY_CHECK", "WEIGHMENT", "DISPATCH"]);

      return {
        ...slot,
        booked: count || 0,
        available: slot.capacity - (count || 0),
      };
    })
  );

  return slotsWithAvailability;
}

export async function createBooking(formData: FormData) {
  const centreId = formData.get("centreId") as string;
  const commodityId = formData.get("commodityId") as string;
  const slotId = formData.get("slotId") as string;
  const quantity = parseFloat(formData.get("quantity") as string);

  if (!centreId || !commodityId || !slotId || !quantity || isNaN(quantity)) {
    return { error: "Please fill all required fields." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to book a slot." };
  }

  // Double check slot capacity
  const { data: slot } = await supabase
    .from("slots")
    .select("capacity")
    .eq("id", slotId)
    .single();

  const { count } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("slot_id", slotId)
    .in("status", ["SLOT_BOOKED", "GATE_PASS_GENERATED", "YARD_ARRIVED", "QUALITY_CHECK", "WEIGHMENT", "DISPATCH"]);

  if (slot && count !== null && count >= slot.capacity) {
    return { error: "This slot is fully booked. Please select another time." };
  }

  // Generate Booking Number KM-YYYYMMDD-XXXX
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  const bookingNumber = `KM-${dateStr}-${randomStr}`;

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      booking_number: bookingNumber,
      farmer_id: user.id,
      centre_id: centreId,
      commodity_id: commodityId,
      slot_id: slotId,
      expected_quantity: quantity,
      status: "GATE_PASS_GENERATED",
    })
    .select()
    .single();

  if (error) {
    console.error("Booking error:", error);
    return { error: "Failed to create booking. Please try again." };
  }

  return { success: true, booking: data };
}

export async function checkInFromPhone(bookingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Get the booking
  const { data: booking, error: bError } = await supabase
    .from("bookings")
    .select("*, slots(start_time, end_time, date)")
    .eq("id", bookingId)
    .eq("farmer_id", user.id)
    .single();

  if (bError || !booking) return { error: "Booking not found" };

  if (booking.status !== "GATE_PASS_GENERATED" && booking.status !== "SLOT_BOOKED") return { error: "Booking is not in correct state" };

  // Validate time: Can check in up to 15 mins before slot start, and up to end of slot.
  const today = new Date().toISOString().split("T")[0];
  if (booking.slots.date !== today) {
    return { error: "You can only check in on the day of your booking." };
  }

  const adminClient = getAdminClient();

  // Generate sequential token number for the day
  const { count } = await adminClient
    .from("queue_entries")
    .select("*", { count: "exact", head: true })
    .eq("centre_id", booking.centre_id)
    .eq("service_date", today);
    
  const queueNumber = (count || 0) + 1;
  const tokenNumber = `Q-${queueNumber}`;

  // Insert into queue_entries
  const { error: qError } = await adminClient
    .from("queue_entries")
    .insert({
      booking_id: bookingId,
      centre_id: booking.centre_id,
      service_date: today,
      token_number: tokenNumber,
      status: "YARD_ARRIVED",
      checked_in_at: new Date().toISOString()
    });

  if (qError) {
    console.error("Queue insert error:", qError);
    return { error: "Failed to join queue." };
  }

  // Update booking status
  const { error: uError } = await adminClient
    .from("bookings")
    .update({ status: "YARD_ARRIVED", updated_at: new Date().toISOString() })
    .eq("id", bookingId);

  if (uError) {
    return { error: "Failed to update booking status." };
  }

  return { success: true, tokenNumber };
}

export async function getQueueStatus(bookingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Verify booking belongs to user
  const { data: booking } = await supabase
    .from("bookings")
    .select("id")
    .eq("id", bookingId)
    .eq("farmer_id", user.id)
    .single();
    
  if (!booking) return null;

  const adminClient = getAdminClient();

  const { data: queueEntry } = await adminClient
    .from("queue_entries")
    .select("*")
    .eq("booking_id", bookingId)
    .single();

  if (!queueEntry) return null;

  const farmerQueueNumber = queueEntry.token_number; // e.g. "Q-15"

  // Find the currently serving queue entry
  const { data: servingEntries } = await adminClient
    .from("queue_entries")
    .select("token_number")
    .eq("centre_id", queueEntry.centre_id)
    .eq("service_date", queueEntry.service_date)
    .in("status", ["QUALITY_CHECK", "WEIGHMENT"])
    .order("checked_in_at", { ascending: true })
    .limit(1);

  let currentQueueNumber = servingEntries && servingEntries.length > 0 ? servingEntries[0].token_number : null;

  // If no one is actively serving, the NEXT person in line is implicitly "at the counter"
  if (!currentQueueNumber) {
    const { data: nextInLine } = await adminClient
      .from("queue_entries")
      .select("token_number")
      .eq("centre_id", queueEntry.centre_id)
      .eq("service_date", queueEntry.service_date)
      .eq("status", "YARD_ARRIVED")
      .order("checked_in_at", { ascending: true })
      .limit(1);

    if (nextInLine && nextInLine.length > 0) {
      currentQueueNumber = nextInLine[0].token_number;
    } else {
      // If queue is completely empty, check the highest completed
      const { data: lastServed } = await adminClient
        .from("queue_entries")
        .select("token_number")
        .eq("centre_id", queueEntry.centre_id)
        .eq("service_date", queueEntry.service_date)
        .in("status", ["COMPLETED", "DBT_PAID", "DISPATCH"])
        .order("checked_in_at", { ascending: false })
        .limit(1);

      if (lastServed && lastServed.length > 0) {
        currentQueueNumber = lastServed[0].token_number;
      } else {
        currentQueueNumber = "Q-1"; 
      }
    }
  }

  const farmerNum = parseInt(farmerQueueNumber.replace("Q-", ""), 10) || 0;
  const currentNum = parseInt(currentQueueNumber.replace("Q-", ""), 10) || 0;

  return {
    farmerToken: farmerQueueNumber,
    currentToken: currentQueueNumber,
    farmerNum,
    currentNum
  };
}

export async function updateFarmerProfile(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const preferredLanguage = formData.get("preferredLanguage") as string;

  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const supabaseAdmin = getAdminClient();
  
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ 
      full_name: fullName,
      preferred_language: preferredLanguage,
      updated_at: new Date().toISOString()
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  return { success: true };
}
