# SIH Demo Script

## Demo story

Use one synthetic farmer journey and show the operational side at the same time.

### Act 1 — Farmer

1. Farmer logs in with OTP.
2. Farmer opens dashboard.
3. Farmer selects commodity and expected quantity.
4. Farmer opens “Find Centre”.
5. Map shows nearby centres with availability.
6. System recommends a centre with a lower estimated wait.
7. Farmer selects date and slot.
8. Booking/token is confirmed.
9. Farmer sees appointment and live queue card.

### Act 2 — Staff

10. Switch to Centre Staff.
11. Staff sees today's schedule.
12. Farmer checks in.
13. Farmer enters queue.
14. Staff advances queue.
15. Farmer-side screen updates in realtime.
16. Staff opens procurement record.
17. Staff enters accepted quantity and quality outcome.
18. Procurement completes.
19. Bill/settlement appears.

### Act 3 — Payment

20. Show payment lifecycle.
21. Trigger mock `INITIATED`.
22. Trigger mock `PROCESSING`.
23. Trigger mock `CREDITED`.
24. Farmer dashboard updates.
25. SMS mock notification appears in notification history.

### Act 4 — Manager/Admin

26. Switch to Centre Manager.
27. Show live queue and capacity.
28. Show average wait/service metrics.
29. Show a busy vs balanced centre.
30. Switch to District/Admin.
31. Compare centres.
32. Show overload indicator and procurement/payment summary.

## Judging message

The core statement:

> “We are not replacing procurement. We are coordinating farmer arrivals and centre operations in real time, reducing uncertainty before the farmer travels and reducing uncontrolled physical waiting once the farmer arrives.”

## Demo discipline

Do not spend demo time on:

- code;
- package versions;
- generic CRUD screens;
- AI buzzwords;
- fake government integrations.

Show:

- the farmer;
- the queue;
- the ETA;
- the centre;
- the procurement lifecycle;
- the measurable operational value.
