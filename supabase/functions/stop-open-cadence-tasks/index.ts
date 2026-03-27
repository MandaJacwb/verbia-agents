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
    const { data, error } = await supabase
      .from("crm_tasks")
      .update({ status: "cancelled" })
      .eq("lead_id", body.lead_id)
      .in("status", ["open", "in_progress"])
      .like("task_type", "%followup%")
      .select("*");
    if (error) throw error;

    return jsonOk({ success: true, tasks: data ?? [] });
  } catch (error) {
    return jsonError(error);
  }
});
