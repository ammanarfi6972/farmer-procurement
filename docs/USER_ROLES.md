# User Roles and Permissions

## Role model

| Role | Primary scope | Main responsibilities |
|---|---|---|
| Farmer | Self | Registration, booking, queue, procurement/payment status |
| Centre Staff | Assigned centre | Check-in, queue, procurement processing |
| Centre Manager | Assigned centre | Operations, exceptions, analytics, staff coordination |
| District/Admin Officer | Assigned district/state scope | Cross-centre monitoring and reporting |
| Super Admin | Entire system | Configuration, master data, access, audit |

## Farmer

Can:

- edit own profile;
- choose preferred language;
- discover centres;
- view availability;
- create/cancel/reschedule own booking;
- view own token and queue;
- view own procurement history;
- view own payment status;
- view own notifications.

Cannot:

- view another farmer's private details;
- alter procurement records;
- change prices;
- alter centre capacity.

## Centre Staff

Can:

- view assigned centre's operational data;
- search today's bookings;
- check in eligible farmers;
- update queue state;
- record simplified procurement;
- trigger allowed notification events;
- view operational history.

Cannot:

- configure MSP globally;
- manage arbitrary centres;
- access unrelated district data;
- change audit history.

## Centre Manager

Can:

- do everything allowed to centre staff where appropriate;
- manage centre schedules/counters within authorized settings;
- inspect exceptions;
- view centre analytics;
- assign/disable operational staff within their scope if configured.

## District/Admin Officer

Can:

- view assigned district/state centres;
- compare centre KPIs;
- view exceptions and trends;
- inspect procurement/payment summaries;
- manage approved operational configurations if granted.

Cannot:

- view unrelated geography outside scope;
- act as Super Admin.

## Super Admin

Can:

- manage global configuration;
- create/disable centres;
- manage commodities;
- maintain pricing records;
- manage roles and assignments;
- inspect system-wide audit logs;
- manage translations/configuration.

## Authorization principle

Use least privilege.

Every request should be evaluated against:

`authenticated user + role + organization scope + resource ownership`

Never implement security solely through route visibility.
