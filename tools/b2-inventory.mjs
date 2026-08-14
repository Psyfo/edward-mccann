// Reports what is actually in the media bucket, and spot-checks that a public
// download URL really serves. Useful after tools/prepare-media.mjs and before a
// deploy, since a missing object shows up as a broken image rather than an error.
//
// Usage: doppler run --project edward-mccann --config dev -- node tools/b2-inventory.mjs

import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const { B2_S3_ENDPOINT, B2_REGION, B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_NAME, NEXT_PUBLIC_MEDIA_BASE_URL } = process.env;

const s3 = new S3Client({
  endpoint: B2_S3_ENDPOINT,
  region: B2_REGION,
  credentials: { accessKeyId: B2_KEY_ID, secretAccessKey: B2_APPLICATION_KEY },
});

let token;
let count = 0;
let bytes = 0;
const byProject = new Map();
let sample;

do {
  const res = await s3.send(new ListObjectsV2Command({
    Bucket: B2_BUCKET_NAME,
    ContinuationToken: token,
  }));
  for (const obj of res.Contents ?? []) {
    count++;
    bytes += obj.Size ?? 0;
    const project = obj.Key.split('/')[1] ?? '(root)';
    byProject.set(project, (byProject.get(project) ?? 0) + 1);
    if (!sample && obj.Key.endsWith('.jpg')) sample = obj.Key;
  }
  token = res.IsTruncated ? res.NextContinuationToken : undefined;
} while (token);

console.log(`bucket ${B2_BUCKET_NAME}: ${count} objects, ${(bytes / 1048576).toFixed(1)} MB`);
console.log(`projects covered: ${byProject.size}`);

if (sample && NEXT_PUBLIC_MEDIA_BASE_URL) {
  const url = `${NEXT_PUBLIC_MEDIA_BASE_URL}/${sample}`;
  const res = await fetch(url, { method: 'HEAD' });
  console.log(`public read: ${res.status} ${res.headers.get('content-type') ?? ''} (${sample})`);
  if (!res.ok) {
    console.error('Objects are not publicly readable; the site would render broken images.');
    process.exit(1);
  }
}
