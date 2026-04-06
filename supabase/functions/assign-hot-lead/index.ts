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
    const { data: owners, error } = await supabase
      .from("crm_owners")
      .select("owner_name, round_robin_order")
      .eq("owner_type", "closer")
      .eq("active", true)
      .order("round_robin_order", { ascending: true });
    if (error) throw error;
    if (!owners?.length) throw new Error("no active closer found");

    const seed = [...String(body.lead_id)].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const owner = owners[seed % owners.length];

    await supabase
      .from("crm_leads")
      .update({
        owner_name: owner.owner_name,
        pipeline_stage: "handoff_closer",
        lifecycle_stage: "sql",
        lead_status: "qualified",
      })
      .eq("id", body.lead_id);

    return jsonOk({ success: true, owner_name: owner.owner_name });
  } catch (error) {
    return jsonError(error);
  }
});
