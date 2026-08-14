# Asset Inventory

Everything the site serves, preserved in `../site-archive/` (350+ files, ~110 MB, manifest at `../site-archive/manifest.json`).

## Identity assets

| Asset | Location (archive) | Reality |
|---|---|---|
| Wordmark | none (typeset text) | "EDWARD McCANN ARCHITECTURE" is live text in futura-pt. No logo file exists |
| Favicon | `assets/application/files/7516/5895/0465/favicon.ico` | Cropped fragment of a black stencil-style "EM" letterform pair |
| Apple touch icon | `assets/application/files/7716/5895/0463/apple-touch-icon.png` | Same "EM" mark, visibly cropped at both edges (the E and M are cut off). Evidence of a latent monogram idea, badly executed |
| RIBA/ARB badges | `assets/application/files/.../RIBA_ARB.png` | Third-party accreditation logos, About page only |
| Award badges | `dmi_2019_badge-featured.jpg` etc. + baked into thumbnails | Don't Move Improve (2017, 2019 featured, 2022 longlisted), Grand Designs logo. Raster, mixed into photography |

## Typography assets

- **Adobe Fonts (Typekit) kit `zou6bnl`**: adobe-garamond-pro (regular + italic) and futura-pt (regular; bold in kit but unused). Loaded via `use.typekit.net`. The kit is tied to whoever's Adobe account created it: a licensing continuity risk for any rebuild that wants the same faces.
- Local: Font Awesome 3.2.1 webfonts (two copies: concrete5 core + bootstrapcdn), slick-carousel fonts (loaded, unused).

## Photography and imagery

- **~470 content images** across 27 project pages plus 27 homepage thumbnails.
- Formats: mostly JPEG for gallery images (concrete5 cache derivatives), **PNG for most homepage thumbnails** (750x750, up to 3.6 MB each; 13.8 MB total on the homepage).
- Master files: originals under `assets/application/files/<n>/<n>/<n>/<name>` include the full-resolution uploads harvested by the archiver (e.g. `01_FIRS_2.png` 3.4 MB). Cache derivatives under `assets/application/files/cache/thumbnails/<hash>.jpg` are what project pages actually serve (945px-width class).
- Content mix: finished-architecture photography (Lyndon Douglas, Travis Levius, Emma Lewis, Sebastian Tiew), CAD axonometric line renders (Goat Hill, Social House, Hackney Road), physical model photography (Campden House, Willow Tree), aerial photo (West Suffolk), interior/joinery detail sets, a few construction shots, plans/drawings occasionally mixed into galleries without labels.
- Thumbnail set is hand-made: several have transparent letterbox padding baked in (source of the grid's ragged rows), award badges composited in Photoshop.
- No video anywhere. No SVG anywhere (all raster).

## Press assets

- 3 "press clipping" downloads (renamed with correct extensions in the archive): `download_file/view/firs-avenue-press-clipping-435.jpg` (iPhone 7 Plus photo of a magazine page), `oval-road-press-clipping-436.png` (screen grab), `latimer-road-press-clipping-437.jpg` (magazine scan).

## Code assets

| File | Role |
|---|---|
| `assets/application/files/cache/css/burble4/main.css` | Theme CSS bundle (normalize + modified Bootstrap 3 + theme), last built 2022-07-27 (`?ts=1658953852`) |
| `assets/application/files/cache/css/bb91926a8d....css` | Page-list grid block CSS (the animated `mbt-col` grid) |
| `assets/concrete/js/jquery.js` | jQuery (concrete5 core copy) |
| `assets/application/themes/burble4/js/site.js` | Theme JS: lazyload lib, `openNav`/`closeNav`, back-to-top, slick carousel (bundled, initialised nowhere observed) |
| `assets/application/themes/burble4/js/modernizr-3.5.0.min.js` | Legacy feature detection |
| `assets/concrete/js/picturefill.js` | Responsive-image polyfill (2014-era) |
| Font Awesome 3.2.1 CSS | Loaded twice (local + netdna.bootstrapcdn.com) |

## Third-party services

- Google Analytics: legacy `analytics.js` with dead UA property `UA-37528173-1`; Google's tag auto-maps to GA4 `G-3J3PKD0QQK`, which does receive hits. Ownership/access unknown.
- Adobe Fonts (`use.typekit.net`, `p.typekit.net`).
- `netdna.bootstrapcdn.com` (Font Awesome 3.2.1), `oss.maxcdn.com` (IE8 shims in conditional comments).
- No cookie banner, no consent management, no social embeds, no maps.

## What does NOT exist (gaps a rebuild must fill)

- Logo files (any format), brand colour definitions, OG/social share images, per-project cover art direction, plans/sections as first-class assets, portrait or studio photography, video/motion assets, PDF portfolio, structured project metadata (year, location, status, team, photographer).
