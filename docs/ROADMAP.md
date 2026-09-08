# Implementation Roadmap

## Phase 0 — Project foundation

- initialize Next.js + TypeScript;
- configure lint/typecheck;
- configure Tailwind/design system;
- configure Supabase;
- establish environment variables;
- create documentation index;
- create CI checks if desired.

## Phase 1 — Data and auth

- Supabase project;
- schema/migrations;
- RLS;
- role model;
- farmer OTP abstraction;
- official auth;
- seeded demo identities.

## Phase 2 — Farmer core

- profile;
- centre discovery;
- map;
- availability;
- slot booking;
- booking details.

## Phase 3 — Queue

- check-in;
- queue state;
- token;
- ETA;
- realtime subscriptions;
- staff workflow.

## Phase 4 — Procurement

- processing form;
- quantity;
- quality;
- pricing;
- settlement;
- payment mock state.

## Phase 5 — Management

- manager dashboard;
- centre analytics;
- district/admin views;
- configuration.

## Phase 6 — PWA/localization

- installability;
- service worker;
- offline shell;
- translations;
- localized SMS mock.

## Phase 7 — Polish

- accessibility;
- responsive pass;
- error states;
- loading states;
- performance;
- audit review;
- demo seed cleanup.

## Phase 8 — SIH demo hardening

- deterministic demo scenario;
- test all role transitions;
- ensure no broken routes;
- remove accidental placeholder text;
- verify maps;
- verify realtime;
- rehearse demo;
- document known limitations.

## Agent workflow per phase

1. Read relevant docs.
2. Inspect current code.
3. Identify dependencies.
4. Implement smallest coherent slice.
5. Test.
6. Review authorization.
7. Review UX states.
8. Update docs when behavior changes.
