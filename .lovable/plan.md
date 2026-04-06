## Implementation Plan: Model Selection, Authentication & Pricing

### Feature 1: Model Selection for Image Generation

**What:** Add a "Model" dropdown to both Generate and Edit tabs, letting users pick between three Gemini image models. Default to the current model.

**Models:**

- Nano Banana (Fast) — `google/gemini-2.5-flash-image-preview` (default, current)
- Nano Banana 2 (Balanced) — `google/gemini-3.1-flash-image-preview`
- Pro (Best Quality) — `google/gemini-3-pro-image-preview`

**Changes:**

- `src/pages/Index.tsx` — Add `model` state, add a Model `<Select>` in both Generate and Edit tabs, pass `model` to the edge function invocation
- `supabase/functions/generate-image/index.ts` — Accept `model` from request body, validate it against an allowlist, use it in the API request instead of hardcoded value

---

### Feature 2: User Authentication (Email + Google Sign-In)

**What:** Allow users to create accounts and sign in via email/password or Google OAuth. Store generation history tied to their account.

**Database changes:**

- Create `profiles` table (id, user_id, display_name, avatar_url, created_at)
- Create `generation_history` table (id, user_id, prompt, model, aspect_ratio, image_url, mode, created_at) with RLS policies so users can only access their own history
- Auto-create profile on signup via trigger

**New files:**

- `src/pages/Auth.tsx` — Login/signup page with email + Google sign-in
- `src/components/AuthGuard.tsx` — Optional wrapper for protected content
- `src/components/UserMenu.tsx` — Header avatar/dropdown with sign out, view history
- `src/pages/History.tsx` — Page showing past generations

**Modified files:**

- `src/App.tsx` — Add `/auth`, `/history` routes
- `src/pages/Index.tsx` — Add UserMenu to header, save generations to history table after successful generation (if logged in), allow unauthenticated usage for free tier
- Configure Google OAuth via Lovable Cloud managed solution

---

### Feature 3: Pricing & Paywall (Freemium Model)

**What:** A freemium plan with daily free credits and paid tiers for power users.

**Proposed Pricing Structure:**


| &nbsp;            | Free             | Pro ($9.99/mo) | Premium ($24.99/mo) |
| ----------------- | ---------------- | -------------- | ------------------- |
| Daily generations | 3                | 20             | Unlimited           |
| Models available  | Nano Banana only | All 3 models   | All 3 models        |
| Max batch size    | 5                | 9              | 9                   |
| Watermark         | Yes              | Yes            | Yes                 |
| History           | 7 days           | 14 days        | Unlimited           |
| Priority queue    | No               | No             | Yes                 |


$2/mo to remove watermark for all plan.

**Database changes:**

- Create `user_credits` table (user_id, daily_generations_used, last_reset_date)
- Create `subscriptions` table (user_id, plan, status, stripe_subscription_id, current_period_end)

**New files:**

- `src/pages/Pricing.tsx` — Pricing page with 3-tier comparison cards, FAQ, CTA buttons
- `src/components/UpgradeDialog.tsx` — Modal shown when free user hits limit

**Modified files:**

- `src/pages/Index.tsx` — Check credits before generation, enforce model/batch restrictions per plan, conditionally apply watermark
- `supabase/functions/generate-image/index.ts` — Validate user plan server-side before generating
- New edge function `supabase/functions/check-credits/index.ts` — Verify and decrement credits
- `src/App.tsx` — Add `/pricing` route

**Payments:** Enable Stripe integration for subscription management (checkout, customer portal, webhooks).

---

- Implementation Order

1. **Model selection** (smallest scope, no dependencies)
2. **Authentication** (needed before credits/payments)
3. **Pricing page + credit system** (depends on auth)
4. **Stripe integration** (depends on pricing design approval)

---

### Technical Notes

- Google sign-in uses Lovable Cloud's managed OAuth — no external setup needed
- Stripe handles subscriptions and billing; webhook edge function syncs plan status to the `subscriptions` table
- Credits reset daily via a check in `check-credits` (compare `last_reset_date` to today)
- Free users can generate without an account but are limited to 3/day via localStorage + IP-based soft limit; creating an account unlocks tracking
- All model validation happens server-side in the edge function to prevent abuse