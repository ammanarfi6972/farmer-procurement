# Procurement Workflow

## Purpose

This document defines the prototype's simplified procurement lifecycle.

The prototype is intentionally not a complete representation of every state-specific government procurement procedure.

## State machine

```text
REGISTERED
  ↓
VERIFIED_DEMO
  ↓
BOOKED
  ↓
CHECKED_IN
  ↓
IN_QUEUE
  ↓
PROCESSING
  ↓
QUALITY_RECORDED
  ↓
WEIGHED
  ↓
PROCUREMENT_COMPLETED
  ↓
BILL_GENERATED
  ↓
PAYMENT_INITIATED
  ↓
PAYMENT_PROCESSING
  ↓
PAYMENT_CREDITED
```

## Branches

```text
BOOKED ─────────→ CANCELLED
BOOKED ─────────→ NO_SHOW
PROCESSING ─────→ REJECTED
PAYMENT_PROCESSING → PAYMENT_FAILED
```

## Prototype simplifications

The SIH demo should:

- simulate verification;
- simulate quality assessment;
- simulate weighing through manual form entry;
- calculate value using configured price data;
- simulate payment state changes;
- generate printable/viewable digital receipt;
- show a clear timeline.

The SIH demo should not:

- integrate Aadhaar;
- integrate bank APIs;
- connect to a physical weighing machine;
- make legally binding quality decisions;
- claim official government authorization.

## Centre processing lifecycle

1. Booking appears in centre schedule.
2. Farmer checks in.
3. System assigns/activates queue position.
4. Staff calls next farmer.
5. Status changes to processing.
6. Staff records quantity and quality.
7. System calculates settlement using effective price.
8. Procurement completes.
9. Settlement/bill record is generated.
10. Mock payment status progresses.
11. Farmer receives status notification.

## Exception handling

Examples:

- farmer arrives without valid booking;
- slot expired;
- quantity differs materially from expectation;
- quality not acceptable;
- record correction requested;
- payment mock failure.

Exceptions should be visible to staff/manager and auditable.
