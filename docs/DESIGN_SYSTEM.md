# Design System

## Visual direction

Premium, restrained, accessible, trustworthy.

## Typography

Use a modern sans-serif stack with excellent Devanagari/regional-language fallback when multilingual fonts are used.

Recommended structure:

- Display: strong but not oversized
- Heading: semibold
- Body: regular
- Supporting: medium/small

## Color system

Define semantic tokens rather than scattering hex values.

Core semantic roles:

- `background`
- `surface`
- `surface-muted`
- `text`
- `text-muted`
- `border`
- `primary`
- `success`
- `warning`
- `danger`
- `info`

The exact palette should be centralized in theme tokens.

## Spacing

Use a consistent spacing scale.

Do not invent one-off margins for every component.

## Radius

Use moderate rounding.

Avoid excessive “pill everything” styling.

## Components

Create reusable components for:

- buttons;
- inputs;
- OTP input;
- selects;
- date/slot picker;
- cards;
- status badges;
- tables;
- charts;
- map cards;
- queue ticker;
- timelines;
- alerts;
- dialogs;
- toast;
- command/search controls.

## Motion

Use subtle motion only when it communicates:

- transition;
- success;
- realtime update;
- loading.

Respect reduced-motion preferences.

## Icons

Use one consistent icon library, such as Lucide.

Avoid emoji as primary UI icons.

## Responsive breakpoints

Define a consistent responsive scale and use layout primitives instead of page-specific hacks.

## Accessibility

Target WCAG-aligned practices:

- visible focus;
- semantic HTML;
- keyboard navigation;
- labels;
- ARIA only when needed;
- contrast;
- screen-reader-friendly statuses.
