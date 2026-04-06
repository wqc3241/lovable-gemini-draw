

## Plan: Fix Pricing Page Colors & Inline Pricing Actions

### What changes

**1. Pricing page (`src/pages/Pricing.tsx`) — match home page design system**

The pricing page uses some styling that doesn't align with the home page's "Pristine Curator" system:
- Plan cards use `border-0` inconsistently and lack the tonal layering from the home page
- The Pro card uses `bg-surface-high shadow-glow ring-1 ring-primary/30` which differs from the home page's `border-primary shadow-lg shadow-primary/10`
- Will unify card styling, badge styling, and button variants to match the home page pricing section exactly

**2. Home page pricing buttons — open checkout directly instead of redirecting**

Currently, clicking "Upgrade to Pro" or "Upgrade to Premium" on the home page wraps buttons in `<Link to="/pricing">`. Instead:
- Replace the `<Link>` wrapper with direct `handleCheckout` calls (same logic as the Pricing page)
- For unauthenticated users, open the auth dialog instead of navigating away
- The "Get Started" button on the Free plan will scroll to the top / focus the prompt input
- Keep the footer "Pricing" link as-is (it's a navigation link, not an action button)

### Technical details

**`src/pages/Pricing.tsx`** — Update card classes to match home page pattern:
- Cards: use `border border-border` for non-accent, `border-primary shadow-lg shadow-primary/10` for accent (Pro)
- Remove `bg-surface-high` usage, use `bg-card` consistently
- Badge: use inline `<span>` with rounded-full styling matching home page
- Ensure consistent font sizing and spacing

**`src/pages/Index.tsx`** — In the pricing section (~lines 1388-1392):
- Remove `<Link to="/pricing">` wrapper
- Add `handleCheckout` function (invoke `create-checkout` edge function, same as Pricing page)
- For unauthenticated users, open `authDialogOpen` instead
- For "Free" plan button, scroll to top with `window.scrollTo(0, 0)`
- Add loading state for checkout buttons

