# Interaction & Motion Analysis

## Complete interaction vocabulary (observed: the site has exactly seven interactive behaviours)

1. **Card hover** (desktop only): 0.25s ease white wash (0.9 alpha) + "View Project" label in a 1px rule box. The label is informative, the wash *subtracts* the image at the exact moment of interest: hover hides the photograph you're choosing.
2. **Nav link hover**: subtle colour transition (0.2s linear); active page italic (static).
3. **Mobile overlay menu**: `openNav()`/`closeNav()` inline JS animating overlay width 0→100% (side-reveal feel), translucent scrim, × to close. No focus trap, no ESC handling, no aria state.
4. **Back-to-top button**: appears on scroll, jumps (no smooth scroll) to top.
5. **Prev/next project links**: plain navigations with chevron glyphs, placed mid-page.
6. **Lazyload**: images fade in as they enter viewport (the only scroll-linked behaviour).
7. **404 auto-redirect**: 5s timer to the homepage (on the insecure www origin).

There are no page transitions, no lightbox, no galleries/carousels (slick is bundled but never initialised), no parallax, no reveal choreography, no custom cursor, no sticky elements beyond the back-to-top, no form interactions (no forms), no sound, no video.

## Loading behaviour (observed)

- First paint blocked by main.css + typekit CSS; fonts swap visibly (Garamond arrives late on slow connections; FOUT with Times fallback).
- 13.8 MB of homepage PNGs stream in visibly on ordinary connections; the grid assembles raggedly as heights resolve (no aspect-ratio reservation → layout shift as images load; the square aligner boxes mitigate on home but not on project stacks).
- Broken cross-host images (www QUIC failures) leave permanent gaps with no fallback UI.

## Motion as brand (evaluation against the audit brief's lenses)

| Lens | Current contribution |
|---|---|
| Materiality | None: no interaction references weight, texture or light |
| Spatial progression | None: pages teleport; galleries scroll without pacing |
| Editorial pacing | None: no sequencing, no rhythm between text and image |
| Architectural scale | None: no moment where an image is allowed to become a space |
| Precision | Undermined: mixed durations, a 1s grid morph, malformed CSS transitions |
| Restraint | Accidentally present: so little motion exists that the site is at least quiet |

**Interpretation**: motion currently decorates nothing and communicates nothing; the one distinctive animation (the 1-second grid column morph) is an artefact users experience as breakage. The site's quietness, however, is closer to the right answer than the animation-heavy end of the category: the rebuild should add *few, meaningful* motions rather than a motion language for its own sake.

## Recommendations (direction, not choreography)

1. Define a 3-4 token motion system (e.g. state 150-200ms, reveal 300-400ms, navigation 400-600ms; one easing family; `prefers-reduced-motion` honoured).
2. Replace the hover wash with a treatment that *adds* information without erasing the image (e.g. metadata reveal, subtle scale/parallax restraint: designer's call).
3. Give galleries pacing: considered image entrances tied to scroll position (restrained: opacity/translate, no parallax theatrics), and a proper end-of-case-study moment (next project) so navigation becomes part of the reading rhythm.
4. If page transitions are introduced, make them serve spatial continuity (the practice's own language: thresholds, sequences of spaces: see Chamber's description) rather than decoration.
5. Fix mechanics beneath the aesthetics: focus management, keyboard operability, scroll restoration, aspect-ratio reservation to eliminate loading shift.
