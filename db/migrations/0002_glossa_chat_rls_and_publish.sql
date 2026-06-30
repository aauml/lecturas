-- Glossa · migración 0002 — operación desde chat (móvil sin git)
-- Aplicada a Supabase project phd-kb (wtwuvrtmadnlezkbesqp) el 2026-06-30.
-- Additive. Dos cosas:
--   1) Políticas RLS para que el chat (anon key) lea/escriba la procedencia glossa_*.
--   2) Cola de publicación + trigger pg_net -> repository_dispatch a aauml/glossa
--      (mismo patrón que council_requests/council_dispatch en phd-kb).
-- Frontera PUB intacta: nada de esto toca evaluated_items ni PM.

-- ─────────────────────────────────────────────────────────────
-- 1) RLS en glossa_* (espeja council_requests: service_role ALL; anon INSERT/SELECT)
-- ─────────────────────────────────────────────────────────────

grant select, insert            on public.glossa_seeds          to anon;
grant select, insert, update    on public.glossa_issues         to anon;
grant select, insert            on public.glossa_issue_sources  to anon;
grant all on public.glossa_seeds, public.glossa_issues, public.glossa_issue_sources to service_role;

-- glossa_seeds
create policy glossa_seeds_service_all on public.glossa_seeds for all   to service_role using (true) with check (true);
create policy glossa_seeds_anon_insert on public.glossa_seeds for insert to anon          with check (true);
create policy glossa_seeds_anon_select on public.glossa_seeds for select to anon          using (true);

-- glossa_issues
create policy glossa_issues_service_all on public.glossa_issues for all    to service_role using (true) with check (true);
create policy glossa_issues_anon_insert on public.glossa_issues for insert  to anon          with check (true);
create policy glossa_issues_anon_select on public.glossa_issues for select  to anon          using (true);
create policy glossa_issues_anon_update on public.glossa_issues for update  to anon          using (true) with check (true);

-- glossa_issue_sources
create policy glossa_isrc_service_all on public.glossa_issue_sources for all    to service_role using (true) with check (true);
create policy glossa_isrc_anon_insert on public.glossa_issue_sources for insert  to anon          with check (true);
create policy glossa_isrc_anon_select on public.glossa_issue_sources for select  to anon          using (true);

-- ─────────────────────────────────────────────────────────────
-- 2) Cola de publicación (el chat escribe aquí; un GitHub Action materializa al repo)
-- ─────────────────────────────────────────────────────────────

create table if not exists public.glossa_publish_requests (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid references public.glossa_issues(id),
  slug text not null,
  issue_no text,
  body_en text not null,                 -- MDX completo EN (frontmatter + cuerpo)
  body_es text,                          -- MDX completo ES (opcional)
  sources_json jsonb,                    -- sidecar de procedencia
  state text not null default 'queued',  -- queued -> building -> done | error
  commit_sha text,
  url_en text,
  url_es text,
  error text,
  requested_by text not null default 'chat',
  requested_at timestamptz not null default now(),
  done_at timestamptz
);
comment on table public.glossa_publish_requests is 'Glossa: cola de publicación desde superficies sin git (chat/móvil). Un GitHub Action (glossa-publish.yml) drena state=queued, escribe los MDX al repo aauml/glossa y devuelve url_en/url_es/commit_sha.';

create index if not exists glossa_publish_state_idx on public.glossa_publish_requests(state);

alter table public.glossa_publish_requests enable row level security;
grant select, insert on public.glossa_publish_requests to anon;
grant all           on public.glossa_publish_requests to service_role;

create policy glossa_pub_service_all on public.glossa_publish_requests for all    to service_role using (true) with check (true);
create policy glossa_pub_anon_insert on public.glossa_publish_requests for insert  to anon          with check (true);
create policy glossa_pub_anon_select on public.glossa_publish_requests for select  to anon          using (true);

-- Trigger: al encolar (state='queued') dispara repository_dispatch a aauml/glossa.
-- Clona public.council_dispatch (lee github_dispatch_pat del Vault, net.http_post).
create or replace function public.glossa_publish_dispatch()
  returns trigger
  language plpgsql
  security definer
  set search_path to 'public','vault','net','extensions'
as $function$
declare
  tok text;
begin
  if new.state = 'queued' then
    select decrypted_secret into tok
      from vault.decrypted_secrets
     where name = 'github_dispatch_pat'
     limit 1;

    if tok is not null then
      perform net.http_post(
        url := 'https://api.github.com/repos/aauml/glossa/dispatches',
        headers := jsonb_build_object(
          'Authorization', 'Bearer ' || tok,
          'Accept', 'application/vnd.github+json',
          'User-Agent', 'supabase-glossa',
          'Content-Type', 'application/json'
        ),
        body := jsonb_build_object(
          'event_type', 'glossa_publish',
          'client_payload', jsonb_build_object('id', new.id::text)
        )
      );
    end if;
  end if;
  return new;
end;
$function$;

drop trigger if exists glossa_publish_dispatch_trg on public.glossa_publish_requests;
create trigger glossa_publish_dispatch_trg
  after insert on public.glossa_publish_requests
  for each row execute function public.glossa_publish_dispatch();
