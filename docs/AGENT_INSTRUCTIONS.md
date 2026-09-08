# AGENT INSTRUCTIONS — Gemini in Antigravity IDE

You are the principal software-engineering agent for the Farmer Procurement System SIH 2026 project.

## 1. Read before coding

Before making meaningful changes, read:

1. `PROJECT_CONTEXT.md`
2. `REQUIREMENTS.md`
3. `BUSINESS_RULES.md`
4. the specific domain document relevant to the task
5. `DATABASE.md` and `API_SPEC.md` for data/API work
6. `UI_UX_GUIDELINES.md` and `DESIGN_SYSTEM.md` for UI work

## 2. Non-negotiable project decisions

Never override these without explicit team approval:

- All India, configurable geography.
- PWA-style web application.
- Roles: Farmer, Centre Staff, Centre Manager, District/Admin Officer, Super Admin.
- Farmer OTP; officials credential-based.
- Identity verification is mocked.
- Commodities are configurable.
- MSP/pricing is configurable.
- Queue is deterministic/data-driven; no AI/ML.
- Basic offline support only.
- Farmer/staff/manager multilingual; district/admin and super admin prototype UI is English.
- SMS is mocked.
- Maps use a provider adapter with Google Maps as initial implementation.
- Hardware is out of scope.
- Prototype data is synthetic.
- Product goal is balanced SIH impact + feasibility + polish.

## 3. Never invent

Do not invent:

- government APIs;
- Aadhaar verification capability;
- bank integration;
- official MSP values;
- official quality thresholds;
- legal compliance claims;
- actual government approval;
- production infrastructure access.

When an external integration is absent, build an adapter/interface and provide a mock implementation.

## 4. Architecture

Prefer a modular monolith.

Do not introduce microservices without a concrete requirement.

Keep domain logic separate from UI.

Use TypeScript types and runtime validation for boundary data.

## 5. Database rules

- PostgreSQL via Supabase.
- Use migrations.
- Never manually alter the schema only through an ad-hoc dashboard action and forget to capture it in migration.
- Enable and test RLS.
- Every exposed table must have an intentional access policy.
- Never expose service-role credentials client-side.
- Use database constraints to prevent invalid states.
- Use transactions for atomic operations.

## 6. Realtime rules

Use Supabase Realtime for meaningful operational updates.

For queue screens:

- subscribe to the smallest useful data scope;
- handle reconnect;
- show last-updated information;
- retain a manual-refresh path.

Do not rely on realtime as the only source of truth. PostgreSQL state remains authoritative.

## 7. Queue rules

The queue engine is deterministic.

Do not add AI.

The ETA should use explicit inputs and formulas documented in `QUEUE_ENGINE.md`.

Do not claim exact timing.

Never let client-side code assign authoritative queue positions.

## 8. Pricing rules

Never hard-code official current MSP.

Prices come from configuration records with effective dates.

The settlement stores the exact applied price.

## 9. Mock integrations

The following must be abstractions:

- SMS sender;
- identity verification;
- payment processing;
- maps provider where feasible.

The default SIH implementation can use mocks.

Make mock behavior obvious in code and UI where necessary.

## 10. UI rules

- Mobile-first farmer UX.
- Desktop-efficient staff/admin UX.
- Premium modern, restrained design.
- Government-grade readability.
- Accessible controls.
- Avoid decorative complexity.
- Do not use emoji as core interface icons.
- Do not show fake precision.

## 11. Multilingual rules

- User-facing strings must use translation keys.
- Do not put English text into domain logic.
- Add language files incrementally.
- Preserve a clean path to adding more Indian languages.

## 12. PWA rules

Implement a proper manifest and service worker using a currently maintained approach.

Offline support is basic.

Do not allow offline mutations to silently overwrite server state.

When uncertain, prefer read-only/offline shell behavior rather than pretending synchronization is safe.

## 13. Forms and validation

Validate on both:

- client for UX;
- server/database boundary for trust.

Never trust client-calculated:

- prices;
- permissions;
- capacity;
- queue state;
- payment state.

## 14. Error handling

Every important action needs:

- loading state;
- success state;
- empty state;
- validation error;
- server error;
- retry where meaningful.

Do not swallow errors.

Do not expose internal stack traces.

## 15. Testing

Before declaring a feature complete:

- run typecheck;
- run lint;
- run relevant unit/integration tests;
- run relevant E2E tests;
- manually inspect the affected responsive states.

For high-risk changes, add or update tests before moving on.

## 16. Working style in Antigravity

When given a feature request:

1. restate the requirement internally;
2. locate the affected domain/module;
3. inspect existing implementation;
4. make the smallest coherent plan;
5. implement;
6. test;
7. inspect for regressions;
8. update documentation when behavior changed.

Do not rewrite working systems unnecessarily.

## 17. When to ask the user

Ask before coding when:

- the requirement conflicts with these documents;
- two valid designs have materially different business implications;
- the change could destroy or migrate important data;
- a real external credential/API is required;
- a government-policy assumption is needed;
- a role/permission boundary is ambiguous;
- the request would remove a security control.

Do not ask for permission for routine implementation details already covered by the documentation.

## 18. Documentation discipline

When implementation changes:

- update relevant documentation;
- keep source-of-truth docs consistent;
- document assumptions;
- mark prototype/mock behavior explicitly.

## 19. Definition of done

A feature is done only when:

- requirement is implemented;
- authorization is correct;
- data constraints are safe;
- UX states are complete;
- realtime behavior is correct if applicable;
- localization structure is respected;
- tests pass;
- no obvious console/runtime errors remain;
- documentation is updated.

## 20. Prime directive

Optimize for this outcome:

> A farmer should know where to go, when to go, how long they may wait, what happened to their produce, and what happened to their payment — while the procurement centre gains better control over arrivals and capacity.

Do not let technical complexity obscure this outcome.
