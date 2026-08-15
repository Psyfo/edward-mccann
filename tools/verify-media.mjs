// Checks that every figure the site references actually exists in the bucket,
// in every format and width the markup can ask for. A missing object renders as
// a broken image rather than an error, so this is the check that catches it.
//
// Usage: node tools/verify-media.mjs

import { readFileSync } from 'node:fs';

const BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL
  ?? 'https://f005.backblazeb2.com/file/edward-mccann-media';
const WIDTHS = [640, 1280, 2000];
// Backblaze throttles bursts, so this is deliberately gentle. The check is not
// on a hot path; being slow and trustworthy beats being fast and crying wolf.
const CONCURRENCY = 4;

const figures = JSON.parse(readFileSync('content/figures.json', 'utf8'));

// Mirror lib/media.ts: only widths at or below the source (plus a hair) are
// referenced, and at least the smallest is always emitted.
function widthsFor(figure) {
  const usable = WIDTHS.filter((w) => w <= figure.width * 1.2);
  return usable.length ? usable : [WIDTHS[0]];
}

const targets = [];
for (const [slug, list] of Object.entries(figures)) {
  for (const figure of list) {
    for (const w of widthsFor(figure)) {
      for (const fmt of ['avif', 'jpg']) {
        targets.push({ slug, url: `${BASE}/${figure.src}-${w}.${fmt}` });
      }
    }
  }
}

let ok = 0;
const missing = [];
let cursor = 0;

async function worker() {
  while (cursor < targets.length) {
    const t = targets[cursor++];
    try {
      const res = await fetch(t.url, { method: 'HEAD' });
      if (res.ok) ok++;
      else missing.push(`${t.slug}: ${res.status} ${t.url}`);
    } catch (err) {
      missing.push(`${t.slug}: ${err.message} ${t.url}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`checked ${targets.length} objects: ${ok} present, ${missing.length} missing`);
for (const m of missing.slice(0, 20)) console.log('  ', m);
if (missing.length) process.exit(1);
