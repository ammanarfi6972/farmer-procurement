-- Seed Data for SIH Demo
-- This script truncates existing tables to perform a clean reset, then populates deterministic demo data.

TRUNCATE TABLE auth.users CASCADE;
TRUNCATE TABLE states CASCADE;
TRUNCATE TABLE commodities CASCADE;

-- 1. States & Districts
INSERT INTO states (id, code, name) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'MH', 'Maharashtra'),
  ('22222222-2222-2222-2222-222222222222', 'UP', 'Uttar Pradesh'),
  ('33333333-3333-3333-3333-333333333333', 'MP', 'Madhya Pradesh')
ON CONFLICT (id) DO NOTHING;

INSERT INTO districts (id, state_id, code, name) VALUES 
  ('10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'MH-PUN', 'Pune'),
  ('10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'MH-NSK', 'Nashik'),
  ('20000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'UP-LKO', 'Lucknow'),
  ('20000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'UP-CNB', 'Kanpur'),
  ('30000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'MP-BHO', 'Bhopal'),
  ('30000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'MP-IND', 'Indore')
ON CONFLICT (id) DO NOTHING;

-- 2. Procurement Centres (Alpha, Beta, Gamma)
INSERT INTO procurement_centres (id, district_id, code, name, address, latitude, longitude) VALUES 
  ('aaaa0000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'C-ALPHA', 'Pune Central Procurement (Alpha)', '123 Market Rd, Pune', 18.5204, 73.8567),
  ('bbbb0000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'C-BETA', 'Nashik APMC (Beta)', '456 Agri Way, Nashik', 19.9975, 73.7898),
  ('cccc0000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'C-GAMMA', 'Lucknow East Centre (Gamma)', '789 Trade Ave, Lucknow', 26.8467, 80.9462)
ON CONFLICT (id) DO NOTHING;

-- 3. Commodities & Prices
INSERT INTO commodities (id, code, name, unit) VALUES 
  ('c0000000-0000-0000-0000-000000000001', 'WHT', 'Wheat', 'Quintal'),
  ('c0000000-0000-0000-0000-000000000002', 'PDY', 'Paddy (Common)', 'Quintal'),
  ('c0000000-0000-0000-0000-000000000003', 'PLS', 'Pulses (Moong)', 'Quintal')
ON CONFLICT (id) DO NOTHING;

INSERT INTO commodity_prices (id, commodity_id, price_per_unit, effective_from) VALUES 
  ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 2275.00, '2025-04-01'),
  ('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 2183.00, '2025-04-01'),
  ('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 8558.00, '2025-04-01')
ON CONFLICT (id) DO NOTHING;

-- Seed Users for Demo (using valid hex UUIDs)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token) VALUES
  ('f0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'farmer@test.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('b0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'staff@test.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('e0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'manager@test.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'admin@test.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) VALUES
  ('90000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', format('{"sub":"%s","email":"%s"}', 'f0000000-0000-0000-0000-000000000001', 'farmer@test.com')::jsonb, 'email', now(), now(), now()),
  ('90000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', format('{"sub":"%s","email":"%s"}', 'b0000000-0000-0000-0000-000000000001', 'staff@test.com')::jsonb, 'email', now(), now(), now()),
  ('90000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', format('{"sub":"%s","email":"%s"}', 'e0000000-0000-0000-0000-000000000001', 'manager@test.com')::jsonb, 'email', now(), now(), now()),
  ('90000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', format('{"sub":"%s","email":"%s"}', 'a0000000-0000-0000-0000-000000000001', 'admin@test.com')::jsonb, 'email', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert Profiles
INSERT INTO public.profiles (id, full_name, mobile, role) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'Ramesh Farmer', '9876543210', 'farmer'),
  ('b0000000-0000-0000-0000-000000000001', 'Suresh Staff', '9876543211', 'centre_staff'),
  ('e0000000-0000-0000-0000-000000000001', 'Mahesh Manager', '9876543212', 'centre_manager'),
  ('a0000000-0000-0000-0000-000000000001', 'Anil Admin', '9876543213', 'district_admin')
ON CONFLICT (id) DO NOTHING;

-- Assign Staff and Manager to Alpha centre
INSERT INTO public.staff_assignments (profile_id, centre_id) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'aaaa0000-0000-0000-0000-000000000001'),
  ('e0000000-0000-0000-0000-000000000001', 'aaaa0000-0000-0000-0000-000000000001')
ON CONFLICT (profile_id, centre_id) DO NOTHING;

