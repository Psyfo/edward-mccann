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
docs/                  The two working briefs (audit brief + design brief)
design-intelligence/   The audit output: 20+ analysis documents, 86 screenshots,
                       style probes, structured content digest. Start with
                       design-intelligence/README.md for the reading order.
site-archive/          Preservation scrape of the legacy site (all HTML, all
                       assets at largest hosted resolution, manifest).
tools/                 Node scripts that produced the above (re-runnable):
                       scrape.mjs, capture.mjs, digest.mjs
```

## Key entry points

- [design-intelligence/executive-summary.md](design-intelligence/executive-summary.md): the 15-minute read
- [design-intelligence/design-handoff.md](design-intelligence/design-handoff.md): the complete handoff for the design phase
- [design-intelligence/README.md](design-intelligence/README.md): package guide + reading order

## Tooling

```bash
cd tools && npm install
node tools/scrape.mjs    # re-archive the live site
node tools/capture.mjs   # re-shoot the screenshot matrix (needs playwright chromium)
node tools/digest.mjs    # re-extract structured copy from the archive
```

The legacy site remains live and untouched; nothing in this repo deploys anywhere yet.
