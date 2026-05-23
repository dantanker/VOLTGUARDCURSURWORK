# Logo & Header Fix

Front-end-only update to the top banner in `components/voltguard/header.tsx`.

## Changes

| Area | Before | After |
|------|--------|-------|
| **Logo height** | `h-28` (112px) | `h-32` (128px) — ~14% larger |
| **Header row padding** | `py-3 md:py-4` | `py-2` — more compact vertical spacing |
| **Header row height** | `h-auto md:h-auto` | `h-auto` |

## Logo

```tsx
className="h-32 w-auto object-contain"
```

Scaled up by approximately 10–20% using Tailwind `h-` utilities only on the logo `Image` element.

## Banner / header height

```tsx
<div className="flex items-center justify-between h-auto py-2">
```

Reduced padding to restore a compact header bar while the logo renders larger.

## Scope

- **Modified file:** `components/voltguard/header.tsx`
- **Not changed:** colors, layout, nav, CTAs, mobile menu, footer logo, or any other components
