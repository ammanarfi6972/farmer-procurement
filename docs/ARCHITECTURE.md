# System Architecture

## High-level

```text
                       ┌───────────────────────────┐
                       │       Next.js PWA         │
                       │                           │
                       │ Farmer / Staff / Manager  │
                       │ District / Super Admin   │
                       └─────────────┬─────────────┘
                                     │
                       Server Routes / Actions
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          ▼                          ▼                          ▼
      Auth Layer                Domain Layer                 Maps Adapter
          │                          │                          │
          ▼                          ▼                          ▼
    Supabase Auth          Booking / Queue / Pricing     Google Maps
                                     │
                                     ▼
                              PostgreSQL / RLS
                                     │
                           ┌─────────┴─────────┐
                           ▼                   ▼
                      Realtime             Storage
```

## Domain modules

### Identity

Authentication, roles, profiles, assignments.

### Geography

State/district/centre hierarchy.

### Scheduling

Slots, capacity, bookings.

### Queue

Check-in, token, active queue, ETA.

### Procurement

Quality, quantity, pricing, settlement.

### Payments

Mock lifecycle.

### Notifications

SMS-shaped mock event pipeline.

### Analytics

Operational and historical aggregations.

### Configuration

Commodities, prices, schedules, languages, centres.

## Data ownership

Domain rules should be implemented once.

Avoid duplicating business logic in:

- frontend;
- server action;
- database trigger;

unless duplication is intentional for defense-in-depth.

## Realtime

Realtime should communicate meaningful state changes.

Do not stream entire dashboards when a small event will do.

## Transactions

Use database transactions/functions for operations that must be atomic.

Examples:

- allocate slot;
- reschedule;
- advance queue;
- complete procurement;
- payment state transition.

## Failure handling

All asynchronous-looking features should have a visible failure state.

Examples:

- realtime disconnected;
- SMS mock failed;
- Maps unavailable;
- database request failed.

The user should still understand what is known and what to retry.
