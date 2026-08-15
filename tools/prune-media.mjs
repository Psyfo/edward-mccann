// Deletes objects in the media bucket that nothing in content/figures.json
// references any more, which happens when imagery is replaced or the key scheme
// changes.
//
// Dry by default: it will not delete anything unless --apply is passed, and it
// refuses to run if the manifest looks empty, so a bad build cannot wipe the
// bucket.
//
// Usage:
//   doppler run --project edward-mccann --config dev -- node tools/prune-media.mjs
//   doppler run --project edward-mccann --config dev -- node tools/prune-media.mjs --apply

import { readFileSync } from 'node:fs';
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const APPLY = process.argv.includes('--apply');
const { B2_S3_ENDPOINT, B2_REGION, B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_NAME } = process.env;

const figures = JSON.parse(readFileSync('content/figures.json', 'utf8'));
const referenced = new Set();
for (const list of Object.values(figures)) {
  for (const fig of list) {
    // Every width and format the site can request for this figure.
    for (const w of [640, 1280, 2000]) {
      for (const fmt of ['avif', 'jpg']) referenced.add(`${fig.src}-${w}.${fmt}`);
    }
  }
}

// Guard: an empty or tiny manifest almost certainly means a broken build rather
// than a genuine instruction to empty the bucket.
const figureCount = Object.values(figures).reduce((n, l) => n + l.length, 0);
if (figureCount < 50) {
  console.error(`Refusing to prune: content/figures.json lists only ${figureCount} figures, which looks wrong.`);
  process.exit(1);
}

const s3 = new S3Client({
  endpoint: B2_S3_ENDPOINT,
  region: B2_REGION,
  credentials: { accessKeyId: B2_KEY_ID, secretAccessKey: B2_APPLICATION_KEY },
});

let token;
const orphans = [];
let total = 0;

do {
  const res = await s3.send(new ListObjectsV2Command({
    Bucket: B2_BUCKET_NAME,
    // Only the generated renditions. Uploaded originals live under originals/
    // and are owned by the CMS, not by this manifest: deleting those would
    // destroy the only copy of the source image.
    Prefix: 'projects/',
    ContinuationToken: token,
  }));
  for (const obj of res.Contents ?? []) {
    total++;
    if (!referenced.has(obj.Key)) orphans.push({ Key: obj.Key, size: obj.Size ?? 0 });
  }
  token = res.IsTruncated ? res.NextContinuationToken : undefined;
} while (token);

const bytes = orphans.reduce((n, o) => n + o.size, 0);
console.log(`bucket holds ${total} objects; ${referenced.size} are referenced by the site`);
console.log(`orphans: ${orphans.length} objects, ${(bytes / 1048576).toFixed(1)} MB`);

if (!orphans.length) process.exit(0);

if (!APPLY) {
  console.log('\ndry run. Pass --apply to delete. Examples:');
  for (const o of orphans.slice(0, 5)) console.log('  ', o.Key);
  process.exit(0);
}

for (let i = 0; i < orphans.length; i += 1000) {
  const batch = orphans.slice(i, i + 1000).map(({ Key }) => ({ Key }));
  await s3.send(new DeleteObjectsCommand({
    Bucket: B2_BUCKET_NAME,
    Delete: { Objects: batch, Quiet: true },
  }));
  console.log(`deleted ${Math.min(i + 1000, orphans.length)}/${orphans.length}`);
}
console.log('done');
