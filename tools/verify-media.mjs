// Checks that every figure the site references actually exists in the bucket,
// in every format and width the markup can ask for. A missing object renders as
// a broken image rather than an error, so this is the check that catches it.
//
// Usage: node tools/verify-media.mjs

import { readFileSync } from 'node:fs';

const BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL
  ?? 'https://f005.backblazeb2.com/file/edward-mccann-media';
const WIDTHS = [640, 1280, 2000];
const CONCURRENCY = 12;

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Backblaze rate-limits a burst of this size and answers 503, which is not the
 * same as a missing object. Retry those with backoff so the check reports real
 * absences rather than its own impatience. A 404 is final and never retried.
 */
async function head(url, attempt = 0) {
  const res = await fetch(url, { method: 'HEAD' });
  if (res.status === 503 && attempt < 4) {
    await sleep(500 * 2 ** attempt);
    return head(url, attempt + 1);
  }
  return res;
}

async function worker() {
  while (cursor < targets.length) {
    const t = targets[cursor++];
    try {
      const res = await head(t.url);
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
