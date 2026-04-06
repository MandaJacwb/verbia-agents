import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/client.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const supabase = getServiceClient();

    const editorialPayload = {
      id: body.id,
      content_code: body.content_code,
      title: body.title,
      pillar: body.pillar,
      campaign: body.campaign,
      format: body.format,
      channel: body.channel ?? "instagram",
      status: body.status ?? "drafted",
      owner_name: body.owner_name,
      planned_for: body.planned_for,
      scheduled_for: body.scheduled_for,
      approval_due_at: body.approval_due_at,
      external_ref: body.external_ref,
      tags: body.tags ?? [],
      updated_by: body.updated_by ?? "api",
      created_by: body.created_by ?? "api",
    };

    const { data: content, error: contentError } = await supabase
      .from("editorial_calendar")
      .upsert(editorialPayload, { onConflict: "content_code" })
      .select("id, content_code, status")
      .single();

    if (contentError) throw contentError;

    if (body.copy?.caption) {
      await supabase.from("copies").insert({
        content_id: content.id,
        version: body.copy.version ?? 1,
        headline: body.copy.headline,
        caption: body.copy.caption,
        cta: body.copy.cta,
        hook: body.copy.hook,
        hashtags: body.copy.hashtags ?? [],
        ai_generated: body.copy.ai_generated ?? true,
        source: body.copy.source ?? "api",
        active: true,
      });
    }

    if (body.prompt?.prompt_text) {
      await supabase.from("prompts").insert({
        content_id: content.id,
        prompt_type: body.prompt.prompt_type ?? "creative",
        provider: body.prompt.provider,
        model: body.prompt.model,
        prompt_text: body.prompt.prompt_text,
        variables: body.prompt.variables ?? {},
        response_text: body.prompt.response_text,
        active: true,
      });
    }

    if (Array.isArray(body.assets) && body.assets.length > 0) {
      const assetRows = body.assets.map((asset: Record<string, unknown>, index: number) => ({
        content_id: content.id,
        asset_type: asset.asset_type,
        bucket_name: asset.bucket_name ?? "mandaja-assets",
        storage_path: asset.storage_path,
        public_url: asset.public_url,
        mime_type: asset.mime_type,
        width: asset.width,
        height: asset.height,
        duration_seconds: asset.duration_seconds,
        metadata: asset.metadata ?? {},
        is_primary: asset.is_primary ?? index === 0,
      }));

      await supabase.from("assets").insert(assetRows);
    }

    return Response.json(
      {
        success: true,
        content,
      },
      { headers: corsHeaders },
    );
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
