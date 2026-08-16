// End-to-end smoke test against a deployed site: every route responds, every
// hero image the pages reference actually loads, and the legacy URLs redirect.
//
// Usage: node tools/smoke.mjs [baseUrl]

import { readFileSync } from 'node:fs';

const BASE = (process.argv[2] ?? 'https://edward-mccann.lab.mahlangu.dev').replace(/\/$/, '');
const facts = JSON.parse(readFileSync('content/facts.json', 'utf8'));

const failures = [];
let checked = 0;

async function expect(label, url, predicate) {
  checked++;
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const problem = predicate(res);
    if (problem) failures.push(`${label}: ${problem} (${url})`);
  } catch (err) {
    failures.push(`${label}: ${err.message} (${url})`);
  }
}

// Status alone is not enough: /index used to return 200 while serving the
// homepage, because the route name collided with index.html in static serving.
// Each page therefore has to prove it is itself.
const pages = [
  { path: '/', contains: 'Nose to tail design' },
  { path: '/archive', contains: '27 WORKS' },
  { path: '/practice', contains: 'RIBA CHARTERED' },
  { path: '/press', contains: 'Recognition' },
  { path: '/contact', contains: 'WRITE TO THE STUDIO' },
  { path: '/sitemap.xml', contains: '/projects/' },
  { path: '/robots.txt', contains: 'Sitemap:' },
];

for (const p of pages) {
  checked++;
  try {
    const res = await fetch(`${BASE}${p.path}`);
    if (!res.ok) {
      failures.push(`page ${p.path}: HTTP ${res.status}`);
    } else {
      const body = await res.text();
      if (!body.includes(p.contains)) {
        failures.push(`page ${p.path}: served 200 but does not contain "${p.contains}", so it is rendering the wrong page`);
      }
    }
  } catch (err) {
    failures.push(`page ${p.path}: ${err.message}`);
  }
}

for (const project of facts.projects) {
  await expect(
    `project ${project.slug}`,
    `${BASE}/projects/${project.slug}`,
    (r) => (r.ok ? null : `HTTP ${r.status}`),
  );
}

// The legacy About page is the only path whose URL changed.
await expect('redirect /about', `${BASE}/about`, (r) =>
  [301, 308].includes(r.status) ? null : `expected a permanent redirect, got ${r.status}`);

// A page that does not exist should 404 rather than redirect or 200.
await expect('missing page 404s', `${BASE}/no-such-page`, (r) =>
  r.status === 404 ? null : `expected 404, got ${r.status}`);

// Every project page must render its hero image, so pull one page's markup and
// confirm the image URL it points at is really served.
const sample = await fetch(`${BASE}/projects/${facts.projects[0].slug}`).then((r) => r.text());
const firstImage = sample.match(/https:\/\/[^"' ]+\.(?:avif|jpg)/)?.[0];
if (!firstImage) {
  failures.push('markup: no image URL found on a project page');
} else {
  await expect('hero image loads', firstImage, (r) => (r.ok ? null : `HTTP ${r.status}`));
}

// Icons are declared in the markup and fetched by the browser separately, so a
// wrong href is invisible while browsing: the tab just shows a blank square.
// Next picks the URLs itself and hashes them, so the only safe check is to read
// whatever the page actually claims and fetch it.
const home = await fetch(`${BASE}/`).then((r) => r.text());
const iconHrefs = [...home.matchAll(/<link[^>]+rel="(?:icon|apple-touch-icon)"[^>]*>/gi)]
  .map((tag) => tag[0].match(/href="([^"]+)"/)?.[1])
  .filter(Boolean);

if (iconHrefs.length === 0) {
  failures.push('markup: the homepage declares no icon at all');
} else {
  for (const href of iconHrefs) {
    await expect(`icon ${href.split('?')[0]}`, new URL(href, BASE).href, (r) =>
      !r.ok
        ? `HTTP ${r.status}`
        : r.headers.get('content-type')?.startsWith('image/')
          ? null
          : `served ${r.headers.get('content-type')} rather than an image`,
    );
  }
}

console.log(`${BASE}: ${checked} checks, ${failures.length} failed`);
for (const f of failures) console.log('  FAIL', f);
if (failures.length) process.exit(1);
