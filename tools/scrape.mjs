// Site archiver for https://edwardmccann.studio
// Fetches every known route's raw HTML, discovers referenced assets
// (images, CSS, JS, fonts, favicons), downloads them preserving URL paths,
// attempts full-resolution originals for CMS thumbnails, and writes a manifest.
// Usage: node tools/scrape.mjs   (run from repo root)
// Writes to ../site-archive, i.e. the workspace beside the repo, not into it.

import { mkdir, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const BASE = 'https://edwardmccann.studio';
// The legacy site links itself on both the apex and www hosts, and a large part
// of the project galleries is only ever referenced on www. Both are the same
// site, so both are in scope and both map to the same local path.
// A third variant, mail.edwardmccann.studio, appears on some project pages
// (a legacy CMS misconfiguration). It serves byte-identical files from the same
// paths, so it is archived to the same location.
const HOSTS = ['edwardmccann.studio', 'www.edwardmccann.studio', 'mail.edwardmccann.studio'];
const OUT = path.resolve('..', 'site-archive');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) site-preservation-archive (client handover)';

const PROJECT_SLUGS = [
  '312-hackney-road', 'antidote', 'archway-road', 'campden-house', 'chamber',
  'chatsworth-rd', 'culford-mews', 'firs-avenue', 'folly', 'goat-hill-house',
  'hassett-road', 'highpoint', 'ibberton', 'kew-tree-house-competition',
  'latimer-road', 'lonsdale-square', 'oval-road', 'park-village', 'pearson-st',
  'pennard-house', 'rylett-crescent', 'social-house', 'sourced', 'union-wharf',
  'victualler', 'west-suffolk', 'willow-tree',
];

const ROUTES = [
  { url: `${BASE}/`, file: 'home.html' },
  { url: `${BASE}/about`, file: 'about.html' },
  { url: `${BASE}/press`, file: 'press.html' },
  { url: `${BASE}/contact`, file: 'contact.html' },
  { url: `${BASE}/page_not_found`, file: 'page_not_found.html' },
  ...PROJECT_SLUGS.map((s) => ({ url: `${BASE}/projects/${s}`, file: `projects/${s}.html` })),
];

const manifest = [];
const assetQueue = new Map(); // url -> true
const seen = new Set();

function enqueue(rawUrl, from) {
  if (!rawUrl) return;
  let url;
  try {
    url = new URL(rawUrl, from).toString();
  } catch {
    return;
  }
  if (!HOSTS.includes(new URL(url).hostname)) return; // this site only
  url = url.split('#')[0];
  if (url.includes('/index.php/')) return; // page aliases, not assets
  const pathname = new URL(url).pathname;
  if (!/\.(png|jpe?g|gif|webp|svg|ico|css|js|woff2?|ttf|otf|eot|mp4|webm|pdf)(\?|$)/i.test(pathname)) return;
  if (!seen.has(url)) {
    seen.add(url);
    assetQueue.set(url, true);
  }
}

function extractAssets(html, fromUrl) {
  const attrRe = /(?:src|href|data-src|data-original|poster)\s*=\s*["']([^"']+)["']/gi;
  for (const m of html.matchAll(attrRe)) enqueue(m[1], fromUrl);
  const srcsetRe = /srcset\s*=\s*["']([^"']+)["']/gi;
  for (const m of html.matchAll(srcsetRe)) {
    for (const part of m[1].split(',')) enqueue(part.trim().split(/\s+/)[0], fromUrl);
  }
  const cssUrlRe = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  for (const m of html.matchAll(cssUrlRe)) enqueue(m[1], fromUrl);
}

function localPathFor(url) {
  const u = new URL(url);
  let p = decodeURIComponent(u.pathname);
  if (p.endsWith('/')) p += 'index';
  return path.join(OUT, 'assets', p.replace(/^\//, ''));
}

async function fetchWithRetry(url, attempts = 2) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA },
        redirect: 'follow',
        signal: AbortSignal.timeout(45000),
      });
      return res;
    } catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, 800));
    }
  }
}

async function savePage(route) {
  const res = await fetchWithRetry(route.url);
  const html = await res.text();
  const file = path.join(OUT, 'pages', route.file);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
  manifest.push({ url: route.url, localPath: path.relative(OUT, file), status: res.status, bytes: html.length, contentType: res.headers.get('content-type') });
  extractAssets(html, route.url);
  console.log(`[page] ${res.status} ${route.url} (${html.length}b)`);
  return html;
}

async function saveAsset(url) {
  try {
    const res = await fetchWithRetry(url);
    if (!res.ok) {
      manifest.push({ url, localPath: null, status: res.status, bytes: 0, contentType: null });
      return;
    }
    const file = localPathFor(url);
    await mkdir(path.dirname(file), { recursive: true });
    await pipeline(Readable.fromWeb(res.body), createWriteStream(file));
    const ct = res.headers.get('content-type') || '';
    manifest.push({ url, localPath: path.relative(OUT, file), status: res.status, contentType: ct });
    // If this is a CSS file, mine it for further urls (fonts, background images)
    if (ct.includes('css') || url.endsWith('.css')) {
      const { readFile } = await import('node:fs/promises');
      const css = await readFile(file, 'utf8');
      extractAssets(css, url);
    }
  } catch (err) {
    manifest.push({ url, localPath: null, status: 'error', error: String(err.message || err) });
  }
}

async function drainQueue(concurrency = 6) {
  while (assetQueue.size > 0) {
    const batch = [...assetQueue.keys()].slice(0, concurrency);
    for (const u of batch) assetQueue.delete(u);
    await Promise.all(batch.map(saveAsset));
    process.stdout.write(`\r[assets] downloaded=${manifest.filter((m) => m.localPath).length} pending=${assetQueue.size}   `);
  }
  console.log();
}

// concrete5 thumbnails live at /application/files/thumbnails/<type>/a/b/c/name;
// the original upload is usually at /application/files/a/b/c/name
function enqueueOriginals() {
  const thumbs = [...seen].filter((u) => u.includes('/application/files/thumbnails/'));
  for (const t of thumbs) {
    const original = t.replace(/\/application\/files\/thumbnails\/[^/]+\//, '/application/files/');
    if (!seen.has(original)) {
      seen.add(original);
      assetQueue.set(original, true);
    }
  }
  console.log(`[originals] queued ${assetQueue.size} candidate full-resolution originals`);
}

const started = Date.now();
await mkdir(path.join(OUT, 'pages', 'projects'), { recursive: true });

for (const route of ROUTES) {
  await savePage(route);
}

await drainQueue();
enqueueOriginals();
await drainQueue();

manifest.sort((a, b) => String(a.url).localeCompare(String(b.url)));
await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));

const ok = manifest.filter((m) => m.localPath).length;
const missed = manifest.filter((m) => !m.localPath);
console.log(`\nDone in ${((Date.now() - started) / 1000).toFixed(1)}s: ${ok} files saved, ${missed.length} misses.`);
if (missed.length) {
  console.log('Misses (first 20):');
  for (const m of missed.slice(0, 20)) console.log(`  ${m.status} ${m.url}`);
}
