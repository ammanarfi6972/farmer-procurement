# Queue Engine

## Goal

Reduce physical waiting by making queue state visible and by producing a useful ETA.

This is deterministic operational intelligence, not AI/ML.

## Inputs

At minimum:

- active queue count;
- farmer position;
- current token;
- active counters;
- rolling average service time;
- recent completed transactions;
- expected processing quantity/complexity where configured;
- centre operating state.

## Baseline ETA

Simple formula:

`ETA = expected_work_before_farmer / effective_parallel_throughput`

Where:

`effective_parallel_throughput = active_counters / average_service_time`

A practical first approximation:

`ETA ≈ (farmers_ahead × rolling_average_service_minutes) / active_counters`

Then improve using workload weighting.

## Workload weighting

If quantity bands are configured:

- small quantity: weight 1.0
- medium quantity: weight 1.2
- large quantity: weight 1.5

These are prototype heuristics and must be configurable, not presented as universal truth.

## Rolling average

Use a bounded recent window, e.g. the last N completed service records, while ignoring obvious outliers.

Store:

- sample count;
- mean service time;
- optional median;
- timestamp of last update.

## Confidence

ETA should display:

- estimated wait;
- last updated timestamp;
- optional confidence band such as `10–20 min`.

Do not display false precision.

## Queue update triggers

Recalculate/publish when:

- farmer checks in;
- farmer enters queue;
- token advances;
- counter opens/closes;
- procurement completes;
- booking is skipped/cancelled;
- relevant processing-time data changes.

## Realtime UX

Use realtime subscription for appropriate queue updates.

Farmer screen should update without full page refresh.

Include:

- `Last updated 12:34 PM`;
- connection state when possible;
- manual refresh fallback.

## Fairness

Default ordering should be first-come-first-served among valid active queue entries.

Any priority lane must be an explicit business rule with role-based authorization and audit logging.

## No AI

Do not introduce:

- machine learning;
- LLM-based ETA;
- AI recommendations;
- black-box ranking.

The innovation is the integration and deterministic optimization.
