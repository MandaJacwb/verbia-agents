import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/client.ts";
import { jsonError, jsonOk } from "../_shared/crm.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    if (!body.channel || !body.direction) {
      throw new Error("channel and direction are required");
    }

    const supabase = getServiceClient();
    const eventPayload = {
      lead_id: body.lead_id ?? null,
      contact_id: body.contact_id ?? null,
      channel: body.channel,
      direction: body.direction,
      provider: body.provider ?? null,
      intent: body.intent ?? null,
      message_text: body.message_text ?? null,
      provider_message_id: body.provider_message_id ?? null,
      message_status: body.message_status ?? null,
      raw_payload: body.raw_payload ?? {},
      correlation_id: body.correlation_id ?? null,
    };

    const { data, error } = await supabase
      .from("crm_message_events")
      .insert(eventPayload)
      .select("*")
      .single();
    if (error) throw error;

    await supabase.from("crm_event_logs").insert({
      lead_id: body.lead_id ?? null,
      event_type: "message_event",
      event_source: body.provider ?? body.channel,
      payload: eventPayload,
      correlation_id: body.correlation_id ?? null,
    });

    return jsonOk({ success: true, event: data });
  } catch (error) {
    return jsonError(error);
  }
});
