// Compares two baselines captured by tools/baseline.mjs and reports what
// actually differs: page text, image URLs, links and headings.
//
// Usage: node tools/compare-baseline.mjs <before> <after>

import { readFileSync } from 'node:fs';
import path from 'node:path';

const [before, after] = process.argv.slice(2);
if (!before || !after) {
  console.error('usage: node tools/compare-baseline.mjs <before> <after>');
  process.exit(2);
}

const load = (label) =>
  JSON.parse(readFileSync(path.resolve('.baseline', label, 'fingerprint.json'), 'utf8'));

const a = load(before);
const b = load(after);
const differences = [];

const listDiff = (page, field, from, to) => {
  const missing = from.filter((x) => !to.includes(x));
  const added = to.filter((x) => !from.includes(x));
  if (missing.length || added.length) {
    differences.push(
      `${page} ${field}: ${missing.length} removed, ${added.length} added` +
        (missing.length ? `\n    - ${missing.slice(0, 3).join('\n    - ')}` : '') +
        (added.length ? `\n    + ${added.slice(0, 3).join('\n    + ')}` : ''),
    );
  }
};

for (const page of Object.keys(a)) {
  if (!b[page]) {
    differences.push(`${page}: missing from "${after}"`);
    continue;
  }
  if (a[page].textHash !== b[page].textHash) {
    differences.push(
      `${page} text differs (${a[page].textLength} chars before, ${b[page].textLength} after)`,
    );
  }
  listDiff(page, 'images', a[page].images, b[page].images);
  listDiff(page, 'links', a[page].links, b[page].links);
  listDiff(page, 'headings', a[page].headings, b[page].headings);
}

for (const page of Object.keys(b)) {
  if (!a[page]) differences.push(`${page}: new in "${after}"`);
}

if (!differences.length) {
  console.log(`identical: ${Object.keys(a).length} pages match between "${before}" and "${after}"`);
  console.log('(screenshots still worth an eye; this compares text, images, links and headings)');
} else {
  console.log(`${differences.length} difference(s) between "${before}" and "${after}":\n`);
  for (const d of differences) console.log('  ' + d);
  process.exit(1);
}
