// One-off: sets derivative.tone on the splash photographs already in the
// library, computed the same way tools/prepare-splash.mjs now computes it for
// new uploads. Safe to re-run; it only writes where the value is missing or
// wrong.
//
// Usage:
//   doppler run --project edward-mccann --config stg -- npx tsx tools/backfill-splash-tone.mjs

import sharp from 'sharp';
import { getPayload } from 'payload';
import config from '../payload.config.ts';

const DIR = 'C:/Users/user-pc/Downloads/Edward McCann/';

const FILES = {
  'Artist Studio-02 © Agnese Sanvito _LR.jpg': 'Artist Studio-02 © Agnese Sanvito _LR.jpg',
  'Artist Studio-12 © Agnese Sanvito_LR.jpg': 'Artist Studio-12 © Agnese Sanvito_LR.jpg',
  'Artist Studio-24 cropped © Agnese Sanvito_LR.jpg': 'Artist Studio-24 cropped © Agnese Sanvito_LR.jpg',
  'Hackney Road_EXT_126.jpg': 'Hackney Road_EXT_126.jpg',
  'DJI_0137.jpg': 'DJI_0137.jpg',
};

async function tone(path) {
  const meta = await sharp(path).metadata();
  const cw = Math.round(meta.width * 0.5);
  const ch = Math.round(meta.height * 0.5);
  const left = Math.round((meta.width - cw) / 2);
  const top = Math.round((meta.height - ch) / 2);
  const { channels } = await sharp(path).extract({ left, top, width: cw, height: ch }).greyscale().stats();
  return channels[0].mean > 140 ? 'light' : 'dark';
}

const payload = await getPayload({ config });
const { docs } = await payload.find({ collection: 'media', limit: 200, where: { filename: { exists: true } } });

let updated = 0;
for (const doc of docs) {
  const localName = Object.keys(FILES).find((f) => doc.filename?.includes(f) || f.includes(doc.filename ?? '\0'));
  if (!localName || !doc.derivative?.src?.startsWith('splash/')) continue;

  const value = await tone(DIR + localName);
  if (doc.derivative.tone === value) {
    console.log(`  already ${value}: ${doc.filename}`);
    continue;
  }
  await payload.update({
    collection: 'media',
    id: doc.id,
    data: { derivative: { ...doc.derivative, tone: value } },
  });
  console.log(`  set ${value}: ${doc.filename}`);
  updated++;
}

console.log(`\n${updated} record(s) updated`);
