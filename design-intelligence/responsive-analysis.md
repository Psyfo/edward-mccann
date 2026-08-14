# Responsive Analysis

Tested at 1440x900 (desktop), 768x1024 and the 769-991 band (tablet), 375x812 (mobile). Screenshots per width in `screenshots/`; per-width probes in `probes/`.

## Breakpoint reality (from the shipped CSS)

The theme layers Bootstrap 3's breakpoints (768 / 992 / 1200) with the grid block's own conflicting media queries:

| Width | Card grid | Header | Notes |
|---|---|---|---|
| <768 | 2-up (50%) | Stacked: centred 2-line wordmark + hamburger row | Intended mobile layout, works |
| =768 exactly | **4-up (25%): 128px thumbnails** | Hamburger | Off-by-one: `min-width:768` desktop rule vs overrides starting at 769. iPad portrait gets the worst grid on any device |
| 769-991 | 2-up (50% `!important`) | Hamburger | Large tiles, most generous presentation on the site |
| 992-1199 | 3-up (33.33% `!important`) | Inline nav returns | |
| ≥1200 | 4-up (25%) | Inline nav | 293px tiles at 1440 |

Column widths carry `transition: width 1s`: crossing a breakpoint animates every card's width over a full second: a decorative oddity that also caused capture artefacts (documented in `screenshot-index.md`).

## Component transformation matrix

| Component | Desktop (≥1200) | 992-1199 | 769-991 | =768 | <768 |
|---|---|---|---|---|---|
| Wordmark | 30px, left | same | 24.6px centred, wraps 2 lines | same | same |
| Nav | Inline right, italic active | same | Hamburger below wordmark → translucent overlay | same | same |
| Project grid | 4-up squares | 3-up | 2-up large | 4-up tiny | 2-up |
| Card titles | 21.6px under image | same | same | same, cramped | ~17px |
| Project hero + stack | 945px column | narrows with container | full container width | same | full width minus 15px gutters |
| Body text | 975px justified | container width, justified | same | same | full width justified (severe gaps) |
| Prev/next | inline pair mid-page | same | same | same | same, wraps |
| Back-to-top | bottom right | same | same | same | same, overlaps content |
| Footer | absent | absent | absent | absent | absent |

## What transforms well (observed)

- The 2-up mobile grid at 375px is decent: legible tiles, sensible tap targets.
- The single-column project template degrades gracefully by nature (it is already linear).
- Text sizes scale down via the em-chain plausibly (nav 18.5 → wordmark 24.6 etc.).

## What breaks or embarrasses (observed, ranked)

1. **=768 iPad portrait**: 128px thumbnails in 4 columns: smaller images than phones get, on a 10" screen. Pure CSS bug.
2. **Justified text at narrow measures**: word-spacing chasms (evidence: `mobile/project-firs-avenue-mobile-justified-text.png`).
3. **Header cost on mobile**: ~170px of chrome (2-line wordmark + hamburger row) before any content; the hamburger sits in dead-centre air, disconnected from thumb reach.
4. **Translucent overlay menu**: legibility depends on the thumbnails behind it.
5. **1s column animation** on rotate/resize: the whole grid visibly morphs, feeling broken rather than intentional.
6. **No responsive image variants**: the same 750px PNG thumbnails and 945px-class JPEGs ship to every device; 13.8 MB homepage weight regardless of viewport (picturefill is loaded but the markup provides no srcset for it to use: dead polyfill).
7. Award badges become illegible confetti at mobile tile sizes.

## Verdict by lens

- **Elegant**: nothing, strictly.
- **Acceptable**: mobile 2-up grid; linear project pages; about/contact single columns.
- **Awkward**: header stacking; overlay menu; 3-up band; animated transitions.
- **Broken**: =768 grid; justified mobile text; undelivered responsive images.

## Principles the rebuild should carry (recommendation)

1. Design the archive grid mobile-first with at most two intentional layouts (e.g. 2-up ≤ tablet, 3/4-up desktop) and test the exact 768/1024 device widths.
2. Kill layout animation on resize; reserve motion for content.
3. Serve real responsive images (modern formats, srcset/sizes, art-directed crops per breakpoint).
4. Budget mobile header chrome ≤ ~80px with a reachable menu control; opaque (or blurred) overlay if an overlay pattern survives.
5. Keep reading measures fluid-capped (~70ch) instead of viewport-proportional; ragged-right at all widths.
