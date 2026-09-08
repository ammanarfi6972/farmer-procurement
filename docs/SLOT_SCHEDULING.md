# Slot Scheduling

## Objective

Spread expected arrivals across centre capacity rather than letting all farmers arrive simultaneously.

## Slot model

A slot has:

- centre;
- date;
- start time;
- end time;
- booking capacity;
- active/inactive state.

Optional capacity dimensions for future extensibility:

- maximum expected quantity;
- processing load.

**SIH MVP Rule:** Capacity is strictly count-based (maximum bookings per slot). Backend/database enforcement is authoritative.

## Allocation logic

When a farmer selects a date:

1. load active slots;
2. remove slots outside booking window;
3. remove full/inactive slots;
4. calculate remaining capacity;
5. optionally rank slots by estimated queue/throughput;
6. let farmer choose;
7. reserve slot transactionally.

## Smart recommendation

The recommendation can use:

- queue size;
- predicted/estimated wait;
- slot availability;
- centre distance;
- centre status;
- operating hours.

This is a deterministic ranking function.

## Reschedule rule

Rescheduling must:

- verify current booking ownership;
- lock/recheck destination slot;
- atomically release and allocate;
- write audit/history.

## Cancellation

Cancellation should:

- change booking status;
- release capacity;
- create audit record;
- optionally trigger notification.

## No-show release

After configured grace time:

- booking may become `NO_SHOW`;
- slot capacity can be released;
- optional waitlisted farmer notification can be triggered.

## Anti-overbooking

Backend/database constraints are authoritative.

Frontend availability is only advisory.
