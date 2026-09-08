# Architecture and Product Decisions

This file records decisions that should remain stable unless explicitly revisited.

| Decision | Choice | Reason |
|---|---|---|
| Geography | All India, configurable | Nationally reusable concept |
| Interfaces | One PWA-style app with role-specific UX | Shared platform and simpler SIH deployment |
| Auth | Farmer OTP; official credentials | Matches requested operating model |
| Verification | Mock | No real government identity integration |
| Commodities | Configurable | Supports multiple procurement programs |
| Pricing | Admin-maintained effective-dated records | Avoid hard-coded policy data |
| Queue | Deterministic smart ETA | No AI/ML |
| Offline | Basic | Good resilience without unsafe sync complexity |
| Languages | Farmer/staff/manager multilingual | Accessibility where it matters most |
| Notifications | Mock SMS | Demonstrates workflow without vendor dependency |
| Maps | Google Maps through adapter | Rich map/routes/places capability |
| Hardware | Out of scope | Keep SIH prototype software-only |
| Architecture | Modular monolith | Fast iteration and maintainability |
| Backend | Supabase/PostgreSQL | Auth, RLS, realtime, storage in one platform |
| Hosting | Vercel | Natural fit for Next.js |
| Demo data | Synthetic | Safe and deterministic |
| AI | None | Avoid unnecessary complexity/buzzword use |
| Strategy | Balanced | Innovation + feasibility + polished demo |
| Slot Capacity | Maximum bookings per slot | Deterministic queue size, extensible model |
| Quality Pricing | Pass/Fail check | Simplifies UI, keeps pricing flat for MVP |
| SIH Demo UI | Dedicated Super Admin Demo Panel | Prevents fake-payment clutter in actual Staff UI |
