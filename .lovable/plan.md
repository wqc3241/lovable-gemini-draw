

## Plan: Credit-Based Pricing Migration (Updated Tiers)

### Credit Structure

| Plan | Monthly Credits | Price | Max Images (all Nano Banana) |
|------|----------------|-------|------------------------------|
| Free | 15 | $0 | 60 |
| Pro | 150 | $9.99 | 600 |
| Premium | 500 | $24.99 | 2,000 |

| Model | Credits/Call |
|-------|-------------|
| Nano Banana (gemini-2.5-flash) | 0.25 |
| Nano Banana 2 (gemini-3.1-flash) | 0.50 |
| Nano Banana Pro (gemini-3-pro) | 0.75 |
| Image Prompt (analyze) | 0.25 |

This is more balanced — Free users get ~60 images/month (2/day pace), Pro gets ~600, Premium ~2,000. Competitive with Leonardo AI and Ideogram pricing.

### Changes

**1. Database migration** — alter `user_credits`:
- Add `monthly_credits_remaining DECIMAL DEFAULT 15`
- Add `monthly_credits_total DECIMAL DEFAULT 15`
- Add `credits_reset_date DATE DEFAULT CURRENT_DATE`

**2. `supabase/functions/check-credits/index.ts`** — rewrite:
- Replace daily limits with monthly credit pools: `{ free: 15, pro: 150, premium: 500 }`
- Add credit costs per model map
- `action: "check"` — return remaining credits, total, plan; auto-reset if 30+ days since `credits_reset_date`
- `action: "decrement"` — subtract `creditCost * imageCount` from `monthly_credits_remaining`
- Remove all daily generation/prompt logic

**3. `src/pages/Index.tsx`** — update credit flow:
- Pass model to check-credits for cost calculation
- Show "X credits remaining" instead of daily counts
- Calculate total cost as `creditCost * imageCount` before generating

**4. `src/pages/Profile.tsx`** — update usage display:
- Replace daily progress bars with monthly credit bar (e.g., "120 / 150 credits remaining")
- Show credit cost per model

**5. `src/pages/Pricing.tsx`** — update plan cards:
- Change feature text from "X generations/day" to "15 / 150 / 500 credits/month"

**6. `src/components/UpgradeDialog.tsx`** — update copy to reference monthly credits instead of daily limits

