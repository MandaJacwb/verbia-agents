import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/client.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const supabase = getServiceClient();

    if (!body.content_id || !body.scheduled_for) {
      throw new Error("content_id and scheduled_for are required");
    }

    const { data, error } = await supabase
      .from("editorial_calendar")
      .update({
        scheduled_for: body.scheduled_for,
        status: body.status ?? "scheduled",
        updated_by: body.updated_by ?? "schedule-api",
      })
      .eq("id", body.content_id)
      .select("id, status, scheduled_for")
      .single();

    if (error) throw error;

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
