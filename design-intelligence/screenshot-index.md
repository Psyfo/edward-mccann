# Screenshot Index

86 captures under `screenshots/{desktop,tablet,mobile}/`, taken 2026-08-14 from the live site. Naming: `<page>-<viewport>.png` = initial viewport (what a visitor first sees); `<page>-<viewport>-full.jpg` = whole page at that width (viewport grown to content height, capped at 16,000px; JPEG for weight).

Capture widths: desktop 1440x900, tablet 768x1024, mobile 375x812. Note that 768px is the old grid's buggy width (4-up tiny thumbnails); the 769-991 band renders 2-up instead: both realities are discussed in `responsive-analysis.md`.

## Start here (the 12 that tell the story)

| File | Why it matters |
|---|---|
| `desktop/home-desktop.png` | The practice's entire first impression: wordmark, italic-active nav, 4-up grid, badges |
| `desktop/home-desktop-full.jpg` | All 27 thumbnails: the uncurated mix (photos, CAD, models, b&w, sketchbook) in one view |
| `desktop/home-desktop-card-hover.png` | The only hover state: white wash + "View Project" rule box (image erased at the moment of interest) |
| `desktop/project-firs-avenue-desktop.png` | Case-study opening: italic title, contained hero |
| `desktop/project-firs-avenue-desktop-full.jpg` | The full 21,000px linear dump: justified essay, red badge, uncaptioned stack, mid-page prev/next |
| `desktop/about-desktop.png` | The justified 975px text wall hiding the practice's best credentials |
| `desktop/press-desktop.png` | Frozen-in-2019 validation layer, three h1s |
| `desktop/contact-desktop.png` | Bare address block; the only mention of Cape Town on the site |
| `mobile/home-mobile.png` | Two-line wordmark + orphaned hamburger row; 2-up cards |
| `mobile/navigation-mobile-open.png` | Translucent overlay menu with grid ghosting through the labels |
| `mobile/project-firs-avenue-mobile-justified-text.png` | Justified text producing word-spacing chasms at 375px |
| `tablet/home-tablet.png` | The 768px off-by-one: 4-up 128px thumbnails on an iPad-sized screen |

## Full coverage map

- **Core pages** (home, about, press, contact): viewport + full at all three widths (24 files).
- **Key projects** (firs-avenue, hassett-road, pennard-house, goat-hill-house, antidote, oval-road): viewport + full at all three widths (36 files). Chosen to span: award-winning house / charred-timber terrace / country house / drawing-led unbuilt / hospitality / early flagship.
- **Every remaining project** (21): desktop viewport opening (21 files), so the design model can see each project's first impression without visiting the site.
- **States**: `desktop/home-desktop-card-hover.png`, `tablet|mobile/navigation-*-open.png`, `mobile/project-firs-avenue-mobile-justified-text.png`, `desktop/page-not-found-desktop.png`.

## Provenance and caveats

- Capture tool: Playwright Chromium, `tools/capture.mjs` (in this repo). CSS-pixel scale.
- Full-page shots were taken by growing the viewport and letting the theme's 1-second animated grid transition settle. (Playwright's stitched fullPage mode interacts badly with that animation and briefly produced a false 2-column desktop grid during the audit; those artefacts were discarded and re-shot. If you re-capture, use the script, not raw fullPage.)
- Pages taller than 16,000px (a few project fulls) are truncated at that height; the pattern repeats, nothing unique is lost.
- Live-site image gaps may appear in some captures where the site's own cross-host image bug (www QUIC failures) dropped images during load; these gaps are a real user-facing behaviour, not a capture fault.
- Style probes (measured fonts/colours/sizes per page/viewport) accompany the screenshots in `probes/*.json`.
