import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLAN_CREDITS: Record<string, number> = {
  free: 15,
  pro: 150,
  premium: 500,
};

const CREDIT_COSTS: Record<string, number> = {
  "google/gemini-2.5-flash-image-preview": 0.25,
  "google/gemini-3.1-flash-image-preview": 0.50,
  "google/gemini-3-pro-image-preview": 0.75,
};

const PROMPT_COST = 0.25;

const PLAN_MODELS: Record<string, string[]> = {
  free: ["google/gemini-2.5-flash-image-preview"],
  pro: [
    "google/gemini-2.5-flash-image-preview",
    "google/gemini-3.1-flash-image-preview",
    "google/gemini-3-pro-image-preview",
  ],
  premium: [
    "google/gemini-2.5-flash-image-preview",
    "google/gemini-3.1-flash-image-preview",
    "google/gemini-3-pro-image-preview",
  ],
};

const MAX_BATCH: Record<string, number> = {
  free: 5,
  pro: 9,
  premium: 9,
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

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, model, imageCount, generationType } = await req.json();

    // Get subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .single();

    const plan = subscription?.plan || "free";
    const totalCredits = PLAN_CREDITS[plan] || PLAN_CREDITS.free;
    const allowedModels = PLAN_MODELS[plan] || PLAN_MODELS.free;
    const maxBatch = MAX_BATCH[plan] || MAX_BATCH.free;

    // Get or create credits row
    let { data: credits } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!credits) {
      await supabase.from("user_credits").insert({ user_id: user.id });
      const { data: newCredits } = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", user.id)
        .single();
      credits = newCredits;
    }

    // Monthly reset: if 30+ days since credits_reset_date, reset credits
    const resetDate = new Date(credits.credits_reset_date);
    const now = new Date();
    const daysSinceReset = Math.floor((now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceReset >= 30) {
      const newTotal = totalCredits;
      await supabase
        .from("user_credits")
        .update({
          monthly_credits_remaining: newTotal,
          monthly_credits_total: newTotal,
          credits_reset_date: now.toISOString().split("T")[0],
        })
        .eq("user_id", user.id);
      credits.monthly_credits_remaining = newTotal;
      credits.monthly_credits_total = newTotal;
    }

    // Sync total if plan changed
    if (credits.monthly_credits_total !== totalCredits) {
      const diff = totalCredits - credits.monthly_credits_total;
      const newRemaining = Math.max(0, credits.monthly_credits_remaining + diff);
      await supabase
        .from("user_credits")
        .update({
          monthly_credits_total: totalCredits,
          monthly_credits_remaining: newRemaining,
        })
        .eq("user_id", user.id);
      credits.monthly_credits_remaining = newRemaining;
      credits.monthly_credits_total = totalCredits;
    }

    const isPromptMode = generationType === "prompt";
    const creditCost = isPromptMode ? PROMPT_COST : (CREDIT_COSTS[model] || 0.25);
    const count = imageCount || 1;
    const totalCost = creditCost * count;

    if (action === "check") {
      // Check model access
      if (!isPromptMode && model && !allowedModels.includes(model)) {
        return new Response(
          JSON.stringify({ allowed: false, reason: "model_restricted", plan }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check batch size
      if (!isPromptMode && imageCount && imageCount > maxBatch) {
        return new Response(
          JSON.stringify({ allowed: false, reason: "batch_restricted", plan, maxBatch }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check credit balance
      if (credits.monthly_credits_remaining < totalCost) {
        return new Response(
          JSON.stringify({
            allowed: false,
            reason: "credit_limit",
            plan,
            creditsRemaining: credits.monthly_credits_remaining,
            creditsTotal: credits.monthly_credits_total,
            costRequired: totalCost,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          allowed: true,
          plan,
          creditsRemaining: credits.monthly_credits_remaining,
          creditsTotal: credits.monthly_credits_total,
          creditCost,
          totalCost,
          watermarkRemoved: credits.watermark_removed || false,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === "decrement") {
      const newRemaining = Math.max(0, credits.monthly_credits_remaining - totalCost);
      await supabase
        .from("user_credits")
        .update({ monthly_credits_remaining: newRemaining })
        .eq("user_id", user.id);

      return new Response(
        JSON.stringify({
          success: true,
          creditsRemaining: newRemaining,
          creditsTotal: credits.monthly_credits_total,
          deducted: totalCost,
        }),
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
