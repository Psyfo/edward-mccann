// Screenshot matrix + style probes for the edwardmccann.studio audit.
// Captures every route at desktop/tablet/mobile widths into
// design-intelligence/screenshots/, plus per-page style probe JSON into
// design-intelligence/probes/.
// Usage: node tools/capture.mjs   (run from repo root)

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE = 'https://edwardmccann.studio';
const SHOTS = path.resolve('design-intelligence', 'screenshots');
const PROBES = path.resolve('design-intelligence', 'probes');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
];

const PROJECT_SLUGS = [
  '312-hackney-road', 'antidote', 'archway-road', 'campden-house', 'chamber',
  'chatsworth-rd', 'culford-mews', 'firs-avenue', 'folly', 'goat-hill-house',
  'hassett-road', 'highpoint', 'ibberton', 'kew-tree-house-competition',
  'latimer-road', 'lonsdale-square', 'oval-road', 'park-village', 'pearson-st',
  'pennard-house', 'rylett-crescent', 'social-house', 'sourced', 'union-wharf',
  'victualler', 'west-suffolk', 'willow-tree',
];

// Representative projects that get the full three-viewport, full-page treatment.
const KEY_PROJECTS = ['firs-avenue', 'hassett-road', 'pennard-house', 'goat-hill-house', 'antidote', 'oval-road'];

const CORE_PAGES = [
  { slug: 'home', url: `${BASE}/` },
  { slug: 'about', url: `${BASE}/about` },
  { slug: 'press', url: `${BASE}/press` },
  { slug: 'contact', url: `${BASE}/contact` },
];

const probeFn = () => {
  const cs = (el) => el ? getComputedStyle(el) : null;
  const t = (el) => { const s = cs(el); return s ? { font: s.fontFamily.split(',')[0], size: s.fontSize, weight: s.fontWeight, lh: s.lineHeight, style: s.fontStyle, transform: s.textTransform, align: s.textAlign, color: s.color } : null; };
  const bgs = new Set(); const colors = new Set();
  document.querySelectorAll('body *').forEach(el => { const s = getComputedStyle(el); if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') bgs.add(s.backgroundColor); colors.add(s.color); });
  const container = document.querySelector('main .container, main .container-fluid');
  return {
    url: location.pathname,
    viewport: { w: document.documentElement.clientWidth, h: innerHeight },
    scrollHeight: document.documentElement.scrollHeight,
    wordmark: t(document.querySelector('nav h2')),
    h1: t(document.querySelector('h1')),
    h3: t(document.querySelector('main h3, h3')),
    navLink: t(document.querySelector('#inlineNav .nav a')),
    bodyP: t(document.querySelector('main p')),
    containerWidth: container ? Math.round(container.getBoundingClientRect().width) : null,
    imageCount: document.querySelectorAll('main img').length,
    backgrounds: [...bgs], textColors: [...colors],
  };
};

const browser = await chromium.launch();
let shot = 0;

for (const vp of VIEWPORTS) {
  await mkdir(path.join(SHOTS, vp.name), { recursive: true });
  await mkdir(PROBES, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  const capture = async (slug, url, { full = true, probe = false } = {}) => {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    } catch {
      await page.waitForTimeout(3000); // networkidle can hang on analytics; proceed with what loaded
    }
    await page.waitForTimeout(600);
    const base = path.join(SHOTS, vp.name, `${slug}-${vp.name}`);
    await page.screenshot({ path: `${base}.png`, scale: 'css' });
    shot++;
    if (full) {
      // Playwright's fullPage capture re-lays-out this theme's animated grid
      // columns incorrectly, so instead: grow the viewport to the content
      // height (capped), let the 1s width transition settle, then shoot.
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.setViewportSize({ width: vp.width, height: Math.min(h, 16000) });
      await page.waitForTimeout(1300);
      await page.screenshot({ path: `${base}-full.jpg`, scale: 'css', type: 'jpeg', quality: 78 });
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(300);
      shot++;
    }
    if (probe) {
      const data = await page.evaluate(probeFn);
      await writeFile(path.join(PROBES, `${slug}-${vp.name}.json`), JSON.stringify(data ?? {}, null, 2));
    }
    console.log(`[${vp.name}] ${slug}`);
  };

  for (const p of CORE_PAGES) await capture(p.slug, p.url, { full: true, probe: true });

  // Nav overlay open state (hamburger exists at tablet/mobile widths)
  if (vp.name !== 'desktop') {
    try {
      await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(800);
      await page.click('#navBars i');
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(SHOTS, vp.name, `navigation-${vp.name}-open.png`), scale: 'css' });
      shot++;
      console.log(`[${vp.name}] navigation-open`);
    } catch (e) { console.log(`[${vp.name}] nav overlay failed: ${e.message}`); }
  }

  for (const slug of KEY_PROJECTS) {
    await capture(`project-${slug}`, `${BASE}/projects/${slug}`, { full: true, probe: vp.name === 'desktop' });
  }

  // Every remaining project gets a desktop opening-viewport record.
  if (vp.name === 'desktop') {
    for (const slug of PROJECT_SLUGS.filter(s => !KEY_PROJECTS.includes(s))) {
      await capture(`project-${slug}`, `${BASE}/projects/${slug}`, { full: false });
    }
    // 404 page state
    await capture('page-not-found', `${BASE}/some-page-that-does-not-exist`, { full: false });
  }

  await ctx.close();
}

await browser.close();
console.log(`\nDone: ${shot} screenshots.`);
