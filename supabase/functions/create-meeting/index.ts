import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/client.ts";
import { jsonError, jsonOk } from "../_shared/crm.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    if (!body.lead_id || !body.starts_at) {
      throw new Error("lead_id and starts_at are required");
    }

    const supabase = getServiceClient();
    const meetingPayload = {
      provider: body.provider ?? "custom",
      starts_at: body.starts_at,
      ends_at: body.ends_at ?? null,
      owner_name: body.owner_name ?? null,
      channel: body.channel ?? null,
    };

    const { data: lead, error } = await supabase
      .from("crm_leads")
      .update({
        meeting_at: body.starts_at,
        lifecycle_stage: "sql",
        pipeline_stage: "reuniao",
        lead_status: "meeting_set",
        owner_name: body.owner_name ?? null,
        next_step: "meeting",
      })
      .eq("id", body.lead_id)
      .select("*")
      .single();
    if (error) throw error;

    await supabase.from("crm_event_logs").insert({
      lead_id: body.lead_id,
      event_type: "meeting_created",
      event_source: body.provider ?? "custom",
      payload: meetingPayload,
      correlation_id: body.correlation_id ?? null,
    });

    return jsonOk({ success: true, lead, meeting: meetingPayload });
  } catch (error) {
    return jsonError(error);
  }
});
