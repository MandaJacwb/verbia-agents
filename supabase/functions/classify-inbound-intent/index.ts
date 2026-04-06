import { corsHeaders } from "../_shared/cors.ts";
import { classifyIntent, jsonError, jsonOk } from "../_shared/crm.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const intent = classifyIntent(body.message_text);

    return jsonOk({
      success: true,
      lead_id: body.lead_id ?? null,
      channel: body.channel ?? null,
      identity: body.identity ?? null,
      intent,
    });
  } catch (error) {
    return jsonError(error);
  }
});
