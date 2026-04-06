import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLAN_LIMITS: Record<string, { daily: number; models: string[]; maxBatch: number }> = {
  free: {
    daily: 3,
    models: ["google/gemini-2.5-flash-image-preview"],
    maxBatch: 5,
  },
  pro: {
    daily: 20,
    models: [
      "google/gemini-2.5-flash-image-preview",
      "google/gemini-3.1-flash-image-preview",
      "google/gemini-3-pro-image-preview",
    ],
    maxBatch: 9,
  },
  premium: {
    daily: Infinity,
    models: [
      "google/gemini-2.5-flash-image-preview",
      "google/gemini-3.1-flash-image-preview",
      "google/gemini-3-pro-image-preview",
    ],
    maxBatch: 9,
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, model, imageCount } = await req.json();

    // Get subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .single();

    const plan = subscription?.plan || "free";
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    if (action === "check") {
      // Get credits
      const { data: credits } = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const today = new Date().toISOString().split("T")[0];
      let used = credits?.daily_generations_used || 0;

      // Reset if new day
      if (credits && credits.last_reset_date !== today) {
        used = 0;
        await supabase
          .from("user_credits")
          .update({ daily_generations_used: 0, last_reset_date: today })
          .eq("user_id", user.id);
      }

      // Check model access
      if (model && !limits.models.includes(model)) {
        return new Response(
          JSON.stringify({ allowed: false, reason: "model_restricted", plan }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check batch size
      if (imageCount && imageCount > limits.maxBatch) {
        return new Response(
          JSON.stringify({ allowed: false, reason: "batch_restricted", plan, maxBatch: limits.maxBatch }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check daily limit
      const requestCount = imageCount || 1;
      if (limits.daily !== Infinity && used + requestCount > limits.daily) {
        return new Response(
          JSON.stringify({ allowed: false, reason: "daily_limit", plan, used, limit: limits.daily }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          allowed: true,
          plan,
          used,
          limit: limits.daily === Infinity ? "unlimited" : limits.daily,
          remaining: limits.daily === Infinity ? "unlimited" : limits.daily - used,
          watermarkRemoved: credits?.watermark_removed || false,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === "decrement") {
      const count = imageCount || 1;
      const today = new Date().toISOString().split("T")[0];

      // Get current credits
      const { data: credits } = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", user.id)
        .single();

      let currentUsed = credits?.daily_generations_used || 0;
      if (credits && credits.last_reset_date !== today) {
        currentUsed = 0;
      }

      await supabase
        .from("user_credits")
        .update({
          daily_generations_used: currentUsed + count,
          last_reset_date: today,
        })
        .eq("user_id", user.id);

      return new Response(
        JSON.stringify({ success: true, used: currentUsed + count }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("check-credits error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
