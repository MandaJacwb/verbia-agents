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
    const unsubscribeAt = body.unsubscribe_at ?? new Date().toISOString();

    const { data: lead, error: leadError } = await supabase
      .from("crm_leads")
      .update({
        do_not_contact: true,
        do_not_contact_reason: body.reason ?? "opt_out",
        unsubscribe_source: body.channel ?? null,
        unsubscribe_at: unsubscribeAt,
        lead_status: "opt_out",
      })
      .eq("id", body.lead_id)
      .select("*")
      .single();
    if (leadError) throw leadError;

    await supabase
      .from("crm_tasks")
      .update({ status: "cancelled" })
      .eq("lead_id", body.lead_id)
      .in("status", ["open", "in_progress"]);

    await supabase.from("crm_event_logs").insert({
      lead_id: body.lead_id,
      event_type: "opt_out",
      event_source: body.channel ?? "unknown",
      payload: {
        reason: body.reason ?? "opt_out",
        unsubscribe_source: body.channel ?? null,
        unsubscribe_at: unsubscribeAt,
      },
      correlation_id: body.correlation_id ?? null,
    });

    return jsonOk({ success: true, lead });
  } catch (error) {
    return jsonError(error);
  }
});
