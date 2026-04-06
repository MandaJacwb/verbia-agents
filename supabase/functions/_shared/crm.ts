import { corsHeaders } from "./cors.ts";

export function jsonOk(payload: unknown, init: ResponseInit = {}) {
  return Response.json(payload, {
    ...init,
    headers: {
      ...corsHeaders,
      ...(init.headers ?? {}),
    },
  });
}

export function jsonError(error: unknown, status = 400) {
  return jsonOk(
    {
      success: false,
      error: error instanceof Error ? error.message : "unknown_error",
    },
    { status },
  );
}

export function normalizePhone(value: unknown) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return null;
  return digits.startsWith("55") ? digits : `55${digits}`;
}

export function normalizeInstagramHandle(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  return raw.replace(/^@+/, "").toLowerCase();
}

export function normalizeEmail(value: unknown) {
  const raw = String(value ?? "").trim().toLowerCase();
  return raw || null;
}

export function buildLeadEnvelope(body: Record<string, unknown>) {
  const phone = normalizePhone(
    body.phone_e164 ??
      body.phone ??
      body.telefone ??
      (body.identity as Record<string, unknown> | undefined)?.phone_e164,
  );
  const email = normalizeEmail(
    body.email ?? (body.identity as Record<string, unknown> | undefined)?.email,
  );
  const instagramHandle = normalizeInstagramHandle(
    body.instagram_handle ??
      body.instagram ??
      (body.identity as Record<string, unknown> | undefined)?.instagram_handle,
  );
  const sourceChannel = String(body.source_channel ?? "site");
  const consent = Boolean(body.whatsapp_consent ?? body.consent ?? false);
  const incomingChannel = String(body.channel ?? "").trim().toLowerCase();

  let channel = incomingChannel || "web";
  if (!incomingChannel) {
    if (sourceChannel === "instagram" || instagramHandle) channel = "instagram";
    else if (email && !phone) channel = "email";
    else if (phone && consent) channel = "whatsapp";
    else channel = "web";
  }

  return {
    source_channel: sourceChannel,
    channel,
    identity: {
      phone_e164: phone,
      email,
      instagram_handle: instagramHandle,
    },
    lead_payload: {
      full_name: body.full_name ?? body.name ?? body.nome ?? null,
      job_title: body.job_title ?? body.cargo ?? null,
      company_name: body.company_name ?? body.empresa ?? null,
      city: body.city ?? body.cidade ?? null,
      district: body.district ?? body.bairro ?? null,
      delivery_volume: body.delivery_volume ?? body.volume ?? null,
      message_text: body.message_text ?? body.mensagem ?? null,
      pain_points_raw: body.pain_points_raw ?? body.dor ?? null,
      external_ref: body.external_ref ?? body.lead_id ?? body.id ?? null,
      gclid: body.gclid ?? null,
      utm_source: body.utm_source ?? null,
      utm_medium: body.utm_medium ?? null,
      utm_campaign: body.utm_campaign ?? null,
      utm_term: body.utm_term ?? null,
      utm_content: body.utm_content ?? null,
      raw: body,
    },
    correlation_id: String(body.correlation_id ?? crypto.randomUUID()),
  };
}

const intentKeywords = {
  more_info: ["1", "SABER MAIS", "MAIS", "QUERO", "INFO"],
  not_interested: ["2", "SEM INTERESSE", "NAO", "NÃO", "NAO QUERO", "AGORA NAO", "AGORA NÃO"],
  opt_out: ["SAIR", "PARE", "STOP", "CANCELAR", "DESCADASTRAR", "REMOVER"],
} as const;

export function classifyIntent(text: unknown) {
  const message = String(text ?? "").trim().toUpperCase();
  if (!message) return "other";

  for (const keyword of intentKeywords.opt_out) {
    if (message === keyword || message.includes(keyword)) return "opt_out";
  }
  for (const keyword of intentKeywords.not_interested) {
    if (message === keyword || message.includes(keyword)) return "not_interested";
  }
  for (const keyword of intentKeywords.more_info) {
    if (message === keyword || message.includes(keyword)) return "more_info";
  }

  return "other";
}

export function computeQualificationFeatures(payload: Record<string, unknown>) {
  const volumeValue = Number(String(payload.delivery_volume ?? "").replace(/[^\d]/g, "")) || 0;
  const role = String(payload.job_title ?? "").toLowerCase();
  const city = String(payload.city ?? "").toLowerCase();
  const pain = String(payload.pain_points_raw ?? payload.message_text ?? "").toLowerCase();
  const segment = String(payload.segment ?? payload.company_segment ?? "").toLowerCase();

  const features = {
    delivery_volume: volumeValue,
    decision_maker: /(ceo|founder|s[oó]cio|diretor|gerente|opera[cç][aã]o|coordenador)/.test(role),
    city_priority: /(sao paulo|são paulo|rio de janeiro|belo horizonte|curitiba)/.test(city),
    pain_sla: /(sla|atras|atraso|custo|roteir|entrega|last-mile)/.test(pain),
    segment_fit: /(farm|e-?commerce|restaurante|mercado|loja)/.test(segment),
  };

  let score = 0;
  if (features.delivery_volume >= 300) score += 35;
  else if (features.delivery_volume >= 100) score += 20;
  if (features.decision_maker) score += 20;
  if (features.city_priority) score += 15;
  if (features.pain_sla) score += 15;
  if (features.segment_fit) score += 15;

  const qualification = score >= 75 ? "hot" : score >= 45 ? "warm" : "cold";
  const next_step =
    qualification === "hot" ? "meeting_or_closer" : qualification === "warm" ? "sdr_followup" : "nurture";

  return { score, qualification, next_step, score_features: features };
}
