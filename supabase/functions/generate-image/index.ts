import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, imageData, aspectRatio, pastedImages } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }


    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log incoming request details
    console.log("=== 📥 INCOMING REQUEST ===");
    console.log("Prompt length:", prompt?.length || 0);
    console.log("Prompt content:", prompt?.substring(0, 200) + (prompt?.length > 200 ? "..." : ""));
    console.log("Aspect ratio:", aspectRatio);
    console.log("Image data present:", !!imageData);

    if (imageData) {
      // Verify image format and size
      const imageFormat = imageData.substring(0, 30);
      const imageSizeKB = Math.round((imageData.length * 0.75) / 1024);
      console.log("Image format prefix:", imageFormat);
      console.log("Image data size (approx):", imageSizeKB, "KB");
      console.log("Image data length:", imageData.length, "characters");
    }

    // Build content array for multimodal input
    const content: any[] = [{ type: "text", text: prompt }];

    // Add main image (for edit mode)
    if (imageData) {
      content.push({
        type: "image_url",
        image_url: { url: imageData }
      });
    }

    // Add pasted images (for both generate and edit modes)
    if (pastedImages && Array.isArray(pastedImages)) {
      pastedImages.forEach((img: string) => {
        content.push({
          type: "image_url",
          image_url: { url: img }
        });
      });
    }

    const requestBody: any = {
      model: "google/gemini-2.5-flash-image-preview",
      messages: [
        {
          role: "user",
          content,
        },
      ],
      modalities: ["image", "text"],
    };

    // Add image_config for aspect ratio control (Gemini-specific parameter)
    if (aspectRatio && aspectRatio !== "auto") {
      requestBody.image_config = {
        aspect_ratio: aspectRatio
      };
    }

    // Log the complete payload structure being sent to API
    console.log("=== 📤 API REQUEST PAYLOAD ===");
    console.log("Model:", requestBody.model);
    console.log("Modalities:", requestBody.modalities);
    console.log("Message role:", requestBody.messages[0].role);

    if (Array.isArray(requestBody.messages[0].content)) {
      console.log("Content type: ARRAY (image editing mode)");
      console.log("Content items:", requestBody.messages[0].content.length);
      requestBody.messages[0].content.forEach((item: any, idx: number) => {
        if (item.type === "text") {
          console.log(`  [${idx}] Text:`, item.text.substring(0, 100) + "...");
        } else if (item.type === "image_url") {
          console.log(`  [${idx}] Image URL present:`, !!item.image_url?.url);
          console.log(`  [${idx}] Image URL format:`, item.image_url?.url?.substring(0, 30));
        }
      });
    } else {
      console.log("Content type: STRING (text-only generation)");
      console.log("Content:", requestBody.messages[0].content.substring(0, 100) + "...");
    }

    if (requestBody.image_config) {
      console.log("Image config:", JSON.stringify(requestBody.image_config));
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
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }),
          { 
            status: 402, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to generate image" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    
    console.log("=== ✅ AI RESPONSE RECEIVED ===");
    console.log("Response status: SUCCESS");

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    // Check for IMAGE_OTHER (content policy rejection)
    const finishReason = data.choices?.[0]?.native_finish_reason;
    console.log("Finish reason:", finishReason);
    console.log("Image URL present:", !!imageUrl);
    if (finishReason === "IMAGE_OTHER") {
      console.error("Content policy rejection detected (IMAGE_OTHER)");
      return new Response(
        JSON.stringify({ 
          error: "Content Policy Violation",
          details: "The AI refused to generate this image due to content policy restrictions. This commonly happens when:\n\n• The uploaded image contains people or faces\n• The prompt describes sensitive content or poses\n• The combination of image + prompt violates safety guidelines\n\nSuggestions:\n• Try a different image\n• Use more generic descriptions\n• Try generating from text only instead of editing"
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    if (!imageUrl) {
      // Log full response structure for debugging
      console.error("No image URL in response. Full response structure:", JSON.stringify(data, null, 2));
      
      // Check if model returned an error message or explanation
      const modelMessage = data.choices?.[0]?.message?.content;
      if (modelMessage) {
        console.error("Model returned message instead of image:", modelMessage);
        return new Response(
          JSON.stringify({ 
            error: "Image generation blocked",
            details: modelMessage
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      // Check if response has choices at all
      if (!data.choices || data.choices.length === 0) {
        console.error("No choices in response");
        return new Response(
          JSON.stringify({ 
            error: "Invalid AI response",
            details: "The AI model did not return any results. Please try again."
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: "No image generated",
          details: "The AI model completed but did not return an image. This may be due to content policy restrictions."
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ imageUrl }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error in generate-image function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
