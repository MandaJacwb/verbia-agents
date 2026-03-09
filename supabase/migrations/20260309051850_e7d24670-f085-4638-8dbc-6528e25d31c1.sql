
-- Table for dashboard interactions (populated by n8n or external sources)
CREATE TABLE public.interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  lead_name TEXT NOT NULL,
  action TEXT NOT NULL,
  is_hot BOOLEAN NOT NULL DEFAULT false,
  interaction_type TEXT NOT NULL DEFAULT 'other',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- Public read policy (dashboard is public, data comes from n8n)
CREATE POLICY "Allow public read on interactions"
  ON public.interactions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow inserts from service role / anon (n8n webhook)
CREATE POLICY "Allow inserts on interactions"
  ON public.interactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.interactions;
