import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/client.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const supabase = getServiceClient();

    if (!body.content_id) {
      throw new Error("content_id is required");
    }

    const metricPayload = {
      content_id: body.content_id,
      captured_at: body.captured_at,
      source: body.source ?? "n8n",
      impressions: body.impressions ?? 0,
      reach: body.reach ?? 0,
      likes: body.likes ?? 0,
      comments: body.comments ?? 0,
      shares: body.shares ?? 0,
      saves: body.saves ?? 0,
      profile_visits: body.profile_visits ?? 0,
      link_clicks: body.link_clicks ?? 0,
      engagement_rate: body.engagement_rate ?? null,
      metadata: body.metadata ?? {},
    };

    const { data, error } = await supabase
      .from("metrics")
      .insert(metricPayload)
      .select("id, content_id, captured_at")
      .single();

    if (error) throw error;

    if (body.mark_as_published === true) {
      await supabase
        .from("editorial_calendar")
        .update({
          status: "published",
          published_at: body.published_at ?? body.captured_at ?? new Date().toISOString(),
          updated_by: body.updated_by ?? "metrics-api",
        })
        .eq("id", body.content_id);
    }

    return Response.json({ success: true, metric: data }, { headers: corsHeaders });
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
