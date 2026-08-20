// Puts the practice's remaining splash photographs into the media library and
// onto the splash list, so the whole set is editable rather than half of it
// living in code.
//
// The originals go through Payload's own upload handler, which is what makes
// them appear in the library like anything else; the derivative fields are
// then filled from the renditions tools/prepare-splash.mjs already produced,
// because that pipeline makes the wide crops a full-viewport image needs and
// Payload's own resizing is deliberately off.
//
// Idempotent: a photograph already in the library is reused, and a slide
// already on the list is left alone.
//
// Usage:
//   doppler run --project edward-mccann --config stg -- npx tsx tools/add-splash-slides.mjs

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getPayload } from 'payload';
import config from '../payload.config.ts';

const DIR = 'C:/Users/user-pc/Downloads/Edward McCann/';

/** The renditions prepare-splash.mjs uploaded, keyed by the source file. */
const SLIDES = [
  {
    landscape: {
      file: 'Artist Studio-02 © Agnese Sanvito _LR.jpg',
      src: 'splash/0b51f0659df3ff09',
      width: 2562,
      height: 2480,
      alt: 'The artist studio, red panelled base under a translucent upper storey.',
      credit: 'Agnese Sanvito',
    },
    portrait: {
      file: 'Artist Studio-12 © Agnese Sanvito_LR.jpg',
      src: 'splash/79931555338bd5ae',
      width: 2284,
      height: 3425,
      alt: 'The artist studio interior, red steel over a garden window.',
      credit: 'Agnese Sanvito',
    },
  },
  {
    landscape: {
      file: 'DJI_0137.jpg',
      src: 'splash/53a7e200c5d2a045',
      width: 2956,
      height: 3983,
      alt: 'The West Suffolk house and its outbuildings from the air.',
      credit: null,
    },
    portrait: null,
  },
];

const payload = await getPayload({ config });

async function mediaFor(spec) {
  const filename = path.basename(spec.file);
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  });
  if (existing.docs.length) {
    console.log(`  reusing ${filename}`);
    return existing.docs[0];
  }

  const data = await readFile(DIR + spec.file);
  const created = await payload.create({
    collection: 'media',
    file: { data, name: filename, mimetype: 'image/jpeg', size: data.length },
    data: {
      title: `Splash, ${filename.replace(/\.[a-z0-9]+$/i, '')}`,
      alt: spec.alt,
      credit: spec.credit,
      medium: 'PHOTOGRAPH',
      fit: 'cover',
      derivative: { src: spec.src, width: spec.width, height: spec.height },
    },
  });
  console.log(`  uploaded ${filename}`);
  return created;
}

const global = await payload.findGlobal({ slug: 'studio-details', depth: 0 });
const current = global.homepage?.splashSlides ?? [];
console.log(`splash list holds ${current.length} slide(s)`);

const additions = [];
for (const slide of SLIDES) {
  console.log(`slide: ${path.basename(slide.landscape.file)}`);
  const landscape = await mediaFor(slide.landscape);
  const portrait = slide.portrait ? await mediaFor(slide.portrait) : null;

  const already = current.some((s) => {
    const id = typeof s.landscape === 'object' ? s.landscape?.id : s.landscape;
    return id === landscape.id;
  });
  if (already) {
    console.log('  already on the list');
    continue;
  }
  additions.push({ landscape: landscape.id, portrait: portrait?.id ?? null });
}

if (additions.length === 0) {
  console.log('nothing to add');
} else {
  await payload.updateGlobal({
    slug: 'studio-details',
    data: {
      homepage: {
        ...global.homepage,
        splashSlides: [
          ...current.map((s) => ({
            landscape: typeof s.landscape === 'object' ? s.landscape?.id : s.landscape,
            portrait: typeof s.portrait === 'object' ? s.portrait?.id : s.portrait,
          })),
          ...additions,
        ],
      },
    },
  });
  console.log(`added ${additions.length} slide(s)`);
}

const after = await payload.findGlobal({ slug: 'studio-details', depth: 1 });
console.log(`\nsplash list now holds ${after.homepage.splashSlides.length} slide(s):`);
for (const s of after.homepage.splashSlides) {
  console.log(`  ${s.landscape?.filename ?? s.landscape} / ${s.portrait?.filename ?? '(landscape used)'}`);
}
