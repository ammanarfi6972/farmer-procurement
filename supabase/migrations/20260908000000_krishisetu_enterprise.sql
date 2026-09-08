-- Add new status values to booking_status ENUM
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'SLOT_BOOKED';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'GATE_PASS_GENERATED';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'YARD_ARRIVED';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'QUALITY_CHECK';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'WEIGHMENT';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'DISPATCH';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'SETTLEMENT_INITIATED';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'DBT_PAID';

-- Add new identity and financial columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kcc_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS aadhaar_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bank_account TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ifsc_code TEXT;

-- Add new gate pass columns to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gate_pass_token TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS vehicle_number TEXT;
