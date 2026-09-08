# Farmer Procurement System — Agent Documentation

This directory is the source-of-truth documentation for the SIH 2026 project **SIH26032 — Farmer Procurement System**.

The project is being developed with **Antigravity IDE using Gemini 3.1 Pro as the coding agent**.

## Source-of-truth hierarchy

When information conflicts, use this order:

1. `AGENT_INSTRUCTIONS.md`
2. `REQUIREMENTS.md`
3. `BUSINESS_RULES.md`
4. `PROCUREMENT_WORKFLOW.md`
5. `DATABASE.md` / `API_SPEC.md`
6. `UI_UX_GUIDELINES.md` / `DESIGN_SYSTEM.md`
7. Other supporting documents
8. Agent assumptions

Never invent a government integration, policy rule, API, credential, or real-world capability that has not been explicitly approved.

## Product decision summary

- Geography: All India
- Product: PWA-style web application
- Interfaces: Farmer, Procurement Centre Staff, Centre Manager, District/Admin Officer, Super Admin
- Farmer authentication: OTP
- Official authentication: credentials
- Government identity verification: mock/simulated for SIH prototype
- Commodities: configurable
- MSP/pricing: configurable by authorized admin
- Queue: smart, data-driven ETA without AI/ML
- AI/ML product features: none
- Offline: basic support only
- Languages: multilingual for Farmer, Centre Staff, Centre Manager; English-only for District/Admin Officer and Super Admin in prototype
- Notifications: SMS mock
- Maps: full maps, routing/navigation, centre availability
- Hardware: software-only prototype
- Demo data: realistic seeded dataset
- Strategy: balanced innovation + feasibility + polished demo

## Build principle

The product is not merely a farmer registration app.

It is a **real-time procurement coordination and centre-operations platform** that reduces uncertainty, distributes arrivals more intelligently, digitizes the physical queue, and makes procurement/payment status visible.

Read `AGENT_INSTRUCTIONS.md` before making code changes.
