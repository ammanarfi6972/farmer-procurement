# Database Design

## Database

Use **PostgreSQL via Supabase**.

Database naming should be consistent, lower_snake_case.

## Core tables

### Identity and access

- `profiles`
- `roles`
- `user_roles`
- `staff_assignments`

### Geography

- `countries`
- `states`
- `districts`
- `sub_districts`
- `villages`

### Procurement

- `procurement_centres`
- `centre_hours`
- `centre_counters`
- `commodities`
- `commodity_prices`
- `quality_rules` (optional/configurable)

### Scheduling

- `slots`
- `bookings`
- `booking_history`
- `check_ins`

### Queue

- `queue_entries`
- `queue_events`
- `queue_metrics`

### Transactions

- `procurements`
- `procurement_quality`
- `weights` (manual prototype values)
- `settlements`
- `payments`

### Communication

- `notification_templates`
- `notifications`

### Governance

- `audit_logs`
- `system_settings`

## Important relationships

```text
profiles
  └─ farmer profile

procurement_centres
  ├─ centre_hours
  ├─ centre_counters
  └─ slots
       └─ bookings
            └─ check_ins
                 └─ queue_entries
                      └─ procurements
                           ├─ procurement_quality
                           ├─ weights
                           └─ settlements
                                └─ payments
```

## Profiles

Suggested fields:

- `id` UUID, references auth user
- `full_name`
- `mobile`
- `preferred_language`
- `role-independent display fields`
- `state_id`
- `district_id`
- timestamps

Do not duplicate auth secrets in application tables.

## Roles

Represent role separately from profile.

Suggested enum-like values:

- `farmer`
- `centre_staff`
- `centre_manager`
- `district_admin`
- `super_admin`

## Centre

Suggested fields:

- `id`
- `code`
- `name`
- `address`
- `state_id`
- `district_id`
- `latitude`
- `longitude`
- `operational_status`
- `phone`
- `timezone` (India default, but configurable)

## Commodity

Suggested fields:

- `id`
- `code`
- `name`
- `unit`
- `active`

## Commodity price

Suggested fields:

- `id`
- `commodity_id`
- `price_per_unit`
- `currency`
- `effective_from`
- `effective_to`
- `source_label`
- `is_demo`

## Booking

Suggested fields:

- `id`
- `booking_number`
- `farmer_id`
- `centre_id`
- `slot_id`
- `commodity_id`
- `expected_quantity`
- `status`
- timestamps

Unique business constraint should prevent the same slot from exceeding its capacity.

## Queue entry

Suggested fields:

- `id`
- `booking_id`
- `centre_id`
- `service_date`
- `token_number`
- `status`
- `queue_position` (optional cached field)
- `checked_in_at`
- `called_at`
- `completed_at`

Prefer deriving position from active ordering rather than trusting a manually mutable integer.

## Procurement

Suggested fields:

- `id`
- `booking_id`
- `staff_id`
- `commodity_id`
- `expected_quantity`
- `accepted_quantity`
- `rejected_quantity`
- `unit_price`
- `total_value`
- `status`
- timestamps
- `is_demo`

## Payment

Suggested fields:

- `id`
- `settlement_id`
- `status`
- `amount`
- `reference`
- `initiated_at`
- `credited_at`
- `is_mock`

## Notification

Suggested fields:

- `id`
- `recipient_profile_id`
- `channel`
- `template_key`
- `language`
- `payload`
- `status`
- `provider_reference`
- `sent_at`

## Audit

Suggested fields:

- `id`
- `actor_user_id`
- `actor_role`
- `entity_type`
- `entity_id`
- `action`
- `before_json`
- `after_json`
- `reason`
- `created_at`

## Security

RLS must be enabled on exposed tables.

Examples:

- farmer can read/write only own profile and own bookings;
- staff can access operational data for assigned centre(s);
- manager can access own centre;
- district admin can access assigned geography;
- super admin has global administrative scope.

Keep service-role credentials server-only.
