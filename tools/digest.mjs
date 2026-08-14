// Builds a per-page content digest (titles, meta, headings, copy, image counts)
// from the archived HTML in the workspace's site-archive/pages, for the audit
// inventories.
// Usage: node tools/digest.mjs   (run from repo root)

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';

const ARCHIVE = '../site-archive';

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
const text = (h) => h
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#039;|&#39;/g, "'").replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ').trim();

const pages = ['home', 'about', 'press', 'contact', 'page_not_found']
  .map((s) => ({ slug: s, file: `${ARCHIVE}/pages/${s}.html` }))
  .concat(readdirSync(`${ARCHIVE}/pages/projects`).map((f) => ({ slug: `projects/${f.replace('.html', '')}`, file: `${ARCHIVE}/pages/projects/${f}` })));

const digest = [];
for (const p of pages) {
  const h = readFileSync(p.file, 'utf8');
  const s = strip(h);
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const main = (s.match(/<main[\s\S]*?<\/main>/i) || [''])[0];
  const h1 = [...s.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => text(m[1]));
  const h3 = [...main.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map((m) => text(m[1]));
  const paras = [...main.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => text(m[1])).filter(Boolean);
  const imgs = [...main.matchAll(/<img[^>]*src="([^"]+)"/gi)].map((m) => m[1]);
  const alts = [...new Set([...main.matchAll(/alt="([^"]*)"/gi)].map((m) => m[1]))];
  digest.push({ slug: p.slug, title, desc, h1, h3, paraCount: paras.length, paras, imageCount: imgs.length, uniqueAlts: alts });
}

mkdirSync('design-intelligence/data', { recursive: true });
writeFileSync('design-intelligence/data/content-digest.json', JSON.stringify(digest, null, 1));
console.log('pages:', digest.length);
for (const d of digest) console.log(`${d.slug} | imgs:${d.imageCount} | paras:${d.paraCount} | h1:${JSON.stringify(d.h1)}`);
