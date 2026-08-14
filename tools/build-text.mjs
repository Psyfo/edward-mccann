// Builds content/text.json: the practice's own project prose, verbatim, with
// the defects catalogued in design-intelligence/copy-inventory.md repaired.
//
// Repairs applied (each one deliberate, each one recorded here):
//   - chatsworth-rd shipped a lorem ipsum placeholder as its body; the real
//     text survives only in that page's meta description, so that is used.
//   - rylett-crescent's body ends mid-word ("compositio"); the meta description
//     carries the finished sentence, so the final clause is completed from it.
//   - "Photos. <name>" trailing paragraphs are removed: photographer is a fact
//     in facts.json and is rendered in the credits layer, not the essay.
//   - HTML entities are decoded to real characters.
//
// Usage: node tools/build-text.mjs   (run from repo root)

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const DIGEST = path.resolve('design-intelligence', 'data', 'content-digest.json');
const OUT = path.resolve('content', 'text.json');

const decode = (s) => s
  .replace(/&amp;/g, '&')
  .replace(/&ndash;/g, '–')
  .replace(/&mdash;/g, '—')
  .replace(/&rsquo;|&#039;|&#39;/g, '’')
  .replace(/&lsquo;/g, '‘')
  .replace(/&ldquo;/g, '“')
  .replace(/&rdquo;/g, '”')
  .replace(/&quot;/g, '"')
  .replace(/&nbsp;?/g, ' ')
  .replace(/&gt;/g, '>')
  .replace(/&lt;/g, '<')
  .replace(/\s+/g, ' ')
  .trim();

const digest = JSON.parse(readFileSync(DIGEST, 'utf8'));
const bySlug = new Map(
  digest
    .filter((d) => d.slug.startsWith('projects/'))
    .map((d) => [d.slug.replace('projects/', ''), d]),
);

const out = {};
const notes = [];

for (const [slug, page] of bySlug) {
  let paras = page.paras.map(decode).filter(Boolean);

  // Photographer credits move to the facts layer.
  paras = paras.filter((p) => !/^photos?\.\s/i.test(p));

  if (/lorem ipsum/i.test(paras.join(' '))) {
    const real = decode(page.desc || '');
    paras = real ? [real] : [];
    notes.push(`${slug}: lorem ipsum replaced with the text from its meta description`);
  }

  // Repair a body that stops mid-sentence. Where the meta description holds
  // the same paragraph finished, take that paragraph whole rather than
  // splicing, which risks duplicating the overlap.
  const last = paras[paras.length - 1];
  if (last && !/[.!?"”’]$/.test(last) && page.desc) {
    const desc = decode(page.desc);
    const probe = last.slice(0, 60);
    const start = probe.length >= 40 ? desc.indexOf(probe) : -1;
    if (start !== -1 && desc.length - start > last.length) {
      paras[paras.length - 1] = desc.slice(start);
      notes.push(`${slug}: completed a body truncated in the source, from its meta description`);
    }
  }

  out[slug] = paras;
}

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 1));

const empty = Object.entries(out).filter(([, v]) => !v.length).map(([k]) => k);
console.log(`wrote text for ${Object.keys(out).length} projects`);
for (const n of notes) console.log('  repair:', n);
if (empty.length) console.log('  NO TEXT (needs client copy):', empty.join(', '));
console.log('  paragraph counts:', Object.entries(out).map(([k, v]) => `${k}:${v.length}`).join(' '));
