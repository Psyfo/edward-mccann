# Typography Analysis

## Faces in service (verified via Adobe Fonts kit `zou6bnl` + computed styles)

| Face | Weights loaded | Where used |
|---|---|---|
| futura-pt | 400 (700 in kit, unused) | Wordmark only: "EDWARD McCANN ARCHITECTURE" |
| adobe-garamond-pro | 400 roman + 400 italic | Everything else: nav, titles, body, cards, labels |
| Helvetica Neue stack | system | Bootstrap base (14px) leaks into unstyled elements |
| Font Awesome 3.2.1 | icon font | Hamburger, chevrons, close glyphs |
| slick + Open Sans | declared, never rendered | Dead weight from bundled carousel CSS |

Both brand faces load from Typekit kit `zou6bnl` (fonts f=6770.6771.10881.10884), tied to an unknown Adobe account: a licensing continuity risk the rebuild must resolve (re-license via the client's own Adobe account, or substitute faces).

## Measured hierarchy (1440px viewport)

| Role | Face | Size | Weight | Style | Leading | Case |
|---|---|---|---|---|---|---|
| Wordmark (h2) | futura-pt | 30px | 400 | roman | 45px | ALL CAPS |
| Project title (h1) | garamond | 29.26px | 400 | **italic** | ~1.5 | Title Case |
| Card title (h4) | garamond | 21.56px | 400 | italic (rendered) | 32.3px | Title Case |
| Nav link | garamond | 18.48px | 400 | roman (italic = active) | 27.7px | Title Case |
| About h3 sections | garamond | ~22px | 400 | roman | ~1.5 | ALL CAPS |
| Body | garamond | 15.4px | 400 | roman | 30.8px (2.0) | sentence |
| Card overlay label | garamond | 15.4px | 400 | roman | 30.8px | Title Case |
| Base (unstyled) | Helvetica stack | 14px | 400 | roman | 20px | n/a |

Fractional sizes (29.26, 21.56, 18.48, 15.4) betray em-multiplication of a 15.4px base rather than a designed scale. There is no 400+ weight anywhere: the site has **no bold**, so emphasis falls entirely to italics, which are simultaneously the active-nav state, the title voice and the card-label voice.

## Setting quality (observed)

- **Justified body at ~120+ characters per line**: double the comfortable measure; produces rivers on desktop and severe word-spacing gaps on mobile (evidence: `screenshots/mobile/project-firs-avenue-mobile-justified-text.png`). No hyphenation is enabled, worsening justification.
- **2.0 leading on 15.4px text**: airy to the point of dissolving paragraph cohesion at that measure.
- Letter-spacing: `normal` everywhere; the caps wordmark and caps h3s receive no tracking (caps without tracking look cramped at display sizes).
- No small caps, no oldstyle figures usage decisions, no hanging punctuation: none of Garamond's editorial equipment is used.
- Run-on credential strings on About (missing list markup) turn the highest-value text into the worst-set text on the site.

## Personality evaluation

- **Observed pairing logic**: geometric modernist caps (Futura: Bauhaus lineage, 1927) against a Renaissance humanist serif (Garamond). This is a legitimate, historied pairing: precision + humanity, which matches the practice's actual character (engineered details + warm client voice).
- **Interpretation**: the typography's *idea* is right and arguably ownable; its *execution* (single weights, accidental scale, justified walls, italic overload) reads amateur. Most London peers run a single contemporary grotesque (see competitive positioning); a serif-led identity done properly would differentiate.
- **Suitability check against the work**: the projects mix Victorian/Edwardian fabric with crisp contemporary insertions. A serif/geometric duality mirrors that old-new dialogue exactly. Evidence the instinct fits: the practice's own copy narrates old-new junctions as its signature move ("Shadow gaps and exposed plaster... abut skirting boards and cornices").

## Recommendations for the type system (direction, not design)

1. Decide deliberately whether Garamond-lineage stays. Two honest paths: (a) recommit with a contemporary cut (or a sharper editorial serif) used with real equipment: weights, true small caps, tracked caps, ragged-right setting, 60-75 character measures; or (b) full replacement with a distinctive contemporary pairing. Path (a) preserves brand memory; path (b) buys contemporaneity faster. Do not keep the current faces by default without re-licensing.
2. Whatever the faces: establish a modular scale, add at least one heavier weight for structure, reserve italics for a single meaning, set body ragged-right, cap measures at ~70ch, and give numerals/metadata a deliberate treatment (project facts will become a visible typographic layer).
3. The wordmark deserves a drawn/spaced refinement (tracked caps, resolved "Mc" treatment) whether or not a symbol is added.
