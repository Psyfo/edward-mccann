// Builds the raster icons from the drawn mark, so there is one source for the
// monogram rather than a set of hand-exported files to keep in sync.
//
// Two of them cannot use the site's favicon as their source, for opposite
// reasons, which is the whole reason this script exists:
//
//   - app/(frontend)/icon.svg has no tile and colours itself from the reader's
//     theme. That is right for a browser tab and wrong everywhere else.
//   - iOS composites touch icons onto black, so a transparent one arrives as a
//     dark square. The touch icon therefore comes from the tiled variant.
//   - .ico cannot carry a media query, so the fallback also uses the tile,
//     which stays legible whatever is behind it.
//
// Usage: node tools/make-app-icons.mjs

import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const TILE = 'public/brand/em-mark-ink-on-paper.svg';
const APPLE_ICON = 'app/(frontend)/apple-icon.png';
const FAVICON = 'app/favicon.ico'; // app root: the .ico convention is not picked up inside a route group

const APPLE_SIZE = 180; // the size iOS asks for
const ICO_SIZES = [16, 32, 48];

const tile = await readFile(TILE);

// ensureAlpha after flatten is not redundant: flatten drops the alpha
// channel, and the .ico container rejects a PNG that is not RGBA. The tile is
// opaque either way; this only decides how many channels it is stored in.
const render = (size) =>
  sharp(tile, { density: 900 })
    .resize(size, size, { fit: 'contain', background: '#F5F2ED' })
    .flatten({ background: '#F5F2ED' })
    .ensureAlpha()
    .png()
    .toBuffer();

await writeFile(APPLE_ICON, await render(APPLE_SIZE));

/**
 * Wraps PNGs in an .ico container.
 *
 * A modern .ico is just a small directory followed by the image files, and PNG
 * is a legal payload, so no bitmap encoder is needed and no dependency has to
 * be added for a file this rare.
 */
function ico(images) {
  const HEADER = 6;
  const ENTRY = 16;
  const header = Buffer.alloc(HEADER);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = HEADER + ENTRY * images.length;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(ENTRY);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // palette size, 0 for true colour
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const icoImages = [];
for (const size of ICO_SIZES) icoImages.push({ size, data: await render(size) });
await writeFile(FAVICON, ico(icoImages));

const apple = await sharp(await readFile(APPLE_ICON)).metadata();
console.log(`wrote ${APPLE_ICON} at ${apple.width}x${apple.height}`);
console.log(`wrote ${FAVICON} with ${ICO_SIZES.join(', ')}px`);
