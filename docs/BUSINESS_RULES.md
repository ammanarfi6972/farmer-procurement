# Business Rules

## General

1. Every record has a stable identifier.
2. Database records use timestamps and audit metadata where appropriate.
3. Important status changes are explicit state transitions.
4. Configuration data is not embedded as magic constants.
5. Prices are versioned by effective dates.
6. Prototype data must be clearly identifiable as demo/simulated data.

## Geography

Use configurable hierarchy:

`Country → State → District → Sub-district/Block → Village → Procurement Centre`

India is the default country. Do not hard-code a single state workflow.

## Commodities

A commodity can have:

- code;
- name;
- unit;
- active/inactive;
- optional quality workflow;
- supported price references.

Quantity calculations must use the commodity's configured unit.

## Pricing/MSP

- Price records are managed by authorized admin.
- Each price has an effective start date.
- A price may have an effective end date.
- Booking should not permanently snapshot the price unless the business flow requires it.
- Procurement settlement should store the exact price used at completion.
- Never hard-code a current official MSP amount in application logic.

## Booking

A booking must include:

- farmer;
- centre;
- commodity;
- expected quantity;
- date;
- slot;
- status.

Recommended statuses:

`PENDING → CONFIRMED → CHECKED_IN → IN_QUEUE → PROCESSING → COMPLETED`

Alternate terminal states:

`CANCELLED`, `NO_SHOW`, `REJECTED`

## Double-booking prevention

The backend must enforce uniqueness for the slot allocation model.

Do not rely on frontend checks.

## Rescheduling

- Only eligible bookings can be rescheduled.
- Original slot must be released atomically with new-slot allocation.
- Store reschedule history.

## Check-in

A booking should be check-in eligible only within the configured check-in window, unless staff has an override permission.

## Queue

- Only checked-in eligible bookings enter the active queue.
- A farmer can have at most one active queue entry per centre/day.
- Queue position is derived from operational state, not manually typed.
- Staff can skip a farmer only through a valid transition with reason.

## ETA

ETA is an estimate.

Required data inputs may include:

- active counters;
- current waiting count;
- queue order;
- rolling service time;
- recent throughput;
- expected processing complexity;
- centre capacity.

Do not claim ETA is exact.

## Slot scheduling

Slots should be capacity-aware.

The MVP uses a strictly count-based slot capacity model (maximum bookings per slot).
Backend constraints enforce this capacity. Other dimensions (like processing load) are deferred for the MVP.

## Procurement

The simplified prototype can use:

`CHECKED_IN → PROCESSING → QUALITY_RECORDED → WEIGHED → COMPLETED`

A transaction stores:

- expected quantity;
- accepted quantity;
- rejected quantity if used;
- applied price;
- total value;
- quality result;
- completion time.

## Payment

Prototype state machine:

`NOT_CREATED → INITIATED → PROCESSING → CREDITED`

Optional terminal state:

`FAILED`

Payment records are simulated and must carry a demo/simulation flag.
A dedicated Super Admin "Demo Control Panel" will be used to artificially advance mock payment states (e.g., INITIATED → PROCESSING → CREDITED) and SMS events during the SIH presentation. These transitions are not exposed in standard staff workflows.

## Notifications

Notifications are asynchronous events conceptually, even if the prototype uses an in-app/mock sender.

Each notification stores:

- recipient;
- channel;
- template/event;
- language;
- status;
- created time;
- simulated provider response.

## Audit

Audit:

- configuration changes;
- role/assignment changes;
- booking changes;
- queue overrides;
- procurement corrections;
- price changes;
- payment-state changes.

## Data deletion

Do not cascade-delete operational records casually. Prefer archive/inactive flags or soft-delete patterns where business history matters.
