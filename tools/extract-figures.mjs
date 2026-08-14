// Extracts the per-project image sequence from the archived legacy pages so the
// rebuild can reuse the practice's own galleries rather than the handful of
// sample images in the design handoff.
//
// For each project page it records, in document order, the image the page
// actually rendered, resolved to a file inside ../site-archive.
// Usage: node tools/extract-figures.mjs   (run from repo root)

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const ARCHIVE = path.resolve('..', 'site-archive');
const PAGES = path.join(ARCHIVE, 'pages', 'projects');
// The design phase art-directed one cover per project. Those crops are what the
// boards were approved on, and they are landscape where the hero frame is
// landscape, so they are used as figure 0 in preference to whatever image
// happened to come first on the legacy page.
const CURATED_HEROES = path.resolve(
  '..', 'design_handoff_edward_mccann_brand', 'assets', 'heroes',
);
// Raw archive references. tools/prepare-media.mjs consumes this and produces
// the web-ready content/figures.json; keeping the two separate makes both
// steps idempotent and re-runnable in any order.
const OUT = path.resolve('content', 'figures.source.json');

const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&#039;|&#39;/g, "'").replace(/&quot;/g, '"')
  .replace(/&nbsp;?/g, ' ').replace(/&ndash;/g, '-').replace(/&rsquo;/g, "'");

const result = {};

for (const file of readdirSync(PAGES).filter((f) => f.endsWith('.html'))) {
  const slug = file.replace('.html', '');
  const html = readFileSync(path.join(PAGES, file), 'utf8');
  const main = (html.replace(/<script[\s\S]*?<\/script>/gi, '').match(/<main[\s\S]*?<\/main>/i) || [''])[0];

  const figures = [];
  const seen = new Set();

  for (const m of main.matchAll(/<img[^>]+>/gi)) {
    const tag = m[0];
    const srcMatch = tag.match(/(?:data-src|src)="([^"]+)"/i);
    if (!srcMatch) continue;
    let src = decode(srcMatch[1]);

    // Normalise every legacy host variant (apex, www and the misconfigured
    // mail subdomain) down to a path inside the archive.
    src = src.replace(/^https?:\/\/(www\.|mail\.)?edwardmccann\.studio/i, '');
    if (!src.startsWith('/')) continue;

    const local = path.join(ARCHIVE, 'assets', decodeURIComponent(src).replace(/^\//, ''));
    if (!existsSync(local)) continue;

    const alt = (tag.match(/alt="([^"]*)"/i) || [, ''])[1];

    // Award badges and press logos are third-party branding inside the
    // practice's own photography, which the brand rules banish. Filenames vary
    // (dmi_, DM1_, GrandDesignsMagazine), so match the alt text too: the badges
    // announce themselves there.
    const name = path.basename(local);
    if (/badge|dm[i1]_|granddesigns|riba|_arb/i.test(name)) continue;
    if (/don'?t move improve|grand designs|award/i.test(alt)) continue;

    const key = path.relative(ARCHIVE, local).replace(/\\/g, '/');
    if (seen.has(key)) continue;
    seen.add(key);

    figures.push({
      file: key,
      bytes: statSync(local).size,
      alt: decode(alt),
    });
  }

  // Prepend the approved cover when the design phase supplied one. It is
  // referenced by an absolute path because it lives outside the archive.
  for (const ext of ['jpg', 'png']) {
    const cover = path.join(CURATED_HEROES, `${slug}.${ext}`);
    if (existsSync(cover)) {
      figures.unshift({
        file: path.relative(ARCHIVE, cover).replace(/\\/g, '/'),
        bytes: statSync(cover).size,
        alt: '',
        curated: true,
      });
      break;
    }
  }

  result[slug] = figures;
}

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(result, null, 1));

const counts = Object.entries(result).map(([k, v]) => `${k}: ${v.length}`);
console.log(`extracted figures for ${Object.keys(result).length} projects`);
console.log(counts.join('\n'));
console.log('total figures:', Object.values(result).reduce((n, v) => n + v.length, 0));
