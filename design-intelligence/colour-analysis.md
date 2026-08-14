# Colour Analysis

## Measured palette (rendered pages)

| Role | Value | Source |
|---|---|---|
| Page ground | `#F7F7F7` (rgb 247,247,247) | body background, all pages |
| Primary ink | `#000000` | headings, body, nav |
| Secondary ink | `#222222` | incidental elements |
| Reversed | `#FFFFFF` | overlay text contexts |
| Hover wash | `rgba(255,255,255,0.9)` | card hover |
| Overlay scrim | `rgba(247,247,247,0.7)` | mobile nav overlay |
| Dark scrim | `rgba(0,0,0,0.7)` | back-to-top block |
| Accidental accent | `#428BCA` (Bootstrap 3 default blue) | unstyled links |
| Meta theme-color | `#000000` (black) | browser chrome tint |

## Colours present but not chosen

- **Award red**: the Don't Move Improve badges (a saturated red ~#E8474B family) are the most chromatic elements on the entire site, appearing on the homepage and inside project pages. This red is NLA's brand, not McCann's, yet it functions as the site's de facto accent.
- **Theme leftovers in CSS, never rendered**: `#75CA2A` bright green, `#D4EFBD` pale green, `#00709D` blue, `#0C6`: the burble4 theme's default palette, dead code worth noting only as evidence the palette was never systematically authored.
- **Photography carries all real colour**: London stock brick oranges, charred-timber blacks, foliage greens, the cobalt joinery of Rylett Crescent. With chrome this neutral, every thumbnail's colour temperature reads loudly, and the mix (warm photos beside cool CAD whites beside red badges) is unplanned.

## Contrast audit (observed)

- Black on #F7F7F7: 20.1:1, excellent.
- "View Project" black text over the 0.9 white wash over photography: usually passes, but the wash lets image luminance through; contrast varies per thumbnail.
- Mobile overlay: black 28px menu text over 0.7-alpha warm white over arbitrary thumbnails: measured contrast depends entirely on what ghosts through behind each label; against Hassett Road's dark timber it is fine, against the white CAD renders the scrim contributes little. Interpretation: a translucent scrim without a blur or higher alpha is a legibility gamble taken 27 times per page.
- Bootstrap blue links on warm white: 3.1:1 at 15.4px: fails AA for normal text where it appears.

## Emotional read

- **Observed**: warm near-white, black ink, no brand colour, photography as chroma.
- **Interpretation**: the non-palette is arguably correct for the category (see competitive positioning: light monochrome grounds dominate the strong comparators) and flatters photography. What is missing is *authorship*: deliberate neutrals (paper/ink tones with a tuned warm cast), a decision about whether any accent exists, and colour management of imagery so adjacent images do not fight.
- The site's only strong colour statement today is another organisation's award branding: the clearest possible symbol of the identity vacuum.

## Recommendations

1. Author the neutrals: pick the paper tone and ink pair on purpose (the current #F7F7F7/#000 is a fine starting hypothesis), define surface/border steps between them, and kill every framework colour (#428BCA first).
2. Decide the accent question consciously. Evidence for restraint: the category's strong players are near-monochrome; the photography is chromatically rich. If an accent is adopted, it must come from the work (materials: charred timber, rammed earth, oxide red, brick) rather than from UI convention. Note for the design model: no strong comparator occupies a dark ground; the practice's black theme-color and charred-timber material story make a sophisticated dark treatment a genuinely available territory, with photography colour-management as the cost.
3. Remove third-party colour from brand surfaces: awards become typographic/monochrome brand components, never raster badges inside images.
4. Set contrast floors now (AA for text, AAA for body) as a non-negotiable in the design system.
