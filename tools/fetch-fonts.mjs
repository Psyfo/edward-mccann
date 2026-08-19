// Downloads the exact font files the site uses into app/fonts, so builds never
// depend on reaching Google at build time.
//
// next/font/google fetches at build time, which makes every build (CI, Docker,
// a laptop on a train) depend on an external service. One CI build already
// failed that way. These faces are open licence (SIL OFL), so self-hosting them
// is both permitted and the more honest default for a site whose whole point is
// that it loads fast and privately.
//
// Usage: node tools/fetch-fonts.mjs

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('app', 'fonts');

// Only the weights and styles actually used, checked against the stylesheets:
// 400 and 500 for the structural voice, 400 roman and italic for reading,
// 400 for notation.
const FACES = [
  { family: 'Jost', axis: 'wght@400', file: 'jost-400' },
  { family: 'Jost', axis: 'wght@500', file: 'jost-500' },
  { family: 'EB+Garamond', axis: 'ital,wght@0,400', file: 'garamond-400' },
  { family: 'EB+Garamond', axis: 'ital,wght@1,400', file: 'garamond-400-italic' },
  { family: 'Spline+Sans+Mono', axis: 'wght@400', file: 'mono-400' },
  // The banner face. The practice asked for Century Gothic, which is
  // Monotype's and cannot be self-hosted; Questrial is the closest open face
  // (same geometric single-storey construction) and sits behind it in the
  // stack, so machines that own Century Gothic use it and everyone else sees
  // its nearest relative rather than a random fallback.
  { family: 'Questrial', axis: 'wght@400', file: 'questrial-400' },
];

// A modern UA is required or Google serves legacy formats instead of woff2.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

await mkdir(OUT, { recursive: true });

for (const face of FACES) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${face.family}:${face.axis}&display=swap`;
  const css = await fetch(cssUrl, { headers: { 'User-Agent': UA } }).then((r) => {
    if (!r.ok) throw new Error(`${face.file}: stylesheet ${r.status}`);
    return r.text();
  });

  // Take the latin subset block; the site is English only.
  const blocks = css.split('/*').filter((b) => b.includes('src:'));
  const latin = blocks.find((b) => b.trimStart().startsWith('latin*')) ?? blocks[blocks.length - 1];
  const url = latin.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
  if (!url) throw new Error(`${face.file}: no woff2 in stylesheet`);

  const bytes = Buffer.from(await fetch(url).then((r) => r.arrayBuffer()));
  await writeFile(path.join(OUT, `${face.file}.woff2`), bytes);
  console.log(`${face.file}.woff2  ${(bytes.length / 1024).toFixed(0)} KB`);
}

console.log(`\n${FACES.length} files in app/fonts. The build no longer contacts Google.`);
