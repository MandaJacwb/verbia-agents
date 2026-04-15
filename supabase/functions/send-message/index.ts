import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const N8N_WEBHOOK_URL =
  Deno.env.get("N8N_SEND_MESSAGE_WEBHOOK_URL") ||
  "https://cleveralpaca-n8n.cloudfy.live/webhook/verbia-send-message";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

/** Call N8N webhook with automatic retry on 404 (container cold-start). */
async function callN8N(body: string, maxAttempts = 3): Promise<Response> {
  const options: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  };
  let last: Response | null = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    last = await fetch(N8N_WEBHOOK_URL, options);
    if (last.ok) return last;
    // Only retry on 404 (webhook not registered yet) or 503 (N8N starting)
    if (last.status !== 404 && last.status !== 503) break;
    if (attempt < maxAttempts) {
      // Wait 1.5 s then retry — gives N8N time to finish registering webhooks
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  return last!;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Verify the user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify JWT and get user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Parse the message request
    const body = await req.json();
    const { phone, message, conversation_id } = body;

    if (!phone || !message) {
      return new Response(JSON.stringify({ error: "phone and message are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Forward to N8N (which sends via Evolution API), with retry on 404/503
    const payload = JSON.stringify({ phone, message, conversation_id, sent_by: user.id });
    const n8nResponse = await callN8N(payload);

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`[send-message] N8N returned ${n8nResponse.status}:`, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to send message", details: errorText, status: n8nResponse.status }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const result = await n8nResponse.json().catch(() => ({}));

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-message error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
