// Processes the practice's archive imagery into web deliverables and publishes
// them to the project's Backblaze B2 bucket, then rewrites content/figures.json
// with the final bucket paths, dimensions and captions.
//
// Deliberate choices:
//   - AVIF plus a JPEG fallback at three widths. next/image is left to pick;
//     the bucket is the origin, not an optimiser.
//   - Objects are content-addressed by a hash of the source bytes plus the
//     variant, so re-runs are idempotent and cache headers can be immutable.
//   - Uploads are skipped when the object already exists, so this is safe and
//     cheap to re-run.
//
// Usage (credentials come from Doppler, never from a file):
//   doppler run --project edward-mccann --config dev -- node tools/prepare-media.mjs
//   ... --dry-run    to process locally and report without uploading

import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const ARCHIVE = path.resolve('..', 'site-archive');
const FIGURES_IN = path.resolve('content', 'figures.source.json');
const FIGURES_OUT = path.resolve('content', 'figures.json');
const FACTS = path.resolve('content', 'facts.json');
const DRY = process.argv.includes('--dry-run');

const WIDTHS = [640, 1280, 2000];
const QUALITY = { avif: 55, jpeg: 82 };

const { B2_S3_ENDPOINT, B2_REGION, B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_NAME } = process.env;
if (!DRY && !(B2_S3_ENDPOINT && B2_KEY_ID && B2_APPLICATION_KEY && B2_BUCKET_NAME)) {
  console.error('B2 credentials missing. Run under `doppler run --project edward-mccann --config <cfg>`.');
  process.exit(1);
}

const s3 = DRY ? null : new S3Client({
  endpoint: B2_S3_ENDPOINT,
  region: B2_REGION,
  credentials: { accessKeyId: B2_KEY_ID, secretAccessKey: B2_APPLICATION_KEY },
});

const facts = JSON.parse(readFileSync(FACTS, 'utf8'));
const figures = JSON.parse(readFileSync(FIGURES_IN, 'utf8'));
const factBySlug = new Map(facts.projects.map((p) => [p.slug, p]));

/** Renders and drawings are declared as such rather than passed off as photography. */
function declareMedium(project, file, index) {
  const name = path.basename(file).toLowerCase();
  if (/thumb/.test(name) && index === 0) return 'PHOTOGRAPH';
  if (/plan|section|elev|drawing|axo|sketch|dwg/.test(name)) return 'DRAWING';
  if (/model|maquette/.test(name)) return 'MODEL';
  if (/render|visual|cgi|3d/.test(name)) return 'VISUALISATION';
  return project?.photographer ? 'PHOTOGRAPH' : 'IMAGE';
}

async function exists(key) {
  if (DRY) return false;
  try {
    await s3.send(new HeadObjectCommand({ Bucket: B2_BUCKET_NAME, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function upload(key, body, contentType) {
  if (DRY) return;
  await s3.send(new PutObjectCommand({
    Bucket: B2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}

const out = {};
let processed = 0;
let uploaded = 0;
let skipped = 0;

for (const [slug, list] of Object.entries(figures)) {
  const project = factBySlug.get(slug);
  const built = [];

  for (const [i, fig] of list.entries()) {
    const abs = path.join(ARCHIVE, fig.file);
    let image;
    try {
      image = sharp(abs, { failOn: 'none' });
    } catch {
      console.warn(`  skipping unreadable ${fig.file}`);
      continue;
    }

    const meta = await image.metadata();
    if (!meta.width || !meta.height) {
      console.warn(`  skipping dimensionless ${fig.file}`);
      continue;
    }
    const source = readFileSync(abs);
    const digest = createHash('sha256').update(source).digest('hex').slice(0, 12);
    const base = `projects/${slug}/${String(i).padStart(2, '0')}-${digest}`;

    for (const w of WIDTHS) {
      if (w > meta.width * 1.2) continue; // never upscale beyond a hair
      for (const [fmt, mime] of [['avif', 'image/avif'], ['jpg', 'image/jpeg']]) {
        const key = `${base}-${w}.${fmt}`;
        if (await exists(key)) { skipped++; continue; }
        // Several legacy thumbnails are transparent PNGs; flattening onto the
        // paper ground keeps them consistent with the site rather than turning
        // black in formats without alpha.
        const pipeline = sharp(source, { failOn: 'none' })
          .resize({ width: w, withoutEnlargement: true })
          .flatten({ background: '#f5f2ed' });
        const buf = fmt === 'avif'
          ? await pipeline.avif({ quality: QUALITY.avif }).toBuffer()
          : await pipeline.jpeg({ quality: QUALITY.jpeg, mozjpeg: true }).toBuffer();
        await upload(key, buf, mime);
        uploaded++;
      }
    }

    built.push({
      src: `${base}`,
      width: meta.width,
      height: meta.height,
      medium: declareMedium(project, fig.file, i),
      caption: '',
      credit: i === 0 ? project?.photographer ?? null : null,
    });
    processed++;
  }

  out[slug] = built;
  console.log(`${slug}: ${built.length} figures`);
}

writeFileSync(FIGURES_OUT, JSON.stringify(out, null, 1));
console.log(`\nprocessed ${processed} images, uploaded ${uploaded} objects, ${skipped} already present${DRY ? ' (dry run: nothing uploaded)' : ''}`);
