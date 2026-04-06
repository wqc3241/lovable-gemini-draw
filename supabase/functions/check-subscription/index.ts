import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRODUCT_MAP: Record<string, string> = {
  "prod_UHouVRaVsnjtmp": "pro",
  "prod_UHov3gHMVDzT7E": "premium",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      // Update local subscription table to free
      await supabaseClient.from("subscriptions").upsert({
        user_id: user.id,
        plan: "free",
        status: "active",
      }, { onConflict: "user_id" });

      return new Response(JSON.stringify({ subscribed: false, plan: "free" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
    });

    if (subscriptions.data.length === 0) {
      await supabaseClient.from("subscriptions").upsert({
        user_id: user.id,
        plan: "free",
        status: "active",
        stripe_customer_id: customerId,
      }, { onConflict: "user_id" });

      return new Response(JSON.stringify({ subscribed: false, plan: "free" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine plan from products
    let plan = "free";
    let subscriptionEnd = null;
    let watermarkRemoved = false;
    let stripeSubId = null;

    for (const sub of subscriptions.data) {
      for (const item of sub.items.data) {
        const productId = typeof item.price.product === "string" ? item.price.product : (item.price.product as any).id;
        if (PRODUCT_MAP[productId]) {
          plan = PRODUCT_MAP[productId];
          subscriptionEnd = new Date(sub.current_period_end * 1000).toISOString();
          stripeSubId = sub.id;
        }
        if (productId === "prod_UHovVVe0IH2fTW") {
          watermarkRemoved = true;
        }
      }
    }

    // Sync to database
    await supabaseClient.from("subscriptions").upsert({
      user_id: user.id,
      plan,
      status: "active",
      stripe_customer_id: customerId,
      stripe_subscription_id: stripeSubId,
      current_period_end: subscriptionEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    if (watermarkRemoved) {
      await supabaseClient.from("user_credits").update({ watermark_removed: true }).eq("user_id", user.id);
    }

    return new Response(JSON.stringify({
      subscribed: plan !== "free",
      plan,
      subscription_end: subscriptionEnd,
      watermark_removed: watermarkRemoved,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("check-subscription error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
