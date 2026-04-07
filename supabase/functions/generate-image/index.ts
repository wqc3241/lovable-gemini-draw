import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, imageData, aspectRatio, pastedImages, model } = await req.json();

    // Validate model against allowlist
    const ALLOWED_MODELS = [
      "google/gemini-2.5-flash-image-preview",
      "google/gemini-3.1-flash-image-preview",
      "google/gemini-3-pro-image-preview",
    ];
    const selectedModel = ALLOWED_MODELS.includes(model) ? model : "google/gemini-2.5-flash-image-preview";
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Authenticate user for storage upload
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    if (authHeader) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      if (user) userId = user.id;
    }

    console.log("=== 📥 INCOMING REQUEST ===");
    console.log("Prompt length:", prompt?.length || 0);
    console.log("Aspect ratio:", aspectRatio);
    console.log("Image data present:", !!imageData);
    console.log("User ID:", userId || "anonymous");

    // Build content array for multimodal input
    const content: any[] = [{ type: "text", text: prompt }];

    if (imageData) {
      content.push({ type: "image_url", image_url: { url: imageData } });
    }

    if (pastedImages && Array.isArray(pastedImages)) {
      pastedImages.forEach((img: string) => {
        content.push({ type: "image_url", image_url: { url: img } });
      });
    }

    const requestBody: any = {
      model: selectedModel,
      messages: [{ role: "user", content }],
      modalities: ["image", "text"],
    };

    if (aspectRatio && aspectRatio !== "auto") {
      requestBody.image_config = { aspect_ratio: aspectRatio };
    }

    console.log("=== 🚀 SENDING TO AI GATEWAY ===");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to generate image" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    console.log("=== ✅ AI RESPONSE RECEIVED ===");

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    const finishReason = data.choices?.[0]?.native_finish_reason;
    console.log("Finish reason:", finishReason);
    
    if (finishReason === "IMAGE_OTHER") {
      return new Response(
        JSON.stringify({ 
          error: "Content Policy Violation",
          details: "The AI refused to generate this image due to content policy restrictions. This commonly happens when:\n\n• The uploaded image contains people or faces\n• The prompt describes sensitive content or poses\n• The combination of image + prompt violates safety guidelines\n\nSuggestions:\n• Try a different image\n• Use more generic descriptions\n• Try generating from text only instead of editing"
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!imageUrl) {
      const modelMessage = data.choices?.[0]?.message?.content;
      if (modelMessage) {
        return new Response(
          JSON.stringify({ error: "Image generation blocked", details: modelMessage }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (!data.choices || data.choices.length === 0) {
        return new Response(
          JSON.stringify({ error: "Invalid AI response", details: "The AI model did not return any results. Please try again." }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ error: "No image generated", details: "The AI model completed but did not return an image." }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If user is authenticated, upload to storage and return public URL
    if (userId && imageUrl.startsWith("data:")) {
      try {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        
        // Decode base64 to binary
        const base64Data = imageUrl.split(",")[1];
        const binaryStr = atob(base64Data);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        const fileId = crypto.randomUUID();
        const filePath = `${userId}/${fileId}.png`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from("generated-images")
          .upload(filePath, bytes, {
            contentType: "image/png",
            upsert: false,
          });

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          // Fall back to returning base64
          return new Response(
            JSON.stringify({ imageUrl }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: publicUrlData } = supabaseAdmin.storage
          .from("generated-images")
          .getPublicUrl(filePath);

        console.log("✅ Image uploaded to storage:", publicUrlData.publicUrl);

        return new Response(
          JSON.stringify({ imageUrl: publicUrlData.publicUrl }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (uploadErr) {
        console.error("Storage upload failed:", uploadErr);
        // Fall back to base64
        return new Response(
          JSON.stringify({ imageUrl }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in generate-image function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
