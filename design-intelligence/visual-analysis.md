# Visual Analysis

## Composition and layout

### Grid (observed)
- Homepage: fluid-width Bootstrap-derived grid, 15px outer gutters, cards at 25% (≥1200px) with ~60px effective gutters; 293px square thumbnail boxes at 1440. Column count lurches across breakpoints (2 → 4 → 2 → 3 → 4, see responsive analysis) with a 1-second animated width transition.
- Content pages: a single centred 975px column inside the fluid container. Two incompatible layout systems (fluid card grid vs fixed essay column) with no shared rhythm.

### Whitespace and density (observed → interpretation)
- Generous vertical gaps between card rows (~140px including titles); header floats in ~100px of air; page ends abruptly with no closing weight. Interpretation: the whitespace is real but unstructured: it reads as emptiness rather than pacing because nothing establishes a vertical rhythm unit; gaps repeat identically regardless of content importance.
- The 975px text column sits off-balance inside the 1440 fluid chrome (aligned left of centre at some widths due to Bootstrap offsets): subtle, but contributes to a "not quite composed" impression.

### Alignment and tension
- Everything is either centred (titles, About h1, mobile chrome) or left-justified blocks; no intentional asymmetry, no scale contrast between featured and ordinary content. The only visual tension comes accidentally: ragged thumbnail bottoms, alternating image widths in galleries, the red badges.

### Cropping and scale
- Homepage thumbs are square by container, but several images arrive pre-letterboxed with transparent padding, so actual displayed ratios vary; two adjacent cards can differ in height by 70px+.
- Project galleries alternate 945px landscapes with ~550px-wide portraits (810px height cap): scale changes feel arbitrary rather than sequenced.

## The visual language, named

**Observed ingredients**: geometric caps wordmark (futura-pt) + old-style serif everything (Garamond) + warm-white ground + black ink + photography + thin rule boxes (the hover state's 1px black border is the site's only graphic device) + Font Awesome glyphs.

**Interpretation**: the ingredient list is genuinely tasteful: Futura-and-Garamond over warm white is a classic modernist-meets-humanist pairing (think mid-century editorial). The failure is entirely in execution: no scale system, no grid discipline, no art direction of images, and third-party visual noise (badges, FA icons, Bootstrap blue) polluting an otherwise strict monochrome. The site has a palette and a type pairing but not a visual system.

## Colour (measured)

See `colour-analysis.md` for full detail. Summary: ground #F7F7F7; ink #000/#222; white overlays at 0.7/0.9 alpha; accidental Bootstrap blue #428BCA; award-badge red (~#E8474B region) as the loudest colour on the site without being a brand decision; unused theme greens in CSS.

## Typography (measured)

See `typography-analysis.md`. Summary: futura-pt 400 caps for the wordmark only; adobe-garamond-pro 400 for everything else (nav 18.5, titles 29.3 italic, cards 21.6, body 15.4/30.8 justified); no weights beyond regular anywhere; scale values are em-multiplication accidents, not a modular scale.

## Imagery treatment (observed)

- Photography is treated as **content to be dumped, not a brand component**: no consistent aspect policy, no duotone/treatment, no sequencing logic (exterior/interior/detail order varies), no full-bleed moments ever (max width 975/945px), no pairing or clustering, no captions.
- The strongest images (Hassett Road's charred timber against brick; Firs Avenue's steel-framed garden elevation; Rylett's cobalt joinery) would each sustain full-viewport presentation; none gets it.
- Award badges and broadcaster logos composited into thumbnails put third-party branding *inside* the practice's photography: the single most damaging visual habit on the site.

## What is deliberate vs inherited vs accidental (the excavation)

| Element | Verdict | Reasoning |
|---|---|---|
| Futura + Garamond pairing | **Deliberate** | Both are paid Adobe Fonts choices; neither is a system default |
| Warm-white ground, black ink | **Deliberate** | Styled explicitly; theme-color meta set to black |
| Italic as active/title voice | **Deliberate** (single-axis Garamond) | Consistent usage pattern |
| 975px column, 15px gutters, card grid | **Inherited** | Bootstrap 3 and the mbt page-list block's defaults |
| Justified text | **Deliberate but misjudged** | A `justify` utility class applied on purpose |
| Ragged card heights | **Accidental** | Hand-letterboxed thumbnails fighting the square container |
| Badges in thumbnails | **Expedient** | CMS offered no award field; Photoshop was the workaround |
| Bootstrap blue links, FA icons | **Inherited** | Framework defaults never overridden |
| 2/4/2/3/4 column lurch | **Accidental** | Conflicting `!important` media queries in the grid block |
| No footer | **Deliberate omission** | Theme supports one; it was turned off |

## Recommendation

The redesign should treat the existing taste (modernist caps + humanist serif + warm white + monochrome + photography-first) as a validated foundation and rebuild the missing system around it: a real grid with a vertical rhythm unit, a modular type scale with weights, an image art-direction policy (ratios, sequencing, full-bleed moments, captions), brand-controlled recognition graphics, and the deletion of every inherited framework artefact.
