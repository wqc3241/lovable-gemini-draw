

# Debugging: Empty History, Zero Stats, and Missing Subscription

## Root Cause

There is an **auth race condition**. When navigating between pages, `supabase.auth.getSession()` can return before the session token is fully restored from storage. This means:

1. **History page**: The query to `generation_history` runs with no valid auth token, so RLS blocks it and returns empty/error ("Failed to load history").
2. **Stats reset to 0**: When navigating back to Index, the `get_public_stats` RPC and subscription query fire before the session is ready, returning zeroed data.
3. **Subscription shows "no subscription"**: The `subscriptions` query with `.single()` fails because RLS blocks the unauthenticated request.

## Plan

### Step 1: Create a shared `useAuth` hook with readiness gating

Create `src/hooks/useAuth.ts` that:
- Calls `supabase.auth.getSession()` and waits for it to complete before setting `isReady = true`
- Listens to `onAuthStateChange` for subsequent updates (without `await` inside the callback)
- Exports `{ session, user, isReady }`

### Step 2: Fix History page

- Use the new `useAuth` hook
- Only call `fetchHistory()` once `isReady` is true and `user` exists
- Redirect to `/auth` only after `isReady` confirms no session

### Step 3: Fix Index page auth and data fetching

- Replace the inline `getSession` + `onAuthStateChange` with the `useAuth` hook
- Gate `fetchPlan` and `fetchCredits` on `isReady && session`
- Stats (`get_public_stats`) are public so they don't need gating, but the subscription/credits queries do

### Step 4: Fix Profile page

- Same pattern: use `useAuth` hook, gate all data loading on `isReady`

### Technical Details

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
      }
    );
    // Then get current session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setIsReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { session, user, isReady };
}
```

Key changes per file:
- **History.tsx**: Replace `checkAuth` with `useAuth()`, add `useEffect` that runs `fetchHistory` only when `isReady && user`, redirect when `isReady && !user`
- **Index.tsx**: Replace lines 62-66 with `useAuth()`, gate `fetchPlan` and `fetchCredits` on `isReady`
- **Profile.tsx**: Same pattern
- **UserMenu.tsx**: Same pattern

Also fix the `.single()` call on subscriptions query in Index.tsx line 76 to use `.maybeSingle()` to avoid errors when no row exists yet.

