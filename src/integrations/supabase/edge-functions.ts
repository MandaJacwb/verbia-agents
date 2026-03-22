import { supabase } from "./client";

/**
 * Send a WhatsApp message through the secure proxy:
 * Frontend → Edge Function → N8N → Evolution API → WhatsApp
 *
 * Credentials never touch the frontend.
 */
export async function sendWhatsAppMessage(
  phone: string,
  message: string,
  conversationId?: string
) {
  const { data, error } = await supabase.functions.invoke("send-message", {
    body: { phone, message, conversation_id: conversationId },
  });

  if (error) throw error;
  return data;
}

/**
 * Generic edge function caller with auth.
 * The Supabase client automatically attaches the user's JWT.
 */
export async function invokeEdgeFunction<T = unknown>(
  functionName: string,
  body: Record<string, unknown>
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
  });

  if (error) throw error;
  return data as T;
}
