# Analytics

## Centre KPIs

- scheduled farmers;
- checked-in farmers;
- waiting;
- processing;
- completed;
- no-show;
- cancelled;
- average wait;
- median wait;
- average service time;
- throughput;
- capacity utilization;
- total accepted quantity;
- total procurement value;
- pending payment value.

## Queue metrics

- current queue length;
- peak queue length;
- average wait;
- 90th percentile wait (when sample size is sufficient);
- active counters;
- throughput per counter.

## Admin metrics

Cross-centre:

- centre utilization;
- overloaded centres;
- low-throughput centres;
- bookings by commodity;
- procurement volume;
- payment pipeline.

## Design

Start with database queries that are easy to understand.

For heavy aggregation, use database views/functions/materialized strategies when justified.

Do not precompute everything prematurely.

## Dashboard freshness

Realtime operational indicators may update live.

Historical analytics can be query-based and need not update every second.

## Integrity

Every KPI should have a documented definition.

Example:

**Average wait time** = average of actual check-in-to-service-start duration for eligible completed samples in the selected period.

Do not label a metric unless the calculation is defined.
