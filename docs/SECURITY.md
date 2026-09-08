# Security and Privacy

## Principles

- least privilege;
- deny by default;
- validate at the server;
- protect secrets;
- minimize personal data;
- audit privileged actions.

## Authentication

Farmer:

`mobile → OTP → authenticated session`

Officials:

credential-based authentication through the chosen auth provider.

## Authorization

Authorization must be enforced:

1. at route/server layer;
2. at database/RLS layer where applicable.

UI hiding is not authorization.

## Data boundaries

### Farmer

Only own private data.

### Staff

Only operational data for assigned centre.

### Manager

Only assigned centre(s).

### District/Admin

Only authorized geography.

### Super Admin

System-wide administrative scope.

## Sensitive fields

Avoid storing more personal information than necessary for the prototype.

Do not store:

- real Aadhaar numbers;
- actual bank credentials;
- real payment credentials.

Use synthetic data.

## Secrets

Never commit:

- service role keys;
- OTP provider credentials;
- Maps restricted secrets;
- database passwords.

Use environment variables.

## RLS

Enable RLS on exposed Supabase tables and explicitly test the policies.

## Audit

Privileged configuration and operational corrections must be auditable.

## Threats to test

- unauthorized booking access;
- IDOR/resource guessing;
- role escalation;
- cross-centre access;
- duplicate booking;
- duplicate payment transition;
- forged notification event;
- client-side price manipulation;
- queue manipulation.

## Production-hardening note

The SIH prototype is not a production government deployment. Treat security architecture as production-oriented, but clearly label mock/demo integrations.
