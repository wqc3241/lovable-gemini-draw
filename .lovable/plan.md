

## Plan: Add Profile / Account Page

### What it does
A new `/profile` page accessible from the UserMenu dropdown. Shows the user's account info, current usage stats, active plan with upgrade/downgrade options, and add-on purchases — all in one place.

### UI Layout

```text
┌──────────────────────────────────────────────────┐
│  ← Back                               [Avatar]   │
│                                                   │
│  My Account                                       │
│                                                   │
│  ┌──────────────────────────────────────────────┐ │
│  │ Profile                                      │ │
│  │ Name: John Doe              [avatar]         │ │
│  │ Email: john@example.com                      │ │
│  └──────────────────────────────────────────────┘ │
│                                                   │
│  ┌──────────────────────────────────────────────┐ │
│  │ Current Plan: Pro                    $9.99/mo│ │
│  │ Renews: May 6, 2026                          │ │
│  │ Watermark removal: Active / [Add $2/mo]      │ │
│  │                                               │ │
│  │ [Manage Subscription]  [Change Plan]          │ │
│  └──────────────────────────────────────────────┘ │
│                                                   │
│  ┌──────────────────────────────────────────────┐ │
│  │ Today's Usage                                │ │
│  │ Generations: ████████░░  8 / 20              │ │
│  │ Prompts:     ██░░░░░░░░  3 / 20              │ │
│  └──────────────────────────────────────────────┘ │
│                                                   │
│  ┌──────────────────────────────────────────────┐ │
│  │ Quick Actions                                │ │
│  │ [Generation History]  [Pricing]              │ │
│  └──────────────────────────────────────────────┘ │
│                                                   │
│  [Sign Out]                                       │
└──────────────────────────────────────────────────┘
```

### Changes

**1. New file: `src/pages/Profile.tsx`**
- Fetch user session, profile (display_name, avatar_url), user_credits (daily usage, watermark status), and subscription info via `check-subscription` and `check-credits` (action: "check")
- **Profile card**: avatar, name, email
- **Plan card**: current plan name, price, renewal date, watermark add-on status with "Add" button (calls `create-checkout` with `watermark_removal`)
- **Usage card**: progress bars for daily generations used vs limit and daily prompts used vs limit (limits from plan: free=3/5, pro=20/20, premium=unlimited)
- **Actions**: "Manage Subscription" (calls `customer-portal`), "Change Plan" (links to `/pricing`), "History" link, sign out button
- Redirect to `/` if not authenticated

**2. `src/App.tsx`** — add route `<Route path="/profile" element={<Profile />} />`

**3. `src/components/UserMenu.tsx`** — add "My Account" menu item linking to `/profile` (with User icon), above "Generation History"

### Technical details
- Reuse existing edge functions: `check-subscription` for plan/renewal, `check-credits` for usage stats, `create-checkout` for watermark add-on, `customer-portal` for Stripe portal
- Query `user_credits` table directly for `daily_generations_used`, `daily_prompts_used`, `watermark_removed`
- Plan limits constant: `{ free: { daily: 3, promptDaily: 5 }, pro: { daily: 20, promptDaily: 20 }, premium: { daily: 999, promptDaily: 999 } }`
- Uses `Progress` component for usage bars
- Consistent styling with `bg-card border-border` card pattern

