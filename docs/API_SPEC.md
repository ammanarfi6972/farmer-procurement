# API Specification

## API style

Use Next.js server-side route handlers and/or server actions for mutations, with typed validation.

Keep domain logic outside UI components.

## Endpoint groups

### Auth

- `POST /api/auth/otp/request`
- `POST /api/auth/otp/verify`
- official credential login through the chosen auth mechanism

### Farmer

- `GET /api/farmer/profile`
- `PATCH /api/farmer/profile`
- `GET /api/farmer/bookings`
- `POST /api/farmer/bookings`
- `POST /api/farmer/bookings/:id/cancel`
- `POST /api/farmer/bookings/:id/reschedule`
- `GET /api/farmer/queue/:bookingId`
- `GET /api/farmer/procurements`
- `GET /api/farmer/payments`
- `GET /api/farmer/notifications`

### Centres

- `GET /api/centres`
- `GET /api/centres/:id`
- `GET /api/centres/:id/availability`
- `GET /api/centres/:id/queue`
- `GET /api/centres/:id/metrics`

### Staff

- `POST /api/staff/check-in`
- `POST /api/staff/queue/call-next`
- `POST /api/staff/queue/skip`
- `POST /api/staff/procurement`
- `POST /api/staff/payment/mock-transition`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/centres`
- `POST /api/admin/centres`
- `PATCH /api/admin/centres/:id`
- CRUD for commodities
- CRUD/versioning for pricing
- schedule/capacity configuration
- user/staff assignments
- audit logs

## Validation

Every mutation validates with a shared schema approach.

Examples:

- quantity > 0;
- slot belongs to centre;
- commodity is active;
- effective price exists for procurement completion;
- actor has authorization;
- booking belongs to farmer for farmer-originated actions.

## Error format

Use a consistent response envelope:

```json
{
  "error": {
    "code": "SLOT_UNAVAILABLE",
    "message": "That slot is no longer available.",
    "details": null
  }
}
```

Never expose stack traces to clients.

## Idempotency

Mutation endpoints that can be retried should be designed to avoid duplicates.

Examples:

- booking creation;
- payment mock transition;
- notification dispatch.

## Realtime channels

Suggested logical topics:

- centre queue;
- booking status;
- centre availability;
- admin centre metrics.

Realtime authorization must follow role/scope rules.
