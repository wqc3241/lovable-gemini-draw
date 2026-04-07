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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Optionally scope to authenticated user; service-role calls migrate all
    let userFilter: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) userFilter = user.id;
    }

    // Find base64 images
    let query = supabase
      .from("generation_history")
      .select("id, image_url, user_id")
      .like("image_url", "data:%")
      .limit(20);
    if (userFilter) query = query.eq("user_id", userFilter);
    const { data: rows, error: fetchError } = await query;

    if (fetchError) {
      throw fetchError;
    }

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ migrated: 0, message: "No base64 images to migrate" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let migrated = 0;
    let failed = 0;

    for (const row of rows) {
      try {
        const base64Data = row.image_url.split(",")[1];
        if (!base64Data) { failed++; continue; }

        const binaryStr = atob(base64Data);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        const filePath = `${row.user_id}/${row.id}.png`;

        const { error: uploadError } = await supabase.storage
          .from("generated-images")
          .upload(filePath, bytes, { contentType: "image/png", upsert: true });

        if (uploadError) {
          console.error(`Upload failed for ${row.id}:`, uploadError);
          failed++;
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from("generated-images")
          .getPublicUrl(filePath);

        const { error: updateError } = await supabase
          .from("generation_history")
          .update({ image_url: publicUrlData.publicUrl })
          .eq("id", row.id);

        if (updateError) {
          console.error(`Update failed for ${row.id}:`, updateError);
          failed++;
        } else {
          migrated++;
        }
      } catch (err) {
        console.error(`Migration error for ${row.id}:`, err);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ migrated, failed, total: rows.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Migration error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
