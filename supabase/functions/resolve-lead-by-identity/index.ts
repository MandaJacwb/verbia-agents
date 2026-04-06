import { corsHeaders } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/client.ts";
import { jsonError, jsonOk, normalizeEmail, normalizeInstagramHandle, normalizePhone } from "../_shared/crm.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const phone = normalizePhone(body.phone_e164 ?? body.phone);
    const email = normalizeEmail(body.email);
    const instagram = normalizeInstagramHandle(body.instagram_handle);
    const supabase = getServiceClient();

    if (body.lead_id) {
      const { data, error } = await supabase
        .from("crm_leads")
        .select("*, contact:crm_contacts(*), company:crm_companies(*)")
        .eq("id", body.lead_id)
        .maybeSingle();
      if (error) throw error;
      return jsonOk({ success: true, lead: data ?? null });
    }

    if (!phone && !email && !instagram) {
      throw new Error("lead_id or a valid identity is required");
    }

    let contactQuery = supabase.from("crm_contacts").select("id").limit(1);
    if (phone) contactQuery = contactQuery.eq("phone_e164", phone);
    else if (email) contactQuery = contactQuery.eq("email", email);
    else if (instagram) contactQuery = contactQuery.eq("instagram_handle", instagram);

    const { data: contact, error: contactError } = await contactQuery.maybeSingle();
    if (contactError) throw contactError;
    if (!contact?.id) return jsonOk({ success: true, lead: null });

    const { data, error } = await supabase
      .from("crm_leads")
      .select("*, contact:crm_contacts(*), company:crm_companies(*)")
      .eq("contact_id", contact.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;

    return jsonOk({ success: true, lead: data ?? null });
  } catch (error) {
    return jsonError(error);
  }
});
