# Requirements

## Functional requirements

### FR-01 Identity and access

- Farmers sign in using mobile number + OTP.
- Officials use credential-based authentication.
- Access is controlled by role.
- Role changes are administrative and auditable.

### FR-02 Farmer profile

A farmer can manage:

- name;
- mobile number;
- address;
- state/district/sub-district/village;
- preferred language;
- farmer identifier used by the prototype;
- commodity/crop details;
- bank/payment-display metadata needed for status tracking.

Use mock identity data. Never collect or claim to validate real Aadhaar data in the SIH prototype.

### FR-03 Centre discovery

The farmer can:

- search by name/location;
- view centres on a map;
- see centre status;
- see operating hours;
- see available slots;
- see approximate queue/wait;
- open route/navigation.

### FR-04 Booking

A farmer can:

- select commodity;
- enter expected quantity;
- choose a centre;
- choose an available date;
- choose a slot;
- confirm booking;
- receive a unique booking/token number;
- cancel/reschedule according to business rules.

### FR-05 Queue

The system must support:

- queue order;
- current serving token;
- farmer position;
- number ahead;
- active counters;
- estimated waiting time;
- queue state transitions;
- staff actions;
- realtime update for relevant screens.

### FR-06 Check-in

Centre staff can:

- find the booking;
- verify demo farmer details;
- mark arrival/check-in;
- move the farmer into the operational queue.

### FR-07 Procurement

For the prototype, procurement is simplified but must support:

- accepted quantity;
- rejected quantity where applicable;
- quality result as a configurable/simple status;
- applicable commodity price/MSP reference;
- calculated procurement value;
- completion timestamp;
- staff identity;
- notes.

### FR-08 Billing and payment status

The system can create a procurement settlement record and show payment lifecycle such as:

`Pending → Initiated → Processing → Credited`

Payment is mocked. No real transfer occurs.

### FR-09 Notifications

Notifications are SMS-shaped mock events.

Examples:

- booking confirmed;
- appointment reminder;
- queue approaching;
- procurement completed;
- payment initiated;
- payment credited.

The product should store notification history.

### FR-10 Centre operations

Centre staff/manager can:

- view today's schedule;
- view live queue;
- check in farmers;
- advance queue;
- process procurement;
- correct eligible records with audit reason;
- see throughput/capacity indicators.

### FR-11 Centre manager analytics

Manager can see:

- scheduled;
- arrived;
- waiting;
- processing;
- completed;
- no-show;
- average wait;
- average service time;
- capacity utilization;
- procurement quantity/value;
- payment pipeline.

### FR-12 District/Admin

District/Admin Officer can:

- view centres in assigned geography;
- compare centre performance;
- view demand and queue health;
- view procurement/payment summaries;
- inspect exceptions.

### FR-13 Super Admin

Super Admin can configure:

- states/districts/centres;
- commodities;
- pricing/MSP records;
- operating hours;
- slot windows;
- centre capacity;
- staff assignments;
- supported languages;
- system settings.

### FR-14 Auditability

Important mutations must record:

- actor;
- role;
- timestamp;
- entity;
- action;
- old value where practical;
- new value where practical;
- reason where required.

## Non-functional requirements

### NFR-01 Performance

- Fast initial load on mobile.
- Avoid unnecessary client-side JavaScript.
- Paginate large lists.
- Debounce search.
- Do not refetch entire dashboards for every small update.

### NFR-02 Reliability

- All important state transitions must be transactional.
- Prevent duplicate bookings.
- Prevent two farmers from receiving the same slot.
- Prevent invalid queue transitions.

### NFR-03 Security

- Enforce authorization at database/backend level.
- Never rely solely on hidden UI.
- Use row-level access control.
- Validate all inputs server-side.
- Do not expose privileged credentials in the browser.

### NFR-04 Accessibility

- Keyboard accessible for staff/admin.
- Clear focus states.
- Adequate contrast.
- Touch-friendly controls.
- Simple wording.
- Error messages that explain what to do next.

### NFR-05 Localization

- Never hard-code user-facing copy in logic.
- Locale-aware formatting.
- Language selection stored per eligible user.
- Prototype can start with English plus a configurable translation structure.

### NFR-06 PWA

- Installable.
- App shell caching.
- Offline page.
- Basic resilience when network drops.
- Never claim critical data is safely writable offline unless conflict handling exists.

### NFR-07 Observability

- Structured error logging.
- Server-side logs.
- Useful user-visible error states.
- Production errors should be distinguishable from expected validation errors.
