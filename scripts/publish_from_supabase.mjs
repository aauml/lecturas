// Glossa — materializa una publicación encolada en Supabase hacia el repo.
// La usa .github/workflows/glossa-publish.yml (disparado por repository_dispatch
// desde el trigger glossa_publish_dispatch). Permite publicar desde superficies
// sin git (chat/móvil): el chat escribe glossa_publish_requests; este script lee
// la fila con la service key, escribe los MDX, y devuelve URLs/estado.
//
// Uso:
//   node scripts/publish_from_supabase.mjs prepare  <request_id>
//   node scripts/publish_from_supabase.mjs finalize <request_id> <commit_sha>
//   node scripts/publish_from_supabase.mjs fail     <request_id> "<mensaje>"
//
// Env: SUPABASE_URL, SUPABASE_SERVICE_KEY (leídos vía 1Password en el workflow).

import { writeFile, mkdir, appendFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const [, , cmd, id, arg] = process.argv;
const URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
// Public anon key (the chat path is all-anon; the worker is least-privilege CI).
const KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
const SITE = 'https://glossa.ademas.ai';

if (!URL || !KEY) { console.error('Missing SUPABASE_URL / SUPABASE_KEY'); process.exit(1); }
if (!cmd || !id) { console.error('usage: prepare|finalize|fail <id> [sha|msg]'); process.exit(1); }

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
const T = `${URL}/rest/v1/glossa_publish_requests`;

async function getRow(rid) {
  const r = await fetch(`${T}?id=eq.${rid}&select=*`, { headers: H });
  if (!r.ok) throw new Error(`get ${r.status}: ${await r.text()}`);
  const rows = await r.json();
  if (!rows.length) throw new Error(`request not found: ${rid}`);
  return rows[0];
}
async function patch(rid, body) {
  const r = await fetch(`${T}?id=eq.${rid}`, { method: 'PATCH', headers: H, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`patch ${r.status}: ${await r.text()}`);
}
async function patchIssue(issueId, body) {
  if (!issueId) return;
  await fetch(`${URL}/rest/v1/glossa_issues?id=eq.${issueId}`, { method: 'PATCH', headers: H, body: JSON.stringify(body) });
}
async function write(path, content) { await mkdir(dirname(path), { recursive: true }); await writeFile(path, content); }
async function out(kv) { if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, kv + '\n'); }

try {
  if (cmd === 'prepare') {
    const row = await getRow(id);
    if (!row.slug || !row.body_en) throw new Error('row missing slug or body_en');
    await patch(id, { state: 'building' });
    const dir = `src/content/articles/${row.slug}`;
    await write(`${dir}/en.mdx`, row.body_en);
    if (row.body_es) await write(`${dir}/es.mdx`, row.body_es);
    if (row.sources_json) await write(`${dir}/sources.json`, JSON.stringify(row.sources_json, null, 2) + '\n');
    await out(`slug=${row.slug}`);
    await out(`issue_no=${row.issue_no || ''}`);
    await out(`has_es=${row.body_es ? '1' : '0'}`);
    console.log(`prepared ${row.slug} (es=${row.body_es ? 'yes' : 'no'})`);
  } else if (cmd === 'finalize') {
    const row = await getRow(id);
    const base = `${SITE}/articles/${row.slug}`;
    const url_en = `${base}/en/`;
    const url_es = row.body_es ? `${base}/es/` : null;
    await patch(id, { state: 'done', commit_sha: arg || null, url_en, url_es, done_at: new Date().toISOString() });
    await patchIssue(row.issue_id, { status: 'published', url_en, url_es, published_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    console.log(`done ${url_en}`);
  } else if (cmd === 'fail') {
    await patch(id, { state: 'error', error: (arg || 'workflow failed').slice(0, 2000), done_at: new Date().toISOString() });
    console.log('marked error');
  } else {
    console.error('unknown cmd'); process.exit(1);
  }
} catch (e) {
  console.error(String(e));
  if (cmd === 'prepare') { try { await patch(id, { state: 'error', error: String(e).slice(0, 2000), done_at: new Date().toISOString() }); } catch {} }
  process.exit(1);
}
