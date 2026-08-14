// Provisions Backblaze B2 storage for this project.
//
// Runs in two phases because the two Doppler scopes are reachable from
// different directories: the machine store (`local`) holds the B2 master key
// and is only reachable from an unscoped directory such as E:\, while the
// project store (`edward-mccann`) is reachable from the workspace.
//
//   Phase "provision" (run from an unscoped dir, master key injected):
//     doppler run --project local --config dev -- node tools/b2-provision.mjs provision <handoff-file>
//
//   Phase "store" (run from the workspace, project token active):
//     node tools/b2-provision.mjs store <handoff-file>
//
// Secrets are never printed and never passed as command-line arguments. The
// new application key is written to <handoff-file> in phase one and piped into
// Doppler over stdin in phase two, after which the file is overwritten and
// removed.

import { writeFileSync, readFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const API = 'https://api.backblazeb2.com/b2api/v3/b2_authorize_account';
const BUCKET_BASE = 'edward-mccann-media';
const DOPPLER_PROJECT = 'edward-mccann';
const DOPPLER_CONFIGS = ['dev', 'stg', 'prd'];
const DOPPLER_BIN = process.platform === 'win32' ? 'doppler.exe' : 'doppler';

// Least privilege: enough to publish and manage this bucket's objects, and
// nothing at all outside it. Deliberately excludes key and bucket creation.
const KEY_CAPABILITIES = [
  'listBuckets', 'readBuckets',
  'listFiles', 'readFiles', 'shareFiles', 'writeFiles', 'deleteFiles',
];

const mode = process.argv[2];
const handoffPath = process.argv[3];
if (!['provision', 'store'].includes(mode) || !handoffPath) {
  console.error('usage: node tools/b2-provision.mjs <provision|store> <handoff-file>');
  process.exit(2);
}

async function b2(url, token, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(`${json.code || res.status}: ${json.message || res.statusText}`);
    err.code = json.code;
    throw err;
  }
  return json;
}

async function provision() {
  const keyId = process.env.BACKBLAZE_B2_MASTER_ID;
  const appKey = process.env.BACKBLAZE_B2_MASTER_APPLICATION_KEY;
  if (!keyId || !appKey) {
    console.error('Master credentials not present in the environment. Run under `doppler run --project local --config dev`.');
    process.exit(1);
  }

  const auth = await fetch(API, {
    headers: { Authorization: 'Basic ' + Buffer.from(`${keyId}:${appKey}`).toString('base64') },
  }).then(async (r) => {
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`authorize failed: ${j.code || r.status} ${j.message || ''}`);
    return j;
  });

  const { accountId, authorizationToken: token } = auth;
  const { apiUrl, downloadUrl, s3ApiUrl } = auth.apiInfo.storageApi;
  console.log('authorized against B2 account', accountId.slice(0, 4) + '…');

  // Bucket names are globally unique across all of B2, so fall back to a
  // suffixed name rather than failing if the preferred one is taken.
  const existing = await b2(`${apiUrl}/b2api/v3/b2_list_buckets`, token, { accountId });
  let bucket = existing.buckets.find((b) => b.bucketName.startsWith(BUCKET_BASE));

  if (bucket) {
    console.log(`reusing existing bucket ${bucket.bucketName}`);
  } else {
    const candidates = [BUCKET_BASE, `${BUCKET_BASE}-${Date.now().toString(36).slice(-4)}`];
    for (const bucketName of candidates) {
      try {
        bucket = await b2(`${apiUrl}/b2api/v3/b2_create_bucket`, token, {
          accountId,
          bucketName,
          // Public: these are the practice's own published photographs, served
          // directly to browsers. Signed URLs would defeat CDN caching.
          bucketType: 'allPublic',
          bucketInfo: { 'cache-control': 'public, max-age=31536000, immutable' },
        });
        console.log(`created bucket ${bucketName}`);
        break;
      } catch (err) {
        if (err.code !== 'duplicate_bucket_name') throw err;
        console.log(`bucket name ${bucketName} taken, trying next`);
      }
    }
  }
  if (!bucket) throw new Error('could not create or find a bucket');

  const created = await b2(`${apiUrl}/b2api/v3/b2_create_key`, token, {
    accountId,
    capabilities: KEY_CAPABILITIES,
    keyName: 'edward-mccann-site',
    bucketId: bucket.bucketId,
  });
  console.log(`created bucket-scoped application key "${created.keyName}" (id ${created.applicationKeyId.slice(0, 6)}…)`);

  writeFileSync(handoffPath, JSON.stringify({
    B2_KEY_ID: created.applicationKeyId,
    B2_APPLICATION_KEY: created.applicationKey,
    B2_BUCKET_NAME: bucket.bucketName,
    B2_BUCKET_ID: bucket.bucketId,
    B2_S3_ENDPOINT: s3ApiUrl,
    B2_REGION: new URL(s3ApiUrl).hostname.split('.')[1],
    NEXT_PUBLIC_MEDIA_BASE_URL: `${downloadUrl}/file/${bucket.bucketName}`,
  }, null, 1), { mode: 0o600 });
  console.log('credentials written to the handoff file for the store phase');
}

function store() {
  const payload = JSON.parse(readFileSync(handoffPath, 'utf8'));
  for (const config of DOPPLER_CONFIGS) {
    for (const [name, value] of Object.entries(payload)) {
      // No shell: the value goes over stdin and the args are passed directly,
      // so nothing sensitive can end up in a command line or shell history.
      const r = spawnSync(DOPPLER_BIN, [
        'secrets', 'set', name,
        '--project', DOPPLER_PROJECT, '--config', config, '--no-interactive',
      ], { input: value, stdio: ['pipe', 'ignore', 'pipe'] });
      if (r.status !== 0) {
        console.error(`failed to set ${name} in ${config}: ${String(r.stderr).slice(0, 200)}`);
        process.exit(1);
      }
    }
    console.log(`stored ${Object.keys(payload).length} values in ${DOPPLER_PROJECT}/${config}`);
  }
  // Overwrite before unlinking so the plaintext key does not linger in slack space.
  writeFileSync(handoffPath, '0'.repeat(2048));
  rmSync(handoffPath);
  console.log('handoff file shredded');
}

if (mode === 'provision') await provision();
else store();
