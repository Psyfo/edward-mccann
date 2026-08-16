// Exports the archive from Payload into content/*.json, which is what the site
// actually builds from.
//
// Why a snapshot rather than reading the database at build time:
//
//   - The image build has no database. This Coolify version cannot mark an
//     environment variable as build-time, and CI has no database either, so a
//     build that queries Postgres cannot run in either place.
//   - It keeps the published site free of any runtime dependency. If Neon
//     sleeps or fails, only the admin is affected; the public site is unmoved.
//   - Every content change becomes a reviewable diff in git, with the same
//     history, rollback and audit trail as code.
//
// So Payload is the editing surface and this file is the publish step:
//
//   npm run content:export      then commit, and the deploy follows.
//
// Usage:
//   npm run content:export
//
// It has to run through tsx, not node: this file imports payload.config.ts,
// which imports the collections without file extensions, and plain node cannot
// resolve those.

import { writeFileSync, readFileSync } from 'node:fs';
import { getPayload } from 'payload';
import config from '../payload.config.ts';

const payload = await getPayload({ config });

const { docs } = await payload.find({
  collection: 'projects',
  limit: 500,
  sort: 'no',
  depth: 1,
});

if (!docs.length) {
  console.error('Refusing to export: the database returned no projects.');
  process.exit(1);
}

// Keep the sector list and the curated homepage order, which are structural
// decisions rather than content, exactly as they are.
const existing = JSON.parse(readFileSync('content/facts.json', 'utf8'));

const facts = {
  _note: existing._note,
  sectors: existing.sectors,
  projects: docs.map((d) => ({
    no: d.no,
    slug: d.slug,
    name: d.name,
    place: d.place ?? '—',
    year: d.year ?? '—',
    sector: d.sector,
    type: d.type,
    status: d.status,
    unbuilt: Boolean(d.unbuilt),
    photographer: d.photographer ?? null,
    press: (d.press ?? []).map((p) => p.entry),
  })),
  selected: existing.selected,
};

const text = {};
const figures = {};

for (const d of docs) {
  text[d.slug] = (d.body ?? []).map((p) => p.text);
  figures[d.slug] = (d.figures ?? [])
    .map((row) => row.image)
    .filter((m) => m && m.derivative?.src)
    .map((m) => ({
      source: m.filename ? `originals/${m.filename}` : undefined,
      src: m.derivative.src,
      width: m.derivative.width,
      height: m.derivative.height,
      fit: m.fit ?? 'cover',
      medium: m.medium ?? 'IMAGE',
      caption: m.caption ?? '',
      credit: m.credit ?? null,
    }));
}

const missing = Object.entries(figures).filter(([, list]) => !list.length);
if (missing.length) {
  console.error(`Refusing to export: ${missing.length} project(s) have no usable imagery: ${missing.map(([s]) => s).join(', ')}`);
  process.exit(1);
}

// The page copy: the statements, the essay, the contact details and the two
// addresses. These are the fields a non-developer is most likely to want to
// change, and until they were exported here, editing them in the admin saved
// happily and changed nothing on the site.
const studio = await payload.findGlobal({ slug: 'studio-details' });
const practice = await payload.findGlobal({ slug: 'practice-page' });

const pages = {
  studio: {
    positioningLine: studio.positioningLine,
    contactStatement: studio.contactStatement,
    contactLede: studio.contactLede,
    email: studio.email,
    telephone: studio.telephone,
    addresses: (studio.addresses ?? []).map((a) => ({ city: a.city, lines: a.lines })),
  },
  practice: {
    statement: practice.statement,
    paragraphs: (practice.paragraphs ?? []).map((p) => ({
      ...(p.heading ? { heading: p.heading } : {}),
      text: p.text,
    })),
    credentials: (practice.credentials ?? []).map((g) => ({
      label: g.label,
      items: (g.items ?? []).map((i) => i.text),
    })),
    recognition: (practice.recognition ?? []).map((r) => r.text),
    colleagues: (practice.colleagues ?? []).map((c) => c.name),
    collaborators: (practice.collaborators ?? []).map((c) => c.name),
  },
};

// A page rendered from empty copy is worse than one rendered from stale copy,
// so refuse rather than publish a blank homepage or contact page.
const required = [
  ['studio.positioningLine', pages.studio.positioningLine],
  ['studio.contactStatement', pages.studio.contactStatement],
  ['studio.email', pages.studio.email],
  ['practice.statement', pages.practice.statement],
];
const empty = required.filter(([, value]) => !value);
if (empty.length || pages.studio.addresses.length === 0 || pages.practice.paragraphs.length === 0) {
  console.error(
    `Refusing to export: page copy is incomplete (${
      empty.map(([k]) => k).join(', ') || 'no addresses or no paragraphs'
    })`,
  );
  process.exit(1);
}

writeFileSync('content/pages.json', JSON.stringify(pages, null, 2) + '\n');
writeFileSync('content/facts.json', JSON.stringify(facts, null, 2) + '\n');
writeFileSync('content/text.json', JSON.stringify(text, null, 1) + '\n');
writeFileSync('content/figures.json', JSON.stringify(figures, null, 1) + '\n');

const figureCount = Object.values(figures).reduce((n, l) => n + l.length, 0);
console.log(`exported ${facts.projects.length} projects and ${figureCount} figures to content/`);
console.log('review the diff, commit, and the deploy publishes it.');
process.exit(0);
