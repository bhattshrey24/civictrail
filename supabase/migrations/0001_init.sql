-- CivicTrail initial schema.
-- Mirrors src/lib/domain/schema.ts. Apply to a Supabase/Postgres project:
--   supabase db push      (or)   psql "$DATABASE_URL" -f supabase/migrations/0001_init.sql
--
-- Security model: the PUBLIC (anon) role may ONLY read. All writes go through the
-- service role (used solely by seed/migration scripts), which bypasses RLS.
-- Not yet applied — no hosted DB exists in this environment (see docs/ai-log.md).

-- Enum-like domains kept as CHECK constraints for migration simplicity.

create table if not exists locality (
  id                          text primary key,
  name                        text not null,
  ward_numbers                int[] not null default '{}',
  assembly_constituency       text,
  parliamentary_constituency  text,
  pincodes                    text[] not null default '{}'
);

create table if not exists agency (
  id            text primary key,
  name          text not null,
  kind          text not null check (kind in ('MCD','PWD','DJB','IFC','DDA','NDMC','DISCOM','OTHER')),
  role          text not null,
  contact_url   text,
  escalation_url text,
  confidence    text not null check (confidence in ('verified','inferred','unverified'))
);

create table if not exists official (
  id          text primary key,
  agency_id   text not null references agency(id) on delete cascade,
  name        text not null,
  designation text not null,
  term_start  date,
  term_end    date,
  confidence  text not null check (confidence in ('verified','inferred','unverified'))
);

create table if not exists representative (
  id            text primary key,
  type          text not null check (type in ('MP','MLA','councillor')),
  name          text not null,
  constituency  text not null,
  party         text,
  term_start    date,
  term_end      date,
  confidence    text not null check (confidence in ('verified','inferred','unverified'))
);

create table if not exists asset (
  id              text primary key,
  locality_id     text not null references locality(id) on delete cascade,
  type            text not null check (type in ('road','drain','streetlight','project','other')),
  name            text not null,
  description     text,
  owner_agency_id text references agency(id) on delete set null,
  confidence      text not null check (confidence in ('verified','inferred','unverified'))
);

create table if not exists issue (
  id          text primary key,
  asset_id    text not null references asset(id) on delete cascade,
  title       text not null,
  description text,
  status      text not null check (status in ('pending','in_progress','completed','unclear')),
  confidence  text not null check (confidence in ('verified','inferred','unverified'))
);

-- 1:1 with issue (nullable relationship — not every issue has a project).
create table if not exists project (
  id            text primary key,
  issue_id      text not null unique references issue(id) on delete cascade,
  tender_ref    text,
  contractor    text,
  cost_inr      numeric check (cost_inr is null or cost_inr >= 0),
  deadline      date,
  progress_note text,
  delay_note    text
);

create table if not exists responsibility (
  id          text primary key,
  issue_id    text not null references issue(id) on delete cascade,
  party_type  text not null check (party_type in ('agency','official','representative')),
  party_id    text not null,
  basis       text not null check (basis in ('direct','oversight','political','shared','unclear')),
  reasoning   text not null,
  confidence  text not null check (confidence in ('verified','inferred','unverified'))
);

-- Polymorphic evidence: attached to any subject by (subject_type, subject_id).
create table if not exists evidence (
  id            bigint generated always as identity primary key,
  subject_type  text not null check (subject_type in ('agency','official','representative','asset','issue','responsibility')),
  subject_id    text not null,
  source_url    text not null,
  source_date   date,
  verified_at   date not null,
  excerpt       text,
  is_official   boolean not null default false
);

create index if not exists evidence_subject_idx on evidence (subject_type, subject_id);
create index if not exists asset_locality_idx on asset (locality_id);
create index if not exists issue_asset_idx on issue (asset_id);
create index if not exists responsibility_issue_idx on responsibility (issue_id);

-- Application-level guard mirroring validate.ts: a responsibility that asserts
-- real responsibility must cite evidence. Enforced as a trigger so bad rows
-- cannot be inserted even outside the app.
create or replace function enforce_responsibility_evidence()
returns trigger
language plpgsql
as $$
begin
  if NEW.basis in ('direct','oversight','political') then
    if not exists (
      select 1 from evidence e
      where e.subject_type = 'responsibility' and e.subject_id = NEW.id
    ) then
      raise exception
        'responsibility % has basis % but no evidence (constituency alone is not control)',
        NEW.id, NEW.basis;
    end if;
  end if;
  return NEW;
end;
$$;

-- Deferred so evidence rows inserted in the same transaction count.
create constraint trigger responsibility_requires_evidence
  after insert or update on responsibility
  deferrable initially deferred
  for each row execute function enforce_responsibility_evidence();

-- ---------------------------------------------------------------------------
-- Row Level Security: public read-only. No anon writes.
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'locality','agency','official','representative','asset','issue',
    'project','responsibility','evidence'
  ] loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists %I_read on %I;', t, t);
    execute format(
      'create policy %I_read on %I for select to anon, authenticated using (true);',
      t, t
    );
  end loop;
end $$;
