# Seed Data

## Purpose

The prototype must look real enough for judging without using personal or official sensitive data.

All data is synthetic.

## Recommended demo scale

- 3 states
- 6 districts
- 12 procurement centres
- 4–6 commodities
- 50–100 farmers
- 100–200 bookings
- 50+ queue events
- 50+ procurement records
- 50+ payment records
- notification history

## Geographic demo strategy

Seed at least:

- one high-load centre;
- one medium-load centre;
- one low-load centre.

This makes centre recommendation and analytics visually meaningful.

## Commodity examples

Use synthetic/configurable examples such as:

- Paddy
- Wheat
- Maize
- Pulses

Do not present seeded prices as current official MSP.

## Centre scenarios

### Centre Alpha — Busy

- high booking volume;
- 2 active counters;
- elevated queue.

### Centre Beta — Balanced

- medium booking volume;
- 4 active counters;
- moderate wait.

### Centre Gamma — Available

- low booking volume;
- 3 active counters;
- short wait.

## Farmer scenarios

Include:

- upcoming booking;
- checked-in farmer;
- waiting farmer;
- processing farmer;
- completed procurement;
- payment pending;
- payment credited;
- cancelled booking;
- no-show.

## Demo users

Create role-based synthetic accounts for:

- farmer;
- centre staff;
- centre manager;
- district admin;
- super admin.

Never ship real passwords in source code. Provide local/dev seed instructions through environment variables or secure development configuration.
