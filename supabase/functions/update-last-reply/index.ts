import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/client.ts";
import { jsonError, jsonOk } from "../_shared/crm.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    if (!body.lead_id) throw new Error("lead_id is required");

    const supabase = getServiceClient();
    const lastReplyAt = body.last_reply_at ?? new Date().toISOString();
    const { data, error } = await supabase
      .from("crm_leads")
      .update({
        last_reply_at: lastReplyAt,
        lead_status: body.lead_status ?? "waiting_reply",
      })
      .eq("id", body.lead_id)
      .select("*")
      .single();
    if (error) throw error;

    return jsonOk({ success: true, lead: data });
  } catch (error) {
    return jsonError(error);
  }
});
