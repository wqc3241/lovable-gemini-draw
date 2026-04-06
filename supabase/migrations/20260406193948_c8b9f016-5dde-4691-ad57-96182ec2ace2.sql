ALTER TABLE public.user_credits
  ADD COLUMN monthly_credits_remaining DECIMAL NOT NULL DEFAULT 15,
  ADD COLUMN monthly_credits_total DECIMAL NOT NULL DEFAULT 15,
  ADD COLUMN credits_reset_date DATE NOT NULL DEFAULT CURRENT_DATE;