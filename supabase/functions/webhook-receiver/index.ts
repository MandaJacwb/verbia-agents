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
    // 1. Validate webhook secret (if configured)
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
      account_id,
      conversation_id,
      raw_data,
    } = body;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 3. Upsert contact if sender info is available
    if (sender && account_id) {
      await supabase.from("contacts").upsert(
        {
          phone: sender,
          name: sender_name || sender,
          account_id,
          channel: "whatsapp",
        },
        { onConflict: "phone,account_id" }
      );
    }

    // 4. Create or update conversation
    if (conversation_id && account_id) {
      await supabase.from("conversations").upsert(
        {
          id: conversation_id,
          account_id,
          contact_phone: sender,
          channel: "whatsapp",
          status: "open",
          last_message_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    }

    // 5. Insert message
    if (message_text && conversation_id) {
      await supabase.from("messages").insert({
        conversation_id,
        account_id,
        role: "user",
        content: message_text,
        external_id: message_id,
      });
    }

    // 6. Insert interaction for dashboard
    await supabase.from("interactions").insert({
      interaction_type: "whatsapp_message",
      action: event || "message_received",
      lead_name: sender_name || sender || "Unknown",
      agent_name: instance || "VerbIA",
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
