import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/client.ts";
import { computeQualificationFeatures, jsonError, jsonOk } from "../_shared/crm.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const result = computeQualificationFeatures(body);
    const summary =
      result.qualification === "hot"
        ? "Lead com bom fit e sinais claros para handoff ou agenda."
        : result.qualification === "warm"
          ? "Lead com fit parcial, precisa de qualificação complementar."
          : "Lead inicial, recomendado entrar em nurture até obter mais contexto.";

    if (body.lead_id) {
      const supabase = getServiceClient();
      const lifecycleStage =
        result.qualification === "hot" ? "sql" : result.qualification === "warm" ? "mql" : "lead";
      const pipelineStage = result.qualification === "hot" ? "handoff_closer" : "qualificacao_sdr";
      const leadStatus =
        result.qualification === "hot" ? "qualified" : result.qualification === "warm" ? "waiting_reply" : "nurture";

      const { error } = await supabase
        .from("crm_leads")
        .update({
          score: result.score,
          qualification: result.qualification,
          next_step: result.next_step,
          score_features: result.score_features,
          lifecycle_stage: lifecycleStage,
          pipeline_stage: pipelineStage,
          lead_status: leadStatus,
        })
        .eq("id", body.lead_id);

      if (error) throw error;
    }

    return jsonOk({
      success: true,
      ...result,
      pain_points: result.score_features.pain_sla ? ["sla", "custo"] : [],
      summary,
    });
  } catch (error) {
    return jsonError(error);
  }
});
