import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET") || "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Validate webhook secret
    if (WEBHOOK_SECRET) {
      const providedSecret = req.headers.get("x-webhook-secret");
      if (providedSecret !== WEBHOOK_SECRET) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // 2. Parse the incoming webhook data from N8N
    const body = await req.json();
    const {
      event,
      instance,
      sender,
      sender_name,
      message_text,
      message_id,
      timestamp,
      raw_data,
    } = body;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 3. Insert interaction — this is what the Centro de Atendimento reads in real-time
    const { error: interactionError } = await supabase.from("interactions").insert({
      interaction_type: "whatsapp_message",
      action: event || "message_received",
      lead_name: sender_name || sender || "Unknown",
      agent_name: instance || "VerbIA",
      phone_number: sender || null,
      message_content: message_text || null,
      contact_name: sender_name || sender || null,
    });

    if (interactionError) {
      console.error("[webhook-receiver] interactions insert error:", interactionError);
      return new Response(JSON.stringify({ error: "Failed to insert interaction", details: interactionError }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[webhook-receiver] unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
