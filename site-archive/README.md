# Site Archive: edwardmccann.studio (as of 2026-08-14)

A preservation scrape of the legacy Edward McCann Architecture website, taken before the rebuild. Purpose: (1) preserve the current site exactly as it shipped, (2) provide the rebuild with every piece of content and every image at the largest hosted resolution.

## Contents

```text
pages/            Raw HTML of all 32 routes, unmodified
  home.html, about.html, press.html, contact.html, page_not_found.html
  projects/<slug>.html   (27 project pages)
assets/           Every same-origin asset, preserving URL paths
  application/files/...            image originals (largest hosted masters)
  application/files/cache/...      CMS-generated derivatives + CSS bundles
  application/themes/burble4/...   theme CSS/JS
  concrete/...                     CMS core CSS/JS
  download_file/view/              the 3 press clippings (renamed with real
                                   extensions; served extension-less by the CMS)
manifest.json     URL -> local path map for every fetched resource,
                  including misses and status codes
```

## How it was taken

`node tools/scrape.mjs` (in this repo): fetches each route, extracts every referenced asset (src/srcset/href/css url()), downloads same-origin assets preserving paths, then additionally attempts the full-resolution original behind every CMS thumbnail (`/application/files/thumbnails/<type>/a/b/c/x` → `/application/files/a/b/c/x`). One miss total: a theme default image that 404s on the live site too.

## Notes for reuse

- Image masters here are the largest files the CMS hosts (up to ~3.6 MB / ~2500-3600px). Anything larger must come from the practice or its photographers.
- The HTML is as-served: it contains the live site's defects (lorem ipsum on Chatsworth Rd, truncated Rylett text, entity glitches). See `../design-intelligence/copy-inventory.md` for the defect log before reusing copy verbatim.
- Extracted, structured copy for all pages lives at `../design-intelligence/data/content-digest.json`.
- URL inventory for the rebuild's 301 redirect map: `../design-intelligence/page-inventory.md` plus `manifest.json`.
- All content and imagery belongs to Edward McCann Architecture and its credited photographers (Lyndon Douglas, Emma Lewis, Travis Levius, Sebastian Tiew). Archived here for the client's own rebuild.
