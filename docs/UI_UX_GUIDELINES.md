# UI/UX Guidelines

## Design goal

Premium modern product design with government-grade clarity.

Reference qualities:

- Linear: information hierarchy;
- Stripe: operational dashboards;
- Apple: spacing and clarity;
- Vercel: restrained visual language.

Do not copy brand assets or proprietary UI exactly.

## UX priorities

1. clarity;
2. speed;
3. trust;
4. accessibility;
5. low cognitive load;
6. mobile readiness.

## Farmer UX

The farmer interface should prioritize:

- current appointment;
- token;
- queue position;
- estimated wait;
- centre address/map;
- procurement status;
- payment status.

Use plain language.

Example:

**“You are 7th in the queue”**

rather than:

**“Queue rank = 7.”**

## Staff UX

Optimize for fast repeated operations:

- keyboard-friendly;
- large touch targets;
- fast search;
- minimal modal chaining;
- one-screen queue state;
- clear primary action.

## Manager/Admin UX

Use:

- summary cards;
- trend charts;
- tables;
- filters;
- drill-down;
- exceptions.

Avoid dashboard decoration that does not support a decision.

## Status semantics

Status must always have:

- text;
- optional icon;
- appropriate visual treatment;
- accessible meaning.

Never rely only on color.

## Mobile

Farmer layout should be designed mobile-first.

Critical information should remain visible without deep navigation.

## Loading

Use skeletons for larger page regions.

Use inline pending states for mutations.

## Empty states

Every major list needs a useful empty state.

Example:

> No upcoming procurement appointments.
> Book a slot to get started.

## Errors

Error messages should answer:

1. what happened;
2. what the user can do next.

## Confirmation

Use confirmation for:

- cancellation;
- important configuration changes;
- skipping queue entries;
- status overrides.
