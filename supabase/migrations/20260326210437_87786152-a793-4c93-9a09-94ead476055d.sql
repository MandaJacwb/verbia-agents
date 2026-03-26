do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'crm_lifecycle_stage'
  ) then
    create type public.crm_lifecycle_stage as enum (
      'lead',
      'mql',
      'sql',
      'opportunity',
      'customer',
      'post_sale'
    );
  end if;

  if not exists (
    select 1 from pg_type where typname = 'crm_pipeline_stage'
  ) then
    create type public.crm_pipeline_stage as enum (
      'novo_lead',
      'qualificacao_sdr',
      'handoff_closer',
      'reuniao',
      'duvidas',
      'contrato',
      'onboarding',
      'pos_venda'
    );
  end if;

  if not exists (
    select 1 from pg_type where typname = 'crm_lead_status'
  ) then
    create type public.crm_lead_status as enum (
      'new',
      'waiting_reply',
      'nurture',
      'qualified',
      'disqualified',
      'meeting_set',
      'opt_out',
      'customer_redirected',
      'support_redirected'
    );
  end if;

  if not exists (
    select 1 from pg_type where typname = 'crm_task_status'
  ) then
    create type public.crm_task_status as enum (
      'open',
      'in_progress',
      'completed',
      'cancelled'
    );
  end if;
end $$;

create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  job_title text,
  phone_raw text,
  phone_e164 text,
  email text,
  instagram_handle text,
  city text,
  district text,
  source text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.crm_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  district text,
  segment text,
  delivery_volume text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.crm_contacts(id) on delete set null,
  company_id uuid references public.crm_companies(id) on delete set null,
  source_channel text,
  channel text,
  external_ref text,
  lifecycle_stage public.crm_lifecycle_stage not null default 'lead',
  pipeline_stage public.crm_pipeline_stage not null default 'novo_lead',
  lead_status public.crm_lead_status not null default 'new',
  score integer not null default 0,
  qualification text,
  next_step text,
  owner_name text,
  attempt_count integer not null default 0,
  last_contact_at timestamptz,
  last_reply_at timestamptz,
  do_not_contact boolean not null default false,
  do_not_contact_reason text,
  unsubscribe_source text,
  unsubscribe_at timestamptz,
  disqualify_reason text,
  cooldown_until timestamptz,
  pain_points text[] not null default '{}',
  sla_need text,
  decision_maker boolean not null default false,
  meeting_at timestamptz,
  score_features jsonb not null default '{}'::jsonb,
  lead_payload jsonb not null default '{}'::jsonb,
  correlation_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.crm_leads(id) on delete cascade,
  task_type text not null,
  title text not null,
  description text,
  channel text,
  priority text default 'normal',
  due_at timestamptz,
  status public.crm_task_status not null default 'open',
  related_message_id text,
  correlation_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.crm_owners (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  owner_type text not null default 'closer',
  region text,
  active boolean not null default true,
  round_robin_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.crm_message_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.crm_leads(id) on delete cascade,
  contact_id uuid references public.crm_contacts(id) on delete set null,
  channel text not null,
  direction text not null,
  provider text,
  intent text,
  message_text text,
  provider_message_id text,
  message_status text,
  raw_payload jsonb not null default '{}'::jsonb,
  correlation_id text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.crm_event_logs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.crm_leads(id) on delete cascade,
  event_type text not null,
  event_source text,
  payload jsonb not null default '{}'::jsonb,
  correlation_id text,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists crm_contacts_phone_e164_uq
  on public.crm_contacts(phone_e164)
  where phone_e164 is not null;

create unique index if not exists crm_leads_external_ref_uq
  on public.crm_leads(external_ref)
  where external_ref is not null;

create unique index if not exists crm_companies_name_city_uq
  on public.crm_companies(lower(name), lower(coalesce(city, '')));

create index if not exists crm_leads_contact_idx on public.crm_leads(contact_id);
create index if not exists crm_leads_company_idx on public.crm_leads(company_id);
create index if not exists crm_leads_status_idx on public.crm_leads(lead_status);
create index if not exists crm_leads_pipeline_idx on public.crm_leads(pipeline_stage);
create index if not exists crm_leads_lifecycle_idx on public.crm_leads(lifecycle_stage);
create index if not exists crm_leads_cooldown_idx on public.crm_leads(cooldown_until);
create index if not exists crm_tasks_lead_status_idx on public.crm_tasks(lead_id, status);
create index if not exists crm_message_events_lead_idx on public.crm_message_events(lead_id, created_at desc);
create index if not exists crm_event_logs_lead_idx on public.crm_event_logs(lead_id, created_at desc);

drop trigger if exists set_crm_contacts_updated_at on public.crm_contacts;
create trigger set_crm_contacts_updated_at
before update on public.crm_contacts
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_crm_companies_updated_at on public.crm_companies;
create trigger set_crm_companies_updated_at
before update on public.crm_companies
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_crm_leads_updated_at on public.crm_leads;
create trigger set_crm_leads_updated_at
before update on public.crm_leads
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_crm_tasks_updated_at on public.crm_tasks;
create trigger set_crm_tasks_updated_at
before update on public.crm_tasks
for each row
execute procedure public.set_updated_at();

alter table public.crm_contacts enable row level security;
alter table public.crm_companies enable row level security;
alter table public.crm_leads enable row level security;
alter table public.crm_tasks enable row level security;
alter table public.crm_owners enable row level security;
alter table public.crm_message_events enable row level security;
alter table public.crm_event_logs enable row level security;

drop policy if exists "Allow service role full crm_contacts" on public.crm_contacts;
create policy "Allow service role full crm_contacts"
on public.crm_contacts for all to service_role
using (true) with check (true);

drop policy if exists "Allow service role full crm_companies" on public.crm_companies;
create policy "Allow service role full crm_companies"
on public.crm_companies for all to service_role
using (true) with check (true);

drop policy if exists "Allow service role full crm_leads" on public.crm_leads;
create policy "Allow service role full crm_leads"
on public.crm_leads for all to service_role
using (true) with check (true);

drop policy if exists "Allow service role full crm_tasks" on public.crm_tasks;
create policy "Allow service role full crm_tasks"
on public.crm_tasks for all to service_role
using (true) with check (true);

drop policy if exists "Allow service role full crm_owners" on public.crm_owners;
create policy "Allow service role full crm_owners"
on public.crm_owners for all to service_role
using (true) with check (true);

drop policy if exists "Allow service role full crm_message_events" on public.crm_message_events;
create policy "Allow service role full crm_message_events"
on public.crm_message_events for all to service_role
using (true) with check (true);

drop policy if exists "Allow service role full crm_event_logs" on public.crm_event_logs;
create policy "Allow service role full crm_event_logs"
on public.crm_event_logs for all to service_role
using (true) with check (true);