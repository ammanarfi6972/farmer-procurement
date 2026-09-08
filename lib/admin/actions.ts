"use server";

import { getAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";



export async function getAdminDashboardData(params: { period?: string; from?: string; to?: string }) {
  const supabaseAdmin = getAdminClient();

  const { data: procurements } = await supabaseAdmin
    .from("procurements")
    .select(`
      id,
      expected_quantity,
      accepted_quantity,
      unit_price,
      total_value,
      created_at,
      commodities ( name ),
      bookings (
        profiles ( full_name ),
        procurement_centres ( name )
      )
    `);

  const { data: bookings } = await supabaseAdmin
    .from("bookings")
    .select("id, status");

  const totalVolume = (procurements || []).reduce((acc: number, p: any) => acc + (p.accepted_quantity || 0), 0);
  const totalValue = (procurements || []).reduce((acc: number, p: any) => acc + (p.total_value || 0), 0);
  
  const paidBookings = (bookings || []).filter((b: any) => b.status === "DBT_PAID");
  const farmersProcessed = paidBookings.length;

  const activeBookings = (bookings || []).filter((b: any) => ["YARD_ARRIVED", "QUALITY_CHECK", "WEIGHMENT"].includes(b.status));
  const activeQueueCount = activeBookings.length;

  const centreVolumeMap: Record<string, number> = {};
  (procurements || []).forEach((p: any) => {
    const centreName = p.bookings?.procurement_centres?.name || "Unknown";
    centreVolumeMap[centreName] = (centreVolumeMap[centreName] || 0) + (p.accepted_quantity || 0);
  });
  const chartDataByCentre = Object.entries(centreVolumeMap).map(([name, volume]) => ({ name, volume }));

  const commodityVolumeMap: Record<string, number> = {};
  (procurements || []).forEach((p: any) => {
    const commName = p.commodities?.name || "Unknown";
    commodityVolumeMap[commName] = (commodityVolumeMap[commName] || 0) + (p.accepted_quantity || 0);
  });
  const chartDataByCommodity = Object.entries(commodityVolumeMap).map(([name, value]) => ({ name, value }));

  const recentActivity = (procurements || [])
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return {
    metrics: {
      totalVolume,
      totalValue,
      farmersProcessed,
      activeQueueCount
    },
    chartDataByCentre,
    chartDataByCommodity,
    recentActivity
  };
}

export async function deleteAllData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authorized" };

  const supabaseAdmin = getAdminClient();

  if (!user) return { error: "Not authorized" };

  await supabaseAdmin.from("payments").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabaseAdmin.from("procurements").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabaseAdmin.from("queue_entries").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabaseAdmin.from("bookings").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabaseAdmin.from("slots").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabaseAdmin.from("commodity_prices").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabaseAdmin.from("commodities").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabaseAdmin.from("staff_assignments").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabaseAdmin.from("procurement_centres").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  
  await supabaseAdmin.from("profiles").delete().neq("id", user.id);
  
  const { data: users } = await supabaseAdmin.auth.admin.listUsers();
  if (users?.users) {
    for (const u of users.users) {
      if (u.id !== user.id) {
        await supabaseAdmin.auth.admin.deleteUser(u.id);
      }
    }
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function populateDemoData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authorized" };

  const supabaseAdmin = getAdminClient();

  const { data: stateData } = await supabaseAdmin.from('states').insert({ code: 'WB', name: 'West Bengal' }).select('id').single();
  const { data: districtData } = await supabaseAdmin.from('districts').insert({ state_id: stateData?.id, code: 'KOL', name: 'Kolkata/Suburbs' }).select('id').single();

  const districtId = districtData?.id;

  const centresData = [
    { district_id: districtId, code: 'SUB', name: 'Subhasgram Centre', address: 'Subhasgram, WB', latitude: 22.4200, longitude: 88.4200 },
    { district_id: districtId, code: 'MAD', name: 'Madhyamgram Centre', address: 'Madhyamgram, WB', latitude: 22.7000, longitude: 88.4500 },
    { district_id: districtId, code: 'PAN', name: 'Panskura Centre', address: 'Panskura, WB', latitude: 22.4000, longitude: 87.7100 }
  ];

  const { data: createdCentres } = await supabaseAdmin.from('procurement_centres').insert(centresData).select('id, name');

  const commoditiesData = [
    { code: 'PLSMNG', name: 'Pulses(Moong)', unit: 'Qtl' },
    { code: 'WHEAT', name: 'Wheat', unit: 'Qtl' },
    { code: 'PADDY', name: 'Paddy', unit: 'Qtl' }
  ];
  
  const { data: createdCommodities } = await supabaseAdmin.from('commodities').insert(commoditiesData).select('id, code');

  if (createdCommodities) {
    const pricesData = createdCommodities.map(c => {
      let price = 0;
      if (c.code === 'PLSMNG') price = 8558;
      if (c.code === 'WHEAT') price = 2275;
      if (c.code === 'PADDY') price = 2182;
      return {
        commodity_id: c.id,
        price_per_unit: price,
        effective_from: new Date().toISOString().split('T')[0]
      };
    });
    await supabaseAdmin.from('commodity_prices').insert(pricesData);
  }

  if (createdCentres) {
    for (const centre of createdCentres) {
      const emailPrefix = centre.name.split(' ')[0].toLowerCase();
      const email = `manager_${emailPrefix}@test.com`;
      
      const { data: userData } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: 'password123',
        email_confirm: true
      });

      if (userData?.user) {
        await supabaseAdmin.from('profiles').upsert({
          id: userData.user.id,
          full_name: `${centre.name} Manager`,
          mobile: `99${Math.floor(10000000 + Math.random() * 90000000)}`,
          role: 'centre_manager'
        });

        await supabaseAdmin.from('staff_assignments').insert({
          profile_id: userData.user.id,
          centre_id: centre.id
        });
      }
    }
  }

  if (createdCentres) {
    const slotInserts = [];
    const today = new Date();
    
    for (let d = 0; d < 7; d++) {
      const slotDate = new Date(today);
      slotDate.setDate(today.getDate() + d);
      const dateStr = slotDate.toISOString().split('T')[0];
      
      const timeWindows = [
        { start: '09:00:00', end: '11:00:00' },
        { start: '11:00:00', end: '13:00:00' },
        { start: '14:00:00', end: '16:00:00' },
        { start: '16:00:00', end: '18:00:00' }
      ];

      for (const centre of createdCentres) {
        for (const time of timeWindows) {
          slotInserts.push({
            centre_id: centre.id,
            date: dateStr,
            start_time: time.start,
            end_time: time.end,
            capacity: 50
          });
        }
      }
    }
    await supabaseAdmin.from('slots').insert(slotInserts);
  }

  revalidatePath("/admin");
  return { success: true };
}
