import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/client.ts";
import { jsonError, jsonOk } from "../_shared/crm.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    if (!body.lead_id || !body.task_type || !body.title) {
      throw new Error("lead_id, task_type and title are required");
    }

    const supabase = getServiceClient();
    const payload = {
      lead_id: body.lead_id,
      task_type: body.task_type,
      title: body.title,
      description: body.description ?? null,
      channel: body.channel ?? null,
      priority: body.priority ?? "normal",
      due_at: body.due_at ?? null,
      status: body.status ?? "open",
      related_message_id: body.related_message_id ?? null,
      correlation_id: body.correlation_id ?? null,
    };

    let result;
    if (body.id) {
      const { data, error } = await supabase
        .from("crm_tasks")
        .update(payload)
        .eq("id", body.id)
        .select("*")
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase.from("crm_tasks").insert(payload).select("*").single();
      if (error) throw error;
      result = data;
    }

    return jsonOk({ success: true, task: result });
  } catch (error) {
    return jsonError(error);
  }
});
