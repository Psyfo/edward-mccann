# Technical Analysis

The audit had no access to the CMS admin or server; findings come from rendered output, HTTP behaviour and the archived assets. Items that could not be verified are marked Unknown.

## Stack (fingerprinted)

| Layer | Finding | Evidence |
|---|---|---|
| CMS | **concrete5 8.4.3** (2018-era; the project is now "Concrete CMS", 8.x long EOL) | `<meta name="generator">`, `CCM_*` globals, `/index.php` dispatcher |
| Language | PHP **7.2.34** (EOL November 2020) | `X-Powered-By` header |
| Server | Apache-style keep-alive, HTTP/1.1 + advertised h3; no CDN/proxy headers | Response headers |
| Theme | `burble4` custom theme: normalize + modified **Bootstrap 3** + theme CSS; bundle last built **2022-07-27** | `?ts=1658953852` cache-buster |
| JS | jQuery (core copy), modernizr 3.5.0, picturefill (polyfill, unused by markup), lazyload, inline nav JS, slick carousel (bundled, never initialised) | site.js, page source |
| Fonts | Adobe Fonts kit `zou6bnl` (Garamond Pro n4/i4, Futura PT n4/n7) | use.typekit.net requests |
| Icons | Font Awesome **3.2.1**, loaded twice (local + netdna.bootstrapcdn.com) | Network log |
| Analytics | gtag with dead UA property `UA-37528173-1`; Google auto-maps to GA4 **G-3J3PKD0QQK** which does collect | Network log (collect requests observed) |
| IE support relics | html5shiv/respond via oss.maxcdn in conditional comments; `@-ms-viewport` patch | Page source |

## Hosting / operational reality

- Dead 404 asset from the theme (`background-slider-default.png`), no robots.txt, no sitemap.xml, no security headers beyond `X-Frame-Options: SAMEORIGIN`, no HSTS. TLS works on both hosts (cert coverage for apex + www: verified by successful HTTPS fetches on both).
- **Host schizophrenia**: internal nav links alternate between `edwardmccann.studio` and `www.edwardmccann.studio` depending on page; image srcs sometimes cross hosts; the www host intermittently fails QUIC for cached thumbnails (observed `ERR_QUIC_PROTOCOL_ERROR` on four images per project page load), silently dropping images. The 404 page redirects to `http://www.` (plain HTTP downgrade).
- Canonicals exist and point at the non-www host (correct), but `/index.php/...` aliases and www duplicates remain crawlable.
- Analytics access, CMS credentials, hosting account, domain registrar, Adobe Fonts account ownership: **all Unknown**; the handover must inventory them.

## Performance (measured/observed)

- Homepage transfers ~14 MB of thumbnails alone (27 PNGs at 750x750, up to 3.6 MB each); no modern formats (zero WebP/AVIF), no `srcset` in markup (picturefill ships but has nothing to do), no HTTP/2 multiplexing benefit guaranteed (H1.1 observed).
- Render-blocking CSS chain + Typekit; visible FOUT.
- Project pages: 20-30 JPEGs of ~945px class each, plus full-weight badge images; scroll length to 21,000px.
- No caching CDN observed; `Cache-Control: no-cache, private` on HTML is fine, but assets rely on default caching.

## Accessibility (technical layer)

- Non-semantic controls (icon `<i>` with onclick as the menu button; `javascript:` hrefs), no aria state anywhere, no skip link, no focus management in the overlay, heading hierarchy broken per template, universal duplicate alt text, italic-only state signalling. No forms exist, which limits the damage surface.

## SEO (technical layer)

- No Open Graph, no Twitter cards, no JSON-LD (no Organization/Project/CreativeWork schema), inconsistent titles, missing descriptions on 8+ pages, no sitemap, duplicate-host crawl surface. Ranking today is brand-term only; there is **nothing worth preserving technically** except the 31 public URL paths, which must 301 to their successors.

## Constraints and freedoms for the rebuild

1. **Freedom**: no CMS content API worth integrating with; content volume is small (32 pages, ~470 images, all archived here). Full re-platforming is unconstrained by legacy tech.
2. **Constraint**: the Adobe Fonts kit belongs to an unknown account; the exact cuts (futura-pt, adobe-garamond-pro) require an Adobe subscription under the client's control if retained.
3. **Constraint**: image masters top out at the CMS uploads preserved in `../../site-archive/` (largest ~2500-3600px). True full-bleed art direction may want re-sourced originals from the photographers.
4. **Constraint**: redirect map required for 31 URLs x 4 host/alias variants; the new platform should own both apex and www with a single canonical redirect.
5. **Constraint**: GA4 property G-3J3PKD0QQK exists and collects; decide whether to claim it or start clean (Unknown ownership).
6. **Freedom**: no cookies/consent debt, no forms, no third-party integrations to migrate.
7. Client-side note for the designer: nothing about the old stack should constrain the creative direction; the rebuild target (Next.js per the project plan) supports any of the directions in `recommended-design-direction.md`.
