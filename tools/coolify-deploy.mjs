// Provisions (or updates) the staging deployment on the Coolify server and
// triggers a deploy. Idempotent: re-running reuses the existing project and
// application rather than creating duplicates.
//
// Usage (token comes from the machine store, never from a file):
//   doppler run --project local --config dev -- node tools/coolify-deploy.mjs
//
// Reads the app's own public config from the project store, so run it with both
// available or pass them in the environment.

const {
  COOLIFY_BASE_URL,
  COOLIFY_TOKEN,
  NEXT_PUBLIC_MEDIA_BASE_URL,
} = process.env;

if (!COOLIFY_BASE_URL || !COOLIFY_TOKEN) {
  console.error('COOLIFY_BASE_URL and COOLIFY_TOKEN are required. Run under `doppler run --project local --config dev`.');
  process.exit(1);
}

const BASE = COOLIFY_BASE_URL.replace(/\/$/, '');
const REPO = 'https://github.com/Psyfo/edward-mccann';
const BRANCH = 'main';
const PROJECT_NAME = 'Edward McCann';
const APP_NAME = 'edward-mccann-staging';
const DOMAIN = 'https://edward-mccann.lab.mahlangu.dev';

async function api(path, init = {}) {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${COOLIFY_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...init.headers,
    },
  });
  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
  if (!res.ok) {
    throw new Error(`${init.method ?? 'GET'} ${path} -> ${res.status} ${JSON.stringify(body).slice(0, 400)}`);
  }
  return body;
}

// 1. Server and project
const servers = await api('/servers');
const server = servers[0];
if (!server) throw new Error('no server visible to this token');
console.log(`server: ${server.name} (${server.uuid})`);

const projects = await api('/projects');
let project = projects.find((p) => p.name === PROJECT_NAME);
if (!project) {
  project = await api('/projects', {
    method: 'POST',
    body: JSON.stringify({ name: PROJECT_NAME, description: 'Edward McCann Architecture website' }),
  });
  console.log(`created project ${PROJECT_NAME} (${project.uuid})`);
} else {
  console.log(`reusing project ${PROJECT_NAME} (${project.uuid})`);
}

// Coolify needs the environment name that the project was created with.
const detail = await api(`/projects/${project.uuid}`);
const environment = detail.environments?.[0];
if (!environment) throw new Error('project has no environment');

// 2. Application
const apps = await api('/applications');
let app = apps.find((a) => a.name === APP_NAME);

if (!app) {
  const created = await api('/applications/public', {
    method: 'POST',
    body: JSON.stringify({
      project_uuid: project.uuid,
      server_uuid: server.uuid,
      environment_name: environment.name,
      environment_uuid: environment.uuid,
      git_repository: REPO,
      git_branch: BRANCH,
      build_pack: 'dockerfile',
      dockerfile_location: '/Dockerfile',
      ports_exposes: '3000',
      name: APP_NAME,
      domains: DOMAIN,
      instant_deploy: false,
    }),
  });
  console.log(`created application ${APP_NAME} (${created.uuid})`);
  app = created;
} else {
  console.log(`reusing application ${APP_NAME} (${app.uuid})`);
}

// 3. Runtime configuration.
//
// This Coolify version's env API rejects is_build_time, so anything set here
// reaches the container but not `next build`. NEXT_PUBLIC_* values are inlined
// at build time, so the app carries safe defaults in code for those and does
// not depend on what is set below: see lib/media.ts and app/robots.ts. These
// entries exist so the values are visible and adjustable in the Coolify UI.
const envs = [
  {
    key: 'NEXT_PUBLIC_MEDIA_BASE_URL',
    value: NEXT_PUBLIC_MEDIA_BASE_URL ?? 'https://f005.backblazeb2.com/file/edward-mccann-media',
  },
  { key: 'NEXT_PUBLIC_SITE_URL', value: DOMAIN },
  // Staging must never be indexed. Production sets this to "true".
  { key: 'NEXT_PUBLIC_ALLOW_INDEXING', value: 'false' },
];

const existing = await api(`/applications/${app.uuid}/envs`);
for (const env of envs) {
  const already = existing.find?.((e) => e.key === env.key);
  if (already) {
    await api(`/applications/${app.uuid}/envs`, {
      method: 'PATCH',
      body: JSON.stringify(env),
    });
    console.log(`updated ${env.key}`);
  } else {
    await api(`/applications/${app.uuid}/envs`, {
      method: 'POST',
      body: JSON.stringify(env),
    });
    console.log(`set ${env.key}`);
  }
}

// 4. Deploy
const deploy = await api(`/deploy?uuid=${app.uuid}&force=false`);
console.log('deployment queued:', JSON.stringify(deploy).slice(0, 200));
console.log(`\nwatch: ${BASE}/project/${project.uuid}`);
console.log(`url:   ${DOMAIN}`);
