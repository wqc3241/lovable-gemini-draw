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
    const { prompt, imageData, aspectRatio } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Map aspect ratio to size
    const sizeMap: Record<string, string> = {
      "1:1": "1024x1024",
      "4:3": "1536x1024", 
      "3:4": "1024x1536",
      "16:9": "1792x1024",
      "9:16": "1024x1792",
      "auto": "auto"
    };
    const size = sizeMap[aspectRatio] || "auto";

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

    // Add aspect ratio instructions to the prompt
    const dimensionInstructions = size !== "auto" 
      ? ` Create the image in ${size} resolution (${aspectRatio} aspect ratio).`
      : "";
    const enhancedPrompt = prompt + dimensionInstructions;

    console.log("Generating image with prompt:", enhancedPrompt, "aspectRatio:", aspectRatio, "hasImage:", !!imageData);

    // Build content based on whether we're editing or generating
    let content;
    if (imageData) {
      // Image editing mode
      content = [
        { type: "text", text: enhancedPrompt },
        { type: "image_url", image_url: { url: imageData } }
      ];
    } else {
      // Image generation mode
      content = enhancedPrompt;
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
    console.log("AI response received");

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error("No image URL in response");
      return new Response(
        JSON.stringify({ error: "No image generated" }),
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
