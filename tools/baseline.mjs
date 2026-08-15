// Captures a visual and structural baseline of a deployment, so a refactor can
// be proven not to have changed the site rather than merely believed not to.
//
// Writes screenshots plus a fingerprint of each page's rendered text and
// structure. Compare two runs with tools/compare-baseline.mjs.
//
// Usage: node tools/baseline.mjs <label> [baseUrl]

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const label = process.argv[2];
const BASE = (process.argv[3] ?? 'https://edward-mccann.lab.mahlangu.dev').replace(/\/$/, '');
if (!label) {
  console.error('usage: node tools/baseline.mjs <label> [baseUrl]');
  process.exit(2);
}

const OUT = path.resolve('.baseline', label);
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

// One of each page type, plus projects that exercise the fit and status rules.
const PAGES = [
  '/', '/archive', '/practice', '/press', '/contact',
  '/projects/firs-avenue',      // photography, award
  '/projects/goat-hill-house',  // drawings, contained fit
  '/projects/oval-road',        // curated cover
  '/projects/chatsworth-rd',    // repaired body text
];

const browser = await chromium.launch();
const fingerprints = {};

for (const vp of VIEWPORTS) {
  await mkdir(path.join(OUT, vp.name), { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  for (const p of PAGES) {
    await page.goto(`${BASE}${p}`, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(500);

    const slug = p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '-');
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.setViewportSize({ width: vp.width, height: Math.min(height, 12000) });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, vp.name, `${slug}.jpg`), type: 'jpeg', quality: 80, scale: 'css' });
    await page.setViewportSize({ width: vp.width, height: vp.height });

    if (vp.name === 'desktop') {
      // Structure and text, ignoring whitespace and the live clocks, which are
      // expected to differ between runs.
      const snap = await page.evaluate(() => {
        const text = (document.body.innerText || '')
          .replace(/\d{2}:\d{2}\s+(GMT|SAST)/g, 'HH:MM TZ')
          .replace(/\s+/g, ' ')
          .trim();
        // Normalise the format: which of avif or jpeg the browser picks varies
        // between runs and is not a change to the site. The content hash in the
        // path is what identifies the image.
        const images = [...document.querySelectorAll('img')]
          .map((i) => (i.currentSrc || i.src).replace(/\.(avif|jpg)$/, ''))
          .sort();
        const links = [...document.querySelectorAll('a')].map((a) => a.getAttribute('href')).sort();
        const headings = [...document.querySelectorAll('h1,h2,h3')].map((h) => `${h.tagName}:${h.textContent.trim()}`);
        return { text, images, links, headings };
      });
      fingerprints[p] = {
        textHash: createHash('sha256').update(snap.text).digest('hex').slice(0, 16),
        textLength: snap.text.length,
        images: snap.images,
        links: snap.links,
        headings: snap.headings,
      };
    }
  }
  await ctx.close();
}

await browser.close();
await writeFile(path.join(OUT, 'fingerprint.json'), JSON.stringify(fingerprints, null, 1));
console.log(`baseline "${label}" captured from ${BASE}: ${PAGES.length} pages x ${VIEWPORTS.length} viewports`);
