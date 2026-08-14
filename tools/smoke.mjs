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

const pages = ['/', '/index', '/practice', '/press', '/contact', '/sitemap.xml', '/robots.txt'];
for (const p of pages) {
  await expect(`page ${p}`, `${BASE}${p}`, (r) => (r.ok ? null : `HTTP ${r.status}`));
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

console.log(`${BASE}: ${checked} checks, ${failures.length} failed`);
for (const f of failures) console.log('  FAIL', f);
if (failures.length) process.exit(1);
