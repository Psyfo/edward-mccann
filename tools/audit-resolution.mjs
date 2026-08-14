// Reports whether the imagery is big enough for the way the design uses it.
// Compares each project's hero source against what a full-bleed 21:9.5 hero
// actually needs, and flags how much of each image the fixed crops discard.
//
// Usage: node tools/audit-resolution.mjs

import { readFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ARCHIVE = path.resolve('..', 'site-archive');
const HANDOFF = path.resolve('..', 'design_handoff_edward_mccann_brand', 'assets', 'heroes');
const source = JSON.parse(readFileSync('content/figures.source.json', 'utf8'));
const facts = JSON.parse(readFileSync('content/facts.json', 'utf8'));

// A full-bleed hero spans the viewport. These are the widths that matter.
const TARGETS = [
  { label: 'laptop 1440 @1x', css: 1440 },
  { label: 'desktop 1920 @1x', css: 1920 },
  { label: 'laptop 1440 @2x', css: 2880 },
];
const HERO_RATIO = 21 / 9.5;

async function dims(file) {
  try {
    const m = await sharp(file, { failOn: 'none' }).metadata();
    return m.width && m.height ? { w: m.width, h: m.height } : null;
  } catch {
    return null;
  }
}

const rows = [];
for (const project of facts.projects) {
  const first = source[project.slug]?.[0];
  const current = first ? await dims(path.join(ARCHIVE, first.file)) : null;

  // The design phase curated one hero per project; see whether it is bigger.
  let curated = null;
  for (const ext of ['jpg', 'png']) {
    const candidate = path.join(HANDOFF, `${project.slug}.${ext}`);
    curated = curated ?? (await dims(candidate));
  }

  rows.push({ slug: project.slug, selected: facts.selected.includes(project.slug), current, curated });
}

const fmt = (d) => (d ? `${d.w}x${d.h}` : 'n/a');
console.log('project                     current hero    curated hero    widest available');
for (const r of rows) {
  const widest = Math.max(r.current?.w ?? 0, r.curated?.w ?? 0);
  const mark = r.selected ? '*' : ' ';
  console.log(
    `${mark}${r.slug.padEnd(26)} ${fmt(r.current).padEnd(15)} ${fmt(r.curated).padEnd(15)} ${widest}`,
  );
}

console.log('\n(* = on the homepage Selected grid)\n');
console.log('A full-bleed 21:9.5 hero needs, at minimum:');
for (const t of TARGETS) {
  console.log(`  ${t.label.padEnd(18)} ${t.css} x ${Math.round(t.css / HERO_RATIO)}`);
}

const widest = rows.map((r) => Math.max(r.current?.w ?? 0, r.curated?.w ?? 0));
const enoughFor1440 = widest.filter((w) => w >= 1440).length;
const enoughFor1920 = widest.filter((w) => w >= 1920).length;
const enoughFor2880 = widest.filter((w) => w >= 2880).length;
console.log(`\nOf ${rows.length} projects, the best available hero source is:`);
console.log(`  >= 1440px wide: ${enoughFor1440}`);
console.log(`  >= 1920px wide: ${enoughFor1920}`);
console.log(`  >= 2880px wide: ${enoughFor2880}`);

// How much of a source the 21:9.5 hero crop throws away.
console.log('\nCropping loss in the hero frame (21:9.5), worst first:');
const loss = rows
  .filter((r) => r.current)
  .map((r) => {
    const srcRatio = r.current.w / r.current.h;
    // cover: the frame keeps full width and cuts height, or vice versa.
    const kept = srcRatio > HERO_RATIO ? HERO_RATIO / srcRatio : srcRatio / HERO_RATIO;
    return { slug: r.slug, pct: Math.round((1 - kept) * 100), ratio: srcRatio.toFixed(2) };
  })
  .sort((a, b) => b.pct - a.pct);
for (const l of loss.slice(0, 8)) {
  console.log(`  ${l.slug.padEnd(26)} loses ${String(l.pct).padStart(2)}%  (source ratio ${l.ratio})`);
}
