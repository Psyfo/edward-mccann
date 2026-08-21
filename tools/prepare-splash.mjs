// Prepares the entry splash photographs.
//
// The splash is the one image on the site that fills the whole viewport, so it
// needs wider renditions than the project pipeline makes: a 2000px file on a
// 2560px monitor is visibly soft when it is the only thing on screen. It also
// needs two crops, because a landscape frame on a phone loses the subject
// entirely.
//
// Otherwise it follows the same conventions as tools/prepare-media.mjs:
// AVIF and JPEG at several widths, content-addressed keys so a re-run of the
// same file uploads nothing, and immutable caching.
//
// It also decides which single flat colour the mark should be over the
// photograph: sampled from the centre of the frame, where the mark sits, since
// a black mark disappears against the darker parts of some of the practice's
// own pictures. Only ever one flat choice, never a per-pixel effect, matching
// the plain ink or paper mark the splash already draws.
//
// Usage:
//   doppler run --project edward-mccann --config stg -- node tools/prepare-splash.mjs "<landscape.jpg>" "<portrait.jpg>"

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const WIDTHS = { landscape: [1280, 1920, 2560, 3200], portrait: [780, 1170, 1560] };
const QUALITY = { avif: 58, jpeg: 84 };

const { B2_S3_ENDPOINT, B2_REGION, B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_NAME } = process.env;
if (!(B2_S3_ENDPOINT && B2_KEY_ID && B2_APPLICATION_KEY && B2_BUCKET_NAME)) {
  console.error('B2 credentials missing. Run under `doppler run --project edward-mccann --config <cfg>`.');
  process.exit(1);
}

const s3 = new S3Client({
  endpoint: B2_S3_ENDPOINT,
  region: B2_REGION,
  credentials: { accessKeyId: B2_KEY_ID, secretAccessKey: B2_APPLICATION_KEY },
});

async function exists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: B2_BUCKET_NAME, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function put(key, body, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: B2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}

/**
 * The flat colour the mark should be over this photograph: light if the
 * centre reads bright enough for a dark mark, dark otherwise. Sampled from
 * the centre 50%x50% box, which is roughly where the mark sits under
 * place-items: center regardless of viewport, rather than the whole frame,
 * since a bright sky and dark foliage in one photograph can average out to a
 * mean that describes neither of the two places the mark could actually be.
 */
async function tone(source, meta) {
  const cw = Math.round(meta.width * 0.5);
  const ch = Math.round(meta.height * 0.5);
  const left = Math.round((meta.width - cw) / 2);
  const top = Math.round((meta.height - ch) / 2);
  const { channels } = await sharp(source)
    .extract({ left, top, width: cw, height: ch })
    .greyscale()
    .stats();
  return channels[0].mean > 140 ? 'light' : 'dark';
}

async function prepare(file, kind) {
  const source = await readFile(file);
  const meta = await sharp(source).metadata();
  const digest = createHash('sha256').update(source).digest('hex').slice(0, 16);
  const key = `splash/${digest}`;
  const markTone = await tone(source, meta);

  // Never upscale: a rendition wider than the source is bytes with no detail.
  const widths = WIDTHS[kind].filter((w) => w <= meta.width * 1.05);
  if (widths.length === 0) widths.push(Math.min(...WIDTHS[kind]));

  let uploaded = 0;
  for (const width of widths) {
    for (const [fmt, mime] of [['avif', 'image/avif'], ['jpg', 'image/jpeg']]) {
      const objectKey = `${key}-${width}.${fmt}`;
      if (await exists(objectKey)) continue;
      const resized = sharp(source).resize({ width, withoutEnlargement: true });
      const buf = fmt === 'avif'
        ? await resized.avif({ quality: QUALITY.avif }).toBuffer()
        : await resized.jpeg({ quality: QUALITY.jpeg, mozjpeg: true }).toBuffer();
      await put(objectKey, buf, mime);
      uploaded++;
    }
  }

  console.log(`${path.basename(file)}
    ${meta.width}x${meta.height} ${kind}
    key      ${key}
    widths   ${widths.join(', ')}
    tone     ${markTone}  (set derivative.tone to this on the media record)
    uploaded ${uploaded} object(s)`);

  return { src: key, width: meta.width, height: meta.height, widths, tone: markTone };
}

const [landscape, portrait] = process.argv.slice(2);
if (!landscape || !portrait) {
  console.error('usage: node tools/prepare-splash.mjs <landscape.jpg> <portrait.jpg>');
  process.exit(1);
}

const results = {
  landscape: await prepare(landscape, 'landscape'),
  portrait: await prepare(portrait, 'portrait'),
};

console.log('\nadd these to content/pages.json under studio.splash:');
console.log(JSON.stringify(results, null, 2));
