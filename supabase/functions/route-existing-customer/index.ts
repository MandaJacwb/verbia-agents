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
    const { data: lead, error } = await supabase
      .from("crm_leads")
      .update({
        lifecycle_stage: body.lifecycle_stage ?? "customer",
        lead_status: "support_redirected",
        next_step: "support",
      })
      .eq("id", body.lead_id)
      .select("*")
      .single();
    if (error) throw error;

    const { data: task, error: taskError } = await supabase
      .from("crm_tasks")
      .insert({
        lead_id: body.lead_id,
        task_type: "support_handoff",
        title: body.title ?? "Cliente redirecionado para suporte",
        description: body.description ?? "Contato já é cliente e deve ser tratado pelo time de suporte.",
        channel: body.channel ?? null,
        priority: "high",
        due_at: body.due_at ?? new Date().toISOString(),
        status: "open",
        correlation_id: body.correlation_id ?? null,
      })
      .select("*")
      .single();
    if (taskError) throw taskError;

    return jsonOk({ success: true, lead, task });
  } catch (error) {
    return jsonError(error);
  }
});
