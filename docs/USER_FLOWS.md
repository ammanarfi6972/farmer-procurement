# User Flows

## Farmer happy path

```text
Landing
  ↓
Mobile OTP
  ↓
Farmer profile
  ↓
Choose commodity
  ↓
Find procurement centre
  ↓
View map + availability
  ↓
Choose date/slot
  ↓
Confirm booking
  ↓
Booking/token created
  ↓
Reminder SMS mock
  ↓
Arrive at centre
  ↓
Check-in
  ↓
Live queue
  ↓
Queue approaches
  ↓
Procurement processing
  ↓
Procurement completed
  ↓
Bill/settlement record
  ↓
Payment status
  ↓
Completion notification
```

## Staff flow

```text
Staff login
  ↓
Centre dashboard
  ↓
Today's bookings
  ↓
Search/select farmer
  ↓
Check-in
  ↓
Queue insertion
  ↓
Call next
  ↓
Record simplified procurement
  ↓
Complete transaction
  ↓
Trigger status updates
```

## Manager flow

```text
Manager login
  ↓
Centre overview
  ↓
Live queue + capacity
  ↓
Exceptions
  ↓
Throughput/average wait
  ↓
Operational action
  ↓
Review analytics
```

## District/Admin flow

```text
Login
  ↓
Assigned geography dashboard
  ↓
Centre comparison
  ↓
Overload/low-throughput detection
  ↓
Centre drill-down
  ↓
Report/export view
```

## Super Admin flow

```text
Login
  ↓
System dashboard
  ↓
Master data
  ├─ Geography
  ├─ Centres
  ├─ Commodities
  ├─ Pricing
  ├─ Schedules
  ├─ Languages
  └─ User assignments
```

## Core error flows

### Booking conflict

If the slot becomes unavailable before confirmation:

- reject creation;
- show a clear explanation;
- refresh availability;
- suggest alternative slots.

### Queue conflict

Never allow a token to be simultaneously in two active states.

### Network failure

Show:

- current known state;
- last updated time;
- retry;
- avoid duplicate mutation on retry.

### Payment status ambiguity

Never show “credited” unless the mocked settlement state explicitly indicates credited.
