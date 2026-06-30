-- Glossa · migración 0003 — worker secretless (anon)
-- Aplicada a Supabase project phd-kb (wtwuvrtmadnlezkbesqp) el 2026-06-30.
-- El worker glossa-publish.yml corre con la anon key PÚBLICA (sin secretos en el repo,
-- mínimo privilegio en CI). Necesita UPDATE en la cola para devolver state/urls/commit_sha.
-- (anon ya tiene UPDATE en glossa_issues desde 0002.)

grant update on public.glossa_publish_requests to anon;

create policy glossa_pub_anon_update on public.glossa_publish_requests
  for update to anon using (true) with check (true);
