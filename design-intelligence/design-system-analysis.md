# Design System Analysis

Reverse-engineering the implicit system, documenting its tokens and its contradictions. Raw computed-style probes per page/viewport are in `probes/*.json`.

## Implicit tokens (as measured)

### Colour
```text
ground:        #F7F7F7
ink:           #000000
ink-muted:     #222222   (incidental)
reversed:      #FFFFFF
wash-hover:    rgba(255,255,255,0.90)
scrim-overlay: rgba(247,247,247,0.70)
scrim-dark:    rgba(0,0,0,0.70)
LEAK link:     #428BCA (Bootstrap default)
DEAD theme:    #75CA2A #D4EFBD #00709D #0C6 (CSS only, never rendered)
```

### Type scale (em-derived accidents, base 15.4px)
```text
30.00  wordmark (futura-pt caps)
29.26  h1 titles (garamond italic)
21.56  h4 card titles
18.48  nav
15.40  body / labels        leading 30.8 (2.0)
14.00  bootstrap base (helvetica stack) where unstyled
Weights: 400 only, sitewide. Italic = active nav + titles + card titles.
```

### Space
No spacing scale exists. Observed recurring values: 15px (bootstrap gutters), ~20px image gaps, ~60px grid gutters at 1200+, ~100-140px section gaps. All incidental to Bootstrap defaults and ad hoc margins (`.marginbottom` utility).

### Grid / containers
```text
Fluid container (100% - 30px) for chrome and card grid
975px fixed column for all reading content
Card columns: 50% / 25%(=768px) / 50%(769-991) / 33.33%(992-1199) / 25%(>=1200)
              with transition: width 1s on the columns themselves
```

### Shape & elevation
Radius 0 everywhere; no shadows anywhere; 1px black rule box as the only border device (hover label). This severity is worth keeping.

### Iconography
Font Awesome 3.2.1 glyphs (hamburger, ×, chevrons). No brand iconography.

### Motion
```text
0.25s ease  (card hover wash)
0.2s linear (colour hovers)
0.3s / 0.5s (misc, inconsistent)
1s width    (grid column resize animation)
Several malformed transition declarations in CSS (double duration values)
```
No scroll effects, no page transitions, no reveal animations, no parallax.

## Inconsistencies catalogue

1. Two layout systems (fluid grid vs fixed essay column) with no shared module.
2. Column-count lurch with an off-by-one at 768px and `!important` overrides fighting the base rules.
3. Italic overloaded with three meanings; no bold available for any.
4. Title patterns differ per template (bare vs ":: Edward Mccann Architects").
5. Hover affordances exist only on desktop cards; project-page images have no affordance at all.
6. Two Font Awesome copies (local + CDN); jQuery + slick loaded, slick never initialised.
7. Back-to-top button styled dark-scrim while every other control is white-ground.
8. `.justify` applied to prose but no hyphenation control, producing the measured rivers.

## What deserves to survive as system DNA (recommendation)

- The severity: 0 radius, no shadows, 1px rules, monochrome chrome.
- Warm-white ground + black ink as the neutral core.
- The caps-geometric + humanist-serif duality (re-executed with real weights/scale).
- Work-first density: thin chrome, photography carrying the page.

## What the new system must add (recommendation)

- A modular type scale with 2-3 weights and one italic meaning; measure caps (~70ch); ragged-right.
- A spacing scale on a fixed rhythm unit shared by grid and prose.
- One grid system spanning archive and case-study templates (with full-bleed capability).
- Authored component set: project card (with facts), facts/metadata block, captioned figure, figure pair, drawing plate, recognition row, people row, enquiry block, footer.
- Motion policy: a small set of durations/easings tied to meaning (reveal, state, navigation), replacing the current accidental values.
- Accessibility floor: AA contrast, visible focus, reduced-motion respect, semantic landmarks: none of which the current system provides.
