"use server";

import { createClient, getAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMasterData() {
  const supabase = await createClient();

  // Get Commodities with their latest active price
  const { data: commodities } = await supabase
    .from("commodities")
    .select(`
      id,
      name,
      unit,
      active,
      commodity_prices (
        price_per_unit,
        effective_from
      )
    `);

  // Transform to get the latest price easily
  const formattedCommodities = commodities?.map((c: any) => {
    // Sort by effective_from descending
    const prices = c.commodity_prices.sort((a: any, b: any) => 
      new Date(b.effective_from).getTime() - new Date(a.effective_from).getTime()
    );
    return {
      ...c,
      currentPrice: prices.length > 0 ? prices[0].price_per_unit : 0
    };
  });

  // Get Procurement Centres
  const { data: centres } = await supabase
    .from("procurement_centres")
    .select("*")
    .order("name", { ascending: true });

  // Get a default district ID for creating new centres (since demo only uses 1 district)
  const { data: districts } = await supabase
    .from("districts")
    .select("id")
    .limit(1);
  const defaultDistrictId = districts?.[0]?.id || null;

  return {
    commodities: formattedCommodities || [],
    centres: centres || [],
    defaultDistrictId
  };
}

export async function addCommodity(name: string, code: string, unit: string, initialPrice: number) {
  const supabaseAdmin = getAdminClient();

  // 1. Insert Commodity
  const { data: newCommodity, error: commodityError } = await supabaseAdmin
    .from("commodities")
    .insert({
      name,
      code,
      unit,
      active: true
    })
    .select("id")
    .single();

  if (commodityError) return { error: commodityError.message };

  // 2. Insert Initial Price
  const { error: priceError } = await supabaseAdmin
    .from("commodity_prices")
    .insert({
      commodity_id: newCommodity.id,
      price_per_unit: initialPrice,
      effective_from: new Date().toISOString()
    });

  if (priceError) return { error: priceError.message };

  revalidatePath("/admin/master-data");
  revalidatePath("/manager");
  return { success: true };
}

export async function addCentre(name: string, code: string, address: string, districtId: string) {
  const supabaseAdmin = getAdminClient();

  const { error } = await supabaseAdmin
    .from("procurement_centres")
    .insert({
      name,
      code,
      address,
      district_id: districtId,
      operational_status: 'ACTIVE'
    });

  if (error) return { error: error.message };

  revalidatePath("/admin/master-data");
  return { success: true };
}

export async function updateCommodityPrice(commodityId: string, newPrice: number) {
  const supabaseAdmin = getAdminClient();

  // Insert a new price record. The active price is just the most recent one.
  const { error } = await supabaseAdmin
    .from("commodity_prices")
    .insert({
      commodity_id: commodityId,
      price_per_unit: newPrice,
      effective_from: new Date().toISOString()
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/master-data");
  revalidatePath("/manager"); // Important so the manager dialogue sees the new price
  return { success: true };
}

export async function toggleCentreStatus(centreId: string, isActive: boolean) {
  const supabaseAdmin = getAdminClient();

  const { error } = await supabaseAdmin
    .from("procurement_centres")
    .update({ operational_status: isActive ? 'ACTIVE' : 'INACTIVE' })
    .eq("id", centreId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/master-data");
  revalidatePath("/farmer/book"); // So farmers can/cannot see the centre
  return { success: true };
}

export async function toggleCommodityStatus(commodityId: string, isActive: boolean) {
  const supabaseAdmin = getAdminClient();

  const { error } = await supabaseAdmin
    .from("commodities")
    .update({ active: isActive })
    .eq("id", commodityId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/master-data");
  revalidatePath("/farmer/book"); // So farmers can/cannot book this commodity
  return { success: true };
}
