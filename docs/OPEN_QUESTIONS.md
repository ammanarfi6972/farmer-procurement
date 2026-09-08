# Open Questions

All initial open questions have been resolved and documented in `DECISIONS.md`.

## 1. Slot Capacity Model
**Status:** RESOLVED.
**Decision:** Use Option 1 (Maximum bookings per slot). Count-based capacity enforced by the backend. The model remains extensible for future volume/load limits.

## 2. Quality-Based Pricing
**Status:** RESOLVED.
**Decision:** Use Option 1 (Pass/Fail). The quality check determines the accepted/rejected outcome. Accepted produce uses the applicable flat commodity price. The data model remains extensible for future quality tiers.

## 3. Demo Control Panel for State Transitions
**Status:** RESOLVED.
**Decision:** Use Option 2 (Dedicated Demo Control Panel). A protected Super Admin-only demo interface will be created to manually advance mocked external states (payment `INITIATED`, `PROCESSING`, `CREDITED`, and SMS events) during SIH judging, keeping the core farmer/staff UI free of "fake" buttons.
