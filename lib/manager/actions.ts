"use server";

import { getAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getManagerDirectory() {
  const supabaseAdmin = getAdminClient();

  // Get all profiles that are not farmers, join with staff_assignments and procurement_centres
  const { data: staffProfiles, error } = await supabaseAdmin
    .from("profiles")
    .select(`
      id,
      full_name,
      mobile,
      role,
      created_at,
      staff_assignments (
        centre_id,
        procurement_centres (
          name
        )
      )
    `)
    .neq("role", "farmer")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching staff directory:", error);
    return { managers: [], centres: [] };
  }

  // Also fetch all active procurement centres for the "Add Staff" form dropdown
  const { data: centres } = await supabaseAdmin
    .from("procurement_centres")
    .select("id, name")
    .eq("operational_status", "ACTIVE")
    .order("name", { ascending: true });

  // Map to a friendlier format
  const formattedStaff = staffProfiles.map((profile: any) => ({
    id: profile.id,
    name: profile.full_name,
    mobile: profile.mobile,
    role: profile.role,
    joined: profile.created_at,
    centreName: profile.staff_assignments?.[0]?.procurement_centres?.name || "Unassigned",
    centreId: profile.staff_assignments?.[0]?.centre_id || null
  }));

  return {
    managers: formattedStaff,
    centres: centres || []
  };
}

export async function createManagerMember(formData: {
  email: string;
  name: string;
  mobile: string;
  role: string;
  centreId?: string;
}) {
  const supabaseAdmin = getAdminClient();
  const tempPassword = "password123";

  // 1. Create the Auth User (bypasses email confirmation for demo)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: formData.email,
    password: tempPassword,
    email_confirm: true,
  });

  if (authError) {
    return { error: authError.message };
  }

  const userId = authData.user.id;

  // 2. Insert Profile
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .insert({
      id: userId,
      full_name: formData.name,
      mobile: formData.mobile,
      role: formData.role
    });

  if (profileError) {
    // Rollback if profile creation fails
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return { error: "Failed to create manager profile: " + profileError.message };
  }

  // 3. Insert Assignment (if applicable)
  if (formData.role === "centre_manager" && formData.centreId) {
    const { error: assignmentError } = await supabaseAdmin
      .from("staff_assignments")
      .insert({
        profile_id: userId,
        centre_id: formData.centreId
      });

    if (assignmentError) {
      console.error("Failed to assign centre:", assignmentError);
      // We don't necessarily want to rollback the whole user if assignment fails, but we should note it.
    }
  }

  revalidatePath("/admin/managers");
  return { success: true };
}

export async function getManagerDashboardData() {
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();

  if (!user) return { centre: null, bookings: [] };

  const supabaseAdmin = getAdminClient();

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select(`
      role,
      staff_assignments (
        centre_id,
        procurement_centres (*)
      )
    `)
    .eq("id", user.id)
    .single();

  const centreId = profile?.staff_assignments?.[0]?.centre_id;
  const centre = profile?.staff_assignments?.[0]?.procurement_centres;
  if (!centreId || !centre) return { centre: null, bookings: [] };

  const today = new Date().toISOString().split('T')[0];
  const { data: bookings, error } = await supabaseAdmin
    .from("bookings")
    .select(`
      id, booking_number, status, expected_quantity,
      profiles(full_name, mobile),
      commodities(id, name),
      slots!inner(start_time, end_time, date)
    `)
    .eq("centre_id", centreId)
    .eq("slots.date", today)
    .order("slots(start_time)", { ascending: true });

  if (error) console.error("Manager bookings error:", error);

  return { centre, bookings: bookings || [] };
}

export async function checkInFarmer(bookingId: string) {
  const supabaseAdmin = getAdminClient();
  const { error } = await supabaseAdmin
    .from("bookings")
    .update({ status: "YARD_ARRIVED", updated_at: new Date().toISOString() })
    .eq("id", bookingId);
  if (error) return { error: error.message };
  revalidatePath("/manager");
  return { success: true };
}

export async function verifyGatePass(token: string) {
  const supabaseAdmin = getAdminClient();
  
  // Find the booking with this token
  const { data: booking, error: fetchError } = await supabaseAdmin
    .from("bookings")
    .select("id, status, booking_number, vehicle_number, profiles(full_name)")
    .eq("gate_pass_token", token)
    .single();

  if (fetchError || !booking) {
    return { error: "Invalid Gate Pass Token" };
  }

  const profilesData: any = booking.profiles;
  const farmerName = Array.isArray(profilesData) ? profilesData[0]?.full_name : profilesData?.full_name;

  // Check if it's already arrived
  if (booking.status === "YARD_ARRIVED" || booking.status === "QUALITY_CHECK" || booking.status === "WEIGHMENT") {
    return { error: "Farmer has already arrived at the yard." };
  }

  // Check if it's cancelled or completed
  if (booking.status !== "GATE_PASS_GENERATED" && booking.status !== "SLOT_BOOKED") {
    return { error: `Booking cannot be checked in. Current status: ${booking.status}` };
  }

  // Transition to YARD_ARRIVED
  const { error: updateError } = await supabaseAdmin
    .from("bookings")
    .update({ status: "YARD_ARRIVED", updated_at: new Date().toISOString() })
    .eq("id", booking.id);

  if (updateError) return { error: updateError.message };
  
  revalidatePath("/manager");
  return { success: true, farmerName: farmerName || "Unknown Farmer", vehicle: booking.vehicle_number || "Unknown" };
}

export async function callNextFarmer(bookingId: string) {
  const supabaseAdmin = getAdminClient();
  
  // Update booking status
  const { error: bError } = await supabaseAdmin
    .from("bookings")
    .update({ status: "QUALITY_CHECK", updated_at: new Date().toISOString() })
    .eq("id", bookingId);
    
  if (bError) return { error: bError.message };

  // Update queue entry
  await supabaseAdmin
    .from("queue_entries")
    .update({ status: "QUALITY_CHECK", called_at: new Date().toISOString() })
    .eq("booking_id", bookingId);

  revalidatePath("/manager");
  return { success: true };
}

export async function processProcurement(formData: FormData) {
  const bookingId = formData.get("bookingId") as string;
  const commodityId = formData.get("commodityId") as string;
  const quantity = parseFloat(formData.get("quantity") as string);
  const isAccepted = formData.get("isAccepted") === "true";

  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const supabaseAdmin = getAdminClient();

  if (!isAccepted) {
    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ status: "REJECTED", updated_at: new Date().toISOString() })
      .eq("id", bookingId);
    
    if (error) return { error: error.message };
    revalidatePath("/manager");
    return { success: true };
  }

  // Get active price
  const { data: commodity } = await supabaseAdmin
    .from("commodities")
    .select("commodity_prices(price_per_unit)")
    .eq("id", commodityId)
    .single();

  const unitPrice = commodity?.commodity_prices?.[0]?.price_per_unit || 0;
  const totalValue = unitPrice * quantity;

  // Insert procurement record
  const { error: procError } = await supabaseAdmin
    .from("procurements")
    .insert({
      booking_id: bookingId,
      staff_id: user.id,
      commodity_id: commodityId,
      expected_quantity: quantity,
      accepted_quantity: quantity,
      quality_status: "ACCEPTED",
      unit_price: unitPrice,
      total_value: totalValue
    });

  if (procError) return { error: procError.message };

  await supabaseAdmin
    .from("bookings")
    .update({ status: "DBT_PAID", updated_at: new Date().toISOString() })
    .eq("id", bookingId);

  revalidatePath("/manager");
  return { success: true };
}

export async function getManagerSlots(date: string) {
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();

  if (!user) return { slots: [] };

  const supabaseAdmin = getAdminClient();

  // Get manager's centre
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select(`staff_assignments(centre_id)`)
    .eq("id", user.id)
    .single();

  const centreId = profile?.staff_assignments?.[0]?.centre_id;
  if (!centreId) return { slots: [] };

  const { data: slots, error } = await supabaseAdmin
    .from("slots")
    .select(`
      *,
      bookings(id, status)
    `)
    .eq("centre_id", centreId)
    .eq("date", date)
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching slots:", error);
    return { slots: [] };
  }

  // Calculate used capacity
  const slotsWithUsage = slots?.map((slot: any) => {
    const validBookings = slot.bookings?.filter((b: any) => b.status !== 'CANCELLED' && b.status !== 'REJECTED') || [];
    return {
      ...slot,
      used_capacity: validBookings.length
    };
  }) || [];

  return { slots: slotsWithUsage };
}

export async function createSlot(date: string, startTime: string, endTime: string, capacity: number) {
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const supabaseAdmin = getAdminClient();

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select(`staff_assignments(centre_id)`)
    .eq("id", user.id)
    .single();

  const centreId = profile?.staff_assignments?.[0]?.centre_id;
  if (!centreId) return { error: "Not assigned to a centre" };

  const { error } = await supabaseAdmin
    .from("slots")
    .insert({
      centre_id: centreId,
      date,
      start_time: startTime,
      end_time: endTime,
      capacity,
      active: true
    });

  if (error) return { error: error.message };

  revalidatePath("/manager/slots");
  revalidatePath("/farmer/book");
  return { success: true };
}

export async function updateSlotCapacity(slotId: string, capacity: number) {
  const supabaseAdmin = getAdminClient();

  const { error } = await supabaseAdmin
    .from("slots")
    .update({ capacity })
    .eq("id", slotId);

  if (error) return { error: error.message };

  revalidatePath("/manager/slots");
  revalidatePath("/farmer/book");
  return { success: true };
}

export async function toggleSlotActive(slotId: string, active: boolean) {
  const supabaseAdmin = getAdminClient();

  const { error } = await supabaseAdmin
    .from("slots")
    .update({ active })
    .eq("id", slotId);

  if (error) return { error: error.message };

  revalidatePath("/manager/slots");
  revalidatePath("/farmer/book");
  return { success: true };
}
