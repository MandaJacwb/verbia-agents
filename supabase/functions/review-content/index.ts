import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/client.ts";

const nextStatusByDecision = {
  approved: "approved",
  rejected: "drafted",
  changes_requested: "drafted",
} as const;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const supabase = getServiceClient();

    const decision = body.decision;
    const nextStatus = nextStatusByDecision[decision as keyof typeof nextStatusByDecision];

    if (!body.content_id || !nextStatus) {
      throw new Error("content_id and valid decision are required");
    }

    const { error: reviewError } = await supabase.from("reviews").insert({
      content_id: body.content_id,
      reviewer_name: body.reviewer_name,
      reviewer_email: body.reviewer_email,
      decision,
      notes: body.notes,
      checklist: body.checklist ?? [],
    });

    if (reviewError) throw reviewError;

    const { data, error: updateError } = await supabase
      .from("editorial_calendar")
      .update({
        status: nextStatus,
        updated_by: body.reviewer_name ?? "review-api",
      })
      .eq("id", body.content_id)
      .select("id, status")
      .single();

    if (updateError) throw updateError;

    return Response.json({ success: true, content: data }, { headers: corsHeaders });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "unknown_error",
      },
      { status: 400, headers: corsHeaders },
    );
  }
});
