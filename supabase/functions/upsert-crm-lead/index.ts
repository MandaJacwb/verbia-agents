import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/client.ts";
import {
  buildLeadEnvelope,
  computeQualificationFeatures,
  jsonError,
  jsonOk,
} from "../_shared/crm.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const supabase = getServiceClient();
    const envelope = buildLeadEnvelope(body);
    const payload = envelope.lead_payload as Record<string, unknown>;

    let contactId: string | null = null;
    const phone = envelope.identity.phone_e164;
    const email = envelope.identity.email;
    const instagramHandle = envelope.identity.instagram_handle;

    if (phone || email || instagramHandle) {
      let contactQuery = supabase.from("crm_contacts").select("id").limit(1);
      if (phone) contactQuery = contactQuery.eq("phone_e164", phone);
      else if (email) contactQuery = contactQuery.eq("email", email);
      else if (instagramHandle) contactQuery = contactQuery.eq("instagram_handle", instagramHandle);

      const { data: existingContact } = await contactQuery.maybeSingle();

      if (existingContact?.id) {
        contactId = existingContact.id;
        const { error } = await supabase
          .from("crm_contacts")
          .update({
            full_name: payload.full_name,
            job_title: payload.job_title,
            phone_raw: body.phone_raw ?? body.phone ?? body.telefone ?? null,
            phone_e164: phone,
            email,
            instagram_handle: instagramHandle,
            city: payload.city,
            district: payload.district,
            source: envelope.source_channel,
          })
          .eq("id", contactId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("crm_contacts")
          .insert({
            full_name: payload.full_name,
            job_title: payload.job_title,
            phone_raw: body.phone_raw ?? body.phone ?? body.telefone ?? null,
            phone_e164: phone,
            email,
            instagram_handle: instagramHandle,
            city: payload.city,
            district: payload.district,
            source: envelope.source_channel,
          })
          .select("id")
          .single();
        if (error) throw error;
        contactId = data.id;
      }
    }

    let companyId: string | null = null;
    if (payload.company_name) {
      const { data: existingCompany } = await supabase
        .from("crm_companies")
        .select("id")
        .ilike("name", String(payload.company_name))
        .eq("city", String(payload.city ?? ""))
        .maybeSingle();

      if (existingCompany?.id) {
        companyId = existingCompany.id;
        const { error } = await supabase
          .from("crm_companies")
          .update({
            district: payload.district,
            segment: body.segment ?? null,
            delivery_volume: payload.delivery_volume,
          })
          .eq("id", companyId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("crm_companies")
          .insert({
            name: payload.company_name,
            city: payload.city,
            district: payload.district,
            segment: body.segment ?? null,
            delivery_volume: payload.delivery_volume,
          })
          .select("id")
          .single();
        if (error) throw error;
        companyId = data.id;
      }
    }

    const defaults = computeQualificationFeatures({
      ...payload,
      segment: body.segment ?? null,
    });

    const leadPatch = {
      contact_id: contactId,
      company_id: companyId,
      source_channel: envelope.source_channel,
      channel: envelope.channel,
      external_ref: payload.external_ref,
      lifecycle_stage: body.lifecycle_stage ?? "lead",
      pipeline_stage: body.pipeline_stage ?? "novo_lead",
      lead_status: body.lead_status ?? "new",
      score: Number(body.score ?? defaults.score),
      qualification: body.qualification ?? defaults.qualification,
      next_step: body.next_step ?? defaults.next_step,
      owner_name: body.owner_name ?? null,
      decision_maker: Boolean(body.decision_maker ?? defaults.score_features.decision_maker),
      pain_points: Array.isArray(body.pain_points) ? body.pain_points : [],
      score_features: body.score_features ?? defaults.score_features,
      lead_payload: envelope.lead_payload,
      correlation_id: envelope.correlation_id,
    };

    let lead;
    if (payload.external_ref) {
      const { data, error } = await supabase
        .from("crm_leads")
        .upsert(leadPatch, { onConflict: "external_ref" })
        .select("id, lead_status, pipeline_stage, lifecycle_stage, channel, source_channel")
        .single();
      if (error) throw error;
      lead = data;
    } else {
      const { data: existingLead } = await supabase
        .from("crm_leads")
        .select("id")
        .eq("contact_id", contactId)
        .eq("pipeline_stage", body.pipeline_stage ?? "novo_lead")
        .maybeSingle();

      if (existingLead?.id) {
        const { data, error } = await supabase
          .from("crm_leads")
          .update(leadPatch)
          .eq("id", existingLead.id)
          .select("id, lead_status, pipeline_stage, lifecycle_stage, channel, source_channel")
          .single();
        if (error) throw error;
        lead = data;
      } else {
        const { data, error } = await supabase
          .from("crm_leads")
          .insert(leadPatch)
          .select("id, lead_status, pipeline_stage, lifecycle_stage, channel, source_channel")
          .single();
        if (error) throw error;
        lead = data;
      }
    }

    return jsonOk({
      success: true,
      envelope,
      lead,
      contact_id: contactId,
      company_id: companyId,
    });
  } catch (error) {
    return jsonError(error);
  }
});
