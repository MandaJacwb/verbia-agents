
-- Add message content fields to interactions table
-- These allow N8N to store WhatsApp message details so the Atendimento page can display them

ALTER TABLE public.interactions
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS message_content TEXT,
  ADD COLUMN IF NOT EXISTS contact_name TEXT;
