import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const DEMO_PASSWORD = 'password123';

const demoUsers = [
  { email: 'farmer@test.com', name: 'Ramesh Farmer', phone: '9876543210', role: 'farmer' },
  { email: 'staff@test.com', name: 'Suresh Staff', phone: '9876543211', role: 'centre_staff' },
  { email: 'manager@test.com', name: 'Mahesh Manager', phone: '9876543212', role: 'centre_manager' },
  { email: 'admin@test.com', name: 'Anil Admin', phone: '9876543213', role: 'district_admin' }
];

const mockFarmers = [
  { email: 'farmer1@test.com', name: 'Ramesh Patil', phone: '9876543001', role: 'farmer', bank_account: '345678901234', ifsc_code: 'SBIN0048291', kcc_number: 'KCC-90248' },
  { email: 'farmer2@test.com', name: 'Suresh Kumar', phone: '9876543002', role: 'farmer', bank_account: '987654321098', ifsc_code: 'HDFC0001234', kcc_number: 'KCC-90249' },
  { email: 'farmer3@test.com', name: 'Anand Singh', phone: '9876543003', role: 'farmer', bank_account: '567890123456', ifsc_code: 'ICIC0005678', kcc_number: 'KCC-90250' }
];

const allUsers = [...demoUsers, ...mockFarmers];

async function run() {
  console.log("🚀 Starting remote database seed...");

  // 1. Reference Data
  console.log("📦 Upserting Master Data...");
  
  await supabase.from('states').upsert([
    { id: '11111111-1111-1111-1111-111111111111', code: 'MH', name: 'Maharashtra' },
    { id: '22222222-2222-2222-2222-222222222222', code: 'UP', name: 'Uttar Pradesh' },
    { id: '33333333-3333-3333-3333-333333333333', code: 'MP', name: 'Madhya Pradesh' }
  ]);

  await supabase.from('districts').upsert([
    { id: '10000000-0000-0000-0000-000000000001', state_id: '11111111-1111-1111-1111-111111111111', code: 'MH-PUN', name: 'Pune' },
    { id: '10000000-0000-0000-0000-000000000002', state_id: '11111111-1111-1111-1111-111111111111', code: 'MH-NSK', name: 'Nashik' },
    { id: '20000000-0000-0000-0000-000000000001', state_id: '22222222-2222-2222-2222-222222222222', code: 'UP-LKO', name: 'Lucknow' }
  ]);

  const centreAlphaId = 'aaaa0000-0000-0000-0000-000000000001';
  await supabase.from('procurement_centres').upsert([
    { id: centreAlphaId, district_id: '10000000-0000-0000-0000-000000000001', code: 'C-ALPHA', name: 'Pune Central Procurement (Alpha)', address: '123 Market Rd, Pune', latitude: 18.5204, longitude: 73.8567 }
  ]);

  const wheatId = 'c0000000-0000-0000-0000-000000000001';
  await supabase.from('commodities').upsert([
    { id: wheatId, code: 'WHT', name: 'Wheat', unit: 'Quintal' },
    { id: 'c0000000-0000-0000-0000-000000000002', code: 'PDY', name: 'Paddy (Common)', unit: 'Quintal' }
  ]);

  await supabase.from('commodity_prices').upsert([
    { id: 'd0000000-0000-0000-0000-000000000001', commodity_id: wheatId, price_per_unit: 2275.00, effective_from: '2025-04-01' }
  ]);

  // 2. Fetch existing users to delete them (Cascades to profiles, bookings, etc.)
  console.log("🧹 Cleaning up old demo users...");
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Failed to list users:", listError);
    return;
  }

  for (const u of allUsers) {
    const existing = users.find(x => x.email === u.email);
    if (existing) {
      await supabase.auth.admin.deleteUser(existing.id);
      console.log(`Deleted ${u.email}`);
    }
  }

  // 3. Create fresh users
  console.log("👤 Creating fresh demo users...");
  const farmerIds: string[] = [];

  let managerId: string | null = null;

  for (const u of allUsers) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: DEMO_PASSWORD,
      email_confirm: true
    });

    if (error) {
      console.error(`Failed to create ${u.email}:`, error.message);
      continue;
    }

    const userId = data.user.id;
    console.log(`Created ${u.email} -> ${userId}`);

    if (u.role === 'farmer') {
      farmerIds.push(userId);
    }
    if (u.role === 'centre_manager') {
      managerId = userId;
    }

    // Insert Profile
    await supabase.from('profiles').upsert({
      id: userId,
      full_name: u.name,
      mobile: u.phone,
      role: u.role,
      bank_account: (u as any).bank_account || null,
      ifsc_code: (u as any).ifsc_code || null,
      kcc_number: (u as any).kcc_number || null,
    });

    // Assign to centre if Staff or Manager
    if (u.role === 'centre_staff' || u.role === 'centre_manager') {
      await supabase.from('staff_assignments').upsert({
        profile_id: userId,
        centre_id: centreAlphaId
      });
      console.log(`Assigned ${u.email} to Alpha Centre`);
    }
  }

  // Create slot
  const slotDate = new Date().toISOString().split('T')[0];
  const slotId = 's0000000-0000-0000-0000-000000000001';
  await supabase.from('slots').upsert([
    { id: slotId, centre_id: centreAlphaId, date: slotDate, start_time: '09:00:00', end_time: '12:00:00', capacity: 100, active: true }
  ]);

  // Create Bookings
  if (farmerIds.length >= 3) {
    const b1Id = 'b0000000-0000-0000-0000-000000000001';
    const b2Id = 'b0000000-0000-0000-0000-000000000002';
    const b3Id = 'b0000000-0000-0000-0000-000000000003';

    await supabase.from('bookings').upsert([
      { id: b1Id, booking_number: 'KS-20241101-A1', farmer_id: farmerIds[0], centre_id: centreAlphaId, commodity_id: wheatId, slot_id: slotId, expected_quantity: 50, status: 'GATE_PASS_GENERATED', gate_pass_token: 'TOKEN123', vehicle_number: 'HR-12-AB-3456' },
      { id: b2Id, booking_number: 'KS-20241101-A2', farmer_id: farmerIds[1], centre_id: centreAlphaId, commodity_id: wheatId, slot_id: slotId, expected_quantity: 80, status: 'YARD_ARRIVED', gate_pass_token: 'TOKEN124', vehicle_number: 'HR-13-CD-7890' },
      { id: b3Id, booking_number: 'KS-20241101-A3', farmer_id: farmerIds[2], centre_id: centreAlphaId, commodity_id: wheatId, slot_id: slotId, expected_quantity: 120, status: 'DBT_PAID', gate_pass_token: 'TOKEN125', vehicle_number: 'HR-14-EF-1122' },
    ]);

    // Add procurements for DBT_PAID booking
    if (managerId) {
      await supabase.from('procurements').upsert([
        { id: 'p0000000-0000-0000-0000-000000000001', booking_id: b3Id, staff_id: managerId, commodity_id: wheatId, expected_quantity: 120, accepted_quantity: 120, quality_status: 'ACCEPTED', unit_price: 2275.00, total_value: 120 * 2275.00 }
      ]);
    }
  }

  console.log("✅ Seed completed successfully! You can now log in.");
}

run().catch(console.error);
