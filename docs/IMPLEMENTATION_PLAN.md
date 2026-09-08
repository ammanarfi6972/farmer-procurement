# Implementation Plan

## Overview
This document outlines the step-by-step technical implementation of the FasalTrack (Farmer Procurement & Queue Management Platform) for SIH 2026. The architecture follows a modular monolith approach using Next.js, Supabase (PostgreSQL, Auth, Realtime), and Tailwind CSS.

## 1. Repository Structure & Technology Setup
- **Structure**: Initialize the Next.js App Router project in the root directory.
  - `/app` for routes and pages.
  - `/components` for reusable UI components.
  - `/lib` for domain logic (e.g., `/lib/db`, `/lib/auth`, `/lib/queue`).
  - `/supabase` for database migrations and seed data.
  - `/tests` for testing setup.
- **Tech Setup**: Next.js (TypeScript), Tailwind CSS, and shadcn/ui.
- **Dependencies**: Install `supabase-js`, `zod`, `lucide-react`, `recharts`, Google Maps API wrapper, and testing libraries (Vitest, Playwright).
- **Environment Variables**: Create `.env.example` defining required keys (Supabase URL/Key, Google Maps Key, etc.).

## 2. Supabase Setup & PostgreSQL Schema
- **Supabase**: Initialize local Supabase CLI and link to remote project.
- **Migrations**: Write SQL migrations for core tables:
  - `profiles`, `roles`, `user_roles`
  - `countries`, `states`, `districts`, `centres`
  - `commodities`, `commodity_prices`
  - `slots`, `bookings`, `check_ins`
  - `queue_entries`, `procurements`, `settlements`, `payments`
  - `notifications`, `audit_logs`
- **Seed Data**: Prepare initial synthetic demo data (3 states, 6 districts, 12 centres, roles, mock pricing).

## 3. Authentication & Authorization (RLS)
- **Auth Flow**: Implement Next.js Server-side Supabase Auth.
- **Farmer Auth**: Mock OTP abstraction integrated with Supabase.
- **Official Auth**: Email/password credentials for Staff, Managers, and Admins.
- **RLS Policies**: Apply Row-Level Security on all exposed tables:
  - Farmers only see their own profile and bookings.
  - Staff/Managers scoped to assigned centres.
  - Admins scoped to geography or global.

## 4. Super Admin Experience & Master Data
- CRUD UI for `commodities`, `pricing` (with effective dates), and `centres`.
- Staff assignment and capacity/schedule configuration.

## 5. District/Admin Experience
- Cross-centre dashboard with aggregated metrics (overload indicators, procurement summaries).
- Recharts-based performance comparisons.

## 6. Farmer Experience (Core flow)
- **Profile & Localization**: Multilingual profile setup.
- **Centre Discovery & Maps**: Map UI showing available centres and operating hours (using Google Maps adapter).
- **Slot Scheduling**: Booking wizard (select commodity, quantity, date, capacity-aware slot).
- **Booking & Token**: Confirm booking and generate stable token.

## 7. Centre Staff Experience
- **Schedule View**: List of today's expected bookings.
- **Check-in**: UI to verify farmer and mark arrival.
- **Procurement Workflow**: Record accepted quantity and Pass/Fail quality. Calculate settlement value using the effective price.

## 8. Queue Engine & ETA Calculation
- **Queue Logic**: Deterministic, strictly ordered queue based on check-ins.
- **ETA Formula**: `(farmers_ahead * rolling_avg_service_time) / active_counters`.
- **Realtime**: Use Supabase Realtime to broadcast queue advances to the Farmer's dashboard.

## 9. Centre Manager Experience
- Live operational dashboard: Queue length, capacity utilization, average service time.
- Exception handling and active counter management.

## 10. Mocks: Payments & Notifications
- **Payment Mock**: Demo control panel (or staff UI action) to transition `INITIATED -> PROCESSING -> CREDITED`.
- **Notification Mock**: Abstracted SMS service that writes to the `notifications` table for display in the app.

## 11. PWA & Offline Support
- Next.js PWA manifest, service worker for basic offline shell.
- Read-only cache when network drops.

## 12. Analytics
- Build database views or efficient queries for KPI aggregation.
- Wire up Recharts on Admin/Manager dashboards.

## 13. Testing
- Setup Vitest for unit tests (pricing, ETA logic).
- Playwright for critical E2E path (Farmer Booking -> Staff Check-in -> Procurement -> Payment).

## 14. SIH Demo Preparation
- Freeze deterministic demo seed.
- Verify role transitions, realtime updates, and clean placeholder text.
- Rehearse the single synthetic farmer journey alongside the staff dashboard.
