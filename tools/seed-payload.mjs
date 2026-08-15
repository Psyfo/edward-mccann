// Imports the committed content into Payload, so going dynamic starts from
// exactly what the site already publishes rather than from an empty database.
//
// Idempotent: existing records are updated in place, matched on slug, so it is
// safe to re-run after editing the JSON.
//
// Media records point at the derivatives the pipeline already produced and
// uploaded, rather than re-uploading anything. Payload owns the metadata; the
// bucket objects stay exactly where the site expects them.
//
// Usage:
//   doppler run --project edward-mccann --config dev -- node tools/seed-payload.mjs

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { getPayload } from 'payload';
import config from '../payload.config.ts';

const facts = JSON.parse(readFileSync('content/facts.json', 'utf8'));
const text = JSON.parse(readFileSync('content/text.json', 'utf8'));
const figures = JSON.parse(readFileSync('content/figures.json', 'utf8'));

const payload = await getPayload({ config });

/**
 * A human name for the library.
 *
 * The files are content hashes inherited from the legacy CMS, so without this
 * the media list is 474 rows of hexadecimal. The first figure of a project is
 * its cover; the rest are numbered as they are captioned on the site.
 */
function figureTitle(project, index) {
  return index === 0
    ? `${project.name}, cover`
    : `${project.name}, fig. ${String(index).padStart(2, '0')}`;
}

/**
 * Media are matched on the derivative path, which is content-addressed and
 * therefore stable across re-runs.
 *
 * Payload takes ownership of the original file, uploading it to the bucket
 * under originals/. That is worth the one-off transfer: it means the practice
 * can re-run the pipeline later (new widths, better encoders, higher-resolution
 * replacements) without needing the local site archive to still exist.
 */
async function upsertMedia(fig, title) {
  const existing = await payload.find({
    collection: 'media',
    where: { 'derivative.src': { equals: fig.src } },
    limit: 1,
  });

  const data = {
    title,
    alt: '',
    caption: fig.caption ?? '',
    medium: fig.medium ?? 'IMAGE',
    // Only the credit the manifest actually carries. Falling back to the
    // project photographer would put a credit on every figure, including
    // drawings and models they did not take, and lengthen every caption.
    credit: fig.credit ?? null,
    fit: fig.fit ?? 'cover',
    derivative: { src: fig.src, width: fig.width, height: fig.height },
  };

  if (existing.docs.length) {
    // Metadata only: the original is already in the bucket.
    return payload.update({ collection: 'media', id: existing.docs[0].id, data });
  }

  return payload.create({
    collection: 'media',
    data,
    filePath: path.resolve('..', 'site-archive', fig.source),
  });
}

let mediaCount = 0;
let projectCount = 0;

for (const project of facts.projects) {
  const figs = figures[project.slug] ?? [];
  const mediaIds = [];
  for (const [i, fig] of figs.entries()) {
    const doc = await upsertMedia(fig, figureTitle(project, i));
    mediaIds.push(doc.id);
    mediaCount++;
  }

  const data = {
    no: project.no,
    name: project.name,
    slug: project.slug,
    place: project.place,
    year: project.year,
    sector: project.sector,
    type: project.type,
    status: project.status,
    unbuilt: Boolean(project.unbuilt),
    photographer: project.photographer ?? null,
    press: (project.press ?? []).map((entry) => ({ entry })),
    body: (text[project.slug] ?? []).map((t) => ({ text: t })),
    figures: mediaIds.map((image) => ({ image })),
  };

  const existing = await payload.find({
    collection: 'projects',
    where: { slug: { equals: project.slug } },
    limit: 1,
  });

  if (existing.docs.length) {
    await payload.update({ collection: 'projects', id: existing.docs[0].id, data });
  } else {
    await payload.create({ collection: 'projects', data });
  }
  projectCount++;
  process.stdout.write(`\r  ${projectCount}/${facts.projects.length} projects, ${mediaCount} figures   `);
}

console.log();

// The page copy that currently lives in the components, so an editor can reach
// it without a developer.
await payload.updateGlobal({
  slug: 'studio-details',
  data: {
    positioningLine:
      'Nose to tail design — initial concepts carried through to their resolution in the details and construction.',
    contactStatement: 'Every project begins with a conversation » a back and forth.',
    contactLede:
      'Tell us about your site and what you imagine for it. We take on houses, places to eat and drink, objects and public work, from first feasibility conversations to contract administration on site.',
    email: 'info@edwardmccann.studio',
    telephone: '+44 7734 593 280',
    addresses: [
      { city: 'LONDON', lines: '105 Wilton Way\nLondon E8 1BH' },
      { city: 'CAPE TOWN', lines: '10 Kelvin Street\nGardens, 8001' },
    ],
  },
});

await payload.updateGlobal({
  slug: 'practice-page',
  data: {
    statement:
      'We believe in nose to tail design, in which initial concepts at inception are carried through to their resolution in the details and construction.',
    paragraphs: [
      {
        text: 'We are an RIBA Chartered and ARB registered architecture practice. We have a lot of experience in working on sites with complex and particular constraints. A lot of the work we have undertaken has been modification and retrofitting of existing buildings: rear extensions, basement extensions, loft extensions, internal reconfigurations and fitouts.',
      },
      {
        text: 'It can be an extremely rewarding experience to see through the transformation of an existing building and unlock new possibilities within it. There are particular stages within a project when things are stripped back and alternative spaces can be seen beyond what is existing at the time. It is the job of your architect to reveal these possibilities to you in advance, within a process that allows you to make good decisions and get the most out of what for most people is a once in a lifetime project.',
      },
    ],
    credentials: [
      {
        label: 'ACCREDITATION',
        items: [{ text: 'RIBA CHARTERED' }, { text: 'ARB REGISTERED' }],
      },
      {
        label: 'EDUCATION',
        items: [
          { text: 'CAMBRIDGE UNIVERSITY — ARB/RIBA PT.3' },
          { text: 'ARCHITECTURAL ASSOCIATION — AA DIPL' },
          { text: 'EDINBURGH UNIVERSITY — MA (HONS)' },
          { text: 'CAMBERWELL COLLEGE OF ART — FOUNDATION' },
        ],
      },
      {
        label: 'PREVIOUS PRACTICES',
        items: [
          { text: 'ADJAYE ASSOCIATES' },
          { text: 'EDWARD CULLINAN ARCHITECTS' },
          { text: 'SCABAL' },
        ],
      },
    ],
    recognition: [
      { text: "DON'T MOVE IMPROVE — 2017" },
      { text: "DON'T MOVE IMPROVE — 2019, FEATURED" },
      { text: "DON'T MOVE IMPROVE — 2022, LONGLISTED" },
      { text: 'GRAND DESIGNS — TELEVISION, 2019' },
      { text: 'GRAND DESIGNS MAGAZINE — LOFT EXTENSIONS FEATURE' },
    ],
    colleagues: [
      'Roua Horaneih', 'Cecilia Dubois', 'Stephanie Westrum', 'Haruka Murai',
      'Chiaki Tanaka', 'Tim Fisher', 'Adrian Ma', 'Sebastian Tiew', 'Ahmed Sahar',
      'Tom Hatzor',
    ].map((name) => ({ name })),
    collaborators: [
      'Rashid Ali', 'Alex Fox', 'Adam Williamson', 'Squint Opera',
      'Atelier For Images', 'Mat Chivers', 'Juliet Haysom',
    ].map((name) => ({ name })),
  },
});

console.log(`seeded ${projectCount} projects and ${mediaCount} figures, plus both globals`);
process.exit(0);
