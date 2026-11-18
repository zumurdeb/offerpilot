# OfferPilot Design System

Source of truth for OfferPilot's visual language, approved in Phase 1. This file documents what is implemented in this codebase; the fuller brand rationale (voice, metaphor, why each decision was made) lives in the Phase 1 design-system artifact and is summarized here for engineers working in this repo. **Do not hand-roll new colors, spacing or radii — every value below is already wired into `globals.css` and Tailwind utilities.**

## Brand direction

OfferPilot tells a Shopify merchant whether a promotion made or lost money. The organizing metaphor is flight: a promotion is a flight plan, margin is altitude. This is why the semantic palette is named `climb` / `descent` / `turbulence` rather than generic green/red/amber, and why the dashboard's profit chart plots a dashed breakeven line like an altimeter's sea-level mark.

## Tokens and where they live

All tokens are CSS custom properties defined in [`src/app/globals.css`](src/app/globals.css) (`:root` for light, `.dark` for dark) and exposed as Tailwind utilities via the `@theme inline` block in the same file — so `bg-climb`, `text-descent`, `border-border-default`, `bg-surface-sunken`, `rounded-md`, `shadow-sm`, `font-display`, etc. all resolve to these values. Never write a raw hex or `rgb()` in a component; use the utility or `var(--token-name)`.

### Color

| Token | Role |
|---|---|
| `surface-page` / `surface-sunken` / `surface-card` / `surface-raised` | Elevation steps, lightest to flattest in light mode, darkest to lightest in dark mode |
| `border-subtle` / `border-default` / `border-strong` | Divider → resting control → hover/active control |
| `text-primary` / `text-secondary` / `text-muted` / `text-on-accent` | Text hierarchy |
| `accent-primary` / `accent-primary-hover` / `accent-soft` / `accent-border` | The one brand blue ("Horizon Blue") — all interactive intent: buttons, links, active states, focus rings |
| `beacon` / `beacon-soft` | Secondary brand gold — marketing/pricing emphasis **only**, never used inside the authenticated app |
| `climb` / `climb-soft` | Profitable promotion signal |
| `descent` / `descent-soft` | Loss-making promotion signal (shared value with `destructive`) |
| `turbulence` / `turbulence-soft` | At-risk / thinning-margin warning |
| `sidebar-*` | A constant-dark surface family (`sidebar`, `sidebar-border`, `sidebar-muted`, `sidebar-accent`, `sidebar-accent-foreground`) — the sidebar is always the darkest surface in the shell, in **both** themes, which is why these don't simply alias the inverting surface tokens. This is a necessary, minimal addition made during implementation to realize the already-approved "sidebar is always dark" rule — not a palette change. |

Every color is fully specified for both `light` and `dark` — dark mode is a first-class theme, not an inverted filter.

### Typography

- `font-sans` → IBM Plex Sans — all UI/body text.
- `font-display` → Space Grotesk — headings and marketing display type only.
- `font-mono` → IBM Plex Mono — currency, percentages, order IDs; always paired with `tabular-nums`.

Loaded via `next/font/google` in [`src/app/layout.tsx`](src/app/layout.tsx).

### Spacing

Tailwind's default 4px-based spacing scale is used as-is (`p-6` = 24px, `gap-4` = 16px, …) — it already matches the approved spacing tokens exactly, so no override was needed.

### Radius

`rounded-xs` 4px · `rounded-sm` 6px (buttons, inputs) · `rounded-md` 10px (cards) · `rounded-lg` 16px (modals) · `rounded-xl` 20px (marketing panels) · `rounded-full` (badges, avatars, pills).

### Shadow

`shadow-xs` (resting controls) · `shadow-sm` (resting cards) · `shadow-md` (popovers, dropdowns) · `shadow-lg` (modals) · `shadow-focus` (focus-visible ring, additive).

## Components

Base primitives come from shadcn/ui (`src/components/ui/*`), re-themed to these tokens — `button.tsx` and `badge.tsx` were rewritten with OfferPilot's own variant names (`primary` / `secondary` / `ghost` / `destructive` / `link` for buttons; `neutral` / `climb` / `descent` / `turbulence` / `accent` for badges) rather than shadcn's generic defaults. Composite, app-specific components live in `src/components/shared/*` (`StatCard`, `TrendPill`, `Sparkline`, `ProfitChart`, `StatusBadge`, `PageHeader`, `EmptyState`) and `src/components/layout/*` (`Sidebar`, `Topbar`, `MobileNav`, `QuickSearch`, `NotificationsMenu`, `UserMenu`).

**Rules carried over from Phase 1, worth repeating because they're easy to violate by accident:**
- Never add a colored left-border accent to a card for decoration — status lives in badges/trend pills/figure color.
- `climb` / `descent` / `turbulence` mean profitability only — never reuse them as arbitrary categorical colors.
- Exactly one `primary` button per view/section.
- Every profit/loss indicator pairs color with an icon or word — never color alone.
