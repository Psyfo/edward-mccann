# Design Intelligence Package: Edward McCann Architecture

A forensic audit of https://edwardmccann.studio/ conducted 2026-08-14, produced as the **Design Intelligence & Creative Direction Handoff** for the identity/design phase (Claude Design) of the Edward McCann rebuild. The audit's job was to understand, not to redesign; nothing here is a design.

## How the analysis was conducted

- Live crawl and interaction pass with Playwright (desktop 1440x900, tablet 768x1024 + the 769-991 band, mobile 375x812): navigation, hover states, overlay menu, scroll behaviour, network waterfall, computed-style probes.
- Full preservation scrape of all 32 routes and 350+ assets into `../../site-archive/` (raw HTML, every image at the largest hosted resolution, CSS/JS, fonts, press downloads, favicon; `manifest.json` maps URL → file).
- Source-level analysis of the archived HTML/CSS/JS (breakpoints, grid rules, metadata, content extraction into `data/content-digest.json`).
- Competitive research across live comparator practices (McLaren Excell, Al-Jawad Pike, 31/44, William Smalley, Proctor & Shaw, Studio McW, Tuckey Design Studio, plus sampled others).
- No CMS/server access existed; everything is inferred from the rendered site and marked Unknown where uncertain. The production site was not modified in any way.

## Reading order

1. `executive-summary.md`: the 15-minute version
2. `design-handoff.md`: the complete synthesis (context → directions → non-negotiables → open questions)
3. `recommended-design-direction.md`: the three creative territories + recommendation
4. `brand-analysis.md` and `competitive-positioning.md`: why the territories are what they are
5. `screenshot-index.md` → the 12 key captures in `screenshots/`
6. Craft files as needed: `typography-analysis.md`, `colour-analysis.md`, `photography-analysis.md`, `visual-analysis.md`, `design-system-analysis.md`, `interaction-analysis.md`, `responsive-analysis.md`, `ux-analysis.md`, `content-analysis.md`, `information-architecture.md`
7. Reference: `page-inventory.md`, `component-inventory.md`, `copy-inventory.md`, `asset-inventory.md`, `technical-analysis.md`, `risks-and-constraints.md`, `opportunities.md`
8. Data: `data/content-digest.json` (all copy, structured), `probes/*.json` (measured styles per page/viewport)

## What was inspected

All 32 public routes (home, about, press, contact, 404, 27 projects), at three viewport classes, plus interaction states (hover, overlay nav open, scrolled reading states) and the network layer (fonts, analytics, CDNs, failure modes).

## What the design model should take from here

Give the design phase, at minimum: `executive-summary.md`, `design-handoff.md`, `recommended-design-direction.md`, `brand-analysis.md`, `competitive-positioning.md`, `photography-analysis.md`, `typography-analysis.md`, `colour-analysis.md`, `responsive-analysis.md`, `opportunities.md`, `screenshot-index.md`, and the `screenshots/` folder. Everything else is depth on demand. Source imagery for moodboards/mockups can be pulled from `../../site-archive/assets/` (highest-resolution preserved masters listed in `asset-inventory.md`).

## Assumptions made

- The live site on 2026-08-14 is the authoritative "current state"; no staging/other versions considered.
- Copy in meta descriptions was treated as practice-authored (it reads as such) and usable content.
- Award/press claims were taken from the site's own statements and thumbnail badges; dates beyond those shown were not independently verified.

## Known unknowns (also listed in `design-handoff.md` → Open Questions)

Project build-status per project; Cape Town office currency; account ownership (CMS, hosting, domain, Adobe Fonts kit `zou6bnl`, GA4 `G-3J3PKD0QQK`); photographer licensing terms; existence of higher-resolution photo masters; the client's preferred practice name.

## Repo context

This folder lives in the `edward-mccann` repository, alongside `../docs/` (the audit brief this package answers, and the Claude Design brief that consumes it) and `../tools/` (the scrape/capture/digest scripts used here, re-runnable). The preservation scrape itself is deliberately kept out of the repository, one level up in the workspace at `../../site-archive/`, together with `../../design-resources/` where the design phase's output will land. The rebuild (Next.js) starts only after the design phase returns.
