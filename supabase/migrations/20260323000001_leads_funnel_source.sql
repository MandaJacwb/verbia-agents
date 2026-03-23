-- =============================================
-- Migration: Add funnel and source to leads
-- Purpose: Support Inbound/Outbound separation
-- =============================================

-- Funnel type: inbound (attraction) vs outbound (prospecting)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS funnel TEXT DEFAULT 'inbound'
  CHECK (funnel IN ('inbound', 'outbound'));

-- Source tracking: where the lead came from
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT
  CHECK (source IN ('webhook', 'whatsapp', 'sheets', 'facebook', 'manual', 'landing_page'));

-- Index for funnel filtering (dashboard queries)
CREATE INDEX IF NOT EXISTS idx_leads_funnel ON leads(funnel);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
