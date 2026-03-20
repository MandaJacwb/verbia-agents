-- =============================================
-- VerbIA Agents — Schema Completo Sprint 1
-- Todas as tabelas com RLS por account_id
-- =============================================

-- -----------------------------------------------
-- 1. ACCOUNTS — Uma por empresa cliente
-- -----------------------------------------------
CREATE TABLE public.accounts (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  cnpj       TEXT,
  plan       TEXT        NOT NULL DEFAULT 'starter',
  status     TEXT        NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------
-- 2. PROFILES — Um por usuário (estende auth.users)
-- -----------------------------------------------
CREATE TABLE public.profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID        NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  full_name  TEXT,
  role       TEXT        NOT NULL DEFAULT 'atendente'
               CHECK (role IN ('admin_conta', 'admin', 'atendente')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_account_id ON public.profiles(account_id);

-- -----------------------------------------------
-- 3. AGENTS — Agentes de IA por conta
-- -----------------------------------------------
CREATE TABLE public.agents (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id       UUID        NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  name             TEXT        NOT NULL,
  description      TEXT,
  objective        TEXT,
  tone             TEXT        NOT NULL DEFAULT 'professional',
  active           BOOLEAN     NOT NULL DEFAULT true,
  config           JSONB       NOT NULL DEFAULT '{}',
  n8n_webhook_url  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_agents_account_id ON public.agents(account_id);

-- -----------------------------------------------
-- 4. CONTACTS — CRM de contatos
-- -----------------------------------------------
CREATE TABLE public.contacts (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID        NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  phone      TEXT,
  email      TEXT,
  company    TEXT,
  tags       TEXT[]      DEFAULT '{}',
  metadata   JSONB       DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contacts_account_id ON public.contacts(account_id);

-- -----------------------------------------------
-- 5. CONVERSATIONS — Conversas de atendimento
-- -----------------------------------------------
CREATE TABLE public.conversations (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID        NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  agent_id   UUID        REFERENCES public.agents(id) ON DELETE SET NULL,
  contact_id UUID        REFERENCES public.contacts(id) ON DELETE SET NULL,
  channel    TEXT        NOT NULL DEFAULT 'whatsapp'
               CHECK (channel IN ('whatsapp', 'instagram', 'messenger', 'web')),
  status     TEXT        NOT NULL DEFAULT 'open'
               CHECK (status IN ('open', 'in_progress', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversations_account_id ON public.conversations(account_id);

-- -----------------------------------------------
-- 6. MESSAGES — Mensagens das conversas
-- -----------------------------------------------
CREATE TABLE public.messages (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID        NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  account_id      UUID        NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  role            TEXT        NOT NULL CHECK (role IN ('user', 'agent', 'system')),
  content         TEXT        NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_account_id      ON public.messages(account_id);

-- -----------------------------------------------
-- 7. LEADS — Leads qualificados
-- -----------------------------------------------
CREATE TABLE public.leads (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID        NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  contact_id UUID        REFERENCES public.contacts(id) ON DELETE SET NULL,
  agent_id   UUID        REFERENCES public.agents(id) ON DELETE SET NULL,
  score      INTEGER     NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  status     TEXT        NOT NULL DEFAULT 'new'
               CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  is_hot     BOOLEAN     NOT NULL DEFAULT false,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_account_id ON public.leads(account_id);

-- -----------------------------------------------
-- 8. MESSAGE_TEMPLATES — Templates de mensagem
-- -----------------------------------------------
CREATE TABLE public.message_templates (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID        NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  content    TEXT        NOT NULL,
  category   TEXT        NOT NULL DEFAULT 'general',
  variables  TEXT[]      DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_message_templates_account_id ON public.message_templates(account_id);

-- -----------------------------------------------
-- 9. CAMPAIGNS — Campanhas de disparo
-- -----------------------------------------------
CREATE TABLE public.campaigns (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id       UUID        NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  template_id      UUID        REFERENCES public.message_templates(id) ON DELETE SET NULL,
  name             TEXT        NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft', 'scheduled', 'running', 'paused', 'completed')),
  channel          TEXT        NOT NULL DEFAULT 'whatsapp',
  total_recipients INTEGER     NOT NULL DEFAULT 0,
  sent_count       INTEGER     NOT NULL DEFAULT 0,
  scheduled_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_campaigns_account_id ON public.campaigns(account_id);

-- -----------------------------------------------
-- 10. Adicionar account_id à interactions existente
-- -----------------------------------------------
ALTER TABLE public.interactions
  ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL;

-- -----------------------------------------------
-- FUNÇÕES AUXILIARES
-- -----------------------------------------------

-- Retorna account_id do usuário logado
CREATE OR REPLACE FUNCTION public.get_my_account_id()
RETURNS UUID
LANGUAGE SQL STABLE SECURITY DEFINER
AS $$
  SELECT account_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Retorna role do usuário logado
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE SQL STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_accounts_updated_at          BEFORE UPDATE ON public.accounts          FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_profiles_updated_at          BEFORE UPDATE ON public.profiles          FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_agents_updated_at            BEFORE UPDATE ON public.agents            FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_contacts_updated_at          BEFORE UPDATE ON public.contacts          FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_conversations_updated_at     BEFORE UPDATE ON public.conversations     FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_leads_updated_at             BEFORE UPDATE ON public.leads             FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_message_templates_updated_at BEFORE UPDATE ON public.message_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_campaigns_updated_at         BEFORE UPDATE ON public.campaigns         FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-criar profile ao cadastrar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF NEW.raw_user_meta_data->>'account_id' IS NOT NULL THEN
    INSERT INTO public.profiles (id, account_id, full_name, role)
    VALUES (
      NEW.id,
      (NEW.raw_user_meta_data->>'account_id')::UUID,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'role', 'atendente')
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------
-- RLS — POLICIES
-- -----------------------------------------------

-- ACCOUNTS
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visualizar própria conta"
  ON public.accounts FOR SELECT TO authenticated
  USING (id = public.get_my_account_id());

CREATE POLICY "admin_conta pode atualizar conta"
  ON public.accounts FOR UPDATE TO authenticated
  USING (id = public.get_my_account_id() AND public.get_my_role() = 'admin_conta');

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visualizar perfis da conta"
  ON public.profiles FOR SELECT TO authenticated
  USING (account_id = public.get_my_account_id());

CREATE POLICY "Atualizar próprio perfil"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins gerenciam perfis da conta"
  ON public.profiles FOR ALL TO authenticated
  USING (account_id = public.get_my_account_id()
    AND public.get_my_role() IN ('admin_conta', 'admin'));

-- AGENTS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visualizar agentes da conta"
  ON public.agents FOR SELECT TO authenticated
  USING (account_id = public.get_my_account_id());

CREATE POLICY "Admins gerenciam agentes"
  ON public.agents FOR ALL TO authenticated
  USING (account_id = public.get_my_account_id()
    AND public.get_my_role() IN ('admin_conta', 'admin'));

-- CONTACTS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visualizar contatos da conta"
  ON public.contacts FOR SELECT TO authenticated
  USING (account_id = public.get_my_account_id());

CREATE POLICY "Gerenciar contatos da conta"
  ON public.contacts FOR ALL TO authenticated
  USING (account_id = public.get_my_account_id());

-- CONVERSATIONS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visualizar conversas da conta"
  ON public.conversations FOR SELECT TO authenticated
  USING (account_id = public.get_my_account_id());

CREATE POLICY "Gerenciar conversas da conta"
  ON public.conversations FOR ALL TO authenticated
  USING (account_id = public.get_my_account_id());

-- MESSAGES
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visualizar mensagens da conta"
  ON public.messages FOR SELECT TO authenticated
  USING (account_id = public.get_my_account_id());

CREATE POLICY "Inserir mensagens na conta"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (account_id = public.get_my_account_id());

-- LEADS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visualizar leads da conta"
  ON public.leads FOR SELECT TO authenticated
  USING (account_id = public.get_my_account_id());

CREATE POLICY "Gerenciar leads da conta"
  ON public.leads FOR ALL TO authenticated
  USING (account_id = public.get_my_account_id());

-- MESSAGE_TEMPLATES
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visualizar templates da conta"
  ON public.message_templates FOR SELECT TO authenticated
  USING (account_id = public.get_my_account_id());

CREATE POLICY "Admins gerenciam templates"
  ON public.message_templates FOR ALL TO authenticated
  USING (account_id = public.get_my_account_id()
    AND public.get_my_role() IN ('admin_conta', 'admin'));

-- CAMPAIGNS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visualizar campanhas da conta"
  ON public.campaigns FOR SELECT TO authenticated
  USING (account_id = public.get_my_account_id());

CREATE POLICY "Admins gerenciam campanhas"
  ON public.campaigns FOR ALL TO authenticated
  USING (account_id = public.get_my_account_id()
    AND public.get_my_role() IN ('admin_conta', 'admin'));

-- INTERACTIONS — substituir políticas públicas por autenticadas
DROP POLICY IF EXISTS "Allow public read on interactions"  ON public.interactions;
DROP POLICY IF EXISTS "Allow inserts on interactions"      ON public.interactions;

CREATE POLICY "Visualizar interactions da conta"
  ON public.interactions FOR SELECT TO authenticated
  USING (account_id = public.get_my_account_id() OR account_id IS NULL);

CREATE POLICY "N8N insere interactions via service role"
  ON public.interactions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Realtime para conversations e messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
