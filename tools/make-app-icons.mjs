// Renders the raster app icons from the one drawn source, app/(frontend)/icon.svg.
//
// Only Apple's touch icon needs a bitmap: everything else uses the SVG, which
// stays sharp at any size. Generated rather than hand-exported so the monogram
// can be redrawn once and the raster follows.
//
// Usage: node tools/make-app-icons.mjs

import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE = 'app/(frontend)/icon.svg';
const OUT = 'app/(frontend)/apple-icon.png';
const SIZE = 180; // Apple's touch icon, the size iOS asks for

const svg = await readFile(SOURCE);

// No transparency: iOS composites touch icons onto a white sheet, and the
// monogram is drawn to sit on the ink ground rather than float on paper.
const png = await sharp(svg, { density: 384 })
  .resize(SIZE, SIZE, { fit: 'contain', background: '#161412' })
  .flatten({ background: '#161412' })
  .png()
  .toBuffer();

await writeFile(OUT, png);

const { width, height, channels } = await sharp(png).metadata();
console.log(`wrote ${OUT} at ${width}x${height}, ${channels} channels, ${png.length} bytes`);
