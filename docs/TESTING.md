# Testing Strategy

## Test pyramid

### Unit

Test:

- price calculation;
- slot validation;
- booking rules;
- queue ordering;
- ETA formula;
- capacity calculations;
- authorization helpers;
- translation lookup.

### Integration

Test:

- OTP flow with mock provider;
- booking transaction;
- overbooking prevention;
- queue transition;
- procurement completion;
- payment state transition;
- notification creation;
- RLS policies.

### End-to-end

Primary E2E scenario:

```text
Farmer OTP login
→ Register/profile
→ Choose centre
→ Book slot
→ See booking
→ Staff check-in
→ Queue updates
→ Procurement
→ Payment status
→ Farmer sees completion
```

## Critical test cases

### Booking

- slot available;
- slot full;
- race condition;
- cancelled booking;
- rescheduling;
- duplicate request.

### Queue

- first farmer;
- multiple counters;
- skipped farmer;
- completed farmer;
- disconnected client;
- realtime reconnection.

### Pricing

- effective price found;
- expired price;
- future price;
- changed configuration;
- quantity precision.

### Authorization

- farmer cannot access another farmer;
- staff cannot access unrelated centre;
- manager cannot access unrelated centre;
- district admin cannot access unrelated district;
- super admin can configure.

## E2E demo seed

Keep one deterministic “golden demo” dataset so every team member can reproduce the same flow.

## Quality gate

Before a feature is considered complete:

- typecheck passes;
- lint passes;
- unit tests pass;
- relevant integration tests pass;
- E2E critical flow remains green;
- no console errors on affected screens.
