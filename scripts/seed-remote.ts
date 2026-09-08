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
  { email: 'manager@test.com', name: 'Mahesh Manager', phone: '9876543212', role: 'centre_manager' },
  { email: 'admin@test.com', name: 'Anil Admin', phone: '9876543213', role: 'district_admin' }
];

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

  for (const u of [...demoUsers, { email: 'staff@test.com' }]) {
    const existing = users.find(x => x.email === u.email);
    if (existing) {
      await supabase.auth.admin.deleteUser(existing.id);
      console.log(`Deleted ${u.email}`);
    }
  }

  // 3. Create fresh users
  console.log("👤 Creating fresh demo users...");
  for (const u of demoUsers) {
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

    // Insert Profile
    await supabase.from('profiles').upsert({
      id: userId,
      full_name: u.name,
      mobile: u.phone,
      role: u.role
    });

    // Assign to centre if Manager
    if (u.role === 'centre_manager') {
      await supabase.from('staff_assignments').upsert({
        profile_id: userId,
        centre_id: centreAlphaId
      });
      console.log(`Assigned ${u.email} to Alpha Centre`);
    }
  }

  // 4. Create Slots for today and next 2 days
  console.log("⏰ Creating time slots...");
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    
    const slots = [
      { centre_id: centreAlphaId, date: dateStr, start_time: '08:00:00', end_time: '10:00:00', capacity: 10, active: true },
      { centre_id: centreAlphaId, date: dateStr, start_time: '10:00:00', end_time: '12:00:00', capacity: 10, active: true },
      { centre_id: centreAlphaId, date: dateStr, start_time: '13:00:00', end_time: '15:00:00', capacity: 10, active: true },
      { centre_id: centreAlphaId, date: dateStr, start_time: '15:00:00', end_time: '17:00:00', capacity: 10, active: true }
    ];
    await supabase.from('slots').insert(slots);
  }

  console.log("✅ Seed completed successfully! You can now log in.");
}

run().catch(console.error);
