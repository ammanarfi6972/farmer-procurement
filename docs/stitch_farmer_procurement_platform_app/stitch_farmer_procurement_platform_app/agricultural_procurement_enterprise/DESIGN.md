---
name: Agricultural Procurement Enterprise
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#404945'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#707975'
  outline-variant: '#bfc9c3'
  surface-tint: '#316858'
  primary: '#00362a'
  on-primary: '#ffffff'
  primary-container: '#134e3f'
  on-primary-container: '#86beab'
  inverse-primary: '#99d2be'
  secondary: '#1b6d24'
  on-secondary: '#ffffff'
  secondary-container: '#a0f399'
  on-secondary-container: '#217128'
  tertiary: '#203500'
  on-tertiary: '#ffffff'
  tertiary-container: '#314d00'
  on-tertiary-container: '#85c505'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b5efda'
  primary-fixed-dim: '#99d2be'
  on-primary-fixed: '#002018'
  on-primary-fixed-variant: '#155041'
  secondary-fixed: '#a3f69c'
  secondary-fixed-dim: '#88d982'
  on-secondary-fixed: '#002204'
  on-secondary-fixed-variant: '#005312'
  tertiary-fixed: '#b2f746'
  tertiary-fixed-dim: '#98da27'
  on-tertiary-fixed: '#121f00'
  on-tertiary-fixed-variant: '#334f00'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.005em
  title-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.015em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  spacing-4xs: 0.125rem
  spacing-3xs: 0.25rem
  spacing-2xs: 0.375rem
  spacing-xs: 0.5rem
  spacing-sm: 0.75rem
  spacing-md: 1rem
  spacing-lg: 1.5rem
  spacing-xl: 2rem
  spacing-2xl: 2.5rem
  spacing-3xl: 3rem
  touch-target-min: 3rem
  screen-padding-mobile: 1rem
  screen-padding-tablet: 1.5rem
  screen-padding-desktop: 2rem
---

## Brand & Style
The design system establishes a high-trust, institutional-grade digital infrastructure for agricultural procurement, crop trade settlements, and depot yard operations. Rejecting folksy tropes, burlap textures, and decorative foliage motifs, it communicates operational clarity, institutional solvency, and speed. The visual tone aligns with modern financial logistics and industrial enterprise platforms: balanced, structured, ergonomic, and quiet.

The personality blends fintech accountability with real-world yard logistics. It balances high-velocity field utility (high visibility under direct sunlight, minimum 48dp physical touch bounds) with executive analytical precision (clear transactional ledgering, audit trails, and status telemetry).

## Colors
The palette leverages Material 3 tonal surface architecture to achieve clarity across bright daylight and terminal operations:

- **Primary (`#134E3F`)**: Deep Forest Emerald anchor. Employed for primary actions, critical state focal points, and dominant structural navigation. Represents institutional strength and settlement security.
- **Secondary (`#2E7D32`)**: Mid-tone balanced botanical green. Utilized for secondary action tiers, verified status chips, and functional operational indicators.
- **Tertiary / Accent (`#A3E635`)**: High-luminance energetic lime. Reserved strictly for tactical alerts, real-time yard callouts, active focus indicators, and fast-action accelerators. Used sparingly to preserve contrast.
- **Neutral & Surfaces**:
  - `surface`: `#F8FAF8` (warm neutral base layer, prevents blinding white washouts outdoors).
  - `surface-container-lowest`: `#FFFFFF` (pure white for high-priority elevated ledger cards).
  - `surface-container`: `#F0F4F1` (subtle structural separation).
  - `surface-container-high`: `#E5EBE6` (dividers and inactive backgrounds).
  - `on-surface`: `#111827` (high-contrast near-black slate for authoritative legibility).
  - `outline`: `#D1DDD5` (low-contrast ghost boundaries).
  - `outline-variant`: `#E2EAE4` (card hairpins and quiet separators).
- **Domain Status Tokens**:
  - `status-active` / `depart-now`: `#15803D` (emerald positive) with `#DCFCE7` container.
  - `status-warning` / `queue-caution`: `#B45309` (amber urgency) with `#FEF3C7` container.
  - `status-in-progress`: `#0369A1` (cerulean processing) with `#E0F2FE` container.

## Typography
The system couples Plus Jakarta Sans for structural clarity in titles and high-scale metrics with Inter for information density in tables, forms, and settlement ledgers.

Tabular numerals (`font-feature-settings: 'tnum' on, 'cv05' on`) must be enabled on all numerical representations, gross tonnage metrics, lot volumes, and currency values to prevent layout shudder during real-time updates. All title and label styles enforce rigorous optical height balancing against 48dp touch centers.

## Layout & Spacing
Built primarily around an Android mobile-first viewport, the system utilizes an 8dp fundamental grid with a 4dp micro-step for alignment. 

- **Mobile (< 600dp)**: 4-column fluid layout with 16dp outer screen margin and 12dp gutters. All primary action components conform to strict minimum 48dp x 48dp tactile hit regions regardless of visual footprint.
- **Tablet (600dp - 840dp)**: 8-column layout with 24dp margins and 16dp gutters. Dual-pane inspection flows for weighbridge tickets and warehouse receipt lists.
- **Desktop / Yard Command (> 840dp)**: 12-column layout capped at 1440dp max content frame. 24dp gutters for high-density logistics tables and spatial depot tracking.

## Elevation & Depth
Depth hierarchy is achieved through Material 3 tonal layering paired with soft, color-tinted ambient occlusion shadows rather than stark drop-shadows.

- **Level 0 (Flat Surface)**: `surface` (`#F8FAF8`), no shadow, 0dp elevation. Base application viewport.
- **Level 1 (Card & Content Blocks)**: `surface-container-lowest` (`#FFFFFF`), bounded by a 1px border of `outline-variant` (`#E2EAE4`). Shadow: `0px 1px 3px 0px rgba(19, 78, 63, 0.05)`.
- **Level 2 (Active/Hovered Yard Cards, Bottom Sheets)**: `surface-container-lowest` (`#FFFFFF`). Shadow: `0px 4px 12px -2px rgba(19, 78, 63, 0.08), 0px 2px 4px -1px rgba(19, 78, 63, 0.04)`.
- **Level 3 (Floating Action Bars, Dialogs, Dropdowns)**: Shadow: `0px 12px 24px -4px rgba(19, 78, 63, 0.12), 0px 4px 8px -2px rgba(19, 78, 63, 0.06)`.

## Shapes
The shape language implements modern Material 3 curvature standards, applying high-radius geometries that feel comfortable to interact with on touch interfaces without appearing child-oriented:

- **Cards & Surface Modules**: 16px radius for standard transaction/lot cards; 24px radius for hero summaries and elevated transit cards.
- **Input Fields & Text Boxes**: 12px radius for soft, controlled ergonomics.
- **Buttons & Tactical Chips**: 12px for regular interactive surfaces; full pill (`9999px`) reserved specifically for status badges, filter chips, and primary floating action buttons (FABs).
- **Bottom Sheets & Modal Surfaces**: 28px top radii for modern bottom sheet ergonomics.

## Components

### Buttons
- **Primary Button**: Solid fill with `primary` (`#134E3F`), text/icon in `#FFFFFF`. Height: 52px (exceeds the 48dp minimum for thumb-reach). Border-radius: 12px. Active state applies a 12% white overlay.
- **Secondary Button**: Outlined button with 1.5px border of `primary` (`#134E3F`), text in `#134E3F`, surface transparent.
- **Tertiary / Express Button**: Accent fill using `tertiary` (`#A3E635`), text in `#111827`. Used exclusively for critical real-time triggers like "Weigh-in Confirm" or "Accept Bid".

### Status Badges & Trust Seals
- **Pill Geometry**: Fully rounded with a height of 28px, horizontal padding of 12px, font set to `label-md`.
- **Verified Settlement Seal**: Primary emerald tone `#134E3F` background, `#A3E635` border highlight, accompanied by a verified check icon.
- **State Indicators**:
  - *Depart Now / Ready*: `#DCFCE7` container, `#15803D` text/icon.
  - *Low Wait*: `#ECFDF5` container, `#047857` text/icon.
  - *In Progress / Assay Pending*: `#E0F2FE` container, `#0369A1` text/icon.
  - *Delay / Queue Halt*: `#FEF3C7` container, `#B45309` text/icon.

### Cards & Procurement Units
- Base cards use `surface-container-lowest` (`#FFFFFF`) with a 16px corner radius and a 1px `#E2EAE4` stroke.
- **Lot / Batch Card**: Includes top metadata cluster (Lot ID, Moisture Content, Grade), central bold figure for Net Tonnage in tabular figures, and a lower transactional tray pinned with 48dp min action buttons.

### Form Inputs & Selectors
- **Container**: Height of 56px with 12px corner radius. Filled style with `#F0F4F1` background transitioning to pure white on focus with a 2px `#134E3F` primary outline.
- **Floating Labels**: Inactive state in `body-md` (`#4B5563`), transitioning to `label-sm` (`#134E3F`) on active input.

### Selection Controls
- **Checkboxes & Radios**: 24dp interactive element centered in a 48dp target bounding box. Primary fill `#134E3F` with white mark.
- **Filter Chips**: 36px height, rounded-full, `#F0F4F1` background, `#111827` text. Selected state changes to `#134E3F` with `#FFFFFF` text.