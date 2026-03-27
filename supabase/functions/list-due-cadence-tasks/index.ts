import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/client.ts";
import { jsonError, jsonOk } from "../_shared/crm.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const now = body.now ?? new Date().toISOString();
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from("crm_tasks")
      .select("*, lead:crm_leads(*)")
      .eq("status", "open")
      .lte("due_at", now)
      .like("task_type", "%followup%");
    if (error) throw error;

    return jsonOk({ success: true, tasks: data ?? [] });
  } catch (error) {
    return jsonError(error);
  }
});
