# Maps and Geolocation

## Requirement

The product uses full map, route/navigation, and centre availability capabilities.

## Recommended provider

Use **Google Maps Platform** for the SIH prototype, behind a small adapter layer.

Planned capabilities:

- interactive map;
- centre markers;
- centre availability indicators;
- geocoding/address handling;
- place details where needed;
- route calculation/navigation hand-off.

## Architecture

Do not spread Google Maps calls across components.

Create a map abstraction such as:

`lib/maps/`

with provider-specific implementation:

`lib/maps/google/`

This makes future provider replacement easier.

## Security

- Map/browser key may be client-visible according to provider design, but restrict it by domain/API.
- Never ship unrestricted keys.
- Server-side secrets stay server-side.
- Keep enabled APIs minimal.

## Route experience

Farmer:

`Current location → selected procurement centre`

Show:

- approximate distance;
- ETA;
- route;
- open navigation action.

## Centre discovery

Each centre can show:

- name;
- address;
- operational state;
- available slots;
- queue estimate;
- operating hours.

## Location permissions

Location is optional.

If permission is denied:

- allow manual search;
- allow map pan/search;
- never block the entire farmer experience.

## Demo fallback

The seeded demo dataset must contain valid centre latitude/longitude so maps work without relying on live place search.

## Provider documentation

Current Google Maps JavaScript documentation describes Maps, Places and Routes capabilities. See the official Google Maps Platform documentation before implementation.
