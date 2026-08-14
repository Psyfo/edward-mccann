# Edward McCann

Rebuild of [edwardmccann.studio](https://edwardmccann.studio/) for Edward McCann Architecture (client handover). This repository currently holds the discovery phase: a full preservation scrape of the legacy site and the Design Intelligence & Creative Direction Handoff Package that feeds the identity/design phase.

## Status

| Phase | State |
|---|---|
| 1. Audit + scrape of legacy site | **Done** (2026-08-14) |
| 2. Brand & digital identity direction (Claude Design, per `docs/`) | Next: consumes `design-intelligence/` |
| 3. Next.js rebuild | Blocked on phase 2 deliverables |

## Repository layout

```text
docs/                  Project documentation: the two working briefs today,
                       north-star docs and ADRs as the rebuild proceeds
design-intelligence/   The audit output: 24 analysis documents, 86 screenshots,
                       style probes, structured content digest. Start with
                       design-intelligence/README.md for the reading order.
tools/                 Node scripts used for the audit (re-runnable):
                       scrape.mjs, capture.mjs, digest.mjs
```

This repository sits inside a workspace that also holds material deliberately kept
out of version control for the rebuild:

```text
edward-mccann/              workspace (Doppler is scoped here)
├── edward-mccann/          this repository
├── site-archive/           preservation scrape of the legacy site (~112 MB:
│                           all HTML, all assets at largest hosted resolution,
│                           manifest). Produced by tools/scrape.mjs
└── brand-design/           output of the brand/design phase, once returned
                            (folder name set by the design brief in docs/)
```

## Key entry points

- [design-intelligence/executive-summary.md](design-intelligence/executive-summary.md): the 15-minute read
- [design-intelligence/design-handoff.md](design-intelligence/design-handoff.md): the complete handoff for the design phase
- [design-intelligence/README.md](design-intelligence/README.md): package guide + reading order

## Tooling

Run these from the repository root, after `cd tools && npm install`. `scrape.mjs`
and `digest.mjs` read and write the workspace's `../site-archive/`; `capture.mjs`
writes into `design-intelligence/screenshots/`.

```bash
node tools/scrape.mjs    # re-archive the live site into ../site-archive
node tools/capture.mjs   # re-shoot the screenshot matrix (needs playwright chromium)
node tools/digest.mjs    # re-extract structured copy from the archive
```

The legacy site remains live and untouched; nothing in this repo deploys anywhere yet.
