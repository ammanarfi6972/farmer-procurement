-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Custom Types
CREATE TYPE user_role AS ENUM ('farmer', 'centre_staff', 'centre_manager', 'district_admin', 'super_admin');
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'IN_QUEUE', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'REJECTED');
CREATE TYPE payment_status AS ENUM ('NOT_CREATED', 'INITIATED', 'PROCESSING', 'CREDITED', 'FAILED');

-- 2. Identity and Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY, -- References auth.users(id) which we'll mock or link later
  full_name TEXT NOT NULL,
  mobile TEXT UNIQUE,
  preferred_language TEXT DEFAULT 'en',
  role user_role NOT NULL DEFAULT 'farmer',
  state_id UUID,
  district_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Geography
CREATE TABLE states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true
);

CREATE TABLE districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID REFERENCES states(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true
);

-- 4. Procurement Centres
CREATE TABLE procurement_centres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID REFERENCES districts(id) ON DELETE RESTRICT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL,
  longitude DECIMAL,
  operational_status TEXT DEFAULT 'ACTIVE',
  timezone TEXT DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Staff Assignments
CREATE TABLE staff_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  centre_id UUID REFERENCES procurement_centres(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, centre_id)
);

-- 6. Commodities & Pricing
CREATE TABLE commodities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  active BOOLEAN DEFAULT true
);

CREATE TABLE commodity_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_id UUID REFERENCES commodities(id) ON DELETE CASCADE,
  price_per_unit DECIMAL NOT NULL,
  currency TEXT DEFAULT 'INR',
  effective_from DATE NOT NULL,
  effective_to DATE,
  source_label TEXT,
  is_demo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Scheduling (Slots)
CREATE TABLE slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  centre_id UUID REFERENCES procurement_centres(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  capacity INT NOT NULL, -- Maximum bookings per slot
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number TEXT UNIQUE NOT NULL,
  farmer_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
  centre_id UUID REFERENCES procurement_centres(id) ON DELETE RESTRICT,
  slot_id UUID REFERENCES slots(id) ON DELETE RESTRICT,
  commodity_id UUID REFERENCES commodities(id) ON DELETE RESTRICT,
  expected_quantity DECIMAL NOT NULL,
  status booking_status DEFAULT 'CONFIRMED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Active Queue (Queue Entries)
CREATE TABLE queue_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  centre_id UUID REFERENCES procurement_centres(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  token_number TEXT NOT NULL,
  status booking_status NOT NULL,
  checked_in_at TIMESTAMPTZ,
  called_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Procurements
CREATE TABLE procurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE RESTRICT,
  staff_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
  commodity_id UUID REFERENCES commodities(id) ON DELETE RESTRICT,
  expected_quantity DECIMAL NOT NULL,
  accepted_quantity DECIMAL NOT NULL,
  rejected_quantity DECIMAL DEFAULT 0,
  quality_status TEXT NOT NULL, -- 'ACCEPTED' or 'REJECTED'
  unit_price DECIMAL NOT NULL,
  total_value DECIMAL NOT NULL,
  is_demo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Payments (Mock)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  procurement_id UUID UNIQUE REFERENCES procurements(id) ON DELETE CASCADE,
  status payment_status DEFAULT 'INITIATED',
  amount DECIMAL NOT NULL,
  reference TEXT,
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  credited_at TIMESTAMPTZ,
  is_mock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Notifications (Mock)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  channel TEXT DEFAULT 'SMS',
  template_key TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  payload JSONB,
  status TEXT DEFAULT 'SENT',
  provider_reference TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  actor_role user_role,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  before_json JSONB,
  after_json JSONB,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Add Foreign Keys that had dependencies above
ALTER TABLE profiles ADD CONSTRAINT fk_state FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD CONSTRAINT fk_district FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE SET NULL;

-- 15. RLS Setup

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE commodities ENABLE ROW LEVEL SECURITY;
ALTER TABLE commodity_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Base Policies (More complex logic typically wrapped in DB functions or handled via App Router server logic using Service Role where needed)

-- Everyone can read states, districts, centres, commodities, slots, prices
CREATE POLICY "Public read states" ON states FOR SELECT USING (true);
CREATE POLICY "Public read districts" ON districts FOR SELECT USING (true);
CREATE POLICY "Public read centres" ON procurement_centres FOR SELECT USING (true);
CREATE POLICY "Public read commodities" ON commodities FOR SELECT USING (true);
CREATE POLICY "Public read slots" ON slots FOR SELECT USING (true);
CREATE POLICY "Public read commodity_prices" ON commodity_prices FOR SELECT USING (true);

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Bookings: Farmers can read own bookings. Staff can read bookings for their centre.
CREATE POLICY "Farmers can view own bookings" ON bookings FOR SELECT USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers can insert own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = farmer_id);

-- Note: Complex policies for staff accessing their assigned centres' data are typically done 
-- via JOINs with staff_assignments or using the Service Role Key in Next.js Server Actions for the prototype to avoid complex recursive RLS logic.
