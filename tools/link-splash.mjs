// Puts the splash photographs into the media library and points the landing
// page at them.
//
// The renditions the splash actually serves are made by tools/prepare-splash.mjs
// and live under splash/ in the bucket. This records them the same way every
// other image on the site is recorded: a media document holding the original,
// with the derivative written onto it. That is what lets the practice swap the
// photograph in the admin rather than asking for a deploy.
//
// Idempotent: matching documents are updated rather than duplicated.
//
// Usage:
//   doppler run --project edward-mccann --config stg -- npx tsx tools/link-splash.mjs

import { getPayload } from 'payload';
import config from '../payload.config.ts';

const DIR = 'C:/Users/user-pc/Downloads/Edward McCann/';

const IMAGES = [
  {
    field: 'splashImage',
    filePath: `${DIR}Artist Studio-24 cropped © Agnese Sanvito_LR.jpg`,
    title: 'Splash, artist studio, elevation',
    alt: 'The artist studio seen from the garden: a red panelled base under a translucent upper storey, among trees.',
    derivative: { src: 'splash/b0a046e305f4e017', width: 2922, height: 2480 },
  },
  {
    // Chosen over the studio interior by measurement rather than taste: the
    // interior puts a bright clerestory directly behind the centred mark
    // (mean luminance 148/255), where this reads 89/255 and the mark holds.
    field: 'splashImageMobile',
    filePath: `${DIR}Hackney Road_EXT_126.jpg`,
    title: 'Splash, Hackney Road, street',
    alt: 'A red zinc roof extension above a brick terrace, seen from the street.',
    credit: null,
    derivative: { src: 'splash/95abdf1855fd67bd', width: 1800, height: 2400 },
  },
];

const payload = await getPayload({ config });
const ids = {};

for (const image of IMAGES) {
  const data = {
    title: image.title,
    alt: image.alt,
    credit: image.credit === null ? null : 'Agnese Sanvito',
    medium: 'PHOTOGRAPH',
    fit: 'cover',
    derivative: image.derivative,
  };

  const existing = await payload.find({
    collection: 'media',
    where: { title: { equals: image.title } },
    limit: 1,
  });

  if (existing.docs.length) {
    const doc = await payload.update({ collection: 'media', id: existing.docs[0].id, data });
    ids[image.field] = doc.id;
    console.log(`updated media #${doc.id} ${image.title}`);
  } else {
    const doc = await payload.create({ collection: 'media', data, filePath: image.filePath });
    ids[image.field] = doc.id;
    console.log(`created media #${doc.id} ${image.title}`);
  }
}

const current = await payload.findGlobal({ slug: 'studio-details' });
await payload.updateGlobal({
  slug: 'studio-details',
  data: { homepage: { ...current.homepage, ...ids } },
});

const after = await payload.findGlobal({ slug: 'studio-details' });
console.log('\nlanding page now points at:');
console.log(`  desktop ${after.homepage.splashImage?.title ?? 'none'}`);
console.log(`  mobile  ${after.homepage.splashImageMobile?.title ?? 'none'}`);

// Payload keeps its pool open, so a script that has finished its work still
// hangs. Nothing is left to do here.
process.exit(0);
