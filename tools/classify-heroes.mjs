// Declares the medium of the cover images that the filename-based inference
// could not establish.
//
// The pipeline can tell a drawing from a photograph by image statistics, but
// that measurement is only ever allowed to decide layout, never to declare what
// something is: a white-ground render measures like a drawing, and a good
// visualisation measures like a photograph. So these were classified by looking
// at each one, and only where the answer is not in doubt.
//
// The consequence on the site is small but visible: the medium chip on a card
// is hidden while the medium is unknown, so seventeen of twenty-seven covers
// carried no label at all and read as broken rather than deliberate.
//
// Idempotent. Safe to re-run; it only writes where the value differs.
//
// Usage:
//   doppler run --project edward-mccann --config stg -- npx tsx tools/classify-heroes.mjs

import { getPayload } from 'payload';
import config from '../payload.config.ts';

/** slug -> medium, judged by eye from the cover image itself. */
const MEDIUM = {
  'archway-road': 'PHOTOGRAPH',
  antidote: 'PHOTOGRAPH',
  'hassett-road': 'PHOTOGRAPH',
  'park-village': 'PHOTOGRAPH',
  'rylett-crescent': 'PHOTOGRAPH',
  'west-suffolk': 'PHOTOGRAPH',
  'chatsworth-rd': 'PHOTOGRAPH',
  chamber: 'PHOTOGRAPH',
  folly: 'PHOTOGRAPH',
  'kew-tree-house-competition': 'PHOTOGRAPH',
  'culford-mews': 'PHOTOGRAPH',
  '312-hackney-road': 'PHOTOGRAPH',
  'social-house': 'PHOTOGRAPH',

  // Line drawings, both already laid out uncropped.
  'willow-tree': 'DRAWING',
  'goat-hill-house': 'DRAWING',

  // An aerial carrying survey annotations, so it works as a site plan rather
  // than as a photograph of anything.
  'pennard-house': 'DRAWING',

  // A render: composited sky, cut-out trees, untextured surfaces.
  'campden-house': 'VISUALISATION',
};

const payload = await getPayload({ config });

const { docs } = await payload.find({
  collection: 'projects',
  limit: 200,
  depth: 1,
});

let changed = 0;
let already = 0;
const missed = [];

for (const project of docs) {
  const wanted = MEDIUM[project.slug];
  if (!wanted) continue;

  const cover = (project.figures ?? [])[0]?.image;
  if (!cover?.id) {
    missed.push(`${project.slug}: no cover image on the project`);
    continue;
  }

  if (cover.medium === wanted) {
    already++;
    continue;
  }

  await payload.update({
    collection: 'media',
    id: cover.id,
    data: { medium: wanted },
  });
  console.log(`${project.slug}: ${cover.medium ?? 'unset'} -> ${wanted}`);
  changed++;
}

console.log(`\n${changed} updated, ${already} already correct`);
for (const m of missed) console.log('  MISSED', m);
process.exit(missed.length ? 1 : 0);
