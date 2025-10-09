import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('=== 📥 INCOMING IMAGE ANALYSIS REQUEST ===');

  try {
    const { imageData } = await req.json();

    if (!imageData) {
      console.error('❌ No image data provided');
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('📷 Image data received, length:', imageData.length);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('❌ LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `Analyze this image and provide a concise prompt that could be used to recreate this image with AI. For each category below, write 3-4 sentences maximum:

1. SUBJECT DESCRIPTION: Main subject(s), their appearance, clothing, expressions (3-4 sentences)
2. POSE & COMPOSITION: Body positioning, angles, gestures, spatial relationships (3-4 sentences)
3. PHOTOGRAPHY STYLE: Lighting type, mood, color grading (3-4 sentences)
4. CAMERA DETAILS: Camera angle, shot type, perspective (3-4 sentences)
5. BACKGROUND & SETTING: Environment details, depth of field, background elements (3-4 sentences)
6. TECHNICAL DETAILS: Camera settings, lens effects, post-processing style (3-4 sentences)
7. ARTISTIC STYLE: Photorealistic, cinematic, artistic, vintage, etc. (3-4 sentences)

Format the output as a clear, structured prompt with each section labeled. Keep descriptions concise but detailed enough for accurate recreation. Total output should be around 20-25 sentences.`;

    console.log('=== 🚀 SENDING TO AI GATEWAY ===');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: systemPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ AI Gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze image' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('=== ✅ AI RESPONSE RECEIVED ===');

    const prompt = data.choices?.[0]?.message?.content;

    if (!prompt) {
      console.error('❌ No prompt in response');
      return new Response(
        JSON.stringify({ error: 'No prompt generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Generated prompt length:', prompt.length);
    console.log('📝 Prompt preview:', prompt.substring(0, 100) + '...');

    return new Response(
      JSON.stringify({ prompt }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in analyze-image function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
