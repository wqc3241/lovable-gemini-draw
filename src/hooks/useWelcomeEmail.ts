import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Listens for first-time sign-ins (any provider) and fires a welcome email.
 * Skips if the welcome was already sent for this user (tracked in sessionStorage).
 */
export function useWelcomeEmail() {
  const sentRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.user) return;

        const userId = session.user.id;

        // Only act on sign-in events
        if (event !== "SIGNED_IN") return;

        // Don't send twice per browser session
        const storageKey = `welcome_sent_${userId}`;
        if (sentRef.current.has(userId) || sessionStorage.getItem(storageKey)) return;

        // Check if user was just created (created_at within last 60 seconds)
        const createdAt = new Date(session.user.created_at).getTime();
        const now = Date.now();
        if (now - createdAt > 60_000) return; // Not a new user

        sentRef.current.add(userId);
        sessionStorage.setItem(storageKey, "1");

        const email = session.user.email;
        if (!email) return;

        const name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          email.split("@")[0];

        supabase.functions
          .invoke("send-transactional-email", {
            body: {
              templateName: "welcome-email",
              recipientEmail: email,
              idempotencyKey: `welcome-${userId}`,
              templateData: { name },
            },
          })
          .catch(() => {});
      }
    );

    return () => subscription.unsubscribe();
  }, []);
}
