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

    console.log("Generating image with prompt:", prompt, "aspectRatio:", aspectRatio, "hasImage:", !!imageData);

    // Build content based on whether we're editing or generating
    let content;
    if (imageData) {
      // Image editing mode
      content = [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: imageData } }
      ];
    } else {
      // Image generation mode
      content = prompt;
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
    
    // Check for IMAGE_OTHER (content policy rejection)
    const finishReason = data.choices?.[0]?.native_finish_reason;
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
